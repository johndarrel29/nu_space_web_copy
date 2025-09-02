import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useQuery } from "@tanstack/react-query";
import "../css/pdfViewer.css";
import useTokenStore from '../store/tokenStore';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
    wasmUrl: '/wasm/',
};

const maxWidth = 800;

function PDFViewer({ docId }) {
    const [numPages, setNumPages] = useState(null);
    const [containerWidth, setContainerWidth] = useState();

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };
    const token = useTokenStore.getState().getToken();
    const { data: pdfData, isLoading, error } = useQuery({
        queryKey: ['pdf', docId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/api/admin/documents/pdf/${docId}`, {
                headers: {
                    'Authorization': token,
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.blob();
        },
        enabled: !!docId && !!token, // only fetch when both exist
    });

    if (isLoading) return <p>Loading PDF...</p>;
    if (error) return <p>Error loading PDF</p>;


    return (
        <div className="flex flex-col items-center my-2.5 py-2.5 px-2.5 w-full">
            <div className="Example__container__document">
                <Document
                    // file="/docSample.pdf"
                    // file={docId}
                    file={pdfData}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={options}
                >
                    {Array.from(new Array(numPages), (_el, index) => (
                        <div key={`page_${index + 1}`} className="mb-8">
                            <Page
                                pageNumber={index + 1}
                                width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
                            />
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}

export default PDFViewer;
