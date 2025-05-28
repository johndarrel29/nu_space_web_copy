import React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tabSelector, Button, TextInput, ReusableDropdown, Backdrop, CloseButton } from '../../components'
import  TagSelector  from '../../components/TagSelector';
import { useTagSelector, useRSO, useTags } from '../../hooks';
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import DefaultPicture from '../../assets/images/default-profile.jpg';

// file manipulation
import Cropper from "react-easy-crop";
// import { cropImage, createImage } from '../../utils';
import getCroppedImg from '../../utils/cropImage';

function RSOAction() {
  // const { tags } = useTags();
  const { createRSO, updateRSO, deleteRSO } = useRSO();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, data, from } = location.state || {};
  const [showSearch, setShowSearch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedModalTag, setSelectedModalTag] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [tagName, setTagName] = useState("");
  const [originalTagName, setOriginalTagName] = useState("");

  //file manipulaion
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [readyCropper, setReadyCropper] = useState(false);

console.log("Location state:", location.state);
// console.log("tags from useTags:", tags);



  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const {
    selectedTags,
    tagsData,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    isFocused,
    setIsFocused,
    searchedData,
    handleTagClick,
    handleApiTagRemove,

    deleteTagMutation,
    isDeletingTag,
    deleteTagError,

    updateTagMutation,
    isUpdatingTag,
    updateTagError,

  } = useTagSelector();

  useEffect(() => {
  if (isEdit) {
    console.log("Edit mode data:", data);
  }
}, [isEdit]);

