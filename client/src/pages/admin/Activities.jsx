import defaultPic from '../../assets/images/default-picture.png';
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
import { ReusableTable, Backdrop, Button, TabSelector, CloseButton } from '../../components';
import { useModal, useActivities, useDocumentManagement } from "../../hooks";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import { useCallback } from 'react';
import DefaultPicture from "../../assets/images/default-profile.jpg";
import axios from 'axios';

//fetch data using: REACT_APP_FETCH_RSO_WEB_URL (http://localhost:5000/api/rso/allRSOweb)


export default function Activities() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation()
  // const { activity } = location.state || {}; 
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [modalType, setModalType] = useState(null);
  const [files, setFiles] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  // const activityId = activity?._id || location.state?.activityId;
  const [titles, setTitles] = useState("");
  const [ showStatusMessage, setShowStatusMessage ] = useState(false);
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

        console.log("view activity data for id", activityId, viewActivityData);

  const activity = viewActivityData || {};
  console.log("Activity data:", activity);


  useEffect(() => {
    if (isCreatingSuccess || createError) {
      setShowStatusMessage(true);
        setShowStatusMessage(false);
        setModalType(null);
      
      setFiles(null); 

      return () => clearTimeout();
    }
  },[ isCreatingSuccess, createError ]);

  const tabs = [
    { label: "Documents"},

  ]

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg(null);
      }, 3000); // Clear message after 3 seconds
      return () => clearTimeout(timer);
    }
  })

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
      if(!res.ok) throw new Error("Network response was not ok");
      setMsg("File uploaded successfully!");
      return res.json();
    })
    .then(data => console.log(data))
    .catch((err) => {
      console.error(err);
      setMsg("File upload failed.");
    });
  }

    const handleFileChange = (e) => {
    const fileArray = Array.from(e.target.files);
    setFiles(fileArray); 
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles); 
  };

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

        console.log("Calling submitDocument with formData...");

        console.log(`Submitting formData for file ${i + 1}:`);
        for (const [key, value] of fd.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        await createActivityDoc({ activityId: activityId, formData: fd});

      }
    } catch (error) {
      console.error("Error submitting document:", error);

    }
  };

  console.log("act docs ", activityDocument?.documents);


