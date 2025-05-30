import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import DefaultPicture from "../../assets/images/default-profile.jpg";
import { ReusableTable, TabSelector, ActivityCard, Button, CloseButton, TextInput } from '../../components';
import TagSelector from '../../components/TagSelector'
import { useTagSelector, useModal, useUserProfile } from '../../hooks';
import { useNavigate, Link } from 'react-router-dom';
import {useDocumentManagement, useRSO} from '../../hooks';
import Switch from '@mui/material/Switch';

function RSODetails() {
  const location = useLocation()
  const { isOpen, openModal, closeModal } = useModal();
  const [ localError, setLocalError ] = useState("");
  const { user } = location.state || {};
  const [activeTab, setActiveTab] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();
  const [ selected, setSelected ] = useState("");
  const [showLink, setShowLink] = useState(true);
  const [modalMode, setModalMode] = useState("officers");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { user: userProfile } = useUserProfile();
  const [successMessage, setSuccessMessage] = useState("");
  const rsoID = user?.id || "default-rso-id"; 
  const [checked, setChecked] = React.useState(null);
  const { updateRSOStatusMutate } = useRSO();

  console.log("user status: ", user.RSO_membershipStatus);
  
  useEffect (() => {
    if (user?.RSO_membershipStatus === true) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [user?.RSO_membershipStatus]);
  

 
  const {
      rsoDocuments,
      rsoDocumentsLoading,
      rsoDocumentsError,
      rsoQueryError,
      approveData,
      approveLoading,
      approveError,
      rejectData,
      rejectLoading,
      rejectError,

      approveDocumentMutate,
      rejectDocumentMutate,
  } = useDocumentManagement(rsoID);


   const handleChange = (newChecked) => {
      const status = newChecked.target.checked;
      setChecked(status);

      console.log("Checked status: ", status);
      console.log("RSO ID: ", rsoID);
      updateRSOStatusMutate({ id: rsoID, status  });
   }


//   console.log("userProfile: ", userProfile);
//   console.log("rsoDocuments: ", rsoDocuments);
//   console.log("rsoID ", rsoID);

//   console.log("rsoDocumentsError:", rsoDocumentsError);
// console.log("rsoQueryError:", rsoQueryError);
// console.log("user role ", userProfile?.role);

  const handleDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // hour12: true
    });
  }

  

  console.log("user: ", user);

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
    navigate(`../../documents/main-activities`, { state: { activity }});
  };

useEffect(() => {
  if ( approveError || rejectError) {
    const errorMessage = approveError?.message || rejectError?.message || "An error occurred while processing your request.";
    setLocalError(errorMessage);

    const timeOut = setTimeout(() => {
      setLocalError("");
    }, 5000);

    return () => clearTimeout(timeOut);
  }
}, [approveError, rejectError]); 



 const handleDocumentAction = (action, documentId) => {
    if (action === "approve") {
      setSuccessMessage("Document Approved Successfully!");
      // Call the approve function with the documentId
      console.log("Approving document with ID:", documentId);
      console.log("User Profile ID: ", userProfile?._id);

      //add the id of the logged in user to the approveData function
      approveDocumentMutate({documentId: documentId, reviewedById: userProfile?._id} );
    } else if (action === "reject") {
      setSuccessMessage("Document Rejected Successfully!");
      // Call the reject function with the documentId
      console.log("Rejecting document with ID:", documentId, " and ", "userProfile?._id: ", userProfile?._id);
      rejectDocumentMutate({documentId: documentId, reviewedById: userProfile?._id} );
      // Add your reject logic here
    } 
  }

  useEffect(() => {
  // if (approveData || rejectData) {
  //   const successMessage1 = approveData?.success ? "Document approved successfully!" :
  //     rejectData?.success ? "Document rejected successfully!" : "An error occurred while processing your request.";

  //   setSuccessMessage(successMessage1);

  //   const timeOut = setTimeout(() => {
  //     setSuccessMessage("");
  //     closeModal();
  //   }, 5000);
  //   return () => clearTimeout(timeOut);
  // }

  if (successMessage) {
    const timeOut = setTimeout(() => {
      setSuccessMessage("");
      closeModal();
    }, 3000);
    return () => clearTimeout(timeOut);
  }

}, [successMessage, closeModal]);

  const tabs = [
    { label: "Requirements" },
    { label: "Activities" },
  ]


  const filteredDocuments = (rsoDocuments ?? []).map((doc) => {
    return {
      _id: doc._id,
      title: doc.title || "Untitled Document",
      file: doc.file,
      url: doc.url,
      contentType: doc.contentType || "no content type",
      status: doc.status || "Pending",
      submittedBy: doc.submittedBy || "Unknown",
      createdAt: handleDateTime(doc.createdAt) || "Unknown",
      updatedAt: handleDateTime(doc.updatedAt) || "Unknown",

    }
  })

  const handleEditClick = () => {
    navigate(`../../rso-management/rso-action`, { state: { mode: "edit", data: user, from: user.RSO_name} });
    console.log("Edit button clicked", user);
  }

  return (
    <div className="bg-white min-h-screen ">
      <div className='mb-8'>
        <div
        onClick={() => {
          navigate(-1);

        }}
        className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </div>
      </div>


      <div className='flex items-start justify-between'>
        <div className='flex'>
          <img className='h-12 w-12 bg-white rounded-full object-cover' src={user.picture || DefaultPicture} alt="RSO Picture" />
          <div className='flex flex-col justify-start ml-4'>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-bold text-[#312895]'>{user.RSO_name || "RSO Name"}</h1>

              <div onClick={handleEditClick} className='px-4 py-1 bg-white text-[#312895] rounded-full text-sm border border-[#312895] hover:bg-[#312895] hover:text-white group cursor-pointer'>
                <div className='flex items-center gap-2 cursor-pointer' >
                  <svg xmlns="http://www.w3.org/2000/svg" className='size-3 fill-[#312895] group-hover:fill-white' viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                  Edit
                </div>
              </div>
            </div>

            <h2 className='text-sm font-light text-gray-600'>{user.RSO_category || "RSO Category"}</h2>
            <div className='mt-4'>
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
        
        </div>
        {/* switch component status */}
          <div >
            <div className='flex flex-col items-center justify-between'>
              <h1 className='text-sm text-gray-600'>Status</h1>
              <Switch checked={checked} onChange={handleChange} />
            </div>
            {/* <input
              checked
              id="switch-component"
              type="checkbox"
              className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300"
            />
            <label
              htmlFor="switch-component"
              className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
            ></label> */}
          </div>
        </div>

      <div className='pl-12 pr-12 mt-6'>
        {/* profile details */}
        <div className='w-full flex items-center justify-center'>          
          <div className='flex items-start gap-4 w-full'>
            <div className='h-auto w-full bg-white rounded-md p-4 border border-mid-gray'>
              <h1 className='text-sm font-semibold text-[#312895]'>Description</h1>
              <p className='text-sm font-light text-gray-700 mt-2'>{user.RSO_description || "No RSO description provided."}</p>
            </div>

            <table className="w-full bg-white rounded-md p-4 border-separate border-spacing-0 border border-mid-gray">
              <tbody>
                <tr>
                  <td className="text-sm font-light text-gray-500 py-1">Acronym</td>
                  <td className="text-sm font-medium text-[#312895] py-1">{user.RSO_acronym || "RSO Acroynm"}</td>
                </tr>
                <tr>
                  <td className="text-sm font-light text-gray-500 py-1">College</td>
                  <td className="text-sm font-medium text-[#312895] py-1">{user.RSO_College || "RSO College"}</td>
                </tr>
                <tr>
                  <td className="text-sm font-light text-gray-500 py-1">Forms</td>
                  <td className="text-sm font-medium py-1">
                    <div                   
                    className='flex items-center gap-2 hover:underline cursor-pointer text-[#312895]'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-[#312895]" viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>
                      {showLink && user.RSO_forms ? (
                        <a
                          href={user.RSO_forms}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          title='Click to view the form'
                        >
                          {user.RSO_forms}
                        </a>
                      ) : (
                        "No forms available."
                      )}
                        
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="text-sm font-light text-gray-500 py-1">Managed By</td>
                  <td className="text-sm font-medium text-[#312895] py-1">John Doe</td>
                </tr>
                <tr>
                  <td className="text-sm font-light text-gray-500 py-1">Date Created</td>
                  <td className="text-sm font-medium text-[#312895] py-1">2023-10-01</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex items-center justify-start mt-6'>
          <h1 className='font-semibold text-[#312895]'>Statistics</h1>
        </div>

        {/* profile stats */}
        <div className='flex w-full items-center justify-center mt-2 gap-4 h-32'>
          {/* members count */}
          <div className='w-full h-full bg-gradient-to-br from-[#312895] to-[#5a4ca8] rounded-md flex items-center justify-center text-white'>
            <div className='flex items-center justify-center gap-4'>
              <div className='flex items-center justify-center h-12 w-12 bg-white/20 rounded-full backdrop-blur-sm'>
                <svg xmlns="http://www.w3.org/2000/svg" className='fill-white size-6' viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
              </div>
              <div>
                <h1 className='text-2xl font-bold'>{user.RSO_memberCount || 0}</h1>
                <p className='text-sm'>Members</p>
              </div>
            </div>
          </div>
          
          <div className='flex flex-col h-full gap-4 w-full'>
            <div className='h-full bg-white rounded-md border border-mid-gray flex items-center justify-center'>
              <div className='flex items-center justify-center gap-3'>
                <div className='flex items-center justify-center rounded-full bg-[#FFCC33] h-8 w-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-white' viewBox="0 0 576 512"><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"/></svg>
                </div>
                <div>
                  <h1 className='text-lg font-bold text-[#312895]'>{0}</h1>
                  <p className='text-xs text-gray-600'>Files Uploaded</p>
                </div>
              </div>
            </div>

            <div className='h-full bg-white rounded-md border border-mid-gray flex items-center justify-center'>
              <div className='flex items-center justify-center gap-3'>
                <div className='flex items-center justify-center rounded-full bg-[#312895] h-8 w-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-white' viewBox="0 0 448 512"><path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z"/></svg>
                </div>
                <div>
                  <h1 className='text-lg font-bold text-[#312895]'>{Math.floor(user.RSO_popularityScoreCount) + "%" || 0}</h1>
                  <p className='text-xs text-gray-600'>Popularity Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* profile rso officers */}
        <div className='flex items-center justify-start mt-6'>
          <h1 className='font-semibold text-[#312895]'>Officers</h1>
        </div>

        <div className='flex flex-wrap items-center justify-start gap-4 w-full mt-3'>
          {/* <div
            onClick={() => {
            setModalMode("officers-create");
            openModal();
          }} 
          className='cursor-pointer flex items-center justify-center gap-2 bg-white border border-[#312895] rounded-md h-full p-3 hover:bg-[#312895] transition-colors group'>
            <div className='h-8 w-8 bg-[#312895] rounded-full flex items-center justify-center group-hover:bg-white'>
              <svg xmlns="http://www.w3.org/2000/svg" className='size-5 fill-white group-hover:fill-[#312895]' viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
            </div>
            <div
            className='flex flex-col justify-start'>
              <h1 className='text-sm font-medium text-[#312895] group-hover:text-white'>Add Officer</h1>
            </div>
          </div> */}
          { console.log("rso officers ", user.RSO_Officers)}
          {/* officer cards */}
          {user?.RSO_Officers?.map((officer, index) => (
            <div 
            key={index}
            onClick={() => {


              setModalMode("officers-edit");
              setSelected(officer);
              setTimeout(() => {
                openModal();
              }, 0);
              console.log("Selected officer: ", officer);
              // setSelected(
              //   officer.RSO_Officers || officer.RSO_Officers[index] || officer.RSO_Officers[0]
              //   // prevSelected => {
              //   //     console.log("Previous selected:", prevSelected);
              //   //     console.log("New selected will be:", officer);
              //   //     return officer;
              //   // }
              // )
            }}

            className='flex items-center justify-center gap-3 bg-white p-3 rounded-md border border-mid-gray cursor-pointer hover:bg-gray-200'>
              <div className='h-10 w-10 bg-[#312895] rounded-full flex items-center justify-center text-white font-medium'>
                {/* {officer.name.split(' ').map(n => n[0]).join('')} */}
                <img
                className='h-full w-full object-cover rounded-full' 
                src={officer.OfficerPicture || DefaultPicture} 
                alt="officer-picture" />
              </div>
              <div className='flex flex-col justify-start'>
                <h1 className='text-sm font-bold text-[#312895]'>{officer.OfficerName || "N/A"}</h1>
                <h2 className='text-xs font-light text-gray-600'>{officer.OfficerPosition || "N/A"}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className='rounded-lg w-full mt-6'>
          <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 0 && (
            <ReusableTable
              options={["All", "A-Z"]}
              showAllOption={false}
              columnNumber={4}
              tableHeading={[
                { name: "Document", key: "title" },
                { name: "Status", key: "status" },
                { name: "Submitted By", key: "submittedBy" },
                { name: "Created At", key: "createdAt" },
              ]}
              tableRow={filteredDocuments}
              onClick={(document) => {
                setSelectedDocument(document);
                setModalMode("documents");
                openModal();
                console.log("Selected document: ", selectedDocument);
              }}
            />
          )}
          
          {activeTab === 1 && (
            user.RSO_activities && user.RSO_activities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-4" >
              {user.RSO_activities.map((activity) => (
                <ActivityCard
                    key={activity._id}
                    activity={activity}
                    Activity_name={activity.Activity_name}
                    Activity_description={activity.Activity_description}
                    Activity_image={activity?.activityImageUrl }
                    Activity_registration_total={activity.Activity_registration_total}
                    onClick={handleActivityClick}
                    Activity_datetime={handleDateTime(activity.Activity_datetime) || "N/A"}
                    Activity_place={activity.Activity_place}
                    statusColor={activity.Activity_status === 'done' ? 'bg-green-500' : 
                                activity.Activity_status === 'pending' ? 'bg-[#FFCC33]' : 
                                'bg-red-500'}
                  />
                ))}
                  </div>
              ) : (
                <div className='w-full flex items-center justify-center h-64'>
                  <p className="text-gray-500">No activities available.</p>
                </div>
              )
          )}
        </div>
      </div>


      {/* modal for rso officers */}
      {['officers-create', 'officers-edit'].includes(modalMode ) && isOpen && (
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50`}>
        <div className='flex items-center justify-center h-screen'>
          <div className='bg-white rounded-lg w-1/3 p-4 shadow-md'>
            <div className='flex justify-between'>
              <h1 className='text-lg font-bold text-[#312895]'>RSO Officers</h1>
                <CloseButton onClick={() => {
                setModalMode("");
                closeModal();
              }}/>
            </div>

            {/* rso details */}
  {userProfile?.role === "student/rso" && (
  <div className='flex flex-col items-start justify-start mt-4 gap-2'>
    <div className='w-full mb-4'>
    <label htmlFor="profilePicture">Profile Picture</label>
    <div className="flex items-center gap-4">
      <div className="relative group">
        <div className="h-16 w-16 bg-[#312895] rounded-full flex items-center justify-center text-white overflow-hidden border-2 border-[#312895]">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Officer preview" 
              className="h-full w-full object-cover"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="size-8" viewBox="0 0 448 512" fill="currentColor">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
            </svg>
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-6" viewBox="0 0 512 512" fill="white">
            <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/>
          </svg>
        </div>
        <input 
          type="file"
          id="profilePicture"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setProfileImage(event.target?.result);
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
      </div>
      
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">Upload a profile picture</p>
        <p className="text-xs text-gray-500">JPG, PNG or GIF (max 2MB)</p>
        {profileImage && (
          <button 
            type="button"
            onClick={() => setProfileImage(null)}
            className="text-xs text-red-500 hover:text-red-700 mt-1"
          >
            Remove image
          </button>
        )}
              </div>
            </div>
          </div>

          {/* Existing form fields */}
          <div className='w-full'>
            <label htmlFor="name">Officer Name</label>
            <TextInput id={"name"} type={"text"} placeholder={"Firstname M.I., Lastname"}></TextInput>
          </div>
          <div className='w-full'>
            <label htmlFor="position">Position</label>
            <TextInput id={"position"} type={"text"} placeholder={"Officer Position"}></TextInput>
          </div>

            </div>
  )}
  {(userProfile?.role === "admin" || userProfile?.role === "superadmin" ) && (
    <div className='flex flex-col items-center justify-center mt-4 gap-2'>
      <div className='aspect-square rounded-full bg-gray h-10'>
        <img 
        className='h-full w-full object-cover rounded-full'
        src={selected.OfficerPicture} 
        alt="officer-picture"  />
      </div>
      {console.log("Selected officer: ", selected)}
    
      <h1>{selected.OfficerName}</h1>
      <h1>{selected.OfficerPosition}</h1>
    </div>
  )}
            <div className='flex items-center justify-end mt-4 gap-2'>
              {modalMode === "officers-create" && isOpen && (
                <>
                  <Button>Assign Officer</Button>
                  <Button style={"secondary"}>Cancel</Button>
                </>
              )}
              {modalMode === "officers-edit" && isOpen && (
                <>
                  {userProfile?.role === "student/rso" && (<Button>Edit Officer</Button>)}
                  <Button style={"secondary"}>Close</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

            {/* modal for rso officers */}
      {/* {modalMode === "officers-edit" && isOpen && (
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 ${modalMode === "officers-edit" ? "block" : "hidden"}`}>
        <div className='flex items-center justify-center h-screen'>
          <div className='bg-white rounded-lg w-1/3 p-4 shadow-md'>
            <div className='flex justify-between'>
              <h1 className='text-lg font-bold text-[#312895]'>Edit RSO Officer</h1>
                <CloseButton onClick={() => {
                setModalMode("");
                closeModal();
              }}/>
            </div>

            <div>{selected.name}</div>
            <div className='flex items-center justify-end mt-4 gap-2'>
                <Button>Assign Officer</Button>
                <Button style={"secondary"}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
      )} */}

         {/* modal for reviewing documents */}
   {modalMode === "documents" && isOpen && (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 ${modalMode === "documents" ? "block" : "hidden"}`}>
        <div className='flex items-center justify-center h-screen'>
          <div className='bg-white rounded-lg w-1/3 p-4 shadow-md'>
          <div className='flex flex-col '>

            {/* title */}
            <div className='flex justify-between'>
              <h1 className='text-lg font-bold text-[#312895]'>RSO Documents</h1>
              <CloseButton onClick={() => {
                setModalMode("");
                closeModal();
              }}/>
            </div>

            <div className='flex flex-col gap-2 mt-4'>
              { selectedDocument ? (
              <div className='w-full border border-primary bg-background rounded-md p-2 flex items-center justify-start'>
                <h1 
                onClick={() => {
                  if (selectedDocument?.url) {
                    window.open(selectedDocument.url, "_blank");
                  } else {
                    console.error("No URL available for this document.");
                  }
                }}
                className='text-primary hover:underline cursor-pointer pl-4 truncate'>{selectedDocument?.title || "No document selected"}</h1>
              </div>
              )
              :
              <div className='w-full bg-red-50 bg-light-gray rounded-md p-2 flex items-center justify-center'>
                <h1 className='text-red-500'>No document selected</h1>
              </div>
            }
            {localError && (
              <div className='w-full bg-red-50 rounded-md p-2 flex items-center justify-center'>
                <h1 className='text-red-500'>{localError || "An error occurred while processing the document."}</h1>
              </div>
            )}

            {successMessage && (
                <p className={"text-green-500"}>
                  {successMessage}
                </p>
            )}

              <div>
                <label className='text-sm font-mid-gray' htmlFor="remarks">Remarks</label>
                <textarea
                id='remarks'
                rows="4"
                name="RSO_description"
                className="bg-textfield border border-mid-gray text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Add remarks here..."
              />
              </div>
            </div>
            <div className='flex items-center justify-end mt-4'>

            <div className='flex items-center justify-end gap-2 mt-4'>
              <Button 
              onClick={() => handleDocumentAction("approve", selectedDocument?._id)}
              >Accept</Button>
              <Button 
              onClick={() => handleDocumentAction("reject", selectedDocument?._id)}
              style={"secondary"}>Reject</Button>
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>
      )}

</div>

  )
}

export default RSODetails;