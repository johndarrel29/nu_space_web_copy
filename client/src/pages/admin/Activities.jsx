import defaultPic from '../../assets/images/default-picture.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReusableTable, Backdrop, Button, TabSelector } from '../../components';
import { useModal } from "../../hooks";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import { useCallback } from 'react';
import axios from 'axios';

export default function Activities() {
  const navigate = useNavigate();
  const location = useLocation()
  const { activity } = location.state || {}; 
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [modalType, setModalType] = useState(null);
  const [files, setFiles] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Documents"},
    { label: "Participants"}
  ]

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

  const documents = [
    { id: 1, name: "Activity Guidelines", type: "PDF", uploadedBy: "Admin" },
    { id: 2, name: "Event Proposal", type: "Word Document", uploadedBy: "RSO Leader" },
    { id: 3, name: "Budget Report", type: "Excel Sheet", uploadedBy: "Treasurer" },
  ];

  const tableHeading = [
    { id: 1, name: "Document Name", key: "name" },
    { id: 2, name: "Type", key: "type" },
    { id: 3, name: "Uploaded By", key: "uploadedBy" },
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
      <div className="flex flex-col items-start bg-white rounded-lg shadow-sm">
      <div className='mb-8'>
        <Button
        style={"secondary"}
        onClick={() => {
          navigate(-1);

        }}
        >Go Back</Button>
      </div>

        {/* Header Section */}
        <div className='flex items-start justify-start w-full'>
          <div className='h-12 w-12 bg-[#312895] rounded-full flex items-center justify-center text-white font-bold'>
            {activity?.Activity_name?.charAt(0) || 'A'}
          </div>
          <div className='flex flex-col justify-start ml-4'>
            <span className='text-xs font-light text-[#312895] bg-[#312895]/10 px-2 py-1 rounded-full w-fit'>Online Event</span>
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
                src={activity?.Activity_image || defaultPic} 
                alt="Activity" 
                className='w-full h-full object-cover'
              />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Left Column */}
              <div className="space-y-4">
                <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Description</h3>
                  <p className="text-gray-700 text-sm">{activity?.Activity_description}</p>
                </div>
                
                <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Date & Time</h3>
                  <p className="text-gray-700 text-sm">
                    {formatDate(activity?.Activity_date)} at {activity?.Activity_time}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
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
                
                <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                  <h3 className="font-semibold text-[#312895] text-sm mb-2">Participants</h3>
                  <p className="text-gray-700 text-sm">{activity?.Activity_registration_total} registered</p>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className='bg-white rounded-lg border border-gray-100 shadow-sm p-4 lg:w-[300px]'>
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
                      {activity?.CreatedBy?.firstName} {activity?.CreatedBy?.lastName}
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
                      {formatDate(activity?.updatedAt)}
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

            {user?.role === "student/rso" && (
              <div className="flex justify-end w-full mt-4">
                <Button 
                  onClick={handleDocumentUpload}
                  className="px-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                >
                  Upload Document
                </Button>
              </div>
            )}

            {activeTab === 0 && (          
              <div className="w-full mt-4">
                <ReusableTable
                  columnNumber={3}
                  tableHeading={tableHeading}
                  tableRow={documents}
                  options={["All", "PDF", "Word Document", "Excel Sheet"]}
                  value={"All"}
                  onChange={(e) => console.log("Filter changed:", e.target.value)}
                  showAllOption={true}
                  onClick={handleDocumentClick}
                  headerColor="#312895"
                />
              </div>
            )}
            {activeTab === 1 && (
              <div className='bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-4'>
                <p className='text-gray-700'>List of participants will appear here</p>
              </div>
            )}
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
                <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl border border-gray-100">
                  <h2 className="text-lg font-semibold text-[#312895] mb-4">Document Details</h2>
                  <div className='space-y-3'>
                    <div>
                      <p className='text-sm text-[#312895]/70'>Document Name</p>
                      <p className='text-[#312895] font-medium'>{selectedActivity?.name}</p>
                    </div>
                    <div>
                      <p className='text-sm text-[#312895]/70'>Type</p>
                      <p className='text-[#312895] font-medium'>{selectedActivity?.type}</p>
                    </div>
                    <div>
                      <p className='text-sm text-[#312895]/70'>Uploaded By</p>
                      <p className='text-[#312895] font-medium'>{selectedActivity?.uploadedBy}</p>
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

        {modalType === "upload" && (
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
                <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl border border-gray-100">
                  <h2 className="text-lg font-semibold text-[#312895] mb-4">Upload Documents</h2>
                  <div className='space-y-4'>
                    <div className='border border-dashed border-[#312895]/30 rounded-lg p-4'>
                      <input 
                        onChange={(e) => setFiles(e.target.files)} 
                        type="file" 
                        multiple
                        className='w-full'
                      />
                    </div>
                    {msg && (
                      <p className={`text-sm ${
                        msg.includes("failed") ? "text-red-500" : "text-[#312895]"
                      }`}>
                        {msg}
                      </p>
                    )}
                    <div className='flex justify-end gap-3 mt-4'>
                      <Button 
                        onClick={handleCloseModal} 
                        className="px-4 bg-white border border-[#312895] text-[#312895] hover:bg-[#312895]/10"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleFileUpload}
                        className="px-4 bg-[#312895] hover:bg-[#312895]/90 text-white"
                      >
                        Upload
                      </Button>
                    </div>
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