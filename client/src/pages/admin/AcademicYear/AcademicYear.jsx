import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Backdrop, Button, CloseButton, TextInput } from '../../../components';
import { DropIn } from "../../../animations/DropIn";
import { FormatDate } from '../../../utils'
import { useModal, useAcademicYears } from '../../../hooks';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import { set } from 'react-hook-form';

// when sending data to API, isActive = isActive, isUpcoming = isUpcoming
// make the date input also accept time

export default function AcademicYear() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeYear, setActiveYear] = useState(null);
    const [academicYearHistory, setAcademicYearHistory] = useState([]);
    const [academicYearData, setAcademicYearData] = useState({
        label: '',
        startDate: '',
        endDate: '',
        startYear: null,
        endYear: null,
        isActive: true,
        isUpcoming: false
    });
    const [mode, setMode] = useState('edit');
    const { isOpen, openModal, closeModal } = useModal();
    const {
        academicYears,
        academicYearsLoading,
        academicYearsError,
        academicYearsErrorMessage,
        refetchAcademicYears,
        isRefetchingAcademicYears,
        isAcademicYearsFetched,

        editAcademicYear,
        isEditingAcademicYear,
        isEditingAcademicYearError,
        isEditingAcademicYearErrorMessage,
        isEditingAcademicYearSuccess,

        createAcademicYear,
        isCreatingAcademicYear,
        isCreatingAcademicYearError,
        isCreatingAcademicYearErrorMessage,
        isCreatingAcademicYearSuccess,

        deleteAcademicYear,
        isDeletingAcademicYear,
        isDeletingAcademicYearError,
        isDeletingAcademicYearErrorMessage,
        isDeletingAcademicYearSuccess,

    } = useAcademicYears();

    useEffect(() => {
        if (academicYears && academicYears.years && Array.isArray(academicYears.years) && academicYears.years.length > 0) {

            const active = academicYears.years.find((year) => year.isActive === true);
            console.log("Active Academic Year:", active);
            if (active) {
                setActiveYear(active);
            } else {
                setActiveYear(academicYears.years[0]); // Fallback to the first year if no active year found
            }


            console.log("Academic Years Data:", academicYears);
        } // Fallback to the first year if no active year found
    }, [academicYears]);

    console.log("academic years ", academicYears, "active year:", activeYear);

    // remove the active year from history
    useEffect(() => {
        // Only populate history if we have academic years and an active year
        if (academicYears?.years && activeYear) {
            // Filter out the active year and create a new history array
            const history = academicYears.years.filter(year =>
                year.id !== activeYear._id &&
                year._id !== activeYear._id
            );
            setAcademicYearHistory(history);
        }
    }, [activeYear, academicYears]);

    console.log("Academic Year History:", academicYearHistory);
    console.log("Active Year:", activeYear);

    const handleOpenModal = (modalMode, year = null) => {
        // Set the mode (view, edit or create)
        setMode(modalMode);

        // Set the form data based on mode
        if ((modalMode === 'edit' || modalMode === 'view') && (year || activeYear)) {
            const yearData = year || activeYear;
            setAcademicYearData({
                label: yearData.label || '',
                startDate: yearData.startDate ? yearData.startDate.split('T')[0] : '',
                endDate: yearData.endDate ? yearData.endDate.split('T')[0] : '',
                startYear: yearData.startYear || null,
                endYear: yearData.endYear || null,
                isActive: yearData.isActive || false,
                isUpcoming: yearData.isUpcoming || false
            });
        } else if (modalMode === 'create') {
            // Clear form for create mode
            setAcademicYearData({
                label: '',
                startDate: '',
                endDate: '',
                startYear: null,
                endYear: null,
                isActive: true,
                isUpcoming: false
            });
        }
        setIsModalOpen(true);
        openModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        closeModal();
    };

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
        openModal();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
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

        // get the years from startDate and endDate and store in label with dash in between
        const label = `${academicYearData.startYear}-${academicYearData.endYear}`;
        setAcademicYearData(prev => ({
            ...prev,
            label: label
        }));

        setAcademicYearData(prev => ({
            ...prev,
            startYear: field === 'startDate' ? startYear : prev.startYear,
            endYear: field === 'endDate' ? endYear : prev.endYear,
            [field]: value
        }));

    };

    const handleSaveChanges = () => {
        console.log('Data to be sent: ', academicYearData);

        if (mode === 'edit') {
            console.log('active year id:', activeYear?._id);
            editAcademicYear({ academicYearData: academicYearData, yearId: activeYear?._id },
                {
                    onSuccess: () => {
                        refetchAcademicYears();
                        toast.success("Academic Year updated successfully");
                        handleCloseModal();
                    },
                    onError: (error) => {
                        console.error("Error editing academic year:", error);
                    }
                }
            );
        } else {
            // Handle create functionality here

            console.log('Creating new academic year:', academicYearData);
            createAcademicYear({ academicYearData: academicYearData },
                {
                    onSuccess: () => {
                        toast.success("Academic Year created successfully");
                        handleCloseModal();
                    },
                    onError: (error) => {
                        console.error("Error creating academic year:", error);
                    }
                }
            );
        }
    };

    const handleDelete = () => {
        if (activeYear) {
            deleteAcademicYear({ yearId: activeYear._id }, {
                onSuccess: () => {
                    refetchAcademicYears();
                    toast.success("Academic Year deleted successfully");
                    handleCloseDeleteModal();
                },
                onError: (error) => {
                    console.error("Error deleting academic year:", error);
                    toast.error("Failed to delete Academic Year");
                }
            });
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-start w-full">
                <div className="flex flex-col w-[800px] justify-center mb-8">
                    {/*  Heading */}
                    <div className="flex flex-col items-center justify-center w-full mb-6">
                        <h2 className="text-md text-gray-500">Academic Year</h2>
                        <h2 className="text-3xl font-bold mt-2 mb-4">{activeYear ? `${activeYear.startYear}-${activeYear.endYear}` : 'No Academic Year set.'}</h2>
                    </div>

                    {/* Edit Card */}
                    <div className="w-full bg-white rounded-md p-6 flex justify-evenly items-center relative mb-4">
                        <table className="w-1/2">
                            <tbody>
                                <tr>
                                    <td className="py-3 pr-6 text-gray-500 text-sm text-end">Start</td>
                                    <td className="py-3 font-medium">{activeYear ? (FormatDate(activeYear.startDate)) : 'No data'}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-6 text-gray-500 text-sm text-end">End</td>
                                    <td className="py-3 font-medium">{activeYear ? (FormatDate(activeYear.endDate)) : 'No data'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="w-1/2">
                            <tbody>
                                <tr>
                                    <td className="py-3 pr-6 text-gray-500 text-sm text-end">Status</td>
                                    <td className="py-3 flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${activeYear && activeYear.isActive ? 'bg-success' : 'bg-error'}`}></div>
                                        <span className="font-medium">{activeYear ? (activeYear.isActive ? "Active" : "Inactive") : "No data"}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-3 pr-6 text-gray-500 text-sm text-end">Upcoming</td>
                                    <td className="py-3 flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${activeYear && activeYear.isUpcoming ? 'bg-success' : 'bg-error'}`}></div>
                                        <span className="font-medium">{activeYear ? (activeYear.isUpcoming ? "Upcoming" : "No Upcoming") : "No data"}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Edit Button */}
                        <div
                            onClick={() => handleOpenModal('edit')}
                            className="flex items-center justify-center aspect-square w-8 h-8 rounded-full absolute right-0 top-0 m-4 cursor-pointer hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-500 size-4" viewBox="0 0 640 640"><path d="M505 122.9L517.1 135C526.5 144.4 526.5 159.6 517.1 168.9L488 198.1L441.9 152L471 122.9C480.4 113.5 495.6 113.5 504.9 122.9zM273.8 320.2L408 185.9L454.1 232L319.8 366.2C316.9 369.1 313.3 371.2 309.4 372.3L250.9 389L267.6 330.5C268.7 326.6 270.8 323 273.7 320.1zM437.1 89L239.8 286.2C231.1 294.9 224.8 305.6 221.5 317.3L192.9 417.3C190.5 425.7 192.8 434.7 199 440.9C205.2 447.1 214.2 449.4 222.6 447L322.6 418.4C334.4 415 345.1 408.7 353.7 400.1L551 202.9C579.1 174.8 579.1 129.2 551 101.1L538.9 89C510.8 60.9 465.2 60.9 437.1 89zM152 128C103.4 128 64 167.4 64 216L64 488C64 536.6 103.4 576 152 576L424 576C472.6 576 512 536.6 512 488L512 376C512 362.7 501.3 352 488 352C474.7 352 464 362.7 464 376L464 488C464 510.1 446.1 528 424 528L152 528C129.9 528 112 510.1 112 488L112 216C112 193.9 129.9 176 152 176L264 176C277.3 176 288 165.3 288 152C288 138.7 277.3 128 264 128L152 128z" /></svg>
                        </div>
                    </div>

                    {/* Button field */}
                    <div className='w-full mt-2 mb-6'>
                        <Button
                            onClick={() => handleOpenModal('create')}
                            style={"secondary"}>
                            <div className='w-full flex items-center gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='size-4' fill='current' viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" /></svg>
                                Create New Academic Year
                            </div>
                        </Button>
                    </div>

                    <div className="flex w-full justify-start mt-4">
                        <button
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        >
                            <h1 className="font-medium">History</h1>
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
                        <div className="w-full mt-4 space-y-2">
                            {academicYearHistory?.map((year) => (
                                <div className="w-full cursor-pointer transition-colors hover:bg-gray-50"
                                    onClick={() => handleOpenModal('view', year)}
                                    key={year._id || `${year.startYear}-${year.endYear}`}>
                                    <div className='w-full bg-white rounded-md p-4 border-l-4 border-gray-200'>
                                        <div className='w-full flex justify-between items-center px-4'>
                                            <h1 className='font-medium'>
                                                {year.startYear}-{year.endYear}
                                            </h1>
                                            <h2 className='text-sm text-gray-500'>
                                                ended {FormatDate(year.endDate)}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" />
                        <motion.div
                            className="fixed inset-0 z-50 w-screen overflow-auto"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-8 w-1/3">
                                    <div className='flex justify-between items-center mb-6'>
                                        <h2 className="text-lg font-medium text-[#312895]">
                                            {mode === 'edit'
                                                ? 'Edit Academic Year'
                                                : mode === 'create'
                                                    ? 'Create New Academic Year'
                                                    : 'Academic Year Details'}
                                        </h2>
                                        <CloseButton onClick={handleCloseModal} />
                                    </div>

                                    <div className='space-y-4'>
                                        <div className="w-full">
                                            <table className="w-full">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-4 pr-8 text-gray-500">Start</td>
                                                        <td className="py-4">
                                                            {mode === 'view' ? (
                                                                <span className="font-medium">{FormatDate(academicYearData.startDate)}</span>
                                                            ) : (
                                                                <input
                                                                    type="date"
                                                                    value={academicYearData.startDate}
                                                                    onChange={(e) => handleAcademicYearChange('startDate', e.target.value)}
                                                                    className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#312895] w-full"
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-4 pr-8 text-gray-500">End</td>
                                                        <td className="py-4">
                                                            {mode === 'view' ? (
                                                                <span className="font-medium">{FormatDate(academicYearData.endDate)}</span>
                                                            ) : (
                                                                <input
                                                                    type="date"
                                                                    value={academicYearData.endDate}
                                                                    onChange={(e) => handleAcademicYearChange('endDate', e.target.value)}
                                                                    className="border-b border-gray-300 py-2 focus:outline-none focus:border-[#312895] w-full"
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-4 pr-8 text-gray-500">Status</td>
                                                        <td className="py-4">
                                                            {mode === 'view' ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-3 h-3 rounded-full ${academicYearData.isActive ? 'bg-success' : 'bg-error'}`}></div>
                                                                    <span className="font-medium">{academicYearData.isActive ? "Active" : "Inactive"}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Switch
                                                                        checked={academicYearData.isActive}
                                                                        onChange={(e) => {
                                                                            const isChecked = e.target.checked;
                                                                            handleAcademicYearChange('isActive', isChecked);
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
                                                                    <div className="font-medium">
                                                                        {academicYearData.isActive ? "Active" : "Inactive"}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-4 pr-8 text-gray-500">Upcoming</td>
                                                        <td className="py-4">
                                                            {mode === 'view' ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-3 h-3 rounded-full ${academicYearData.isUpcoming ? 'bg-success' : 'bg-error'}`}></div>
                                                                    <span className="font-medium">{academicYearData.isUpcoming ? "Upcoming" : "Not Upcoming"}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <Switch
                                                                        checked={academicYearData.isUpcoming}
                                                                        onChange={(e) => {
                                                                            const isChecked = e.target.checked;
                                                                            handleAcademicYearChange('isUpcoming', isChecked);
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
                                                                    <div className="font-medium">
                                                                        {academicYearData.isUpcoming ? "Upcoming" : "Not Upcoming"}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className={`flex mt-8 gap-3 ${mode === 'view' ? 'justify-end' : mode === 'edit' ? 'justify-between' : 'justify-end'}`}>
                                        {/* Delete Button - Only show in edit mode */}
                                        {mode === 'edit' && (
                                            <div
                                                className='flex items-center justify-center px-3 py-2 rounded cursor-pointer text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors'
                                                onClick={handleOpenDeleteModal}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className='fill-current size-5 mr-1' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>
                                                Delete
                                            </div>
                                        )}

                                        <div className='flex gap-3'>
                                            {/* Always show close button */}
                                            <Button
                                                onClick={handleCloseModal}
                                                style="secondary"
                                            >
                                                {mode === 'view' ? 'Close' : 'Cancel'}
                                            </Button>

                                            {/* Only show action buttons in edit/create modes */}
                                            {mode !== 'view' && (
                                                <Button
                                                    onClick={handleSaveChanges}
                                                    className="px-6 bg-[#312895] hover:bg-[#312895]/90 text-white"
                                                >
                                                    {mode === 'edit' ? 'Save Changes' : 'Create'}
                                                </Button>
                                            )}

                                            {/* Optional: Add an Edit button in view mode */}
                                            {mode === 'view' && academicYearData && (
                                                <Button
                                                    // onClick={() => handleOpenModal('edit', academicYearData)}
                                                    className="px-6 bg-[#312895] hover:bg-[#312895]/90 text-white"
                                                >
                                                    Reactivate Year Records
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <>
                        <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" />
                        <motion.div
                            className="fixed inset-0 z-50 w-screen overflow-auto"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-8 w-1/3">
                                    <div className='flex justify-between items-center mb-4'>
                                        <h2 className="text-lg font-medium text-[#312895]">
                                            Delete Academic Year
                                        </h2>
                                        <CloseButton onClick={handleCloseDeleteModal} />
                                    </div>

                                    <div className='space-y-4'>
                                        <div className="w-full p-4 text-center">
                                            <div className="mb-4 flex justify-center">
                                                <div className="bg-red-50 rounded-full p-4 inline-block">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-red-500 size-8" viewBox="0 0 640 640">
                                                        <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-medium mb-3">Are you sure?</h3>
                                            <p className="text-gray-500">
                                                You are about to delete the academic year
                                                <span className="font-medium"> {activeYear ? `${activeYear.startYear}-${activeYear.endYear}` : ''}</span>.
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex justify-end mt-8 gap-3'>
                                        <Button
                                            onClick={handleCloseDeleteModal}
                                            style="secondary"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleDelete}
                                            className="px-6 bg-red-500 hover:bg-red-600 text-white"
                                            disabled={isDeletingAcademicYear}
                                        >
                                            {isDeletingAcademicYear ? 'Deleting...' : 'Delete'}
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