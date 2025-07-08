import defaultPic from '../../assets/images/default-picture.png';
import DefaultPicture from "../../assets/images/default-profile.jpg";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ReusableTable, Backdrop, Button, TabSelector, UploadBatchModal } from '../../components';
import { DropIn } from "../../animations/DropIn";
import { useModal, useActivities, useDocumentManagement, useUserProfile } from "../../hooks";
import { useAuth } from "../../context/AuthContext";

// from rso rep if review forms, show the stored data (edit, delete, & view)
// from admin also have review forms, only review forms (view & flag/ review)
// if create forms, show the form builder


//if pre document, show Activity_pre_activity_documents
// if post document, show Activity_post_activity_documents
//make that condition on filter for table

// then, continue with integrating web service for document upload

export default function Activities() {
  const { user } = useAuth();

  // Router hooks
  const { activityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Modal control
  const { isOpen, openModal, closeModal } = useModal();

  // State management
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [files, setFiles] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [titles, setTitles] = useState("");
  const [showStatusMessage, setShowStatusMessage] = useState(false);
  const { webProfile } = useUserProfile();
  const [filter, setFilter] = useState("All");


  const isAdmin = user?.role === "admin";
  const isRSORepresentative = user?.role === "rso_representative";



  // Activity data hooks
  const {
    errorQuery,
    activityDocument,
    activityDocumentError,
    isActivityDocumentLoading,
    isActivityDocumentError,
    createActivityDoc,
    createError,
    isCreatingSuccess,
    loading: isCreatingLoading,
    viewActivityData
  } = useActivities(activityId);

  const activity = viewActivityData || {};
  console.log("Activity data:", activity);

  // Effect to handle upload status messages
  useEffect(() => {
    if (isCreatingSuccess || createError) {
      setShowStatusMessage(true);
      setShowStatusMessage(false);
      setModalType(null);
      setFiles(null);
      return () => clearTimeout();
    }
  }, [isCreatingSuccess, createError]);

  // Tab configuration
  const tabs = [
    { label: "Documents" },
  ];

  // Effect to clear status messages after timeout
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);


  let filteredDocuments = [];
  // Filter documents based on selected filter

  switch (filter) {
    case "Pre Documents":
      filteredDocuments = activity?.Activity_pre_activity_documents || [];
      break;
    case "Post Documents":
      filteredDocuments = activity?.Activity_post_activity_documents || [];
      break;
    case "All":
      filteredDocuments = ((activity?.Activity_pre_activity_documents ?? []).concat(activity?.Activity_post_activity_documents ?? []));
      break;
    default:
      filteredDocuments = activity?.Activity_pre_activity_documents || [];
      break;
  }
  console.log("Filter applied:", filter);
  console.log("Filtered documents:", filteredDocuments);

  // Process activity documents for table display
  const filterActivityDocuments = (filteredDocuments).map((doc) => ({
    id: doc._id,
    title: doc.title,
    purpose: doc.purpose,
    createdAt: new Date(doc.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    url: doc.url,
    status: doc.status,
  }));




  // Table configuration
  const tableHeading = [
    { name: "Document Name", key: "title" },
    { name: "Status", key: "status" },
    { name: "Purpose", key: "purpose" },
    { name: "Uploaded At", key: "createdAt" },
    { name: "Action", key: "actions" }
  ];

  /**
   * Handles file upload process
   */
  const handleFileUpload = () => {
    if (!files) {
      setMsg("Please select a file first!");
      return;
    }

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append(`file${i + 1}`, files[i]);
    }

    setMsg("Uploading file...");
    fetch("http://httpbin.org/post", {
      method: "POST",
      body: fd,
      headers: { "Custom-Header": "value" }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        setMsg("File uploaded successfully!");
        return res.json();
      })
      .then(data => console.log(data))
      .catch((err) => {
        console.error(err);
        setMsg("File upload failed.");
      });
  };

  /**
   * Handles file selection from input
   * @param {Event} e - File input change event
   */
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  /**
   * Removes a file from the selected files array
   * @param {number} index - Index of file to remove
   */
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  /**
   * Submits the selected files for upload
   */
  const handleSubmit = async () => {
    try {
      if (!files || files.length === 0) {
        console.error("No file to upload or title provided.");
        setMsg("Please select a file and provide a title.");
        return;
      }

      console.log("Submitting document:", files, "titles:", titles);

      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('files', files[i]);
        fd.append('title', files[i].title || `Untitled ${i + 1}`);
        fd.append('description', files[i].description || "No description provided");

        console.log(`Submitting formData for file ${i + 1}:`);
        for (const [key, value] of fd.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        await createActivityDoc({ activityId: activityId, formData: fd });
      }
    } catch (error) {
      console.error("Error submitting document:", error);
    }
  };

  /**
   * Handles document click to show details
   * @param {Object} document - Document object to display
   */
  const handleDocumentClick = (document) => {
    setSelectedActivity(document);
    openModal();
    setModalType("details");
  };

  /**
   * Closes the modal and resets modal type
   */
  const handleCloseModal = useCallback(() => {
    closeModal();
    setModalType(null);
  }, [closeModal]);

  /**
   * Opens the document upload modal
   */
  const handleDocumentUpload = () => {
    openModal();
    setModalType("upload");
  };

  /**
   * Formats date string to readable format
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Handles edit button click to navigate to edit page
   */
  const handleEditClick = () => {
    navigate(`../document-action`, {
      state: {
        mode: "edit",
        data: activity,
        from: user.RSO_name
      }
    });
    console.log("Edit button clicked", activity);
  };

  return (
    <>
      <div className="flex flex-col items-start">
        {/* Header Section */}
        <div className='flex items-start justify-between w-full items-center  gap-4 '>
          <div className='flex items-center gap-4'>
            <div
              onClick={() => navigate(-1)}
              className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </div>

            <div className='h-12 w-12 bg-[#312895] rounded-full flex items-center justify-center text-white font-bold'>
              <img
                className='h-full w-full object-cover rounded-full'
                src={activity?.RSO_id?.RSO_imageUrl || DefaultPicture}
                alt="Activity Picture"
              />
            </div>

            <div className='flex flex-col justify-start'>
              <h2 className='text-sm text-gray-600'>Hosted By</h2>
              <h1 className='text-md font-bold text-off-black'>
                {activity?.RSO_id?.RSO_name || 'RSO Name'}
              </h1>
            </div>
          </div>

          {/* Forms Management */}
          {/* if activitySurvey has no content stored in it, show the first content. if it has 
          then show the second content. else, show nothing.
          */}
          <div>

          </div>

          <div>
            {(isRSORepresentative && (!viewActivityData?.activitySurvey || viewActivityData.activitySurvey.length === 0)) ? (
              <Button style={"secondary"} onClick={() => navigate("/forms-builder")}>
                <div className="flex items-center gap-2 text-sm font-light ">
                  <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z" /></svg>
                  Create Forms
                </div>
              </Button>
            ) : (viewActivityData?.activitySurvey) ? (
              <Button
                onClick={() => navigate("/form-viewer")}
              >
                Review Forms
              </Button>
            ) : (
              <h1 className='text-sm text-gray-600'>No Forms Created</h1>
            )
            }
          </div>
        </div>

        {/* Main Content */}
        <div className='w-full px-4 sm:px-8 lg:px-12 mt-6'>
          {/* Image and Details Section */}
          <div className=' flex flex-col items-center w-full'>
            {/* Activity Image */}
            <div className='bg-dark-gray rounded-md  flex justify-center items-center w-full'>
              <div className='aspect-square w-full sm:w-[60%] md:w-[50%] lg:w-[40%] bg-mid-gray overflow-hidden'>
                <img
                  src={activity?.activityImageUrl || defaultPic}
                  alt="Activity"
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* Details Section */}
            <div className='flex w-full justify-start mt-4 gap-4'>
              <h1 className='text-2xl font-bold text-off-black'>{activity?.Activity_name}</h1>
              <div className='flex items-center gap-2'>
                {isRSORepresentative && (
                  <Button onClick={handleEditClick} >
                    <div className="flex items-center gap-2 text-sm font-light ">
                      Edit
                    </div>
                  </Button>
                )}
              </div>
            </div>
            <div className='w-full flex flex-col sm:flex-row justify-start gap-4 mt-4'>
              <div className='bg-white p-4 rounded-lg border border-mid-gray w-full sm:w-[48%] lg:w-[20%]'>
                <h3 className="font-semibold text-off-black text-sm mb-2">Date & Time</h3>
                <p className="text-gray-700 text-sm">{formatDate(activity?.Activity_datetime)}</p>
              </div>
              <div className='bg-white p-4 rounded-lg border border-mid-gray w-full sm:w-[48%] lg:w-[20%]'>
                <h3 className="font-semibold text-off-black text-sm mb-2">Location</h3>
                <p className="text-gray-700 text-sm">{activity?.Activity_place}</p>
              </div>
            </div>

            <div className="space-y-4 mt-4 w-full">
              <div>
                <h3 className="font-semibold text-off-black text-sm mb-2">Description</h3>
                <p className="text-gray-700 text-sm line-clamp-[8] overflow-hidden">
                  {activity?.Activity_description}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 w-full">
              <div className="bg-[#312895]/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-[#312895]" viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-off-black text-sm">Total Registrations</h3>
                <p className="text-gray-700 text-sm">{activity?.Activity_registration_total || 0} participants</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 w-full">
              <div className="bg-[#312895]/10 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-[#312895]" viewBox="0 0 512 512">
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-off-black text-sm">Created At</h3>
                <p className="text-gray-700 text-sm">{formatDate(activity?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className='mt-8 w-full'>
            <TabSelector
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeColor="#312895"
            />

            {activeTab === 0 && (
              <>
                {isRSORepresentative && (
                  <div className="flex justify-end w-full mt-4">
                    <Button
                      onClick={handleDocumentUpload}
                      className="px-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                    >
                      <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='fill-white size-4' viewBox="0 0 512 512">
                          <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                        </svg>
                        Upload Document
                      </div>
                    </Button>
                  </div>
                )}

                <div className="w-full mt-4 overflow-x-auto">
                  <ReusableTable
                    columnNumber={user.role === "rso_representative" ? 5 : 4}
                    tableHeading={tableHeading}
                    tableRow={filterActivityDocuments}
                    options={["All", "Pre Documents", "Post Documents"]}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    showAllOption={false}
                    onClick={handleDocumentClick}
                    headerColor="#312895"
                    activityId={activityId}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Document Details Modal */}
        {modalType === "details" && (
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
                  <h2 className="text-lg font-semibold text-[#312895] mb-4">Document Details</h2>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-sm text-[#312895]/70'>Document Name</p>
                      <p className='text-[#312895] font-medium'>{selectedActivity?.title}</p>
                    </div>
                    <div>
                      <p className='text-sm text-[#312895]/70'>Type</p>
                      <p className='text-[#312895] font-medium'>{selectedActivity?.purpose}</p>
                    </div>
                    <div>
                      <p className='text-sm text-[#312895]/70'>Creation Date</p>
                      <p className='text-[#312895] font-medium'>{selectedActivity?.createdAt}</p>
                    </div>
                  </div>
                  <div className='flex justify-end mt-6'>
                    <Button
                      onClick={handleCloseModal}
                      className="px-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Upload Document Modal */}
        {modalType === "upload" && (
          <Backdrop className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-8">
            <motion.div
              className="bg-white rounded-lg shadow-lg w-[120vh] h-[90vh] border border-[#312895]/20 flex flex-col"
              variants={DropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UploadBatchModal handleCloseModal={handleCloseModal} page={"activity"}></UploadBatchModal>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
}