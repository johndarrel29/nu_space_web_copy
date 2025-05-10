import { MainLayout, Searchbar, ReusableDropdown, Button, Backdrop, CloseButton, TabSelector } from "../../components";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import  { DropIn }  from "../../animations/DropIn";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {useDocumentManagement} from "../../hooks";
import useNotification from "../../utils/useNotification";

export default function DocumentPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [modalType, setModalType] = useState("");
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const { documents, fetchDocuments, submitDocument } = useDocumentManagement();
    const { handleNotification } = useNotification();

    useEffect(() => {
        console.log("Fetching documents on component mount...");
        fetchDocuments();
    }, [fetchDocuments]);

    console.log("Documents fetched:", documents);

    const handleSubmit = async () => {
        console.log("Submitting document:", file, title);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try {
            console.log("Calling submitDocument with formData...");
            await submitDocument(formData);
            handleNotification("Document submitted successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting document:", error);
            handleNotification("Error submitting document. Please try again.");
        }
    };

    const tabs = [
        { label: "All" },
        { 
            label: "Pending", 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2 dark:text-blue-500" fill="currentColor" viewBox="0 0 384 512">
                <path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/> 
            </svg> 
        },
        { 
            label: "Approved", 
            icon: <svg className="w-4 h-4 me-2 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/>
            </svg>
        },
        { 
            label: "Declined", 
            icon: <svg className="w-4 h-4 me-2 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg> 
        },
    ];


    return (
        <MainLayout
            tabName="Documents"
            headingTitle="View and Upload Documents"
        >
            <div className="flex flex-col items-center min-h-screen bg-white rounded-lg shadow-md p-4 mt-4">
                <div className="flex items-center justify-evenly w-full space-x-2">
                    <div className="w-1/2">
                        <Searchbar
                        placeholder={"Search for documents..."}
                        />
                    </div>
                    <div className="w-1/4">
                        <ReusableDropdown
                            showAllOption={true}
                            options={["Most Recent", "Most Viewed", "Cherry"]}
                        />
                    </div>
                    <Button
                    onClick={() => {
                        setModalType("upload");
                        setShowModal(true)}}
                    className="w-1/4 pl-4 pr-4 bg-primary-rso hover:bg-primary-rso-dark ">
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="fill-primary size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                            <h1 className="text-primary">Upload a new document</h1>
                        </div>
                        
                    </Button>
                </div>
                <div className="flex items-start justify-between w-full mt-4">
                    <h1 className="text-dark-gray">Showing 10 Entries</h1>
                    <div className="w-1/4">
                        <ReusableDropdown
                                showAllOption={false}
                                options={["10 Rows", "20 Rows", "30 Rows"]}
                            />
                    </div>

                </div>

                 {/* Documents Section */}
                <div className="w-full">
                    <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                    
                    <div className="mt-4 space-y-2">
                        {documents
                            .filter(doc => 
                                activeTab === 0 || 
                                (activeTab === 1 && doc.status === "Pending") ||
                                (activeTab === 2 && doc.status === "Approved") ||
                                (activeTab === 3 && doc.status === "Declined")
                            )
                            .map((doc, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                    onClick={() => {
                                        setModalType("view");
                                        setShowModal(true)}}
                                >
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">{doc.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{doc.date}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            doc.status === "Approved" ? "bg-green-100 text-green-800" :
                                            doc.status === "Declined" ? "bg-red-100 text-red-800" :
                                            "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {doc.status}
                                        </span>
                                        <span className="text-gray-400">{doc.remarks}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
            {showModal && modalType === "view" && (
                    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <motion.div
                            className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-2xl"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold">Document Details</h2>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="text-gray-600">Document Name:</span>
                                        <span className="font-medium">Event Proposal.pdf</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="text-gray-600">Upload Date:</span>
                                        <span className="font-medium">16/04/2025</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">Pending</span>
                                    </div>
                                    <div className="flex items-start justify-between pt-2">
                                        <span className="text-gray-600">Remarks:</span>
                                        <span className="font-medium text-right max-w-xs">This document is currently under review by the committee. We'll notify you once it's processed.</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <Button 
                                        style="secondary"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2"
                                    >
                                        Close
                                    </Button>
                                    <Button className="px-4 py-2">
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </Backdrop>
                )} 
                {(showModal && modalType === "upload") && (
                    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-4"
                variants={DropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                    
                    <div className="w-full ">
                        <div className="flex items-center justify-between ">
                            <h2 className="text-lg font-bold">File Upload</h2>
                            <CloseButton
                            onClick={() => setShowModal(false)}
                            />
                        </div>
                    
                    <div className="flex flex-col gap-2 items-center justify-center mt-4 border-2 border-dashed border-primary rounded-lg h-[200px] bg-[#BAC1E3]">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])} 
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                    >
                        
                        <svg className="fill-primary size-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                        <h1 className="text-primary">Upload a file</h1>
                    </label>
                    </div>

                    <div className="flex justify-end mt-4">
                        <div className="flex space-x-2">
                            <Button className="p-2 bg-blue-500 text-white rounded-md" onClick={handleSubmit}>
                            Upload
                            </Button>
                            <Button style="secondary" className="p-2 rounded-md" onClick={() => setShowModal(false)}>
                            Cancel
                            </Button>
                        </div>
                    </div>
                    </div>
                
            </motion.div>
            </Backdrop>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}