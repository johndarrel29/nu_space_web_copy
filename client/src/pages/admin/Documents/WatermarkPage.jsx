import { useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDFViewer, DraggableSandbox, Button } from '../../../components';
import watermarkImage from '../../../assets/images/NUSpace_blue.png'
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

    console.log("url:", url);
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

    async function createPdf() {
        // load base PDF
        // const existingPdfBytes = await fetch(pdfData).then(res => res.arrayBuffer());
        const existingPdfBytes = await pdfData.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // embed watermark image
        const pngBytes = await fetch(watermarkImage).then(res => res.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

        // get rendered pdf size in browser (use CSS size, not canvas pixel buffer)
        // const renderedPdfElement = document.querySelector('.react-pdf__Page__canvas');
        // const rect = renderedPdfElement?.getBoundingClientRect();
        const renderedPdfElement = document.querySelector('.react-pdf__Page__canvas');
        const rect = renderedPdfElement?.getBoundingClientRect();
        const renderedCssWidth = rect?.width || pdfWidth;
        const renderedCssHeight = rect?.height || pdfHeight;

        // Find the rendered PDF canvas


        if (!watermark) {
            console.warn('[Watermark] No watermark rectangle set – skipping overlay. Drag the box before exporting.');
            toast.error("Please position the watermark box before applying the watermark.");
            return;

        } else {
            // Scale from screen (CSS pixels) to PDF coordinate space
            const scaleX = pdfWidth / renderedCssWidth;
            const scaleY = pdfHeight / renderedCssHeight;

            // Convert top-left origin (browser) to bottom-left (PDF)
            const pdfX = watermark.x * scaleX;
            const pdfY = pdfHeight - (watermark.y + watermark.height) * scaleY;

            const drawWidth = watermark.width * scaleX;
            const drawHeight = watermark.height * scaleY;


            // Debug information
            console.log("[Exporting to PDF]");
            console.log("Browser box (raw):", watermark);
            console.log("PDF page size:", { pdfWidth, pdfHeight });
            console.log("Screen size:", { renderedCssWidth, renderedCssHeight });
            console.log("Mapped PDF coords:", { x: pdfX, y: pdfY, width: drawWidth, height: drawHeight });

            console.log("[Watermark comparison]", {
                browserBox: watermark,
                pdfBox: { pdfX, pdfY, drawWidth, drawHeight },
                pdfPage: { pdfWidth, pdfHeight },
                screen: { renderedCssWidth, renderedCssHeight }
            });

            // Skip if computed dimensions are invalid
            // if (drawWidth > 0 && drawHeight > 0 && pdfX >= 0 && pdfY >= 0 && pdfX <= pdfWidth && pdfY <= pdfHeight) {
            //     firstPage.drawImage(pngImage, {
            //         x: pdfX,
            //         y: pdfY,
            //         width: drawWidth,
            //         height: drawHeight,
            //         opacity: 1, // subtle watermark
            //     });
            // Draw watermark
            if (drawWidth > 0 && drawHeight > 0) {
                firstPage.drawImage(pngImage, {
                    x: pdfX,
                    y: pdfY,
                    width: drawWidth,
                    height: drawHeight,
                    opacity: 1,
                });
            } else {
                console.warn('[Watermark] Skipping draw – calculated position outside page bounds.');
            }
        }
        console.log("[Browser watermark box]", watermark);
        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, "mayWatermark.pdf", "application/pdf");
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
                        <DraggableSandbox onUpdate={setWatermark} />
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