import React, { useState, useCallback, useEffect } from 'react';
import { TextInput, Button, Backdrop, CloseButton } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActivities } from '../../hooks';
import Datetime from 'react-datetime';
import { useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DefaultPicture from '../../assets/images/default-picture.png'; // default image for activities


// file manipulation
import Cropper from "react-easy-crop";
// import { cropImage, createImage } from '../../utils';
import getCroppedImg from '../../utils/cropImage';

function DocumentAction() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, data, from } = location.state || {};
  const { createActivity, updateActivity, deleteActivity, error, success, loading } = useActivities();
  const fileInputRef = useRef(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [defaultImage, setDefaultImage] = useState(true);
  const [ descriptionError, setDescriptionError ] = useState("");

    //file manipulaion
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [readyCropper, setReadyCropper] = useState(false);
  console.log("DocumentAction mode:", mode, "data:", data, "from:", from);
  
  console.log("data image", data?.Activity_image, "activityImageUrl:", data?.activityImageUrl);
  
  const [activityData, setActivityData] = useState(() => {
    if (mode === 'edit' && data) {
      return {
        Activity_name: data.Activity_name || '',
        Activity_image: data.Activity_image || '',
        activityImageUrl: data.activityImageUrl || null,
        Activity_datetime: data?.Activity_datetime ? dayjs(data.Activity_datetime) : null,
      Activity_picturePreview: data?.imageUrl || DefaultPicture, 
      // Activity_picturePreview: null,
        Activity_place: data.Activity_place || '',
        Activity_description: data.Activity_description || '',
        Activity_GPOA: data.Activity_GPOA ?? false
      };
    }
    return {
      Activity_name: '',
      Activity_image: '',
      activityImageUrl: null,
      Activity_datetime: null,
      Activity_place: '',
      Activity_description: '',
      Activity_GPOA: false,
      Activity_picturePreview: DefaultPicture, 
    };
  });

  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setActivityData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

    useEffect(() => {
      if (success) {
        navigate('..', { relative: 'path' });
      }
    }, [success, navigate]);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activityData?.Activity_description === "" || activityData?.Activity_description === null) {
      setDescriptionError("Description is required");
      return;
    } else if (activityData?.Activity_description.length > 500) {
      setDescriptionError("Description must not exceed 500 characters.");
      return;
    } else {
      setDescriptionError("");
    }

    if (error || descriptionError) {
      return;
    }

    // Prepare the data to match the API requirement
    const apiData = {
      ...activityData,
      Activity_GPOA: activityData.Activity_GPOA.toString(),
      Activity_datetime: activityData.Activity_datetime?.toISOString() || 'null', 
    };

    try {
      let result;

      console.log("data before uploading", apiData);
      if (isEdit && data?._id) {
              // Update existing activity

      result = await updateActivity(data._id, apiData);
      } else if (isCreate) {

        const created = await createActivity(apiData);
        console.log("Activity created:", created);
        
        if (created) {
          navigate(from || "/admin/documents", {
            state: { message: isEdit ? "Activity updated successfully!" : "Activity created successfully!" },
          });
        }
      }

    }
    catch (error) {
      console.error("Error submitting form:", error);
    }
    setHasSubmitted(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

console.log("Deleting activity with ID:", data?._id);

    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(data._id);
        console.log("Activity deleted");
        navigate('..', { relative: 'path' });
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  }

  const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const preview = URL.createObjectURL(file);
    setImage(preview);
    setReadyCropper(false); 

    const img = new Image();
    img.onload = () => {
      setReadyCropper(true);
    };
    img.src = preview;
  }
    };

      const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
      }, []);
      
      const handleCrop = async () => {
        if (!image || !croppedAreaPixels || !readyCropper) {
          console.error("Image or crop data not ready");
          return;
        }  
        try {          
          const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
          const croppedFile = new File([croppedBlob], "cropped.png", { type: "image/png" });
          setActivityData(prev => ({
            ...prev,
            Activity_image: croppedFile,
            Activity_picturePreview: URL.createObjectURL(croppedFile), 
          }));
          setImage(null); 
        } catch (error) {
              console.error("Error cropping image:", error);  
        }
      };

    const handleDateChange = (newValue) => {
    setActivityData((prev) => ({
      ...prev,
      Activity_datetime: newValue,
    }));
  };



  return (
    <>
      <div className='mb-8'>
        <div
        onClick={() => {
          navigate(-1);

        }}
        className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {mode === "edit" ? "Edit Activity Details" : mode === "create" ? "Create New Activity" : "View Activity Details"}
      </h1>

      <div>
        <div className="flex items-center justify-center mb-4 gap-2"> 
            {/* edit and create, delete buttons */}
            <div className='flex items-center justify-center mb-4 gap-1'>
              <div
              onClick={() => fileInputRef.current?.click()}
                  className='px-2 py-1 bg-transparent rounded-full border border-gray-400 text-sm flex justify-center cursor-pointer hover:text-gray-500'>
                    
                    {isEdit ? `Edit` : isCreate ? 'Upload' : 'Upload'}
                  </div >
              <div 
              onClick={() => {
                setImage(null);
                setDefaultImage(true);
                setActivityData(prev => ({
                  ...prev,
                  Activity_image: null,
                  Activity_picturePreview: DefaultPicture,
                }));
              }} 
              className='cursor-pointer px-2 py-1 bg-transparent rounded-full aspect-square border border-gray-400 text-sm flex items-center justify-center group hover:text-gray-500'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='fill-off-black size-3 group-hover:fill-gray-500 '><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
              </div >
            </div>




            
            {!activityData.Activity_picturePreview && (
              <div className='h-[13rem] w-full lg:w-[13rem] bg-[#312895]/10 rounded-lg overflow-hidden'>
                <img
                  src={isEdit && hasSubmitted === false ? activityData?.activityImageUrl : defaultImage === true ? DefaultPicture : null}
                  alt="Activity Preview testing"
                  className="w-full h-full object-cover"
                />
              </div>
            )}


              {console.log("Activity_picturePreview value:", activityData.Activity_picturePreview)}
              {activityData.Activity_picturePreview && (
                <div className='h-[13rem] w-full lg:w-[13rem] bg-[#312895]/10 rounded-lg overflow-hidden'>
                    <img
                      src={activityData.Activity_picturePreview}
                      alt="Activity Preview image input"
                      className="w-full h-full object-cover"
                    />
                </div>
              )}
        </div >
        <input 
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange} />
      </div>



    <div className="flex items-center justify-center w-full">
      {/* details */}
      <div className="space-y-6 w-full max-w-2xl">
        <section className="bg-white p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Activity Name</label>
            <TextInput 
              placeholder="Enter activity name" 
              value={activityData.Activity_name} 
              onChange={handleChange('Activity_name')} 
            />
          </div>
          
          {/* <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <TextInput 
              placeholder="Enter " 
              value={activityData.Activity_description} 
              onChange={handleChange('Activity_description')} 
            />
          </div>
           */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            {/* <TextInput 
              type="date" 
              value={activityData.Activity_datetime} 
              onChange={handleChange('Activity_datetime')} 
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              // label="Activity Date & Time"
              value={activityData.Activity_datetime}
              onChange={handleDateChange}
              className="w-full"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  variant: 'outlined'
                }
              }}
            />
          </LocalizationProvider>

          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <TextInput 
              placeholder="Enter location" 
              value={activityData.Activity_place} 
              onChange={handleChange('Activity_place')} 
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="4"
              name="Activity_place"
              value={activityData.Activity_description}
              onChange={handleChange('Activity_description')}
              className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Provide more details about the activity..."
            />
            {descriptionError && (
              <div className="text-red-500 text-sm mt-1">
                {descriptionError}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">GPOA Status</h2>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="gpoa-checkbox"
              checked={activityData.Activity_GPOA}
              onChange={handleChange('Activity_GPOA')}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="gpoa-checkbox" className="block text-sm font-medium text-gray-700">
              Is GPOA Activity
            </label>
          </div>
        </section>
      </div>
    </div>

      <div className="mt-10 flex justify-end space-x-4">
        { success ? (
          <div className="text-green-600 font-semibold">
            {isEdit ? "Activity updated successfully!" : "Activity created successfully!"}
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold">
            {error}
          </div>
        ) : loading && (
          <div className="text-blue-600 font-semibold">
            {isEdit ? "Updating activity..." : "Creating activity..."}
          </div>
        )}
        {isEdit && (
          <Button style="secondary" onClick={handleDelete}>
            Delete Activity
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {isEdit ? "Save Changes" : "Create Activity"}
        </Button>
      </div>

      {/* Modal for image preview */}
      <AnimatePresence>
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
                  <CloseButton onClick={() => setImage(null)}></CloseButton>
                </div>
                <div className='relative h-[300px] w-full mx-auto mb-4'>
                  {/* <img src={image} alt="Preview" className='w-32 h-32 object-cover rounded-md' /> */}
                  {image && readyCropper ? (
                    <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape='square'
                      classes={{
                        containerClassName: 'rounded-xl overflow-hidden',
                      }}
                    />
                  )
                :
                (
                  <div className='flex items-center justify-center h-full'>
                    <p className='text-gray-500'>Loading image...</p>
                  </div>
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
                      disabled={!readyCropper || !croppedAreaPixels}
                  >Upload Image</Button>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>


    </>
  );
}

export default DocumentAction;