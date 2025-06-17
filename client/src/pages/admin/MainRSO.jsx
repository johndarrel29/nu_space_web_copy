import { useState, useEffect } from "react";
import { RSOTable, Searchbar, Notification, TabSelector, ReusableTable, Button, CloseButton } from "../../components";
import RSOForm from "../../components/RSOForm";
import { AnimatePresence } from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../../components'; 
import  useSearchQuery from "../../hooks/useSearchQuery";
import  {useRSO, useKeyBinding} from "../../hooks";
import { useNotification } from "../../utils";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import Switch from '@mui/material/Switch';

//fetch data from /AllRSOs endpoint

export default function MainRSO() {
  const { 
    organizations, 
    error, 
    loading, 
    fetchData, 
    createRSO, 
    updateRSO, 
    deleteRSO, 
    queryData, 
    fetchWebRSOError, 
    updateMembershipDateMutate, 
    isUpdatingMembershipDate, 
    isUpdatingMembershipDateError, 
    isUpdatingMembershipDateSuccess,

    membershipDateData,
    isGettingMembershipDate,
    isGettingMembershipDateError,
    isGettingMembershipDateSuccess,

    closeMembershipDateMutate,
    isClosingMembershipDate,
    isClosingMembershipDateError,
    isClosingMembershipDateSuccess,

    extendMembershipDateMutate,
    isExtendingMembershipDate,
    isExtendingMembershipDateError,
    isExtendingMembershipDateSuccess,

  } = useRSO();
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [orgList, setOrgList] = useState(organizations);
  const [activeTab, setActiveTab] = useState(0);
  const { notification, handleNotification } = useNotification();
  const [sort, setSort] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [membershipEnabled, setMembershipEnabled] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  //TODO: before switch is on, prompt the user to set the membership end date
  //TODO: if the membership end date is set, show the membership end date and allow to change it

  const [membershipEndDate, setMembershipEndDate] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(false);

//   useEffect(() => {
//   console.log("Query Data: ", queryData);
// }, [queryData]);

  useEffect(() => {
    if (membershipDateData) {
      setMembershipStatus(membershipDateData?.RSO_membershipStatus);
      setMembershipEndDate(membershipDateData?.RSO_membershipEndDate?.substring(0, 10));
    }
  }, [membershipDateData]);

  //reflect changes in membership status and end date
  useEffect(() => {
    console.log("Membership End Date: ", membershipEndDate);
  }, [membershipEndDate]);

  useEffect(() => {
    if (membershipEnabled) {
      setDateModalOpen(true);
    }
  }, [membershipEnabled]);



  const checkSpace = (str) => {
    if (str && str.length > 0) {
      return str.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with a single space and trim
    }
    return str; 
  };

  const rsoList = queryData?.rsos ?? [];
  console.log("RSO List:", rsoList);

  
    // Assuming 'organizations' is an array of organization objects
    const tableRow = rsoList.map((org) => ({
      id: org._id,
      RSO_name: checkSpace(org.RSO_name),
      RSO_acronym: org.RSO_acronym || '',
      RSO_description: org.RSO_description || '', // Added missing field
      RSO_tags: org.RSO_tags || [], // Convert tag objects to array of strings
      RSO_category: org.RSO_category || '',
      RSO_College: org.RSO_College || '',
      RSO_totalMembers: org.RSO_totalMembers || 0, // Added missing field
      RSO_membershipStatus: org.RSO_membershipStatus || '', // Added missing field
      RSO_status: org.RSO_status || false, // Added missing field
      RSO_picture: org.RSO_picture || '',
      picture: org.picture || '', // Added missing field
      RSO_memberCount: org.RSO_members ? org.RSO_members.length : org.RSO_totalMembers || 0,
      RSO_members: org.RSO_members || [],
      RSO_successRate: org.RSO_successRate || 0,
      RSO_popularityScoreCount: org.RSO_popularityScore > 0 ? org.RSO_popularityScore : 0,
      RSO_activities: org.RSO_activities || [],
      RSO_forms: org.RSO_forms || '',
      RSO_Officers: org.RSO_Officers || [], // Added missing field
      RSO_assignedUsers: org.RSO_assignedUsers || [],
      __v: org.__v || 0 // Added missing version field
    }));

    console.log("tableRow", tableRow);
    const allTags = tableRow.map((row) => row.RSO_tags);
console.log("All RSO Tags:", allTags);

      const tabs = [
          { label: "All" },
      { label: "Probationary", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor" viewBox="0 0 384 512"><path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/> </svg> },
          { label: "Professional", icon: <svg className="w-4 h-4 me-2  dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/>
              </svg>},
          { label: "Professional & Affiliates", icon: <svg className="w-4 h-4 me-2  dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
          </svg> },
          { label: "Special Interest", icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/> </svg> },
      ];


  useEffect(() => {
    setOrgList(organizations);
  }, [organizations]);

  const filteredOrgs = () => {
    // If no actions have been taken by the user, return the default tableRow (all organizations)
    if (activeTab === 0 && searchQuery === "" && sort === "All") {
      return tableRow; // Return the default table row (organizations)
    }
  
    // Filter organizations based on active tab and search query
    let filteredList = tableRow.filter((org) => {
      const matchesTab = activeTab === 0 || org.RSO_category === tabs[activeTab].label;
      const matchesSearch = org.RSO_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  
    // Sort based on the selected sort option
    if (sort === "A-Z") {
      filteredList = filteredList.sort((a, b) => a.RSO_name.localeCompare(b.RSO_name));
      console.log("A-Z", filteredList);
    } else if (sort === "Most Popular") {
      filteredList.sort((a, b) => {
        const aScore = a.RSO_popularityScoreCount || 0; // Fallback to 0 if no score
        const bScore = b.RSO_popularityScoreCount || 0;
        return bScore - aScore; // Descending order
      });
      console.log("Most Popular", filteredList);
    }
  
    // Map the filtered and sorted results to the same format as tableRow
    return filteredList.map((org) => ({
      id: org._id,
      RSO_name: checkSpace(org.RSO_name),
      RSO_acronym: org.RSO_acronym || '',
      RSO_description: org.RSO_description || '',
      RSO_tags: org.RSO_tags?.map(tag => tag.tag) || [],
      RSO_category: org.RSO_category || '',
      RSO_College: org.RSO_College || '',
      RSO_totalMembers: org.RSO_totalMembers || 0,
      RSO_membershipStatus: org.RSO_membershipStatus || '',
      RSO_status: org.RSO_status || false,
      RSO_picture: org.RSO_picture || '',
      RSO_Officers: org.RSO_Officers || [],
      picture: org.picture || '',
      RSO_memberCount: org.RSO_members ? org.RSO_members.length : org.RSO_totalMembers || 0,
      RSO_members: org.RSO_members || [],
      RSO_successRate: org.RSO_successRate || 0,
      RSO_popularityScoreCount: org.RSO_popularityScore > 0 ? org.RSO_popularityScore : 0,
      RSO_activities: org.RSO_activities || [],
      RSO_forms: org.RSO_forms || '',
      RSO_Officers: org.RSO_Officers || [],
      __v: org.__v || 0
    }));

  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectedUser = (user) => {
    console.log("Selected user:", user);
    setSelectedUser(user);
    navigate('rso-details', { state: { user } }); 
  };

  const handleSubmit = async (data) => {
    try {
      await createRSO(data);
      handleNotification("RSO created successfully!");
      setActiveTab(0); // Switch to the RSO list tab after creation
    } catch (error) {
      console.error("Error creating RSO:", error);
      handleNotification("Error creating RSO. Please try again.");
    }
  }
  const handleUpdate = async (id, data) => {
    try {
      await updateRSO(id, data);
      handleNotification("RSO updated successfully!");
    } catch (error) {
      console.error("Error updating RSO:", error);
      handleNotification("Error updating RSO. Please try again.");
    }
  };

  const handleCreate = () => {
    navigate("rso-action", {
      state: { 
        mode: "create",
      },
    });
    console.log("Selected user:", selectedUser);
  }

    useKeyBinding(
    {key: "c", 
        callback: () => {
          handleCreate();
        },
        dependencies: [handleCreate]

    });

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  }

  const handleMembershipStatusChange = (e) => {
    const newStatus = e.target.checked;

    if (newStatus === false) {
      console.log("I have been clicked ", newStatus)
      closeMembershipDateMutate();
      setMembershipEndDate("");
      return;
    }

    console.log("Switch toggled - New status:", newStatus);
    console.log("Current membership end date:", membershipEndDate);
    setMembershipStatus(newStatus);
    
    if (newStatus) {
      setDateModalOpen(true);
    }
  };

  const handleConfirmDate = (date) => {
    console.log("Date: ", date);

    // extract the days from now to the selected date
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log("Formatted Date: ", diffDays);
    updateMembershipDateMutate({date: diffDays});
  }

  const handleExtendDate = (date) => {
    console.log("Date: ", date);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log("Formatted Date: ", diffDays);
    extendMembershipDateMutate({date: diffDays});
  }

  const handleMembershipEndDateChange = (e) => {
    const newDate = new Date(e.target.value);
    console.log(newDate);
    setDate(newDate);
  }

  // useEffect(() => {
  //   console.log("Date: ", date);
  //   if (date) {
  //     setDateModalOpen(false);
  //   }
  // }, [date]);

  return (
    <>
      <div className="flex justify-between items-center">
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex items-center gap-2">
          <Button className={"px-4"} onClick={handleCreate}>
            <div className="flex items-center gap-2">
              <h1>Create RSO</h1>
              <div className="h-6 w-6 border border-gray-200 rounded flex items-center justify-center font-light active:bg-primary-rso active:text-white transition duration-200 ease-in-out">
                c
              </div>
            </div>
          </Button>
          <div 
          onClick={() => openSettingsModal(true)}
          className="rounded-full aspect-square w-10 flex items-center justify-center hover:bg-mid-gray cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-600 size-4" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
          </div>         
        </div>
      </div>

      {(membershipDateData?.RSO_membershipStatus === true) && (
        <div className="flex items-center gap-6 w-full justify-start bg-background p-6 rounded-md mt-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${membershipStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h1 className="text-gray-700 font-medium">Membership Status: <span className={`font-semibold ${membershipStatus ? 'text-green-600' : 'text-red-600'}`}>{membershipStatus ? "Active" : "Inactive"}</span></h1>
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <h1 className="text-gray-700 font-medium">End Date: <span className="font-semibold text-gray-900">{membershipEndDate}</span></h1>
          </div>
        </div>
      )}
          <ReusableTable 
            options={["All", "A-Z", "Most Popular"]}
            showAllOption={false}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            columnNumber={3}
            tableHeading={[
                { id: 1, name: "RSO Name", key: "RSO_name" },
                { id: 2, name: "RSO Category", key: "RSO_category" }, 
            ]}
            tableRow={filteredOrgs()}
            onClick={handleSelectedUser}
            error={fetchWebRSOError}
            isLoading={loading}
            >
            {/* {loading && <CardSkeleton/  >} */}
          </ReusableTable>
          <AnimatePresence>
            {isSettingsModalOpen && (
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
                    <div className="flex items-center justify-between mb-8">
                      <h1 >RSO Membership Settings</h1>
                      <CloseButton onClick={() => setIsSettingsModalOpen(false)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <h1 className="text-sm font-medium text-gray-700">Membership Status</h1>
                          <Switch
                            checked={membershipStatus}
                            onChange={handleMembershipStatusChange}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#312895',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: '#312895',
                                },
                              },
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <h1 className="text-sm font-medium text-gray-700">Membership End Date</h1>
                          <div className="relative">
                            <div className={`flex items-center gap-2 ${!membershipStatus ? 'pointer-events-none' : ''}`}>
                              <input 
                                value={membershipEndDate}
                                type="date" 
                                className={`border border-gray-300 rounded-md p-2 ${!date ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}`}
                                onChange={(e) => {
                                  const newDate = new Date(e.target.value);
                                  setDate(newDate);
                                  setMembershipEndDate(e.target.value);
                                }}
                                disabled={!date}
                              />
                              <Button
                                onClick={() => handleExtendDate(date)}
                                className={`${date ? 'bg-primary-rso text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                              >
                                <h1>Set</h1>
                              </Button>
                            </div>
                            {!membershipStatus && (
                              <div className="absolute inset-0 bg-gray-100 opacity-50 z-10"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {dateModalOpen && (
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
                    <div className="flex items-center justify-between mb-8">
                      <h1>Set Membership End Date</h1>
                      <CloseButton onClick={() => 
                        {
                          setDateModalOpen(false);
                          setMembershipEnabled(false);
                        }
                      } />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <h1 className="text-sm font-medium text-gray-700">Membership End Date</h1>
                            <input 
                              type="date" 
                              className="border border-gray-300 rounded-md p-2"
                              value={date.toISOString().split('T')[0]}
                              onChange={(e) => {
                                const newDate = new Date(e.target.value);
                                console.log(newDate);
                                setDate(newDate);
                              }}
                            />

                          </div>
                          <div className="flex justify-end items-center mt-2 mb-8">
                            {(date != null && date.toDateString() !== new Date().toDateString()) && (
                              <>
                              {(() => {
                                const today = new Date();
                                const diffTime = date - today;
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                return (
                                  <h1 className="text-sm font-medium text-gray-700">Membership will end on {diffDays} days</h1>
                                )

                              })()}
                              </>
                            )}
                          </div>
                            <Button
                            style={"secondary"}
                            onClick={() => 
                            {
                              handleConfirmDate(date);
                              setDateModalOpen(false);
                            }
                            }>
                              <h1>Set</h1>
                            </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </>
  );
}
