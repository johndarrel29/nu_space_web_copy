import { TextInput, Button, ReusableTable, Backdrop, CloseButton, TabSelector } from "../../../components";
import { useState } from "react";
import { useAnnouncements, useNotification, useModal } from "../../../hooks";
import { useUserStoreWithAuth } from '../../../store';
import { toast } from "react-toastify";
import { FormatDate } from "../../../utils";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { DropIn } from "../../../animations/DropIn";

// populate notificationsData onto table and filtering.


function AnnouncementsPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState(0); // added active tab state
    const { isUserRSORepresentative, isUserAdmin, isCoordinator } = useUserStoreWithAuth();

    const {
        // get notifications
        notificationsData,
        notificationsLoading,
        notificationsError,
        notificationsErrorDetails
    } = useNotification({ userId: user?.id });

    console.log("Notifications Data: ", notificationsData);

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

    const fetchedAnnouncements = announcements?.RSOSpace?.announcement || [];

    // Store full content for viewing in the modal
    // const tableRow = fetchedAnnouncements.map((announcement) => ({
    //     title: announcement.title,
    //     // Truncate content for table display (show only first 50 chars)
    //     content: announcement.content?.length > 50
    //         ? `${announcement.content.substring(0, 50)}...`
    //         : announcement.content,
    //     createdBy: announcement.createdBy,
    //     createdAt: FormatDate(announcement.createdAt),
    //     // Store the full data for the modal
    //     fullData: announcement
    // }));

    const tableRow = notificationsData?.data?.map((notification) => ({
        title: notification.title,
        // Truncate content for table display (show only first 50 chars)
        message: notification.message?.length > 50
            ? `${notification.message.substring(0, 50)}...`
            : notification.message,
        createdBy: notification.createdBy,
        createdAt: FormatDate(notification.createdAt),
        notifType: notification.data.type,
        // Store the full data for the modal
        fullData: notification
    })) || [];

    // Mock sent notifications data (tableRowSent)
    const tableRowSent = [
        {
            title: 'System Maintenance',
            message: 'Scheduled maintenance on Friday at 10 PM...',
            createdBy: user?.firstName || 'Admin',
            createdAt: FormatDate(new Date().toISOString()),
            notifType: 'system',
            fullData: { title: 'System Maintenance', content: 'Scheduled maintenance on Friday at 10 PM. Expect brief downtime.', createdBy: user?.firstName || 'Admin', createdAt: new Date().toISOString(), data: { type: 'system' } }
        },
        {
            title: 'Survey Reminder',
            message: 'Please complete the feedback survey for last event...',
            createdBy: user?.firstName || 'Admin',
            createdAt: FormatDate(new Date(Date.now() - 86400000).toISOString()),
            notifType: 'reminder',
            fullData: { title: 'Survey Reminder', content: 'Please complete the feedback survey for last event to help us improve.', createdBy: user?.firstName || 'Admin', createdAt: new Date(Date.now() - 86400000).toISOString(), data: { type: 'reminder' } }
        },
        {
            title: 'New Feature Release',
            message: 'We have released a new dashboard feature...',
            createdBy: user?.firstName || 'Admin',
            createdAt: FormatDate(new Date(Date.now() - 172800000).toISOString()),
            notifType: 'update',
            fullData: { title: 'New Feature Release', content: 'We have released a new dashboard feature to improve analytics viewing.', createdBy: user?.firstName || 'Admin', createdAt: new Date(Date.now() - 172800000).toISOString(), data: { type: 'update' } }
        }
    ];

    const rowsToDisplay = activeTab === 0 ? tableRow : tableRowSent;

    const announcementHeading = [
        {
            "key": "title",
            "name": "Title"
        },
        {
            "key": "message",
            "name": "Message"
        },
        {
            "key": "notifType",
            "name": "Type"
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

    // listen if a user clicked a row
    // useEffect(() => {
    //     if (isDetailsModalOpen && selectedAnnouncement) {
    //         setEditTitle(selectedAnnouncement.title);
    //         setEditDescription(selectedAnnouncement.content);
    //     }
    // }, [isDetailsModalOpen, selectedAnnouncement]);

    const notificationTab = [
        { label: "Received" },
        { label: "Sent" }
    ]

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div className='flex justify-start md:order-2 p-2'>
                    <Button onClick={openModal}>Create an Announcement</Button>
                </div>
                <TabSelector tabs={notificationTab} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div >
                <ReusableTable
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    columnNumber={4}
                    tableHeading={announcementHeading}
                    tableRow={rowsToDisplay}
                    onClick={handleRowClick}
                    isLoading={false}
                    options={["All", "Latest", "Oldest"]}
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

                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                    <p className="text-base font-medium break-words">
                                        {selectedAnnouncement.title || "—"}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Message / Content</h3>
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                        {selectedAnnouncement.message ||
                                            selectedAnnouncement.content ||
                                            "—"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Type</h3>
                                        <p className="text-sm capitalize">
                                            {selectedAnnouncement?.data?.type || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                                        <p className="text-sm">
                                            {FormatDate(selectedAnnouncement.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                                        <p className="text-sm">
                                            {selectedAnnouncement.createdBy || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">ID</h3>
                                        <p className="text-xs text-gray-600 break-all">
                                            {selectedAnnouncement._id || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button style="secondary" onClick={closeDetailsModal}>
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </Backdrop>
                )}
            </AnimatePresence>
        </>
    );
}

export default AnnouncementsPage;