import React from 'react'
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { tabSelector, Button, TextInput, ReusableDropdown } from '../../components'
import  TagSelector  from '../../components/TagSelector';
import { useTagSelector } from '../../hooks';

function RSOAction() {
    const location = useLocation();
  const { mode, data, from } = location.state || {};
  const [showSearch, setShowSearch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedModalTag, setSelectedModalTag] = useState(null);

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

        const handleTagModal = (tag) => {
        setSelectedModalTag(tag);
        setShowModal(true);
    }

  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const handleOptions = ['All', 'CCIT', 'CBA', 'COA', 'COE', 'CAEAS', 'CTHM' ];



  return (
    <div  >
      {/* <div className='cursor-pointer hover:bg-light-gray rounded-full p-2  flex gap-2 items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        <h1>Go Back</h1>
      </div> */}
      <h1 className='text-xl font-bold '>{isEdit ? `Edit ${from}` : isCreate ? 'Create RSO' : 'RSO Action'}</h1>
      <h2 className='text-sm font-200 '>{isEdit ? `Manage Account details` : isCreate ? 'Create a new RSO Account' : ''}</h2>
      {/* first section */}
      <div className='flex  items-start gap-4 mt-12'>
        {/* headers */}
        <div className='w-1/2'>
          <h1 className='text-lg font-semibold'>Profile</h1>
          <h2 className='text-sm'>Set account details</h2>
        </div>

        {/* detailed sections */}
        <div className='flex flex-col items-start  w-full'>
                  <div className='flex flex-col items-center justify-center'>
            <div className='rounded-full h-24 w-24 bg-gray-300'/>
            <div className='flex gap-1 mt-2'>
              <div className='px-2 py-1 bg-transparent rounded-xl border border-gray-400 text-sm flex justify-center'>Edit</div >
              <div className='cursor-pointer px-2 py-1 bg-transparent rounded-full border border-gray-400 text-sm flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='fill-off-black size-3'><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
              </div >
            </div>
          </div>
          


          <div className='w-full'>
            <label htmlFor="name" className='text-sm'>RSO Name</label>
            <TextInput id='name' type='text' placeholder='RSO Full Name'></TextInput>
            <div className='flex gap-4 mt-2 '>
              <div className='w-full'>
                  <label htmlFor="name" className='text-sm'>RSO Acronym</label>
                  <TextInput id='name' type='text' placeholder='Acronym'></TextInput>      
              </div>
              <div className='w-full'>
                  <label htmlFor="name" className='text-sm'>RSO College</label>
                  <ReusableDropdown options={handleOptions}></ReusableDropdown> 
              </div>
            </div>
            <div>
                <label htmlFor="large-input" className='text-sm'>Description</label>
                <textarea
                    rows="4"
                    name="RSO_description"
                    className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Tell us about your organization..."
                />
            </div>
          </div>
        </div>


      </div>

      <div className='w-full h-[1px] bg-gray-200 mt-4 mt-2'></div>

      {/* second section */}

            <div className='flex justify-between items-start gap-4 mt-12'>
        {/* headers */}
        <div className='w-1/2'>
          <h1 className='text-lg font-semibold'>Tags</h1>
          <h2 className='text-sm'>Add account tags</h2>
        </div>

        {/* detailed sections */}
        <div className=' w-full'>

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
          ></TagSelector>
          
          
          </div>
      </div>

      <div className='w-full h-[1px] bg-gray-200 mt-4 mt-2'></div>

      
    </div>
  )
}

export default RSOAction