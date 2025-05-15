import React from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DefaultPicture from "../../assets/images/default-profile.jpg";
import { ReusableTable, TabSelector, ActivityCard, Button } from '../../components';
import TagSelector from '../../components/TagSelector'
import { useTagSelector } from '../../hooks';
import { useNavigate } from 'react-router-dom';

function RSODetails() {
  const location = useLocation()
  const { user } = location.state || {}; // Destructure rsoDetails from location.state
  const [activeTab, setActiveTab] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

    const {
      selectedTags,
      setSelectedTags,
      searchQuery,
      setSearchQuery,
      isFocused,
      setIsFocused,
      searchedData,
      handleTagClick
    } = useTagSelector();



    const handleActivityClick = (activity) => {
      setSelectedActivity(activity);
      console.log("Selected Activity:", activity);
      navigate(`../../documents/main-activities`, { state: { activity }}); // Navigate to the activity details page
  };

  const handleIcon = (icon) => {
    switch (icon) {
      case "Probationary":
        return <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-400 size-4' fill="currentColor" viewBox="0 0 384 512"><path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/> </svg>;
      case "Professional":
        return <svg className='fill-gray-400 size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
        <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/>
        </svg>
      case "Professional & Affiliates":
        return <svg className='fill-gray-400 size-4'  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
          </svg>
      case "Special Interest":
        return <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-400 size-4' fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/> </svg>
   
      }
    }

    console.log("User data:", user);
    console.log("User tags:", user.RSO_activities);

    const tabs = [
      { label: "Requirements" },
      { label: "Activities" },
      { label: "Stats" },
    ]

    const tableDocuments = [
      { label: "RSO Constitution" },
      { label: "RSO By-Laws" },
      { label: "RSO Code of Conduct" },
      { label: "RSO Membership Form" },
      { label: "RSO Event Proposal Form" },
    ]

    const handleEditClick = () => {
      navigate(`../../rso-management/rso-action`, { state: { mode: "edit", data: user, from: user.RSO_name} });
    }


  return (
    <div>
        <div className='flex items-center justify-center'>
          {user ? (
            <>
              <div className='flex items-start justify-center gap-12 mt-4 mr-12'> 
                <div>
                  <img src={user.RSO_picture || DefaultPicture} alt="RSO" className='w-32 h-32 rounded-full border border-gray-300' />
                </div>
                <div>
                <div className='flex flex-col justify-center mb-4'>
                    <p className='text-2xl font-bold line-clamp-1'> {user.RSO_name}</p>
                    <p className='text-sm font-light'> {user.RSO_acronym}</p>
                </div>
                <div className='flex items-center mb-2 gap-2 '>
                    <p >{user.RSO_description} </p>
                  </div>
                  <div className='flex items-center mb-2 gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-400 size-4' viewBox="0 0 512 512"><path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                    <p> {user.RSO_College || <em className='text-gray-500'>N/A</em> }</p>
                  </div>
                  <div className='flex items-center mb-2 gap-2'>
                  {handleIcon(user.RSO_category)}
                  <p> {user.RSO_category}</p>
                  </div>
                  <div className='flex items-center mb-2 gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-400 size-4' viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
                    <p> {user.RSO_memberCount} members</p>
                  </div>

                  <div className='flex items-center mb-2 gap-2'>
                    <p>Forms: {user.RSO_forms ? user.RSO_forms : <em>No forms uploaded</em> } </p>
                  </div>
                  <div>
                    <TagSelector
                      style={"view"}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      setIsFocused={setIsFocused}
                      searchedData={searchedData}
                      handleTagClick={handleTagClick}
                      selectedTags={selectedTags}
                      apiTags={user.RSO_tags}
                    />
                  </div>
                </div>
                <div className='flex items-center gap-2 justify-center'>
                  <Button style={"secondary"} className={"flex items-center justify-center"} onClick={handleEditClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4 ' viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                  </Button>
                </div>



              </div>




            </>
          ) : (
            <p>No user data available.</p>
          )}

        </div>
        <div className='p-4 rounded-lg w-full mt-4'>
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 0 && (

          <ReusableTable
            options={["All", "A-Z"]}
            showAllOption={false}
            columnNumber={2}
            tableHeading={[
                { name: "Document", key: "label" },
            ]}
            tableRow={tableDocuments}
          />

        )}
        {activeTab === 1 && (
      <div className="grid grid-cols-3 gap-3 mt-4">
        
          {user.RSO_activities && user.RSO_activities.length > 0 ? (user.RSO_activities.map((activity) => (
            <ActivityCard
                key={activity._id}
                activity={activity}
                Activity_name={activity.Activity_name}
                Activity_description={activity.Activity_description}
                Activity_image={activity.Activity_image}
                Activity_registration_total={activity.Activity_registration_total}
                onClick={handleActivityClick} 
            />
          )))
          : (
            <p>No activities available.</p>
          )}
        {console.log("User activities:", user.RSO_activities)}
      </div>
        )}
        {activeTab === 2 && (
          <div className='bg-gray-100 p-4 rounded-lg w-1/3'>
            <h1 className='font-bold '>Quick Stats</h1>
            <p >Success Rate: {user.RSO_successRate}</p>
            <p>Success Rate: {user.RSO_popularityScoreCount}</p>
        </div>
    
        )}


        </div>

    </div>
  )
}

export default RSODetails;