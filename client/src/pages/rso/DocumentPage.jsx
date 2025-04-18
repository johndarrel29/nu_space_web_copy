import { MainLayout, Searchbar, ReusableDropdown, Button, Backdrop, CloseButton } from "../../components";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import  { DropIn }  from "../../animations/DropIn";
import { motion } from "framer-motion";


export default function DocumentPage() {
    const [showModal, setShowModal] = useState(false);


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
                    onClick={() => setShowModal(true)}
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
                <table className="w-full mt-4">
                    <tr className="flex justify-between w-full bg-light-gray p-2 rounded-md mt-4">
                        <td>
                            Document Name
                        </td>
                        <td>
                            16/04/2025
                        </td>
                        <td>
                            Pending
                        </td>
                        <td>
                            Remarks
                        </td>
                    </tr>
                </table>
            </div>
            <AnimatePresence
                    initial={false}
                    exitBeforeEnter={true}
                    onExitComplete={() => null}
                >
            {showModal && (
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
                    
                    {/* file upload */}
                    <div className="flex flex-col gap-2 items-center justify-center mt-4 border-2 border-dashed border-primary rounded-lg h-[200px] bg-[#BAC1E3]">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => console.log(e.target.files[0])} // Handle file selection
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
                            <Button className="p-2 bg-blue-500 text-white rounded-md" onClick={() => setShowModal(false)}>
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