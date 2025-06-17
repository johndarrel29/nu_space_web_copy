import React from 'react'
import { MainLayout, ReusableTable, Button, Backdrop, CloseButton, TabSelector, CardSkeleton, TextInput } from '../../components'
import { useDocumentManagement, useModal } from '../../hooks';
import { useEffect, useState } from 'react';
import useNotification from '../../utils/useNotification';
import { AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Document() {
  // State and hooks initialization
  const { 
    documents, 
    fetchDocuments, 
    submitDocument, 
    loading, 
    error, 

    submitDocumentMutate,
    submitDocumentLoading,
    submitDocumentSuccess,
    submitDocumentError, 

    generalDocuments, 
    generalDocumentsLoading, 
    refetchGeneralDocuments
   } = useDocumentManagement();
  const [files, setFiles] = useState(null);
  const [titles, setTitles] = useState("");
  const { handleNotification } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState("");
  const [msg, setMsg] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user?.id || "";
  const {         
    documentsData,
    documentsLoading,
    documentsError,
    documentsQueryError,
    refetchDocuments
  } = useDocumentManagement({ userID });

  console.log("user ", user);
  console.log("user id", userID)
  console.log("documentsData", documentsData);

  // Fetch documents on component mount
  // useEffect(() => {
  //   console.log("Fetching documents on component mount...");
  //   fetchDocuments();
  // }, [fetchDocuments]);

  /**
   * Formats a date string to a readable format
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };



// console.log("generalDocuments", Array.isArray(generalDocuments) ? generalDocuments.map(doc => doc.title) : []);


  // Prepare table data from documents
  const tableRow = Array.isArray(documentsData)
  ? documentsData
  .filter(doc => doc.purpose !== "activities")
  .map((doc) => ({
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
  })) :
  [];

  /**
   * Filters documents based on active tab and search query
   * @returns {Array} Filtered list of documents
   */
  const filteredDocuments = () => {
    if (activeTab === 0 && searchQuery === "") {
      return tableRow;
    }

    return tableRow.filter((doc) => {
      const matchesTab = activeTab === 0 || 
        doc.status.toLowerCase() === tabs[activeTab].label.toLowerCase();
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }

  // Tab configuration
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

  // Event handlers
  const handleDocumentUpload = () => {
    setModalType("upload");
    openModal();
  }

  const handleCloseModal = () => {
    setModalType("");
    closeModal();
    setFiles(null);
    setTitles("");
    setMsg(null);
  }

  const handleDocumentView = (row) => {
    setSelectedDocument(row);
    setModalType("view");
    openModal();
    console.log("Selected row:", row);
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

  /**
   * Handles document submission
   * Validates files and submits them to the server
   */
  const handleSubmit = async () => {
    try {
      if (!files || files.length === 0) {
        // console.error("No file to upload or title provided.");
        // handleNotification("Please select a file and provide a title.");
        // setMsg("Please select a file and provide a title.");
        console.log("No files to upload or titles provided.");
        return;
      } 
      
      console.log("Submitting document:", files, "titles:", titles);

        const fd = new FormData();
        

        files.forEach((file, i) => {
          console.log("files[i] content:", files[i]);
          fd.append('files', files[i]); 

          // Optional: if you're sending metadata per file
          fd.append(`title_${i}`, files.title || `Untitled ${i + 1}`);
          fd.append(`description_${i}`, files.description || "No description provided");
          fd.append(`purpose_${i}`, files.purpose || "No purpose provided");
        });

        console.log("Submitting full FormData:");
        for (const [key, value] of fd.entries()) {
          console.log("fd is an instance of FormData:", fd instanceof FormData);

          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        submitDocumentMutate(
          { formData: fd}, {
          onSuccess: (data) => {
            console.log("Document submitted successfully:", data);
            // setMsg("File uploaded successfully!");
            handleNotification("Document submitted successfully!");
            refetchGeneralDocuments(); // Refresh the document list
          },
          onError: (error) => {
            console.error("Error submitting document:", error);
            // setMsg("Error uploading file.");
            handleNotification("Error submitting document. Please try again.");
          }
        });
        // setMsg("File uploaded successfully!");
        handleNotification("Document submitted successfully!");
    } catch (error) {
      console.error("Error submitting document:", error);
      // setMsg("Error uploading file.");
      // handleNotification("Error submitting document. Please try again.");
    }
  };

  //listens to success. it will close the modal and clear the file on the state
  useEffect (() => {
    if (submitDocumentSuccess) {
      setFiles(null);
      setTitles("");
      closeModal();
      setMsg("Document submitted successfully!");
      refetchGeneralDocuments(); // Refresh the document list
    }
  })

  return (
    <MainLayout>
      <div className='w-full flex flex-col bg-card-bg rounded-lg p-4 border border-mid-gray'>
        <div className='w-full flex justify-between items-center mb-4'>
          <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}/>
          <div>
            <Button onClick={handleDocumentUpload}>
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-white' viewBox="0 0 512 512">
                  <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                </svg>
                Upload a document
              </div>
            </Button>
          </div>
        </div>
        
        <ReusableTable
          options={["All", "A-Z", "Most Popular"]}
          onClick={(row) => handleDocumentView(row)}
          value={""}
          showAllOption={false}
          tableRow={filteredDocuments()}
          error={error}
          isLoading={generalDocumentsLoading}
          tableHeading={[
            { name: "Title", key: "title" },
            { name: "Status", key: "status" },
            { name: "Submitted By", key: "submittedBy" },
            { name: "Created At", key: "createdAt" },
            {name: "Action", key: "actions"}
          ]}
          onActionClick={(row) => {
            console.log("Delete clicked for:", row);
          }}
        />
      </div>

      {/* Modal Views */}
      <AnimatePresence>
        {/* View Document Modal */}
        {isOpen && modalType === "view" && (
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
                  <CloseButton onClick={handleCloseModal} />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
                    <span className="text-[#312895]/70 font-medium">Document Name:</span>
                    <span 
                    onClick={() => {
                      window.open(selectedDocument.url, "_blank");
                    }}
                    className="text-[#312895] font-semibold cursor-pointer hover:underline">{selectedDocument.title}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
                    <span className="text-[#312895]/70 font-medium">Document For:</span>
                    <span className="text-[#312895] font-semibold">Requirements Renewal Request</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
                    <span className="text-[#312895]/70 font-medium">Upload Date:</span>
                    <span className="text-[#312895]">{selectedDocument?.createdAt || "Document Date"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-[#312895]/10">
                    <span className="text-[#312895]/70 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedDocument?.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedDocument?.status === 'pending' ? 'bg-[#FFCC33]/20 text-[#FFCC33]/90' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedDocument?.status || "pending"}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <Button style={"secondary"} onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button className="px-6 py-2 bg-[#312895] hover:bg-[#312895]/90 text-white">
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          </Backdrop>
        )} 

        {/* Upload Document Modal */}
        {isOpen && modalType === "upload" && (
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
                              {/* commented since title is already made from the file uploaded */}
                              <input
                                type="text"
                                value={files[index].title || ""}
                                onChange={(e) => {
                                  const updated = [...files];
                                  updated[index].title = e.target.value;
                                  setFiles(updated);
                                }}
                                className="mt-2 w-full p-2 border border-[#312895]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#312895]/50"
                                placeholder="Enter document title"
                              />
                              <input
                                type="text"
                                value={files[index].purpose || ""}
                                onChange={(e) => {
                                  const updated = [...files];
                                  updated[index].purpose = e.target.value;
                                  setFiles(updated);
                                }}
                                className="mt-2 w-full p-2 border border-[#312895]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#312895]/50"
                                placeholder="Enter document purpose"
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

                {submitDocumentSuccess ? (
                  <div 
                  className={`mt-4 p-3 rounded-lg text-sm bg-green-100 text-green-800 `}>
                    Document submitted successfully!
                  </div>
                )
                :
                submitDocumentError ? (
                  <div 
                  className={`mt-4 p-3 rounded-lg text-sm bg-red-100 text-red-800 `}>
                    There was a problem processing upload
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-[#312895]/70">
                    {submitDocumentLoading ? "Uploading..." : "Add files to upload"}
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
    </MainLayout>
  )
}

export default Document