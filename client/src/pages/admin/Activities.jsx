import defaultPic from '../../assets/images/default-picture.png';
import DefaultPicture from "../../assets/images/default-profile.jpg";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

// Components
import { ReusableTable, Backdrop, Button, TabSelector, CloseButton } from '../../components';
import { DropIn } from "../../animations/DropIn";

// Hooks
import { useModal, useActivities, useDocumentManagement } from "../../hooks";

export default function Activities() {
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
  
  // User data
  const user = JSON.parse(localStorage.getItem("user"));
  
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

  // Process activity documents for table display
  const filterActivityDocuments = (activityDocument?.documents ?? []).map((doc) => ({
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
      fd.append(`file${i+1}`, files[i]);
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
        <div className='flex items-start justify-start w-full items-center  gap-4 '>
          <div
            onClick={() => navigate(-1)}
            className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
            </svg>
          </div>
          
          <div className='h-12 w-12 bg-[#312895] rounded-full flex items-center justify-center text-white font-bold'>
            <img
              className='h-full w-full object-cover rounded-full' 
              src={activity?.RSO_id?.imageUrl || DefaultPicture} 
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

        {/* Main Content */}
        <div className='w-full px-4 sm:px-8 lg:px-12 mt-6'>
          {/* Image and Details Section */}
          <div className='flex flex-col items-center w-full'>
            {/* Activity Image */}
            <div className='aspect-square w-full sm:w-[60%] md:w-[50%] lg:w-[40%] bg-mid-gray rounded-lg overflow-hidden'>
              <img 
                src={activity?.imageUrl || defaultPic} 
                alt="Activity" 
                className='w-full h-full object-cover'
              />
            </div>

            {/* Details Section */}
            <div className='flex w-full justify-start mt-4'>
              <h1 className='text-2xl font-bold text-off-black'>{activity?.Activity_name}</h1>
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
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
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
                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
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
                {user?.role === "student/rso" && (
                  <div className="flex justify-end w-full mt-4">
                    <Button 
                      onClick={handleDocumentUpload}
                      className="px-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                    >
                      <div className='flex items-center gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='fill-white size-4' viewBox="0 0 512 512">
                          <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                        </svg>
                        Upload Document
                      </div>
                    </Button>
                  </div>
                )}
                
                <div className="w-full mt-4 overflow-x-auto">
                  <ReusableTable
                    columnNumber={user.role === "student/rso" ? 5 : 4}
                    tableHeading={tableHeading}
                    tableRow={filterActivityDocuments}
                    options={["All", "PDF", "Word Document", "Excel Sheet"]}
                    value={"All"}
                    onChange={(e) => console.log("Filter changed:", e.target.value)}
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
            <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"/>
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
          <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-white rounded-lg shadow-lg w-[90%] max-w-[600px] border border-[#312895]/20"
              variants={DropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#312895]">Upload Documents</h2>
                  <CloseButton onClick={handleCloseModal} />
                </div>
                
                {/* File Upload Area */}
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#312895]/30 rounded-lg bg-[#312895]/5 hover:bg-[#312895]/10 cursor-pointer transition-colors"
                  >
                    <svg className="fill-[#312895] size-12 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                    </svg>
                    <span className="text-[#312895] font-medium">Click to browse files here</span>
                    <span className="text-sm text-[#312895]/70 mt-1">Supports: PDF, DOCX, XLSX (Max 10MB)</span>
                  </label>
                </div>

                {/* Selected Files List */}
                {files && files.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-[#312895]/5 rounded-lg gap-2">
                        <div className="flex-col items-start w-full">
                          <div className="group block w-full" aria-disabled="false" data-accordion-container data-accordion-mode="exclusive">
                            <div
                              className="flex items-start justify-between w-full text-left font-medium dark:text-white text-slate-800 cursor-pointer"
                              data-accordion-toggle
                              data-accordion-target={`#basicAccordion${index}`}
                              aria-expanded="false"
                            >   
                              <div className="flex flex-col">
                                <p className="text-[#312895] font-medium truncate max-w-[300px]">{file.name}</p>
                                <p className="text-sm text-[#312895]/70">{(file.size / 1024).toFixed(2)} KB</p>                      
                              </div>
                              <div
                                title='Add title and description' 
                                className='flex gap-2 hover:underline hover:decoration-primary cursor-pointer'
                              >
                                <h1 className='text-sm text-[#312895]/70 hidden'>Add title and description</h1>
                                <svg data-accordion-icon-close xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#312895" className="size-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <svg data-accordion-icon-open xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#312895" className="size-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                </svg>
                              </div>
                            </div>
                            <div id={`basicAccordion${index}`} className="overflow-hidden transition-all duration-300 border-b border-slate-200 dark:border-slate-700 pl-1 pr-1">
                              <input
                                type="text"
                                name="title"
                                value={files[index].title || ""}
                                onChange={(e) => {
                                  const updated = [...files];
                                  updated[index].title = e.target.value;
                                  setFiles(updated);
                                }}
                                className="mt-2 w-full p-2 border border-[#312895]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#312895]/50"
                                placeholder="File title"
                              />
                              <textarea
                                rows="4"
                                name="description"
                                value={files[index].description || ""}
                                onChange={(e) => {
                                  const updated = [...files];
                                  updated[index].description = e.target.value;
                                  setFiles(updated);
                                }}
                                className="mt-2 w-full p-2 border border-[#312895]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#312895]/50"
                                placeholder="File description"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-[#312895] hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 384 512">
                            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Status Messages */}
                {msg && (
                  <div className="mt-4 p-3 rounded-lg text-sm bg-yellow-100 text-yellow-800">
                    {msg}
                  </div>
                )}
                
                {showStatusMessage && 
                  (isCreatingSuccess ? (
                    <div className={`mt-4 p-3 rounded-lg text-sm bg-green-100 text-green-800`}>
                      File uploaded successfully!
                    </div>
                  ) : createError && (
                    <div className={`mt-4 p-3 rounded-lg text-sm bg-red-100 text-red-800`}>
                      Error uploading file: {createError.message}
                    </div>
                  ))
                }
              
                {isCreatingLoading && (
                  <div className="mt-4 p-3 rounded-lg text-sm bg-yellow-100 text-yellow-800">
                    Uploading file... 
                  </div>
                )}

                {/* Modal Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <Button style={"secondary"} onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#312895] hover:bg-[#312895]/90 text-white"
                    disabled={!files || files.length === 0}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
}