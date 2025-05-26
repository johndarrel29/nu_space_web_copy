import React from 'react'
import { MainLayout, ReusableTable, Button, Backdrop, CloseButton, TabSelector, CardSkeleton } from '../../components'
import { useDocumentManagement, useModal } from '../../hooks';
import { useEffect, useState } from 'react';
import  useNotification  from '../../utils/useNotification';
import { AnimatePresence } from "framer-motion";
import  { DropIn }  from "../../animations/DropIn";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

//NOTE: Multiple file upload is not supported yet on the backend. but the frontend now uppends multiple files to the formData

function Document() {
const { documents, fetchDocuments, submitDocument, loading, error } = useDocumentManagement();
    const [files, setFiles] = useState(null);
    const [titles, setTitles] = useState("");
    const { handleNotification } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const { isOpen, openModal, closeModal } = useModal();
    const [ modalType, setModalType ] = useState("");
    const [ msg, setMsg ] = useState(null);
    const [ selectedDocument, setSelectedDocument ] = useState(null);
    const [ searchQuery, setSearchQuery ] = useState("");

  useEffect(() => {
      console.log("Fetching documents on component mount...");
      fetchDocuments();
  }, [fetchDocuments]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
    };

const tableRow = documents.map((doc) => ({

        id: doc._id,
        contentType: doc.contentType || '',
        createdAt: formatDate(doc.createdAt) || '',
        updatedAt: formatDate(doc.updatedAt) || '',
        file: doc.file || '',
        status: doc.status || '',
        submittedBy: doc.submittedBy.firstName + " " + doc.submittedBy.lastName || "N/A",
        title: doc.title || '',
        url: doc.url || '',
        __v: doc.__v || 0
    }));


  const filteredDocuments = () => {
    if (activeTab === 0 && searchQuery === "") {
      return tableRow; 
    };

    let filteredList = tableRow.filter((doc) => {
      const matchesTab = activeTab === 0 || doc.status.toLowerCase() === tabs[activeTab].label.toLowerCase();
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;

    });

    return filteredList;
  }  



    const tabs = [
        { label: "All" },
        { 
            label: "Pending", 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2 dark:text-blue-500" fill="currentColor" viewBox="0 0 384 512">
                <path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/> 
            </svg> 
        },
        { 
            label: "Approved", 
            icon: <svg className="w-4 h-4 me-2 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/>
            </svg>
        },
        { 
            label: "Declined", 
            icon: <svg className="w-4 h-4 me-2 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg> 
        },
    ];

    const handleDocumentUpload = () => {
        setShowModal(true);
        setModalType("upload");
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setFiles(null);
        setTitles("");
        setMsg(null);
    }

    const handleDocumentView = (document) => {
        setSelectedDocument(document);
        setShowModal(true);
        setModalType("view");
        console.log("Selected document:", document);
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
        if (!files ) {
            console.error("No file to upload or title provided.");
            handleNotification("Please select a file and provide a title.");
            setMsg("Please select a file and provide a title.");
        return;
        } else {
            console.log("Submitting document:", files, titles);



            // const formData = new FormData();
            // formData.append("file", files);
            // formData.append("title", titles);

            const fd = new FormData();
            for (let i = 0; i < files.length; i++) {
                fd.append(`files`, files[i]);
                fd.append(`title${i+1}`, titles[i]);
            }
            console.log("FormData:", fd);

            setMsg("Uploading file...");


            console.log("Calling submitDocument with formData...");
            await submitDocument(fd);
            setMsg("File uploaded successfully!");
            handleNotification("Document submitted successfully!");
        }

        } catch (error) {
            console.error("Error submitting document:", error);
            setMsg("Error uploading file.");
            handleNotification("Error submitting document. Please try again.");
        }
    };

  return (
    <MainLayout>
        <div className='w-full flex flex-col bg-card-bg rounded-lg p-4 border border-mid-gray'>
            <div className='w-full flex justify-between items-center mb-4'>
                <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}/>
                <div>
                  <Button onClick={handleDocumentUpload}>
                    <div className='flex items-center gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-white' viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                    Upload a document
                    </div>
                  </Button>
                </div>
            </div>
            <ReusableTable
            options={["All", "A-Z", "Most Popular"]}
            onClick={handleDocumentView}
            value={""}
            showAllOption={false}
            tableRow={filteredDocuments()}
            error={error}
            isLoading={loading}
            tableHeading={[
                { name: "Title", key: "title" },
                // { name: "File", key: "file" },
                { name: "Status", key: "status" },
                { name: "Submitted By", key: "submittedBy" },
                { name: "Created At", key: "createdAt" },
                {name: "Action", key: "actions"}
            ]}
              onActionClick={(row) => {
              console.log("Delete clicked for:", row);
              // handleDeleteItem(row._id); 
            }}
            >
            </ReusableTable>

        </div>

<AnimatePresence>
  {/* View Document Modal */}
  {showModal && modalType === "view" && (
    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl border border-[#312895]/20"
        variants={DropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-[#312895]">Document Details</h2>
            <CloseButton 
              onClick={handleCloseModal}
            >
            </CloseButton>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
              <span className="text-[#312895]/70 font-medium">Document Name:</span>
              <span className="text-[#312895] font-semibold">{selectedDocument.title}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
              <span className="text-[#312895]/70 font-medium">Document For:</span>
              <span className="text-[#312895] font-semibold">Requirements Renewal Request</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
              <span className="text-[#312895]/70 font-medium">Upload Date:</span>
              <span className="text-[#312895]">{new Date(selectedDocument.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
              <span className="text-[#312895]/70 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedDocument.status === 'approved' ? 'bg-green-100 text-green-800' :
                selectedDocument.status === 'pending' ? 'bg-[#FFCC33]/20 text-[#FFCC33]/90' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedDocument.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-[#312895]/70 font-medium">URL:</span>
              <span
                onClick={() => window.open(selectedDocument.url, "_blank")} 
                className="text-[#312895] hover:underline cursor-pointer max-w-xs truncate"
              >
                {selectedDocument.url}
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button 
            style={"secondary"}
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <Button 
              className="px-6 py-2 bg-[#312895] hover:bg-[#312895]/90 text-white"
            >
              Download
            </Button>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  )} 

  {/* Upload Document Modal */}
  {showModal && modalType === "upload" && (
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
            <CloseButton 
              onClick={handleCloseModal}
            >
            </CloseButton>
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
              <span className="text-[#312895] font-medium">Click to browse or drag files here</span>
              <span className="text-sm text-[#312895]/70 mt-1">Supports: PDF, DOCX, XLSX (Max 10MB)</span>
            </label>
          </div>

          {files && files.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#312895]/5 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#312895] font-medium truncate">{file.name}</p>
                    <p className="text-sm text-[#312895]/70">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-[#312895] hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 384 512">
                      <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {msg && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              msg.includes("failed") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {msg}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button 
            style={"secondary"}
              onClick={handleCloseModal}
            >
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
    </MainLayout>
    
  )
}
//NOTE: The modal is not closing when the upload is successful. I will fix this later

export default Document