const filterActivityDocuments = (activityDocument?.documents ?? []).map((doc) => {
  return {
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
  };
})


  const tableHeading = [
    { name: "Document Name", key: "title" },
    { name: "Status", key: "status" },
    { name: "Purpose", key: "purpose" },
    { name: "Uploaded At", key: "createdAt" },
    { name: "Action", key: "actions"}
  ];



  const handleDocumentClick = (document) => {
    setSelectedActivity(document);
    openModal();
    setModalType("details");
  }

  const handleCloseModal = useCallback(() => {
    closeModal();
    setModalType(null);
  }, [closeModal]);

  const handleDocumentUpload = () => {
    openModal();
    setModalType("upload");
  }

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

    const handleEditClick = () => {
    navigate(`../document-action`, { state: { mode: "edit", data: activity, from: user.RSO_name} });
    console.log("Edit button clicked", activity);
  }

  return (
    <>
      <div className="flex flex-col items-start">
      <div className='mb-8'>
        <div
        onClick={() => {
          navigate(-1);

        }}
        className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </div>
      </div>

        {/* Header Section */}
        <div className='flex items-start justify-start w-full'>
          <div className='h-12 w-12 bg-[#312895] rounded-full flex items-center justify-center text-white font-bold'>
            {/* {activity?.Activity_name?.charAt(0) || 'A'} */}
            <img
            className='h-full w-full object-cover rounded-full' 
            src= {activity?.RSO_id?.imageUrl || DefaultPicture} alt={"Activity Picture"} />
          </div>
          <div className='flex flex-col justify-start ml-4'>
            {/* <span className='text-xs font-light text-[#312895] bg-[#312895]/10 px-2 py-1 rounded-full w-fit'>Online Event</span> */}
            <h1 className='text-xl font-bold text-[#312895] mt-1'>{activity?.Activity_name || 'Activity Name'}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className='w-full pl-12 pr-12 mt-6'>
          {/* Image and Details Section */}
          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Activity Image */}
            <div className='h-[13rem] w-full lg:w-[13rem] bg-[#312895]/10 rounded-lg overflow-hidden'>
              <img 
                src={activity?.imageUrl || defaultPic} 
                alt="Activity" 
                className='w-full h-full object-cover'
              />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Left Column */}
              <div className="space-y-4">
                <div className='bg-white p-4 rounded-lg border border-mid-gray'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Description</h3>
                  <p className="text-gray-700 text-sm">{activity?.Activity_description}</p>
                </div>
                
                <div className='bg-white p-4 rounded-lg border border-mid-gray'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Created at</h3>
                  <p className="text-gray-700 text-sm">
                    {formatDate(activity?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className='bg-white p-4 rounded-lg border border-mid-gray'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Status</h3>
                  <div className='flex items-center gap-2'>
                    <div className={`h-2 w-2 rounded-full ${
                      activity?.Activity_status === 'approved' ? 'bg-green-500' : 
                      activity?.Activity_status === 'pending' ? 'bg-[#FFCC33]' : 
                      'bg-red-500'
                    }`}></div>
                    <p className="text-gray-700 text-sm capitalize">{activity?.Activity_status}</p>
                  </div>
                </div>
                
                <div className='bg-white p-4 rounded-lg border border-mid-gray'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Participants</h3>
                  <p className="text-gray-700 text-sm">{activity?.Activity_registration_total} registered</p>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className='bg-white rounded-lg border border-mid-gray p-4 lg:w-[300px]'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-[#312895] rounded-full flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='size-5 fill-white' viewBox="0 0 448 512">
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-[#312895]/70'>Created By</p>
                    <p className='text-sm font-medium text-[#312895]'>
                      {activity?.RSO_id?.RSO_acronym} 
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-[#312895] rounded-full flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='size-5 fill-white' viewBox="0 0 448 512">
                      <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48H0l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z"/>
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-[#312895]/70'>Date & Time</p>
                    <p className='text-sm font-medium text-[#312895]'>
                      {formatDate(activity?.Activity_datetime)}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-[#312895] rounded-full flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='size-5 fill-white' viewBox="0 0 384 512">
                      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-[#312895]/70'>Location</p>
                    <p className='text-sm font-medium text-[#312895]'>
                      {activity?.Activity_place}
                    </p>
                  </div>
                </div>
              </div>
            {user.role === "student/rso" && (
              <Button 
                className="w-full mt-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                onClick={handleEditClick}
              >
                Edit Event
              </Button>
            )}

            </div>
          </div>

          {/* Tabs Section */}
          <div className='mt-8'>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className='fill-white size-4' viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                        Upload Document
                      </div>
                    </Button>
                  </div>
                )}
              <div className="w-full mt-4">
                <ReusableTable
                  columnNumber={user.role === "student/rso" ? 5 : 4}
                  tableHeading={tableHeading}
                  tableRow={filterActivityDocuments}
                  options={["All", "PDF", "Word Document", "Excel Sheet"]}
                  value={"All"}
                  onChange={(e) => console.log("Filter changed:", e.target.value)}
                  showAllOption={true}
                  onClick={handleDocumentClick}
                  headerColor="#312895"
                  activityId={activityId}
                />
              </div>
              </>     
            )}
            {/* {activeTab === 1 && (
              <div className='bg-white p-4 rounded-lg border border-mid-gray mt-4'>
                <p className='text-gray-700'>List of participants will appear here</p>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
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
        { modalType === "upload" &&  (
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
                                className='flex gap-2 hover:underline hover:decoration-primary cursor-pointer'>
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
                          className=" text-[#312895] hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 384 512">
                            <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {msg && (
                  <div className="mt-4 p-3 rounded-lg text-sm bg-yellow-100 text-yellow-800">
                    {msg}
                  </div>
                )}
                {showStatusMessage && 
                (isCreatingSuccess ? (
                  <div className={`mt-4 p-3 rounded-lg text-sm  bg-green-100 text-green-800`}>
                    File uploaded successfully!
                  </div>
                ) : createError && (
                  <div className={`mt-4 p-3 rounded-lg text-sm bg-red-100 text-red-800`}>
                    Error uploading file: {createError.message}
                  </div>
                ) 
                )}
              
              {
                isCreatingLoading && (
                  <div className="mt-4 p-3 rounded-lg text-sm bg-yellow-100 text-yellow-800">
                    Uploading file... 
                  </div>
                )
              }
                

              


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