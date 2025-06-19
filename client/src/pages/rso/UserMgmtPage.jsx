import { Searchbar, ReusableDropdown, Button, Backdrop, CloseButton } from "../../components";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import  { DropIn }  from "../../animations/DropIn";
import { motion } from "framer-motion";

export default function UserMgmtPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        <div className="flex flex-col items-center  min-h-screen bg-gray-100">
            <div className="bg-white h-auto w-full rounded-lg shadow-md p-4 mt-4">
                <div className="flex items-center justify-between space-x-2 ">
                    <div className="w-full">
                        <Searchbar
                        placeholder={"Search for users..."}
                        />
                    </div>
                    <div className="flex items-center justify-between w-1/2">
                        <ReusableDropdown 
                        showAllOption={true}
                        options={["Most Recent", "Most Viewed", "Cherry"]} />
                    </div>
                </div>

                <div>
                    <h1 className="text-dark-gray mt-4">Showing 10 Entries</h1>
                </div>

                <table className="w-full mt-4 rounded-md ">
                    <tr 
                    onClick={() => setShowModal(true)}
                    className="bg-light-gray h-12 p-2 hover:bg-mid-gray cursor-pointer">
                        <td className="pl-2 pr-2">1</td>
                        <td>
                            <div className="flex flex-col items-start justify-center ">
                                <h1 className="font-bold">Juan Dela Cruz</h1>
                                <h1>College</h1>
                            </div>
                        </td>
                        <td>Student</td>
                        <td>Approved</td>
                        <td>16/04/2024</td>
                        <td>
                            <div className="rounded-full h-8 w-8 bg-light-gray flex items-center justify-center hover:bg-mid-gray cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-off-black size-4" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32-14.3 32-32z"/></svg>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <AnimatePresence
                    initial={false}
                    exitBeforeEnter={true}
                    onExitComplete={() => null}
                >
            {showModal && (
            <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                className="bg-white overflow-hidden rounded-lg shadow-lg w-1/2 p-4"
                variants={DropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >  
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold ">User Details</h2>
                        <CloseButton onClick={() => setShowModal(false)} />
                    </div>

                    <div className="flex flex-col gap-4 justify-between overflow-y-auto max-h-[60vh]">
                    <div className="flex justify-center items-center w-full max-h-[200px] bg-light-gray rounded-md p-4">
                        <h1 className="font-bold">
                            <div className="flex items-center justify-center gap-2 hover:underline cursor-pointer">
                            GDSC Forms
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-off-black size-4" viewBox="0 0 512 512"><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-128c0-17.7-14.3-32-32-32L352 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
                            </div>
                        </h1>
                    </div>
                    
                    <div className="flex flex-col w-full max-h-[200px] justify-start items-start gap-2 sticky top-0">
                        <div className="bg-light-gray w-full max-h-[200px] p-4 flex justify-start flex-col items-start gap-2 rounded-md">
                                <div className="flex items-center justify-center space-x-2">
                                    <h1 className="font-bold">Juan Dela Cruz</h1>
                                    <h1 className="text-dark-gray">Student</h1>
                                </div>
                                
                                <h1>cruzjd@students.national-u.edu.ph</h1>
                                <h1>CCIT</h1>
                                
                        </div>

                        {/* button */}
                        <div className="flex justify-start mt-4 space-x-2">
                            <div
                            title="Approve User"
                            onClick={() => setShowModal(false)}
                            className={"rounded-full h-10 w-10 bg-primary-rso flex items-center justify-center hover:bg-primary-rso-hover cursor-pointer"}
                            >
                                <svg className="fill-primary size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                            </div>
                            <div
                            title="Reject User"
                            onClick={() => setShowModal(false)}
                            className={"rounded-full h-10 w-10 bg-light-gray flex items-center justify-center hover:bg-mid-gray cursor-pointer"}
                            >
                                <svg className="fill-off-black size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32-14.3 32-32z"/></svg>
                            </div>

                        </div>
                    </div>

                    {/* right pane
                    <div className="overflow-y-auto bg-light-gray w-full p-4 rounded-md h-screen">Forms</div> */}
                </div>
                </div>
            </motion.div>
            </Backdrop>
            )}
        </AnimatePresence>
        </>
    );
}