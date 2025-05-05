import { MainLayout, TextInput, ReusableDropdown, Backdrop, Button } from "../../components";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DropIn } from "../../animations/DropIn";

export default function RSOAccountPage() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "Google Developer Group in Manila",
        handler: "RSO Account Handler",
        type: "Professional",
        avatar: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            type: value
        }));
    };

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: event.target.result
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    return (
        <MainLayout tabName="RSO Account" headingTitle="View RSO Account Details">
            <div className="flex justify-center space-x-4">
                {/* Left Section - RSO Form */}
                <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full h-[80vh] overflow-auto">
                    <TextInput placeholder="RSO Official Name" />
                    <div className="grid grid-cols-2 mt-4 gap-4">
                        <TextInput placeholder="Account Handler" />
                        <ReusableDropdown
                            showAllOption={false}
                            options={["Probationary", "Professional", "Cherry"]}
                        />
                        <TextInput placeholder="Address" />
                        <TextInput placeholder="RSO Type" />
                    </div>
                </div>

                {/* Right Section - RSO Details Card */}
                <div className="flex flex-col items-center bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-1/2 h-[50vh] relative">
                    <button
                        title="Edit RSO Account"
                        aria-label="Edit RSO Account"
                        onClick={() => setShowModal(true)}
                        className="absolute top-8 right-8 transform translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    >
                        <div className="flex items-center justify-center h-10 w-10 rounded-full border bg-light-gray hover:bg-mid-gray transition duration-300 ease-in-out cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-dark-gray size-4" viewBox="0 0 512 512">
                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                            </svg>
                        </div>
                    </button>

                    <div className="h-[120px] w-[120px] rounded-full border border-primary-rso bg-gradient-to-b from-light-gray to-mid-gray mb-4" />
                    <h1 className="font-bold text-lg">RSO Name</h1>
                    <h2 className="text-md text-center">Google Developer Group in Manila</h2>
                    <div className="flex justify-start mt-4 w-full">
                        <div className="flex flex-col space-y-2">
                            <span className="text-dark-gray text-sm">RSO Account Handler</span>
                            <span className="text-dark-gray text-sm">Professional</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <motion.div
                            className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-6"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold">Edit RSO Account</h2>
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
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center mb-4">
                                    <div className="relative">
                                        <div className="h-32 w-32 rounded-full border-2 border-primary-rso overflow-hidden bg-gradient-to-b from-light-gray to-mid-gray">
                                            {formData.avatar && (
                                                <img src={formData.avatar} alt="RSO Avatar" className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>
                                    <span className="text-sm text-gray-500 mt-2">Click to change avatar</span>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">RSO Name</label>
                                        <TextInput 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Handler</label>
                                        <TextInput 
                                            name="handler"
                                            value={formData.handler}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">RSO Type</label>
                                        <ReusableDropdown
                                            showAllOption={false}
                                            options={["Probationary", "Professional", "Cherry"]}
                                            selectedValue={formData.type}
                                            onSelect={handleTypeChange}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <Button
                                    style="secondary"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2"
                                >
                                    Cancel
                                </Button>
                                <Button className="px-4 py-2">
                                    Save Changes
                                </Button>
                            </div>
                        </motion.div>
                    </Backdrop>
                )}
            </AnimatePresence>
        </MainLayout>
    );
}
