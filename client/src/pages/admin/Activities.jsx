
import defaultPic from '../../assets/images/default-picture.png';
import { useLocation } from 'react-router-dom';
import { ReusableTable, Backdrop, Button } from '../../components';
import   { useModal }  from "../../hooks";
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import  { DropIn }  from "../../animations/DropIn";
import { useCallback } from 'react';
import axios, { Axios } from 'axios';


export default function Activities() {
  const location = useLocation()
  const { activity } = location.state || {}; 
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [modalType, setModalType] = useState(null); // State to track the type of modal
  const [ files, setFiles ] = useState(null);
  const [ progress, setProgress ] = useState({ started: false, pc: 0 });
  const [ msg, setMsg ] = useState(null);
  

    const handleFileUpload = () => {
      if (!files) {
        console.error("No file selected for upload.");
        return;
      }
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append(`file${i+1}`, files[i]);
      }

      setMsg("Uploading file...");
      // setProgress(prevState => {
      //   return { ...prevState, started: true };

      // })
      fetch("http://httpbin.org/post", {
        method: "POST",
        body: fd,
        headers: {
          "Custom-Header": "value",
        },

        // onUploadProgress: (progressEvent) => { setProgress(
        //   prevState => {
        //     return { ...prevState, pc: progressEvent.progress*100}
        //   }
        // ) },
        headers: {
          "Custom-Header": "value",
        }
      })
      .then((res) => {
        if(!res.ok) {
          throw new Error("Network response was not ok");
        }
        setMsg("File uploaded successfully!");
        return res.json();
      })

      .then(data => console.log(data))
      .catch((err) => {
        console.error(err);
        setMsg("File upload failed.");
      });

      // axios.post("http://httpbin.org/post", fd, {
      //   onUploadProgress: (progressEvent) => { setProgress(
      //     prevState => {
      //       return { ...prevState, pc: progressEvent.progress*100}
      //     }
      //   ) },
      //   headers: {
      //     "Custom-Header": "value",
      //   }
      // })
      // .then((res) => {
      //   console.log(res.data);
      //   setMsg("File uploaded successfully!");
      // })
      // .catch((err) => {
      //   console.error(err);
      //   setMsg("File upload failed.");
      // });


    }

    // Sample documents data
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
      console.log("Document clicked:", document);
      // show the document details in the modal
      setSelectedActivity(document);
      // Add your logic to handle document click here
      openModal(); // Open the modal when a document is clicked
      setModalType("details"); // Set the modal type to "details"
    }

  const handleCloseModal = useCallback(() => {
      closeModal(); // Close the modal when the button is clicked
      setModalType(null); // Reset the modal type to null
    }, [closeModal]);

    const handleDocumentUpload = () => {
      // Logic to handle document upload goes here
      console.log("Document upload button clicked");
      openModal(); // Open the modal when the button is clickeds
      setModalType("upload"); // Set the modal type to "upload"
    }

  

  return (
    <>
      <div className="flex flex-col items-start ">
        <div className="flex flex-row gap-4 items-center">
            <div className="w-32 h-32 bg-card-bg border border-gray-400 rounded-md"
            style={{
                backgroundImage: `url(${defaultPic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}></div>
              <div className="flex flex-col">
                <div className="font-semibold text-xl">{activity.Activity_name}</div>
                <div className="font-light text-mid_gray">{activity.RSO_id.RSO_name}</div>
            </div>


        </div>
        <div className='w-full h-[300px] flex flex-row justify-center items-center border border-mid-gray mt-2 rounded-md'>
              Activity Details
        </div>

        {user?.role === "student/rso" ? (
          <div className="flex justify-end w-full mt-4">
            <Button 
            onClick={handleDocumentUpload}
            className={"px-4"}>
              Upload Document</Button>
          </div>
        ) : (
          null
        )}
        <ReusableTable
            columnNumber={3}
            tableHeading={tableHeading}
            tableRow={documents}
            options={["All", "PDF", "Word Document", "Excel Sheet"]}
            value={"All"}
            onChange={(e) => console.log("Filter changed:", e.target.value)}
            showAllOption={true}
            onClick={handleDocumentClick} // Add onClick handler for document rows
          />
        
    </div>
<AnimatePresence>

      {modalType === "details" && (
        
        <>
          <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"/>
        <motion.div className="fixed inset-0 z-50 w-screen overflow-auto"
        variants={DropIn}
        initial="hidden"
        animate="visible"
        exit="exit">
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-1/3">
              <h2 className="text-lg font-semibold">Document Details</h2>
              <p>Document Name: {selectedActivity.name}</p>
              <p>Uploaded By: {selectedActivity.uploadedBy}</p>
              <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </motion.div>      
        </>

      )}
      {modalType === "upload" &&(
        <>
          <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"/>
        <motion.div className="fixed inset-0 z-50 w-screen overflow-auto"
        variants={DropIn}
        initial="hidden"
        animate="visible"
        exit="exit">
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-1/3">
              <h2 className="text-lg font-semibold">Upload Documents</h2>
              <div className='flex justify-between mt-4'>
                <input onChange={ (e) => { setFiles(e.target.files) } } type="file" multiple/>
                <Button className="px-4" style={"secondary"} onClick={handleFileUpload}>Upload</Button>
              </div>

              <div className='w-full'>
                {/* {progress.started && (
                  <progress max="100" value={progress.pc}></progress>)} */}
                {msg && <p>{msg}</p>}
              </div>


              <button onClick={handleCloseModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </motion.div>      
        </>

      )}
</AnimatePresence>




      
    </>

  );

}