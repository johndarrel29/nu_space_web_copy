import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TabSelector, Backdrop } from "../../components";
import { AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import { motion } from "framer-motion";

export default function ActivityDocuments() {
    const [activeTab, setActiveTab] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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

    const documents = [
        { name: "Event Proposal.pdf", date: "16/04/2025", status: "Pending", remarks: "Under review" },
        { name: "Budget Plan.xlsx", date: "10/04/2025", status: "Approved", remarks: "Approved with notes" },
        { name: "Participant List.docx", date: "05/04/2025", status: "Declined", remarks: "Incomplete data" }
    ];

    return(
        <div className="flex flex-col bg-white rounded-lg shadow-md p-6 relative max-w-7xl mx-auto">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Saturday, October 14, 2023</span>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mt-1">The Event Conference</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>412MB</span>
                        <span>@National University-Manila</span>
                    </div>
                </div>
                <button
                    title="Edit Activity"
                    onClick={() => navigate("/activity-page/create-activity")}
                    className="flex items-center justify-center h-10 w-10 rounded-full border bg-light-gray hover:bg-mid-gray transition duration-300 ease-in-out cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-dark-gray size-4" viewBox="0 0 512 512">
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                    </svg>
                </button>
            </div>

            {/* Banner Image */}
            <div className="w-full h-64 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mb-8 flex items-center justify-center">
                <div className="text-white text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-2 text-lg font-medium">Event Banner</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Creator Info */}
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Created by</p>
                            <p className="font-semibold">Tyler, the Creator</p>
                        </div>
                    </div>

                    {/* Details Sections */}
                    <div className="space-y-6">
                        {/* Date and Time */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <svg className="fill-gray-500 mr-2 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272z"/>
                                </svg>
                                Date and Time
                            </h2>
                            <div className="flex items-center text-gray-700">
                                <span>October 14, 2023</span>
                                <span className="mx-2">•</span>
                                <span>4:00AM - 7:00AM</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-3 flex items-center">
                                <svg className="fill-gray-500 mr-2 size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z"/>
                                </svg>
                                Location
                            </h2>
                            <p className="text-gray-700">Online</p>
                        </div>

                        {/* Description */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold mb-3">Description</h2>
                            <p className="text-gray-700">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fringilla, nunc a facilisis tincidunt, erat nisi convallis enim, nec efficitur enim nunc id ligula.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button className="flex-1 py-3">Generate Report</Button>
                        <Button style="secondary" className="flex-1 py-3">Share Event</Button>
                    </div>

                    {/* Attendance */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center h-48">
                        <div className="text-4xl font-bold text-blue-600 mb-2">1,247</div>
                        <p className="text-gray-600 mb-4">Attendees</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">75% of expected attendance</p>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-white rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Documents</h2>
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
                                        onClick={() => setShowModal(true)}
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
            </div>

            {/* Modal */}
            <AnimatePresence initial={false} exitBeforeEnter={true} onExitComplete={() => null}>
                {showModal && (
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
            </AnimatePresence>
        </div>
    );
}