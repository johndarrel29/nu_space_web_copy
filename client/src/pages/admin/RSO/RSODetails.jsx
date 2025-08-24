import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DefaultPicture from "../../../assets/images/default-profile.jpg";
import { TabSelector, ActivityCard, Button, CloseButton, BackendTable } from '../../../components';
import TagSelector from '../../../components/TagSelector'
import { useTagSelector, useModal, useUserProfile, useDocumentManagement, useAdminRSO, useAdminActivity } from '../../../hooks';
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../../animations/DropIn";
import { useAuth } from "../../../context/AuthContext";

// TODO: get rso detail hook
// link the rso detail to the rso id from state
// map the response into the UI.
// RSO details for admin

// use the metadata to know if the activity fetched is related to rso. if not, dont display.

function RSODetails() {
  const location = useLocation()
  const { isOpen, openModal, closeModal } = useModal();
  const [localError, setLocalError] = useState("");
  const { user } = location.state || {};
  const [activeTab, setActiveTab] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [modalMode, setModalMode] = useState("officers");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { user: userProfile } = useUserProfile();
  const [successMessage, setSuccessMessage] = useState("");
  const rsoID = user?.id || "";
  const [checked, setChecked] = React.useState(null);
  const { user: authUser } = useAuth();
  const {
    rsoDetailData,
    isRSODetailLoading,
    isRSODetailError,
    rsoDetailError,
    refetchRSODetail
  } = useAdminRSO(
    rsoID ? rsoID : null
  );

  console.log("user id to send to admin activity:", rsoID);

  useEffect(() => {
    if (rsoDetailData) {
      console.log("RSO Detail Data:", rsoDetailData);
    }
  }, [rsoDetailData]);

  // admin activity route
  const {
    adminPaginatedActivities,
    adminError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminActivity({
    RSO: rsoDetailData?.data?.RSO_snapshot?.acronym,
    sorted: "All",
    RSOType: "All"
  });

  const localActivities = rsoID ? adminPaginatedActivities?.pages?.flatMap(page => page?.activities || []) : [];

  // change this to use the new auth role
  const isAdmin = authUser?.role === "admin" || authUser?.role === "coordinator" || authUser?.role === "super_admin";
  const isRSORepresentative = authUser?.role === "rso_representative";
  const showLink = true;

  // map this details to the ui
  useEffect(() => {
    if (rsoDetailData) {
      console.log("RSO Detail Data:", rsoDetailData);
    }
  }, [rsoDetailData]);

  useEffect(() => {
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
  } = useDocumentManagement({ rsoID });


  const handleDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  }

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
    navigate(`/documents/${activity._id}`);
  };

  useEffect(() => {
    if (approveError || rejectError) {
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
      approveDocumentMutate({ documentId: documentId, reviewedById: userProfile?._id });
    } else if (action === "reject") {
      setSuccessMessage("Document Rejected Successfully!");
      // Call the reject function with the documentId
      console.log("Rejecting document with ID:", documentId, " and ", "userProfile?._id: ", userProfile?._id);
      rejectDocumentMutate({ documentId: documentId, reviewedById: userProfile?._id });
      // Add your reject logic here
    }
  }

  useEffect(() => {

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

  console.log("filtered documents: ", rsoDocuments);
  const filteredDocuments = (rsoDocuments ?? []).map((doc) => {
    const name = doc?.submittedBy?.firstName + " " + doc?.submittedBy?.lastName;
    return {
      _id: doc._id,
      title: doc.title || "Untitled Document",
      file: doc.file,
      url: doc.url,
      contentType: doc.contentType || "no content type",
      status: doc.status || "Pending",
      submittedBy: name || "Unknown",
      createdAt: handleDateTime(doc.createdAt) || "Unknown",
      updatedAt: handleDateTime(doc.updatedAt) || "Unknown",
    }
  })

  const handleEditClick = () => {
    navigate(`/rsos/rso-action`, { state: { mode: "edit", data: user, from: user.RSO_name } });
  }

  return (
    <div className="bg-white min-h-screen ">
      <div className='mb-8'>
        <div
          onClick={() => {
            navigate(-1);

          }}
          className='flex items-center justify-center rounded-full h-8 w-8 cursor-pointer border border-gray-300 group'>
          <svg xmlns="http://www.w3.org/2000/svg" className='fill-gray-600 size-4 group-hover:fill-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
        </div>
      </div>


      <div className='flex flex-col md:flex-row items-start justify-between gap-4'>
        {/* Left side - Profile and Info */}
        <div className='flex flex-col sm:flex-row w-full'>
          <img
            className='h-12 w-12 bg-white rounded-full object-cover'
            src={rsoDetailData?.data?.RSOid?.RSO_picture?.signedURL || DefaultPicture}
            alt="RSO Picture"
          />

          <div className='flex flex-col justify-start mt-3 sm:mt-0 sm:ml-4 w-full'>
            {/* Name and Edit Button */}
            <div className='flex flex-col md:flex-row items-center gap-2'>
              <h1 className='text-xl font-bold text-off-black'>{rsoDetailData?.data?.RSO_snapshot?.name || "RSO Name"}</h1>

              <div
                onClick={handleEditClick}
                className='px-4 py-1 bg-white text-off-black rounded-full text-sm border border-gray-400 hover:bg-light-gray group cursor-pointer w-fit'
              >
                <div className='flex items-center gap-2 cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='size-3 fill-off-black ' viewBox="0 0 512 512">
                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                  </svg>
                  Edit
                </div>
              </div>
            </div>

            {/* Category and Tags */}
            <h2 className='text-sm font-light text-gray-600'>{rsoDetailData?.data?.RSO_snapshot?.category || "RSO Category"}</h2>
            <div className='mt-4'>
              <TagSelector
                style={"view"}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsFocused={setIsFocused}
                searchedData={searchedData}
                handleTagClick={handleTagClick}
                selectedTags={selectedTags}
                apiTags={rsoDetailData?.data?.RSOid?.RSO_tags}
              />
            </div>
            {/* Stats Section */}
            <div className=" flex flex-wrap gap-4">
              {/* Members Count Card */}
              <div className="flex bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="w-2 bg-gradient-to-b from-[#312895] to-[#5a4ca8]"></div>
                <div className="flex items-center p-4 gap-3">
                  <div className="flex items-center justify-center h-10 w-10 bg-[#312895] bg-opacity-10 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-[#312895] size-5" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0c-14.7 0-26.7-11.9-26.7-26.7z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-medium text-gray-500">Members</p>
                    <p className="text-xl font-bold text-off-black">{user.RSO_memberCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Status Switch */}
        {/* <div className='flex flex-col items-start md:items-end justify-between w-full md:w-auto'>
          <h1 className='text-sm text-gray-600'>Status</h1>
          <Switch checked={checked} onChange={handleChange} className='mt-1' />
        </div> */}
      </div>


      <div className='lg:pl-10 lg:pr-10 md:pl-8 md:pr-8 pl-6 pr-6 mt-6'>
        {/* profile details */}
        <div className='w-full flex items-center justify-center'>
          <div className='flex flex-col lg:flex-row items-start gap-4 w-full'>
            {/* Description Card */}
            <div className='h-auto w-full bg-white rounded-lg p-4 border border-gray-100 shadow-sm'>
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">Description</p>
              <p className='text-sm text-gray-700'>{rsoDetailData?.data?.RSOid?.RSO_description || "No RSO description provided."}</p>
            </div>



            {/* Info Table */}
            <div className="w-full bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <table className="w-full border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1 w-1/3">Acronym</td>
                    <td className="text-sm font-medium text-off-black py-1">{rsoDetailData?.data?.RSOid?.RSO_acronym || "RSO Acroynm"}</td>
                  </tr>
                  <tr>
                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">College</td>
                    <td className="text-sm font-medium text-off-black py-1">{rsoDetailData?.data?.RSOid?.RSO_College || "No College"}</td>
                  </tr>
                  <tr>
                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">Forms</td>
                    <td className="text-sm py-1">
                      {showLink && rsoDetailData?.data?.RSOid?.RSO_forms ? (
                        <a
                          href={rsoDetailData?.data?.RSOid?.RSO_forms}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#312895] hover:text-[#493ec4] transition-colors truncate max-w-[40px] sm:max-w-[400px]"
                          title='Click to view the form'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-4 fill-current shrink-0" viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                          {user.RSO_forms}
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">No forms available</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">Managed By</td>
                    <td className="text-sm font-medium text-off-black py-1">
                      {rsoDetailData?.data?.RSOid?.RSO_assignedUsers?.length > 0
                        ? rsoDetailData.data.RSOid.RSO_assignedUsers.map((rsoUser, index) => (
                          `${rsoUser.firstName} ${rsoUser.lastName}${index < rsoDetailData.data.RSOid.RSO_assignedUsers.length - 1 ? ', ' : ''}`
                        ))
                        : "No assigned users"
                      }
                    </td>
                  </tr>
                  <tr>
                    <td className="text-xs uppercase tracking-wider font-medium text-gray-500 py-1">Status</td>
                    <td className="text-sm py-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${rsoDetailData?.data?.RSO_snapshot?.probationary ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {rsoDetailData?.data?.RSO_snapshot?.probationary ? 'On Probation' : 'Active'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${user?.RSO_visibility ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {user?.RSO_visibility ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>



        {/* Officers Section */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-off-black uppercase tracking-wider mb-3">Officers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* officer cards */}
            {rsoDetailData?.data?.RSO_Officers && rsoDetailData?.data?.RSO_Officers.length > 0 ? (
              rsoDetailData?.data?.RSO_Officers.map((officer, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setModalMode("officers-edit");
                    setSelected(officer);
                    setTimeout(() => {
                      openModal();
                    }, 0);
                  }}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-[#312895]/20">
                    <img
                      className="h-full w-full object-cover"
                      src={officer.OfficerPicture?.signedURL || DefaultPicture}
                      alt={officer.OfficerName || "Officer"}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-off-black">{officer.OfficerName || "N/A"}</h3>
                    <p className="text-xs text-gray-500">{officer.OfficerPosition || "N/A"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm text-gray-500">No officers available</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg w-full mt-6">
          <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 0 && (
            rsoID ? (
              <BackendTable
                activeTab={1}
                filters={{
                  rsoId: rsoID,
                  purpose: "recognition",
                  limit: 10,
                  page: 1
                }}
                rsoId={rsoID}
              />
            ) : (
              <div className='w-full flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-4'>
                <div className='text-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mx-auto fill-gray-400 mb-2" viewBox="0 0 384 512">
                    <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z" />
                  </svg>
                  <p className="text-gray-500 font-medium">No RSO Documents Available</p>
                  <p className="text-sm text-gray-400 mt-1">Documents will appear here once submitted</p>
                </div>
              </div>
            )
          )}

          {activeTab === 1 && (
            localActivities && localActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mt-4" >
                  {localActivities.map((activity) => (
                    <ActivityCard
                      key={activity._id}
                      activity={activity}
                      Activity_name={activity.Activity_name}
                      Activity_description={activity.Activity_description}
                      Activity_image={activity?.activityImageUrl}
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
                <div className="flex justify-center mt-6 w-full">
                  {hasNextPage && (
                    <Button
                      style={"secondary"}
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className='w-full flex items-center justify-center h-64'>
                <p className="text-gray-500">No activities available.</p>
              </div>
            )
          )}
        </div>
      </div >


      {/* modal for rso officers */}
      < AnimatePresence >
        {
          ['officers-create', 'officers-edit'].includes(modalMode) && isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50`}
            >
              <div className='flex items-center justify-center h-screen'>
                <motion.div
                  variants={DropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className='bg-white rounded-lg w-[400px] p-4 shadow-md'
                >
                  <div className='flex justify-between'>
                    <h1 className='text-lg font-bold text-off-black'>RSO Officers</h1>
                    <CloseButton onClick={() => {
                      setModalMode("");
                      closeModal();
                    }} />
                  </div>

                  {/* rso details */}
                  {(isAdmin) && (
                    <div className='flex flex-col items-center justify-center mt-4 gap-2'>
                      <div className='aspect-square rounded-full bg-gray h-24'>
                        <img
                          className='h-full w-full object-cover rounded-full'
                          src={selected?.OfficerPicture?.signedURL || DefaultPicture}
                          alt="officer-picture"
                        />
                      </div>
                      <div className='flex flex-col items-center justify-center'>
                        <h1>{selected.OfficerName}</h1>
                        <h1 className='text-gray-600 text-sm'>{selected.OfficerPosition}</h1>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* modal for reviewing documents */}
      < AnimatePresence >
        {modalMode === "documents" && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50`}
          >
            <div className='flex items-center justify-center h-screen'>
              <motion.div
                variants={DropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className='bg-white rounded-lg w-1/3 p-4 shadow-md'
              >
                <div className='flex flex-col'>
                  {/* title */}
                  <div className='flex justify-between'>
                    <h1 className='text-lg font-bold text-off-black'>RSO Documents</h1>
                    <CloseButton onClick={() => {
                      setModalMode("");
                      closeModal();
                    }} />
                  </div>

                  <div className='flex flex-col gap-2 mt-4'>
                    {selectedDocument ? (
                      <div className='w-full border border-primary bg-background rounded-md p-2 flex items-center justify-start'>
                        <h1
                          onClick={() => {
                            if (selectedDocument?.url) {
                              window.open(selectedDocument.url, "_blank");
                            } else {
                              console.error("No URL available for this document.");
                            }
                          }}
                          className='text-primary hover:underline cursor-pointer pl-4 truncate'
                        >
                          {selectedDocument?.title || "No document selected"}
                        </h1>
                      </div>
                    ) : (
                      <div className='w-full bg-red-50 bg-light-gray rounded-md p-2 flex items-center justify-center'>
                        <h1 className='text-red-500'>No document selected</h1>
                      </div>
                    )}
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
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDocumentAction("reject", selectedDocument?._id)}
                        style={"secondary"}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence >

    </div >

  )
}

export default RSODetails;