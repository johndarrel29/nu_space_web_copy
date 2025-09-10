import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDFViewer, DraggableSandbox, Button } from '../../../components';
import watermarkImage from '../../../assets/images/NUSpace_blue.png'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { useQuery } from "@tanstack/react-query";
import useTokenStore from '../../../store/tokenStore';
// import { useAdminDocuments } from '../../../hooks';

export default function WaterMarkPage() {
    const token = useTokenStore.getState().getToken();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { documentId, url } = state || {};
    const [count, setCount] = useState(0)
    const [coords, setCoords] = useState(null);
    const [watermark, setWatermark] = useState(null);

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

        // get rendered pdf size in browser
        const renderedPdfElement = document.querySelector('.react-pdf__Page__canvas'); // or your PDF canvas selector
        const renderedWidth = renderedPdfElement?.width || pdfWidth;
        const renderedHeight = renderedPdfElement?.height || pdfHeight;

        const scaleX = renderedWidth / pdfWidth;
        const scaleY = renderedHeight / pdfHeight;

        if (watermark) {
            const scaleX = pdfWidth / renderedWidth;
            const scaleY = pdfHeight / renderedHeight;

            if (watermark) {
                const pdfX = watermark.x * scaleX;
                const pdfY = pdfHeight - (watermark.y + watermark.height) * scaleY;
                const pdfWidthScaled = watermark.width * scaleX;
                const pdfHeightScaled = watermark.height * scaleY;

                firstPage.drawImage(pngImage, {
                    x: pdfX,
                    y: pdfY,
                    width: pdfWidthScaled,
                    height: pdfHeightScaled,
                });
            }
        }

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

    if (isLoading) return <p>Loading PDF...</p>;
    if (isError) return <p>Error loading PDF</p>;

    return (
        <>
            <div className='flex justify-between items-center w-full bg-white mb-4'>
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
                <Button onClick={handleSaveDocument}>Apply Watermark</Button>
            </div>
            <div className='w-full bg-gray-800 rounded'>
                <PDFViewer docId={documentId} />
                <DraggableSandbox onUpdate={setWatermark}></DraggableSandbox>
            </div>
        </>
    );
}