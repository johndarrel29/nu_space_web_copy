import { MainLayout, Button, TextInput, Badge, Backdrop, CloseButton, TabSelector } from "../../components";
import { useEffect, useState, useCallback, useRef } from "react";
import { useUserProfile, useModal, useRSO } from "../../hooks";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";

//TODO: make sure to submit correct data field to formData upon appending 
// backend requires array but the frontend is sending formData with single object
///update-officers/ route names array files as officerImages
//delete officer not working even in postman

//fetch data from http://localhost:5000/api/auth/userProfile


//TODO: apply CRUD functionalities for officer. 
//apply routes to frontend. attach to the modal form and create function for creation.
//cache problem: when you create a new officer, the cache is not updated, so you need to refetch the user profile to get the updated list of officers.

//decide if you want to adjust backend to allow individual edits or the batch from mobile.
//tip: you can start from the mobile app's officer management page, then adjust the backend to allow individual edits.
// '/officers/:id', '/update-officers/:id', '/delete-officer/:rsoId' from rsoRoute.js

import Cropper from "react-easy-crop";
import getCroppedImg from '../../utils/cropImage';

const tabs = [
  { label: "Officers" },
]


export default function Account() {
  const { user, error, isLoading, isError, refetch, deleteOfficerMutate, profilePageData } = useUserProfile();
  const {
    updateOfficerMutate,
    isUpdatingOfficer,
    isUpdateOfficerError,
    isUpdateOfficerSuccess,
    createOfficerMutate,
  } = useRSO();
  const { isOpen, openModal, closeModal } = useModal();
  const [officerName, setOfficerName] = useState("");
  const [officerPosition, setOfficerPosition] = useState("");
  const [officerId, setOfficerId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [create, setCreate] = useState(false);
  const [officerError, setOfficerError] = useState("");
  
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [readyCropper, setReadyCropper] = useState(false);
  const fileInputRef = useRef(null);

  console.log("user ", user);
  
  console.log("signed picture", user?.rso_membership?.[0]?.signed_picture);
  const [formData, setFormData] = useState({
    OfficerPicture: null,
    OfficerPicturePreview: null,
    OfficerName: "",
    OfficerPosition: "",
  });

  console.log("user page data", profilePageData);

const handleOfficer = (officer) => {
  if (!officer) {
    openModal();
    setCreate(true);
    setOfficerId(null);
    setFormData({
      OfficerName: "",
      OfficerPosition: "",
      OfficerPicture: null,
      OfficerPicturePreview: "", 
    });

    return;
  }

  setOfficerId(officer._id);
  setFormData({
    OfficerName: officer.OfficerName || "",
    OfficerPosition: officer.OfficerPosition || "",
    OfficerPicture: officer.signed_picture || null,
    OfficerPicturePreview: officer.OfficerPicture || "", 
  });
  setCreate(false);

  openModal();


};


  const handleSubmit = () => {
    // Clear error state at the start
    setOfficerError("");
    
    // Handle form submission logic here
    const { OfficerPicture, OfficerName, OfficerPosition } = formData;
    if (!OfficerPicture || !OfficerName || !OfficerPosition) {
      setOfficerError("Please fill in all fields and upload a picture.");
      return;
    }

    const formDataToSubmit = new FormData();

    if (OfficerPicture && OfficerPicture instanceof File) {
      formDataToSubmit.append("OfficerPicture", OfficerPicture);
    }

    formDataToSubmit.append("OfficerName", OfficerName);
    formDataToSubmit.append("OfficerPosition", OfficerPosition);


    // Log the form data to the console
    console.log("Form Data to Submit:", formDataToSubmit);
    console.log("Officer ID:", officerId);
    console.log("Profile Page Data ID:", profilePageData.assigned_rso?._id, "user id", user?._id);
    console.log("Create Mode:", create);

    if (create) {
      console.log("Creating new officer...");
      createOfficerMutate({ 
        id: profilePageData?.assigned_rso?._id, 
        createdOfficer: formDataToSubmit 
      });
    } else {
      updateOfficerMutate({ 
        id: officerId, 
        updatedOfficer: formDataToSubmit 
      });
    }

    // Reset form data after submission
    setFormData({
      OfficerPicture: null,
      OfficerPicturePreview: null,
      OfficerName: "",
      OfficerPosition: "",
    });
    handleCloseModal();
  }

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const isStudentRSO = user?.role === "student/rso";
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "superadmin";








  const handleCloseModal = () => {
    setOfficerName("");
    setOfficerPosition("");
    closeModal();
  }

  const handleCloseImage = () => {
    setImage(null);
    setReadyCropper(false);
  }
      useEffect(() => {
        if (image) {
              const timeOut = setTimeout(() => {
  
              setReadyCropper(true);
              }, 300);
  
              return () => clearTimeout(timeOut);
        } else {
          setReadyCropper(false);
        }
      })
  
    const onCropComplete = useCallback((_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
    }, []);
    
    const handleCrop = async () => {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cropped.png", { type: "image/png" });
      setFormData(prev => ({
        ...prev,
        OfficerPicture: croppedFile,
        OfficerPicturePreview: URL.createObjectURL(croppedFile), 
      }));

      setImage(null); 
    };

        const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        
        setImage(preview);
      }
    };

    const handleOfficerDelete = (officerId) => {
      if (officerId) {
        console.log("Deleting officer with ID:", officerId);
        deleteOfficerMutate(officerId);
      }
    }

    

  return (
    <MainLayout tabName="Admin Account" headingTitle="Admin Full Name">
      <div className="border border-mid-gray bg-white rounded-lg p-4">
        <div className="flex flex-col justify-center items-center mb-4 w-full">
          {/* Profile Overview */}
          <div className="w-full md:w-auto md:col-span-1 flex justify-center md:justify-start">
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <img
                src={user?.assigned_rso?.signed_picture || DefaultPicture}
                alt="Profile"
                className="size-16 rounded-full object-cover"
              />
              {isAdmin ? (
                <Badge text="Admin" style="secondary" />
              ) : isSuperAdmin && 
                (<Badge text="Super Admin" style="primary" />)
              }
              {isStudentRSO && (
                <Badge text="RSO" style="secondary" />
              )}
              <div className="font-semibold text-lg">
                <h1>
                {isStudentRSO 
                  ? (profilePageData?.assigned_rso?.RSO_name || "loading...")
                  : (isAdmin || isSuperAdmin)
                  ? (
                    profilePageData?.firstName + " " + profilePageData?.lastName || "loading..."
                  )
                  : "loading..."}
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                      {isStudentRSO 
                      ? (profilePageData?.assigned_rso?.RSO_acronym || "loading...")
                      : (isAdmin || isSuperAdmin)
                      ? ('')
                      : "loading..."}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="w-full  md:col-span-2 gap-2">
            { isStudentRSO && (
              <>
              <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}></TabSelector>
              {activeTab === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 ">

                  <div 
                  onClick={() => handleOfficer(null)}
                  className="relative cursor-pointer bg-white hover:bg-background transition ease-in-out flex flex-col justify-center items-center w-full max-w-xs p-6 rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800 mx-auto" >
                    <div className="aspect-square h-14 w-14 rounded-full bg-primary flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-12 fill-white" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                    </div>
                    <h1 className="text-primary text-sm">Add Officer</h1>
                  </div>
                  {console.log("profilePageData officer ", profilePageData?.assigned_rso?.RSO_Officers)}
                  { profilePageData?.assigned_rso?.RSO_Officers?.map ((officer, index) => { 
                    return (
                      <>
  

                      <div 
                      key={index}
                      onClick={(e) => handleOfficer(officer)}
                      
                      className="relative cursor-pointer hover:bg-gray-100 transition ease-in-out flex flex-col justify-center w-full max-w-xs p-6 rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800 mx-auto">
                      <div
                      onClick={
                        (e) => {
                          e.stopPropagation();
                          handleOfficerDelete(officer?._id);
        
                        } 
                      }
                      className="bg-white h-8 w-8 aspect-square rounded-full flex items-center justify-center mb-2 absolute top-0 right-0 mr-2 mt-2 cursor-pointer group transition ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-gray-400 group-hover:fill-gray-700" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                      </div>
                      <img src={officer.signed_picture || DefaultPicture} alt="" className="mx-auto rounded-full dark:bg-gray-500 aspect-square h-32 object-cover shrink-1" />
                      <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                        <div className="my-2 space-y-1">
                          <h2 className="text-xl font-semibold sm:text-2xl truncate">{officer.OfficerName || ''}</h2>
                          <p className="px-5 text-xs sm:text-base dark:text-gray-600 truncate">{officer.OfficerPosition || ''}</p>
                        </div>
                      </div>
                      </div>
                      </>
                    );
                  })}
                </div>
              )}
              </>
            )}

          </div>
        </div>

        {/* edit officer modal */}
        <AnimatePresence>
        {isOpen && (
            <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                className="bg-white rounded-lg shadow-lg w-[70%] max-w-[400px] border border-[#312895]/20"
                variants={DropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold mb-4">{create ? "Create Officer" : "Edit Officer"}</h2>
                    <CloseButton onClick={handleCloseModal} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center mb-4">
                      <div className="flex justify-start w-full">
                        <label 
                          htmlFor="officerPicture" 
                          className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
                        >
                          Officer Picture
                        </label>
                      </div>
                                            <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          className="hidden "
                          onChange={handleImageChange}
                        />
                        
                      <div 
                      
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-full h-[10rem] bg-gray-400 hover:bg-gray-700 transition ease-in-out-300 cursor-pointer">
                        {/* only show preview when user uploads a picture */}
                        {formData.OfficerPicturePreview?.startsWith("blob:") ? (
                          <img
                            name="officerPicture"
                            className="w-full h-full object-cover rounded-full hover:opacity-50 transition ease-in-out-300"
                            src={formData.OfficerPicturePreview}
                            alt={officerName || "Officer Picture Preview"}
                          />
                        ) : (
                          <img
                            name="officerPicture"
                            className="w-full h-full object-cover rounded-full hover:opacity-50 transition ease-in-out-300"
                            src={formData.OfficerPicture || DefaultPicture}
                            alt="Default Officer Picture"
                          />
                        )}

                      
                      </div>
                    </div>
                    <div>
                        <label 
                          htmlFor="officerName" 
                          className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
                        >
                          Officer Name
                        </label>
                      <TextInput
                        id="officerName"
                        label="Officer Name"
                        name="OfficerName"
                        value={formData.OfficerName || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="officerPosition" 
                        className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
                      >
                        Officer Position
                      </label>
                      <TextInput
                        id="officerPosition"
                        name="OfficerPosition"
                        label="Officer Position"
                        value={formData.OfficerPosition || ""}
                        onChange={handleChange}
                        />
                    </div>
                  </div>
                  <div className="flex justify-end mt-8">
                    <div>
                      <Button onClick={handleCloseModal} style={"secondary"} className="mr-2">
                        Delete
                      </Button>
                      <Button
                        disabled={
                          !formData.OfficerPicture ||
                          !formData.OfficerName.trim() ||
                          !formData.OfficerPosition.trim()
                        }
                      onClick={handleSubmit}>Save</Button>
                    </div>
                  </div>
                  {officerError && (
                    <div className="text-red-500 text-sm mt-1">
                      {officerError}
                    </div>
                  )}
                </div>
              </motion.div>
            </Backdrop>
        )}
        {image && (
          <>
            <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"/>
            <motion.div               
              className="fixed inset-0 z-50 w-screen overflow-auto flex items-center justify-center"
              variants={DropIn}
              initial="hidden"
              animate="visible"
              exit="exit">
              
              <div className="bg-white rounded-lg p-6 w-1/3 shadow-xl border border-gray-100">
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-sm font-semibold'>Image Preview</h2>
                  <CloseButton onClick={handleCloseImage}></CloseButton>
                </div>
                <div className='relative h-[300px] w-full mx-auto mb-4'>
                  {/* <img src={image} alt="Preview" className='w-32 h-32 object-cover rounded-md' /> */}
                  {image && readyCropper && (
                    <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape='round'
                      classes={{
                        containerClassName: 'rounded-xl overflow-hidden',
                      }}
                    />
                  )}
                </div>

              <label>Zoom:</label>
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                />


                <div className='flex justify-end mt-4'>
                  <Button
                  onClick={handleCrop}
                  >Upload Image</Button>
                </div>
              </div>

            </motion.div>
          </>
        )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}