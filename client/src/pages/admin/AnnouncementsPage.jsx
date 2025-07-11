import { TextInput, Button, ReusableTable, Backdrop, CloseButton, TabSelector } from "../../components";
import { useState, useEffect } from "react";
import { useAnnouncements } from "../../hooks";
import { toast } from "react-toastify";
import { FormatDate } from "../../utils";
import { useModal } from "../../hooks";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { DropIn } from "../../animations/DropIn";



function AnnouncementsPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const {
        createAnnouncementMutate,
        isCreating,
        announcements,
        refetchAnnouncements,
        deleteAnnouncementMutate,
        isDeleting,
        isSuccessDelete,
        isErrorDelete,

        updateAnnouncementMutate,
        isUpdating,
        isSuccessUpdate,
        isErrorUpdate,
        updateError,
    } = useAnnouncements();
    const { isOpen, openModal, closeModal } = useModal();
    const [error, setError] = useState(null);

    // Add state for the details modal
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // state for storing the edit title and description
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const fetchedAnnouncements = announcements?.RSOSpace?.announcement || [];

    // Store full content for viewing in the modal
    const tableRow = fetchedAnnouncements.map((announcement) => ({
        title: announcement.title,
        // Truncate content for table display (show only first 50 chars)
        content: announcement.content?.length > 50
            ? `${announcement.content.substring(0, 50)}...`
            : announcement.content,
        createdBy: announcement.createdBy,
        createdAt: FormatDate(announcement.createdAt),
        // Store the full data for the modal
        fullData: announcement
    }));

    const announcementHeading = [
        {
            "key": "title",
            "name": "Title"
        },
        {
            "key": "content",
            "name": "Content"
        },
        {
            "key": "createdBy",
            "name": "Created By"
        },
        {
            "key": "createdAt",
            "name": "Date"
        }
    ];

    // Handle row click to show details modal
    const handleRowClick = (row) => {
        setSelectedAnnouncement(row.fullData);
        setIsDetailsModalOpen(true);
    };

    // Close details modal
    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedAnnouncement(null);
    };

    const handleNotification = () => {
        if (!title || !description) {
            setError("Please fill in all fields.");
            return;
        }
        // Here you would typically send the announcement data to your backend
        console.log("Announcement created:", { title, description });
        createAnnouncementMutate({ title, content: description },
            {
                onSuccess: () => {
                    toast.success("Announcement created successfully!");
                    setTitle("");
                    refetchAnnouncements();
                    closeModal();
                    setDescription("");
                },
                onError: (error) => {
                    alert("Failed to create announcement. Please try again.");
                },
            }
        );
    }

    const handleAnnouncementDelete = () => {
        if (!selectedAnnouncement) {
            toast.error("No announcement selected for deletion.");
            return;
        }
        deleteAnnouncementMutate(selectedAnnouncement._id, {
            onSuccess: () => {
                toast.success("Announcement deleted successfully!");
                refetchAnnouncements();
                closeDetailsModal();
            },
            onError: (error) => {
                toast.error("Failed to delete announcement. Please try again.");
            },
        });
    }

    const handleAnnouncementUpdate = () => {
        // compare the original and edited values
        if (editTitle === selectedAnnouncement.title && editDescription === selectedAnnouncement.content) {
            toast.info("No changes made to the announcement.");
            return;
        }

        if (!selectedAnnouncement || !editTitle || !editDescription) {
            setError("Please fill in all fields.");
            return;
        }

        console.log("Updating announcement:", {
            id: selectedAnnouncement._id,
            title: editTitle,
            content: editDescription,
        });

        updateAnnouncementMutate(
            { announcementId: selectedAnnouncement._id, title: editTitle, content: editDescription },
            {
                onSuccess: () => {
                    toast.success("Announcement updated successfully!");
                    refetchAnnouncements();
                    closeDetailsModal();
                    setTitle("");
                    setDescription("");
                },
                onError: (error) => {
                    toast.error("Failed to update announcement. Please try again.");
                },
            }
        );
    }

    // listen if a user clicked a row
    useEffect(() => {
        if (isDetailsModalOpen && selectedAnnouncement) {
            setEditTitle(selectedAnnouncement.title);
            setEditDescription(selectedAnnouncement.content);
        }
    }, [isDetailsModalOpen, selectedAnnouncement]);

    const notificationTab = [
        { label: "Received" },
        { label: "Sent" }
    ]

    return (
        <div className="border border-mid-gray bg-white rounded-lg p-4 mt-4">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className='flex justify-start md:order-2 p-2'>
                    <Button onClick={openModal}>Create an Announcement</Button>
                </div>
                <TabSelector tabs={notificationTab} />
            </div>
            <div className="mt-8">
                <ReusableTable
                    columnNumber={4}
                    tableHeading={announcementHeading}
                    tableRow={tableRow}
                    onClick={handleRowClick}
                    isLoading={false}
                    options={["All", "Latest", "Oldest"]}
                    searchQuery={""}
                    error={null}
                />
            </div>

            {/* Create Announcement Modal */}
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {isOpen && (
                    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <motion.div
                            className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-4"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold mb-4">Create Announcement</h2>
                                <CloseButton onClick={closeModal} />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                    <TextInput
                                        label="Title"
                                        placeholder="Make a title for your announcement"
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                        onClick={() => setError(null)}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Content</h3>
                                    <textarea
                                        rows="4"
                                        name="announcement_description"
                                        className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write your announcement here"
                                        onChange={(e) => setDescription(e.target.value)}
                                        value={description}
                                        onClick={() => setError(null)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end mt-4 gap-2">
                                {error && (
                                    <div className="text-red-500 text-sm mb-2">
                                        {error}
                                    </div>
                                )}
                                <Button
                                    style="secondary"
                                    onClick={closeModal}
                                    className="ml-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleNotification}
                                    disabled={isCreating}
                                >
                                    {isCreating ? "Creating..." : "Create Announcement"}
                                </Button>
                            </div>
                        </motion.div>
                    </Backdrop>
                )}
            </AnimatePresence>

            {/* View Details Modal */}
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {isDetailsModalOpen && selectedAnnouncement && (
                    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <motion.div
                            className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-4"
                            variants={DropIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Announcement Details</h2>
                                <CloseButton onClick={closeDetailsModal} />
                            </div>


                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                    <TextInput
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    >
                                    </TextInput>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Content</h3>
                                    <textarea
                                        id="Description"
                                        rows="4"
                                        name="announcement_description"
                                        className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write your announcement here"
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        value={editDescription}
                                        onClick={() => setError(null)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                                        <p className="text-sm">{selectedAnnouncement.createdBy}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                                        <p className="text-sm">{FormatDate(selectedAnnouncement.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 gap-4">
                                <Button
                                    style="secondary"
                                    onClick={handleAnnouncementDelete}
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={handleAnnouncementUpdate}
                                >
                                    Update Announcement
                                </Button>
                            </div>
                        </motion.div>
                    </Backdrop>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AnnouncementsPage;