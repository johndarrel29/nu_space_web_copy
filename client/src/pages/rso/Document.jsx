import React from 'react'
import {
  ReusableTable, Button, Backdrop, CloseButton, TabSelector, CardSkeleton, TextInput, UploadDocumentsModal, UploadBatchModal
} from '../../components'
import { useDocumentManagement, useModal } from '../../hooks';
import { useEffect, useState } from 'react';
import useNotification from '../../utils/useNotification';
import { AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

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
  console.log("generalDocuments", generalDocuments);

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

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({ onDrop })

  // Prepare table data from documents
  const tableRow = Array.isArray(generalDocuments)
    ? generalDocuments
      .filter(doc => doc.purpose !== "activities")
      .map((doc) => {
        console.log("doc", doc); // inside your map

        return {
          id: doc._id,
          contentType: doc.contentType || '',
          createdAt: formatDate(doc.createdAt) || '',
          updatedAt: formatDate(doc.updatedAt) || '',
          file: doc.file || '',
          status: doc.status || '',
          submittedBy: doc.submittedBy
            ? `${doc.submittedBy.firstName} ${doc.submittedBy.lastName}`
            : "N/A",
          title: doc.title || '',
          url: doc.url || '',
        };
      }) :

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
      label: "Pending"
    },
    {
      label: "Approved",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2 dark:text-blue-500" fill="currentColor" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
    },
    {
      label: "Declined",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2 dark:text-blue-500" fill="currentColor" viewBox="0 0 512 512"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" /></svg>
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
        { formData: fd }, {
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
  useEffect(() => {
    if (submitDocumentSuccess) {
      setFiles(null);
      setTitles("");
      closeModal();
      setMsg("Document submitted successfully!");
      refetchGeneralDocuments(); // Refresh the document list
    }
  })

  return (
    <div className='w-full flex flex-col bg-card-bg rounded-lg p-4 border border-mid-gray'>
      <div className='w-full flex justify-between items-center mb-4'>
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div>
          <Button onClick={handleDocumentUpload}>
            <div className='flex items-center gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-white' viewBox="0 0 512 512">
                <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
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
          { name: "Action", key: "actions" }
        ]}
        onActionClick={(row) => {
          console.log("Delete clicked for:", row);
        }}
      />

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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedDocument?.status === 'approved' ? 'bg-green-100 text-green-800' :
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
              className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl border border-[#312895]/20"
              variants={DropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* <UploadDocumentsModal handleCloseModal={handleCloseModal} /> */}
              <UploadBatchModal handleCloseModal={handleCloseModal} page={"general"}></UploadBatchModal>
            </motion.div>
          </Backdrop>
        )}


      </AnimatePresence>
    </div>
  )
}

export default Document