// console.log("Selected tags:", selectedTags);
// console.log("tag inside tags data:", tagsData);
// console.log("compare ", selectedTags, "with", tagsData?.tags);

  useEffect(() => {
  if (isEdit && data) {
    setFormData({
      RSO_name: data.RSO_name || "",
      RSO_acronym: data.RSO_acronym || "",
      picture: data.picture || null,
      RSO_category: data.RSO_category || "",
      RSO_tags: data.RSO_tags || [],
      RSO_College: data.RSO_College || "",
      RSO_status: data.RSO_status ?? false,
      RSO_description: data.RSO_description || "",
      RSO_picture: data.RSO_picture || null,
      RSO_picturePreview: data.picture || DefaultPicture,
      RSO_forms: data.RSO_forms || "",
    });

    if (data.RSO_tags?.length) {
      const tagStrings = data.RSO_tags.map(tagObj => 
        typeof tagObj === 'object' ? tagObj.tag : tagObj
      );
      setSelectedTags(tagStrings);
    }
  }
}, [isEdit, data]);





  const handleOptions = ['CCIT', 'CBA', 'COA', 'COE', 'CAEAS', 'CTHM'];
  const handleOptionsCategory = ['Professional & Affiliates', 'Professional', 'Special Interest', 'Probationary']

      const [RSO_picture, setRSOPicture] = useState(null);
      const [formData, setFormData] = useState({
          RSO_name: "",
          RSO_acronym: "",
          RSO_category: "",
          RSO_tags: [],
          RSO_college: "",
          RSO_status: false,
          RSO_description: "",
          RSO_picture: null,
          RSO_picturePreview: DefaultPicture,
      });
  
      const onTagEdit = (tag) => {
          setSelectedTag(tag);
        };
  
      const fileInputRef = useRef(null);
  
      const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
      };
  
      //move the delete button up top
      //map the tagsData here then compare that with selectedTags
      //store the selected tags in a state variable
      //make sure the output is id from the selectedTags



      // const handleTagClick = (tag) => {
      //     console.log("Tag clicked:", tag);
      //     setSelectedTags((prevTags) =>
      //         prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
      //     );
      //     setSearchQuery("");
      //     console.log("Selected tags after click:", selectedTags);
      // };

    const handleTagId = (tag) => {
      const matchingTag = tagsData?.tags.find(tagObj => tagObj.tag.toLowerCase().trim() === tag.toLowerCase().trim());

      if (matchingTag) {
        console.log("Matching tag object found:", matchingTag);
        return matchingTag;
      } else {
        console.log("No matching tag found for:", tag);
        return null;
      }

        // console.log("Tag String clicked:", tag);
        // console.log("tagsData: ",  tagsData?.tags.map(tagObj => tagObj.tag));
        // if (matchingTag) {
        //   console.log("the if statement is true");
        //   console.log("Matching tag ID:", matchingTag._id);
        //   deleteTagMutation(matchingTag._id, {
        //     onSuccess: () => {
        //       console.log("Tag deleted successfully:", matchingTag.tag);
        //       setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
        //       setShowModal(false);
        //       setSelectedModalTag(null);
        //     },
        //     onError: (error) => {
        //       console.error("Error deleting tag:", error);
        //     }
        //   });
          
        // } else {
        //   console.log("No matching tag found for:", tag);
        // }

        // console.log("Selected tags after ID click:", selectedTags);
    }

    const handleTagUpdate = () => {
      const tagId = selectedModalTag?._id;
      const newTag = selectedModalTag?.tag;

      console.log("Updating tag with ID:", tagId, "to new name:", newTag);

      
        updateTagMutation({ tagId: tagId, tagName: newTag }, {
          onSuccess: () => {
            console.log("Tag updated successfully:", newTag);
           setSelectedTags((prevTags) =>
              prevTags.map((t) =>
                t === originalTagName ? selectedModalTag?.tag : t
              )
            );
            setShowModal(false);
            setSelectedModalTag(null);
          },
          onError: (error) => {
            console.error("Error updating tag:", error);
          }
        });

    }

          const handleTagDelete = (tag) => {
          console.log("Deleting tag:", tag);

        deleteTagMutation(tag, {
            onSuccess: () => {
              console.log("Tag deleted successfully:", tag);
              setSelectedTags((prevTags) =>
                prevTags.filter((t) => t !== selectedModalTag.tag)
              );
              setShowModal(false);
              setSelectedModalTag(null);
            },
            onError: (error) => {
              console.error("Error deleting tag:", error);
            }
          });
          
          // setShowModal(false);
          // setSelectedModalTag(null);
      };

      const handleTagModal = (tag) => {
        const tagObj = handleTagId(tag);
          console.log("Tag object for modal:", tagObj);

          if (tagObj) {            
            setSelectedModalTag(tagObj);
            setOriginalTagName(tagObj.tag);
            setShowModal(true);
          }
      }
  

  
      const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Selected tags before submit:", selectedTags);

        const payload = {
          ...formData,
          RSO_tags: selectedTags,
        };

        console.log("Payload before submission:", payload); //tags still show here

        if (formData.RSO_status === "" || formData.RSO_status === null) {
          delete payload.RSO_status;
        }

        let result;
        if (isEdit) {
          console.log("Sending to updateRSO:", payload);
          result = await updateRSO(data.id, payload); 
        } else if (isCreate) {
          console.log("Sending to createRSO:", payload);
          result = await createRSO(payload);
        } 
        
          console.log("RSO created:", result);

          setFormData({
              RSO_name: "",
              RSO_acronym: "",
              RSO_category: "",
              RSO_tags: "",
              RSO_forms: "",
              RSO_College: "",
              RSO_status: "",
              RSO_description: "",
          },
          console.log("clearing after submit: ", formData)
        );
          setRSOPicture(null);
          setSelectedTags([]);
          setSearchQuery("");

          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }

          setHasSubmitted(true);
      };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        
        setImage(preview);
        // this prepares the file for upload

        // setFormData(prev => ({
        //   ...prev,
        //   RSO_picture: file, 
        //   RSO_picturePreview: preview,
        //   RSO_pictureFilename: JSON.stringify(file.name) 
        // }));
      }
    };

    if (image ) {
      console.log("image is a File object:", image);
    } 


    const handleDelete = async () => {
      const confirmed = window.confirm("Are you sure you want to delete this RSO?");
      if (confirmed) {
        try {
          const result = await deleteRSO(data.id);
          console.log("RSO deleted:", result);
          navigate('/rso-management'); 
        } catch (error) {
          console.error("Error deleting RSO:", error);
        }
      }
    };

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
      RSO_picture: croppedFile,
      RSO_picturePreview: URL.createObjectURL(croppedFile), 
    }));
    setImage(null); 
  };



  return (
    <div>
      <div className='mb-8'>
        <div
        onClick={() => {
          navigate(-1);

        }}
        className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </div>
      </div>


      <h1 className='text-xl font-bold'>
        {isEdit ? `Edit ${from}` : isCreate ? 'Create RSO' : 'RSO Action'}
      </h1>
      <h2 className='text-sm font-200'>
        {isEdit ? `Manage Account details` : isCreate ? 'Create a new RSO Account' : ''}
      </h2>

      {/* first section */}
      <div className='flex flex-col md:flex-row items-start gap-4 mt-12'>
        {/* headers */}
        <div className='md:w-1/2 w-full'>
          <h1 className='text-lg font-semibold'>Profile</h1>
          <h2 className='text-sm'>Set account details</h2>
        </div>

        <form  className='w-full'>
        {/* detailed sections */}
        <div className='flex flex-col items-start w-full'>
          <div className='flex flex-col items-center justify-center'>

            {/* only show if there's no image */}
            {!formData.RSO_picturePreview && (
                  <img
                  src={isEdit && !hasSubmitted ? formData?.picture : DefaultPicture}
                  alt="RSO Preview"
                  className="rounded-full h-24 w-24 object-cover"
                />
            )}


              {/* image input */}
              {formData.RSO_picturePreview && (
                <img
                  src={formData.RSO_picturePreview}
                  alt="RSO Preview"
                  className="rounded-full h-24 w-24 object-cover"
                />
              )}
            <div className='flex gap-1 mt-2'>

              {/* input image button */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />


              <div
              onClick={() => fileInputRef.current?.click()}
              className='px-2 py-1 bg-transparent rounded-xl border border-gray-400 text-sm flex justify-center cursor-pointer'>
                
                {isEdit ? `Edit` : isCreate ? 'Upload' : 'Upload'}
              </div >
              <div 
              onClick={() => {
                setImage(null);
                setFormData(prev => ({
                  ...prev,
                  RSO_picture: null,
                  RSO_picturePreview: DefaultPicture,
                }));
              }} 
              className='cursor-pointer px-2 py-1 bg-transparent rounded-full border border-gray-400 text-sm flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='fill-off-black size-3'><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
              </div >
            </div>
          </div>

          <div className='w-full'>
            <label htmlFor="RSO_name" className='text-sm'>RSO Name</label>
            <TextInput 
            id={'RSO_name'}
            name={'RSO_name'}
            type={'text'} 
            placeholder={'RSO Full Name'}
            value={formData.RSO_name}
            onChange={handleChange}
            ></TextInput>
            <div className='flex flex-col md:flex-row gap-4 mt-2'>
              <div className='w-full'>
                <label htmlFor="RSO_acronym" className='text-sm'>RSO Acronym</label>
                <TextInput 
                id='RSO_acronym'
                name='RSO_acronym' 
                type='text' 
                placeholder='Acronym'
                value={formData.RSO_acronym}
                onChange={handleChange}
                >
            
                </TextInput>
              </div>
              <div className='w-full'>
                <label htmlFor="RSO_college" className='text-sm'>RSO College</label>
                <ReusableDropdown 
                name="RSO_college"
                value={formData.RSO_College}
                options={handleOptions}
                onChange={(e) =>
            {    console.log("Selected:", e.target.value);
                setFormData({ ...formData, RSO_College: e.target.value })}
                }
                ></ReusableDropdown>
              </div>
            </div>

              <div className='w-full'>
                <label htmlFor="RSO_category" className='text-sm'>RSO Category</label>
                <ReusableDropdown 
                name="RSO_category"
                value={formData.RSO_category}
                options={handleOptionsCategory}
                onChange={(e) =>
            {    console.log("Selected:", e.target.value);
                setFormData({ ...formData, RSO_category: e.target.value })}
                }
                ></ReusableDropdown>
              </div>

            <label htmlFor="RSO_forms" className='text-sm'>Registration Forms Link</label>
            <TextInput 
            id={'RSO_forms'}
            name={'RSO_forms'}
            type={'text'} 
            placeholder={'Ex. https://forms.gle/....'}
            value={formData.RSO_forms}
            onChange={handleChange}
            ></TextInput>

            <div className='mt-2'>
              <label htmlFor="large-input" className='text-sm'>Description</label>
              <textarea
                rows="4"
                name="RSO_description"
                value={formData.RSO_description}
                onChange={handleChange}
                className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tell us about your organization..."
              />
            </div>
          </div>
        </div>

        </form>


      </div>

      <div className='w-full h-[1px] bg-gray-200 mt-4'></div>

      {/* second section */}
      <div className='flex flex-col md:flex-row justify-between items-start gap-4 mt-12'>
        {/* headers */}
        <div className='md:w-1/2 w-full'>
          <h1 className='text-lg font-semibold'>Tags</h1>
          <h2 className='text-sm'>Add account tags</h2>
        </div>

        {/* detailed sections */}
        <div className='w-full'>
            <TagSelector 
              style={"crud"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowSearch={setShowSearch}
              setIsFocused={setIsFocused}
              searchedData={searchedData}
              handleTagClick={handleTagClick}
              selectedTags={selectedTags}
              handleApiTagRemove={handleApiTagRemove}
              setShowModal={setShowModal}
              handleTagModal={(tag) => {
                handleTagModal(tag);
              }}
            />
        </div>
      </div>

      <div className='w-full h-[1px] bg-gray-200 mt-4'></div>

      <div className='w-full flex justify-between gap-2 mt-4'>
        <Button 
        variant="danger"
        onClick={handleDelete}
        >
          Delete
        </Button>
        <div className='flex gap-2'>
          <Button
            style="secondary"
            size="small"
            onClick={() => {
              console.log("Cancel");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleSubmit}
            type="submit"
          >
            {isEdit ? 'Update' : isCreate ? 'Create' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Modal for tag editing */}
      <AnimatePresence>
        {showModal && (
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
                  <h2 className='text-sm font-semibold'>Edit Tag</h2>
                  <CloseButton onClick={() => setShowModal(false)}></CloseButton>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm'>Tag Name</label>
                  <TextInput
                    type="text"
                    placeholder='Enter tag name'
                    value={selectedModalTag?.tag || "No tag detected"}
                    onChange={(e) => {
                          setSelectedModalTag((prev) => ({
                          ...prev,
                          tag: e.target.value,
                        }));
                    }}
                  />
                  <div className='flex justify-end mt-4'>

                    {/* delete */}
                    <Button
                      onClick={() => {

                        handleTagDelete(selectedModalTag?._id);
                      }}
                      style={"secondary"}
                    >
                      Delete Tag
                    </Button>
                    {/* edit */}
                    <Button
                    //   onClick={() => {
                    //     setSelectedTags((prev) => {
                    //       const updatedTags = prev.map((tag) =>
                    //         tag === selectedModalTag || tag === selectedTag ? selectedModalTag || selectedTag : tag
                    //       );
                    //       return updatedTags;
                    //     });
                    //     setShowModal(false);
                    //   }}
                    //   className='ml-2'
                      onClick={
                        handleTagUpdate
                        // updateTagMutation({ tagId: selectedModalTag?._id, tagName: selectedModalTag?.tag })
                      }
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


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

  )
}

export default RSOAction;