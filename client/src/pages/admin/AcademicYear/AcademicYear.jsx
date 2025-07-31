import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Backdrop, Button, CloseButton, TextInput } from '../../../components';
import { DropIn } from "../../../animations/DropIn";
import { useModal } from '../../../hooks';
import Switch from '@mui/material/Switch';

// when sending data to API, status = isActive, upcoming = isUpcoming

export default function AcademicYear() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [academicYearData, setAcademicYearData] = useState({
        label: '',
        startDate: '',
        endDate: '',
        startYear: null,
        endYear: null,
        status: true,
        upcoming: false
    });
    const { isOpen, openModal, closeModal } = useModal();

    const handleOpenModal = () => {
        setIsModalOpen(true);
        openModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        closeModal();
    };

    const handleAcademicYearChange = (field, value) => {
        let startYear;
        let endYear;

        // extract start and end year from the startDate and endDate
        if (field === 'startDate' || field === 'endDate') {
            if (value) {
                const date = new Date(value);
                if (field === 'startDate') {
                    startYear = date.getFullYear();
                } else if (field === 'endDate') {
                    endYear = date.getFullYear();
                }
            }
        }
        setAcademicYearData(prev => ({
            ...prev,
            startYear: field === 'startDate' ? startYear : prev.startYear,
            endYear: field === 'endDate' ? endYear : prev.endYear,
            [field]: value
        }));

    };

    const handleSaveChanges = () => {
        console.log('Academic Year Data:', academicYearData);
        handleCloseModal();
    };

    return (
        <>
            <div className="flex flex-col items-center justify-start w-full ">
                <div className="flex flex-col w-[800px] justify-center mb-4">
                    {/*  Heading */}
                    <div className="flex flex-col items-center justify-center w-full">
                        <h2 className="text-md">Academic Year</h2>
                        <h2 className="text-3xl font-bold my-8">2025-2026</h2>
                        {/* <p className="text-sm text-gray-600 my-12">No Academic Year set.</p> */}
                    </div>

                    {/* Edit Card */}
                    <div className="w-full rounded bg-light-gray border border-mid-gray p-4 flex justify-evenly items-center relative">
                        <table>
                            <tr>
                                <td className="p-2 text-gray-800 text-sm text-end">Start</td>
                                <td className="p-2 font-bold">No data</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-gray-800 text-sm text-end">End</td>
                                <td className="p-2 font-bold">No data</td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <td className="p-2 text-gray-800 text-sm text-end">Status</td>
                                <td className="p-2 flex items-center gap-2 font-bold">
                                    <div className='aspect-square w-4 h-4 rounded-full bg-success'></div>
                                    Active
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 text-gray-800 text-sm text-end">Upcoming</td>
                                <td className="p-2 font-bold">
                                    Not set
                                </td>
                            </tr>
                        </table>

                        {/* Edit Button */}
                        <div
                            onClick={handleOpenModal}
                            className="flex items-center justify-center aspect-square w-8 h-8 rounded-full absolute right-0 top-0 m-4 cursor-pointer hover:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-off-black size-5" viewBox="0 0 640 640"><path d="M505 122.9L517.1 135C526.5 144.4 526.5 159.6 517.1 168.9L488 198.1L441.9 152L471 122.9C480.4 113.5 495.6 113.5 504.9 122.9zM273.8 320.2L408 185.9L454.1 232L319.8 366.2C316.9 369.1 313.3 371.2 309.4 372.3L250.9 389L267.6 330.5C268.7 326.6 270.8 323 273.7 320.1zM437.1 89L239.8 286.2C231.1 294.9 224.8 305.6 221.5 317.3L192.9 417.3C190.5 425.7 192.8 434.7 199 440.9C205.2 447.1 214.2 449.4 222.6 447L322.6 418.4C334.4 415 345.1 408.7 353.7 400.1L551 202.9C579.1 174.8 579.1 129.2 551 101.1L538.9 89C510.8 60.9 465.2 60.9 437.1 89zM152 128C103.4 128 64 167.4 64 216L64 488C64 536.6 103.4 576 152 576L424 576C472.6 576 512 536.6 512 488L512 376C512 362.7 501.3 352 488 352C474.7 352 464 362.7 464 376L464 488C464 510.1 446.1 528 424 528L152 528C129.9 528 112 510.1 112 488L112 216C112 193.9 129.9 176 152 176L264 176C277.3 176 288 165.3 288 152C288 138.7 277.3 128 264 128L152 128z" /></svg>
                        </div>
                    </div>

                    <div className="flex w-full justify-start mt-8">
                        <button
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        >
                            <h1>History</h1>
                            <svg
                                className={`w-4 h-4 transition-transform ${isHistoryOpen ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* History Table */}
                    {isHistoryOpen && (
                        <div className="w-full mt-4">
                            <div className='w-full bg-white border border-mid-gray rounded-md p-4'>
                                <div className='w-full flex justify-between items-center px-8'>
                                    <h1 className='font-semibold'>
                                        2024-2025
                                    </h1>
                                    <h2 className='text-sm text-gray-600'>
                                        ended 2025-06-30
                                    </h2>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" />
                        <motion.div
                            className="fixed inset-0 z-50 w-screen overflow-auto"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl border border-mid-gray">
                                    <div className='flex justify-between items-center mb-4'>
                                        <h2 className="text-lg font-semibold text-[#312895]">Edit Academic Year</h2>
                                        <CloseButton onClick={handleCloseModal} />
                                    </div>

                                    <div className='space-y-4'>
                                        <div className="w-full  p-4">
                                            <table className="w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className="p-2">Label</td>
                                                        <td className="p-2 font-bold">
                                                            <TextInput
                                                                placeholder={"ex. AY 2025-2026"}
                                                                value={academicYearData.label}
                                                                onChange={(e) => handleAcademicYearChange('label', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2">Start</td>
                                                        <td className="p-2 font-bold">
                                                            <input
                                                                type="date"
                                                                value={academicYearData.startDate}
                                                                onChange={(e) => handleAcademicYearChange('startDate', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2">End</td>
                                                        <td className="p-2 font-bold">
                                                            <input
                                                                type="date"
                                                                value={academicYearData.endDate}
                                                                onChange={(e) => handleAcademicYearChange('endDate', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2">Status</td>
                                                        <td className="p-2 flex items-center gap-2 font-bold">
                                                            <Switch
                                                                checked={academicYearData.status}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    console.log("Switch toggled", isChecked);
                                                                    handleAcademicYearChange('status', isChecked);
                                                                }}
                                                                sx={{
                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                        color: '#312895',
                                                                        '& + .MuiSwitch-track': {
                                                                            backgroundColor: '#312895',
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                            <div>
                                                                {academicYearData.status ? "Active" : "Inactive"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-2">Upcoming</td>
                                                        <td className="p-2 flex items-center gap-2 font-bold">
                                                            <Switch
                                                                checked={academicYearData.upcoming}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    console.log("Upcoming switch toggled", isChecked);
                                                                    handleAcademicYearChange('upcoming', isChecked);
                                                                }}
                                                                sx={{
                                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                                        color: '#312895',
                                                                        '& + .MuiSwitch-track': {
                                                                            backgroundColor: '#312895',
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                            <div>
                                                                {academicYearData.upcoming ? "Upcoming" : "Not Upcoming"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className='flex justify-end mt-6 gap-2'>
                                        <Button
                                            onClick={handleCloseModal}
                                            style="secondary"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveChanges}
                                            className="px-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}