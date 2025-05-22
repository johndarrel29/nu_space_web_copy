import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tabSelector, Button, TextInput, ReusableDropdown } from '../../components'
import  TagSelector  from '../../components/TagSelector';
import { useTagSelector, useRSO } from '../../hooks';

function RSOAction() {
  const { createRSO, updateRSO, deleteRSO } = useRSO();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, data, from } = location.state || {};
  const [showSearch, setShowSearch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedModalTag, setSelectedModalTag] = useState(null);

console.log("Location state:", location.state);


      const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const {
    selectedTags,
    setSelectedTags,
    searchQuery,
    setSearchQuery,
    isFocused,
    setIsFocused,
    searchedData,
    handleTagClick,
    handleApiTagRemove
  } = useTagSelector();

  useEffect(() => {
  if (isEdit) {
    console.log("Edit mode data:", data);
  }
}, [isEdit]);


  useEffect(() => {
  if (isEdit && data) {
    setFormData({
      RSO_name: data.RSO_name || "",
      RSO_acronym: data.RSO_acronym || "",
      RSO_category: data.RSO_category || "",
      RSO_tags: data.RSO_tags || [],
      RSO_College: data.RSO_College || "",
      RSO_status: data.RSO_status ?? false,
      RSO_description: data.RSO_description || "",
      RSO_picture: data.RSO_picture || null,
      RSO_picturePreview: data.RSO_picture || null,
      RSO_forms: data.RSO_forms || "",
    });

    // Extract just the tag names from the tag objects
    if (data.RSO_tags?.length) {
      // Convert tag objects to strings
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
          RSO_picturePreview: null,
      });
  
      const onTagEdit = (tag) => {
          setSelectedTag(tag); // Set the clicked tag as the selected tag
        };
  
      const fileInputRef = useRef(null);
  
      const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
      };
  
      const handleTagModal = (tag) => {
          setSelectedModalTag(tag);
          setShowModal(true);
      }
  
      const handleTagDelete = (tag) => {
          console.log("Deleting tag:", tag);
          // Call the API to delete the tag
          setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
          setShowModal(false);
          setSelectedModalTag(null);
      };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    RSO_tags: selectedTags,
  };

    // Remove RSO_status if it's empty or null
  if (formData.RSO_status === "" || formData.RSO_status === null) {
    delete payload.RSO_status;
  }




  let result;
  if (isEdit) {
    result = await updateRSO(data.id, payload); 
    console.log("RSO updated:", result);
  } else {
    result = await createRSO(payload, selectedTags, RSO_picture);
    console.log("RSO created:", result);
  } 
  

  
 {
  console.error("Error creating/updating RSO");
  // Handle error (e.g., show a message to the user)
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
    navigate('/rso-management'); 

    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
};

  
// const handleImageChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     setFormData(prev => ({
//       ...prev,
//       RSO_picture: file,
//       RSO_picturePreview: URL.createObjectURL(file), 
//     }));
//   }
// };

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Still create the preview using URL.createObjectURL
    const preview = URL.createObjectURL(file);
    
    // Convert file to Base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({
        ...prev,
        RSO_picture: base64String, // Store base64 string instead of file object
        RSO_picturePreview: preview
      }));
    };
    reader.readAsDataURL(file); // This reads the file as a data URL (Base64)
  }
};

const handleDelete = async () => {
  const confirmed = window.confirm("Are you sure you want to delete this RSO?");
  if (confirmed) {
    try {
      const result = await deleteRSO(data.id);
      console.log("RSO deleted:", result);
      navigate('/rso-management'); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting RSO:", error);
      // Handle error (e.g., show a message to the user)
    }
  }
};






  
      useEffect(() => {
          if (showModal) {
              
              if (formData.RSO_tags?.length) {
                  setSelectedTags(formData.RSO_tags);
              }
          }
      }, [showModal]);



  return (
    <div>
      <div className='mb-8'>
        <Button
        style={"secondary"}
        onClick={() => {
          navigate(-1);

        }}
        >Go Back</Button>
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
            {/* <div className='rounded-full h-24 w-24 bg-gray-300' /> */}

            {/* only show if there's no image */}
            {!formData.RSO_picturePreview && (
              <div className='rounded-full h-24 w-24 bg-gray-300' />
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
              className='px-2 py-1 bg-transparent rounded-xl border border-gray-400 text-sm flex justify-center'>
                
                {isEdit ? `Edit` : isCreate ? 'Upload' : 'Upload'}
              </div >
              <div className='cursor-pointer px-2 py-1 bg-transparent rounded-full border border-gray-400 text-sm flex items-center justify-center'>
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
          {mode === 'create' && (
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
              handleTagModal={handleTagModal}
            />)
            }
          {mode === 'edit' && (
            <TagSelector 
              style={"crud"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowSearch={setShowSearch}
              setIsFocused={setIsFocused}
              searchedData={searchedData}
              handleTagClick={handleTagClick}
              selectedTags={selectedTags}  // Use the same state as create mode
              handleApiTagRemove={handleApiTagRemove}
              setShowModal={setShowModal}
              handleTagModal={handleTagModal}
            />
          )}
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
    </div>
  )
}

export default RSOAction;
