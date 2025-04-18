import { MainLayout, TextInput, ReusableDropdown, Backdrop, Button } from "../../components";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import  { DropIn }  from "../../animations/DropIn";
import { motion } from "framer-motion";


export default function RSOAccountPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <MainLayout
        tabName="RSO Account"
        headingTitle="View RSO Account Details"
        >
            <div className="flex justify-center  space-x-4 ">
                <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full h-[80vh]">
                    <TextInput
                        placeholder={"RSO Name"}
                        />   
                    <div className="grid grid-cols-2 mt-4 gap-4">
                        <TextInput
                        placeholder={"RSO Name"}
                        />
                        <ReusableDropdown
                            showAllOption={false}
                            options={["Probationary", "Professional", "Cherry"]}
                        />
                        <TextInput
                        placeholder={"RSO Name"}
                        />
                        <TextInput
                        placeholder={"RSO Type"}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center  bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-1/2 h-[50vh] relative">
                    <div
                    title="Edit RSO Account"
                    onClick={() => setShowModal(true)}
                    className="absolute top-8 right-8 transform translate-x-1/2 -translate-y-1/2">
                            <div  className="flex items-center justify-center h-10 w-10 rounded-full border bg-light-gray hover:bg-mid-gray transition duration-300 ease-in-out cursor-pointer">
                            <svg  xmlns="http://www.w3.org/2000/svg" className="fill-dark-gray size-4" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                        </div>
                    </div>
                    <div className="h-[120px] w-[120px] rounded-full border border-primary-rso bg-gradient-to-b from-light-gray to-mid-gray"/>
                    
                    
                    <h1 className="font-bold text-lg">RSO Name</h1>
                    <h2 className=" text-md">Google Developer Group in Manila</h2>
                    <div className="flex justify-start mt-4 w-full">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-dark-gray text-sm">RSO Account Handler</h1>
                            <h1 className="text-dark-gray text-sm">Professional</h1>
                        </div>
                    </div>
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
                className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-4"
                variants={DropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                    
                    <div className="w-full ">
                    <h2 className="text-lg font-bold mb-4">Test Modal</h2>
                    <p>This is a test modal popup.</p>
                    <div className="flex justify-end mt-4">
                        <Button className="p-2 bg-blue-500 text-white rounded-md" onClick={() => setShowModal(false)}>
                        Close
                        </Button>
                    </div>
                    </div>
                
            </motion.div>
            </Backdrop>
            )}
        </AnimatePresence>
        </MainLayout>

    );
}