import { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDFViewer, DraggableSandbox, Button } from '../../../components';
// import watermarkImage from '../../../assets/images/NUSpace_blue.png';
import { useSignature, useAdminUser } from '../../../hooks';
// import watermarkImage from '../../../assets/images/icon_yellow.png';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../../store";
import { toast } from 'react-toastify';
// import { useAdminDocuments } from '../../../hooks';

export default function WaterMarkPage() {
    const token = useTokenStore.getState().getToken();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { documentId, url } = state || {};
    const [count, setCount] = useState(0)
    const [coords, setCoords] = useState(null);
    const [watermark, setWatermark] = useState({ x: 50, y: 50, width: 100, height: 100 });
    const [watermarkPreviewUrl, setWatermarkPreviewUrl] = useState(null);

    const {
        // fetching admin profile
        adminProfile,
        isAdminProfileLoading,
        isAdminProfileError,
        adminProfileError,
        refetchAdminProfile,
        isAdminProfileRefetching,
    } = useAdminUser();

    const {
        // fetch query
        signatureData,
        isFetching,
        isFetchError,
        fetchError,
        refetchSignature,
    } = useSignature({ id: adminProfile?.user?._id || null });



    console.log("data for watermark:", signatureData);

    const watermarkImage = signatureData?.data?.signedUrl || null;
    console.log("watermarkImage:", watermarkImage);

    if (signatureData && signatureData?.data?.signedUrl === null) {
        toast.error("No signature/watermark image available. Please create one first.");
        navigate(-1);
    }

    // const pdfUrl = (`http://localhost:5000/api/admin/documents/pdf/${documentId}`);
    const pdfUrl = (`${process.env.REACT_APP_BASE_URL}/api/admin/documents/pdf/${documentId}`);

    const { data: pdfData, isLoading, isError } = useQuery({
        queryKey: ['pdf', documentId],
        queryFn: async () => {
            const res = await fetch(pdfUrl, {
                headers: {
                    'Authorization': token
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.blob();
        },
        enabled: !!documentId && !!token,
    });

    const watermarkUrl = (`${process.env.REACT_APP_BASE_URL}/api/signature/stream-signature/${adminProfile?.user?._id}`);
    const { data: watermarkData, isLoading: isWatermarkLoading, isError: isWatermarkError } = useQuery({
        queryKey: ['watermark', adminProfile?.user?._id],
        queryFn: async () => {
            const res = await fetch(watermarkUrl, {
                headers: {
                    'Authorization': token
                }
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Error: ${res.status} - ${res.statusText}`);
            }
            return res.blob();
        },
        enabled: !!adminProfile && !!token,
    });

    useEffect(() => {
        if (!watermarkData) return setWatermarkPreviewUrl(null);

        const url = URL.createObjectURL(watermarkData);
        setWatermarkPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [watermarkData]);

    console.log("watermarkData:", watermarkData ? true : false);

    async function createPdf() {
        if (!pdfData) { toast.error("PDF not loaded yet."); return; }
        if (!watermarkData) { toast.error("No signature/watermark image available."); return; }

        const existingPdfBytes = await pdfData.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // --- Get image bytes from watermarkData (already a Blob) ---
        let imageBytes;
        let mime = watermarkData.type || '';
        try {
            imageBytes = await watermarkData.arrayBuffer();
        } catch (e) {
            console.error('[Watermark] Failed reading blob arrayBuffer', e);
            toast.error('Could not read watermark image.');
            return;
        }

        // Optional: PNG signature sniff (first 8 bytes)
        const isPngSignature = (() => {
            if (imageBytes.byteLength < 8) return false;
            const sig = new Uint8Array(imageBytes.slice(0, 8));
            // 89 50 4E 47 0D 0A 1A 0A
            return sig[0] === 0x89 && sig[1] === 0x50 && sig[2] === 0x4E &&
                sig[3] === 0x47 && sig[4] === 0x0D && sig[5] === 0x0A &&
                sig[6] === 0x1A && sig[7] === 0x0A;
        })();

        // Decide embed method
        let embeddedImage;
        try {
            if (mime.includes('png') || (mime === '' && isPngSignature)) {
                embeddedImage = await pdfDoc.embedPng(imageBytes);
            } else if (mime.includes('jpeg') || mime.includes('jpg')) {
                embeddedImage = await pdfDoc.embedJpg(imageBytes);
            } else if (isPngSignature) {
                embeddedImage = await pdfDoc.embedPng(imageBytes);
            } else {
                // Try PNG then JPG fallback
                try {
                    embeddedImage = await pdfDoc.embedPng(imageBytes);
                } catch {
                    embeddedImage = await pdfDoc.embedJpg(imageBytes);
                }
            }
        } catch (err) {
            console.error('[Watermark] Embedding failed. MIME:', mime, err);
            toast.error('Unsupported watermark image format.');
            return;
        }

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

        const renderedPdfElement = document.querySelector('.react-pdf__Page__canvas');
        const rect = renderedPdfElement?.getBoundingClientRect();
        const renderedCssWidth = rect?.width || pdfWidth;
        const renderedCssHeight = rect?.height || pdfHeight;

        if (!watermark) {
            toast.error('Place the watermark box first.');
            return;
        }

        const scaleX = pdfWidth / renderedCssWidth;
        const scaleY = pdfHeight / renderedCssHeight;

        const pdfX = watermark.x * scaleX;
        const pdfY = pdfHeight - (watermark.y + watermark.height) * scaleY;
        const drawWidth = watermark.width * scaleX;
        const drawHeight = watermark.height * scaleY;

        console.log('[Export → PDF]', {
            mime,
            isPngSignature,
            browserBox: watermark,
            pdfCoords: { x: pdfX, y: pdfY, width: drawWidth, height: drawHeight }
        });

        if (drawWidth <= 0 || drawHeight <= 0) {
            toast.error('Invalid watermark size.');
            return;
        }

        firstPage.drawImage(embeddedImage, {
            x: pdfX,
            y: pdfY,
            width: drawWidth,
            height: drawHeight,
            opacity: 1
        });

        const out = await pdfDoc.save();
        download(out, 'watermarked.pdf', 'application/pdf');
        toast.success('Watermark applied.');
    }

    function download(data, filename, type) {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    const handleSaveDocument = () => {
        createPdf();
        // window.open(url, "_blank");
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    if (isLoading) return (
        <SkeletonTheme baseColor="#2d2d30" highlightColor="#3d3d42">
            <div className='w-full flex flex-col px-3 sm:px-4 lg:px-6 pb-8 animate-fade-in'>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center w-full mb-4 pt-2'>
                    <div className='flex items-center gap-2'>
                        <Skeleton circle width={32} height={32} />
                        <Skeleton width={140} height={20} />
                    </div>
                    <div className='flex gap-2 w-full sm:w-auto'>
                        <Skeleton width={130} height={36} />
                    </div>
                </div>
                <div className='w-full bg-gray-900 rounded-lg shadow-inner flex flex-col md:flex-row gap-4 md:gap-6 p-2 md:p-4 min-h-[60vh]'>
                    <div className='w-full md:flex-1 flex justify-center items-start overflow-hidden rounded border border-gray-700 bg-black/40 relative'>
                        <div className='w-full max-w-full md:max-w-[900px] flex flex-col gap-4 py-4 px-2'>
                            <Skeleton width={`60%`} height={24} />
                            <Skeleton width={`80%`} height={18} />
                            <Skeleton width={`90%`} height={18} />
                            <div className='mt-6'>
                                <Skeleton width={`100%`} height={420} />
                            </div>
                        </div>
                    </div>
                    <div className='w-full md:w-64 flex-shrink-0'>
                        <Skeleton width={`100%`} height={200} />
                        <div className='mt-4 space-y-2'>
                            <Skeleton width={`70%`} height={14} />
                            <Skeleton width={`90%`} height={14} />
                            <Skeleton width={`60%`} height={14} />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
    if (isError) return <p>Error loading PDF</p>;

    return (
        <div className='w-full flex flex-col px-3 sm:px-4 lg:px-6 pb-8'>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center w-full bg-white mb-4 sticky top-0 z-10 py-2'>
                {/* Back navigation button */}
                <div
                    onClick={handleBackClick}
                    className="flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-gray-600 size-4 group-hover:fill-off-black"
                        viewBox="0 0 448 512"
                    >
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                </div>
                <div className='flex gap-2'>
                    <Button onClick={handleSaveDocument} className='whitespace-nowrap'>Apply Watermark</Button>
                </div>
            </div>
            <div className='relative inline-block w-full bg-gray-900 rounded-lg shadow-inner flex flex-col md:flex-row gap-4 z-100 md:gap-6 p-2 md:p-4 min-h-[60vh]'>
                <div className='w-full md:flex-1 flex justify-center items-start overflow-auto rounded border border-gray-700 bg-black/40 relative'>
                    <div className='w-full max-w-full md:max-w-[900px] flex justify-center relative'>
                        <PDFViewer docId={documentId} />
                        <DraggableSandbox onUpdate={setWatermark} imageSample={watermarkPreviewUrl} />
                    </div>
                </div>
                <div className='w-full md:w-64 flex-shrink-0 relative'>
                    <div className='mt-4 text-xs text-gray-300 space-y-1'>
                        <p className='font-semibold text-gray-200'>Instructions:</p>
                        <p>Drag & resize the watermark box. Position it where you want it applied on the first page.</p>
                        <p className='text-[10px] italic opacity-70'>Preview may differ slightly from the final PDF scaling.</p>
                    </div>
                    {/* <div className='mt-4 space-y-2 bg-gray-800 p-2 rounded text-xs text-gray-300 h-[100px] border border-white/10 cursor-pointer'>
                        <div
                            className='px-1 py-2 bg-gray-700 rounded text-center text-xs text-gray-300'>
                            Recenter Watermark
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}