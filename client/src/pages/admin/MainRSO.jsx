import { useState, useEffect } from "react";
import { TabSelector, ReusableTable, Button, CloseButton } from "../../components";
import { AnimatePresence } from "framer-motion";
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../../components';
import useSearchQuery from "../../hooks/useSearchQuery";
import { useRSO, useKeyBinding } from "../../hooks";
import { FormatDate, useNotification } from "../../utils";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { DropIn } from "../../animations/DropIn";
import Switch from '@mui/material/Switch';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// TODO: switch should only be connected to web req when it's off. Otherwise, turning on should trigger a state to allow date selection
// understand why the date is not being set when the switch is turned on
// all the states should be stored first and only sent when the set button is clicked

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
  const [membershipEndDate, setMembershipEndDate] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(false);

  // Add new state for duration picker
  const [durationDays, setDurationDays] = useState(0);
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);


  useEffect(() => {
    if (durationDays || durationHours || durationMinutes) {
      console.log("Duration changed:", {
        days: durationDays,
        hours: durationHours,
        minutes: durationMinutes
      });
    }
  }, [durationDays, durationHours, durationMinutes]);

  useEffect(() => {
    if (membershipDateData) {
      setMembershipStatus(membershipDateData?.RSO_membershipStatus);
      setMembershipEndDate(FormatDate(membershipDateData?.RSO_membershipEndDate));

      const endDate = membershipDateData?.RSO_membershipEndDate;
      if (endDate) {
        setMembershipEndDate(FormatDate(endDate)); // For display
        setDate(new Date(endDate)); // Set the date state for DateTimePicker
      }
    }

  }, [membershipDateData]);


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
    {
      label: "Professional"
    },
    {
      label: "Professional & Affiliates"
    },
    { label: "Special Interest" },
  ];

  useEffect(() => {
    console.log("membershipDateData", membershipEndDate);
  }, [membershipEndDate]);


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
  }, [fetchData]);

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
    {
      key: "c",
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
      setMembershipStatus(false);
      setMembershipEnabled(false);
      closeMembershipDateMutate();
      setMembershipEndDate("");

      // clear the date, hours, and minute state when membership is disabled
      setDurationDays(0);
      setDurationHours(0);
      setDurationMinutes(0);

      return;
    }

    console.log("Switch toggled - New status:", newStatus);
    console.log("Current membership end date:", membershipEndDate);
    setMembershipStatus(newStatus);
  };

  const handleDateTimeChange = (newValue) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    console.log("raw date:", newValue);
    console.log("Selected date:", FormatDate(newValue));
    if (newValue) {
      const phISOString = dayjs(newValue).tz("Asia/Manila").toISOString();
      console.log("ISO Format:", phISOString);
      setDate(phISOString);
      console.log("Date Object:", phISOString);
    }
  }

  // TODO: date.toDate is not a function
  // make it accept date object first
  // dateObject is not a date object. that is why it is getting the error

  const handleConfirmDate = (date) => {
    console.log("Date: ", date);

    // Handle both dayjs objects and Date objects
    let dateObject;
    if (date && typeof date.toDate === 'function') {
      // It's a dayjs object from DateTimePicker
      dateObject = date.toDate();
    } else if (date instanceof Date) {
      // It's already a JavaScript Date object from state
      dateObject = date;
    } else {
      // Fallback: try to create a Date object
      console.error("Invalid date type:", typeof date, date);
      return;
    }

    // extract the days from now to the selected date
    const today = new Date();
    const diffTime = dateObject - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // extract the hours, minutes and seconds from the selected date
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    console.log("Selected Date:", dateObject);
    console.log("Hours: ", hours, "Minutes: ", minutes);

    console.log("Formatted Opened Date: ", diffDays);
    updateMembershipDateMutate({ date: diffDays, hours: hours, minutes: minutes });
    console.log("diffDays: ", diffDays, "Hours: ", hours, "Minutes: ", minutes);
  }

  const handleExtendDate = (date) => {
    console.log("Date: ", date);

    let dateObject;
    if (date && typeof date.toDate === 'function') {
      // It's a dayjs object from DateTimePicker
      dateObject = date.toDate();
    } else if (date instanceof Date) {
      // It's already a JavaScript Date object from state
      dateObject = date;
    } else {
      // Fallback: try to create a Date object
      console.error("Invalid date type:", typeof date, date);
      return;
    }

    const today = new Date();
    const diffTime = dateObject - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    // extract the hours, minutes and seconds from the selected dateObject
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    console.log("Formatted Extend Date: ", diffDays);
    extendMembershipDateMutate({ date: diffDays, hours: hours, minutes: minutes });
  }

  const handleMembershipEndDateChange = (e) => {
    const newDate = new Date(e.target.value);
    console.log(newDate);
    setDate(newDate);
  }

  const handleDateAction = () => {
    console.log("handleDateAction toggled: ", {
      days: durationDays,
      hours: durationHours,
      minutes: durationMinutes
    });
    { console.log("Membership Status: ", membershipStatus); }
    if (membershipStatus) {
      extendMembershipDateMutate({ date: durationDays, hours: durationHours, minutes: durationMinutes });
      console.log("Membership Status is true, extending membership date");
      return;
    } else {
      updateMembershipDateMutate({ date: durationDays, hours: durationHours, minutes: durationMinutes });
      console.log("Membership Status is false, updating membership date");
      return;
    }
  }




  return (
    <>
      <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center">

        <div className="flex justify-start items-center gap-2 lg:order-2">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-600 size-4" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
          </div>
        </div>
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex items-center gap-6 w-full justify-start bg-white border border-mid-gray p-6 rounded-md mt-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${membershipStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h1 className="text-gray-700 font-medium">Membership Status: <span className={`font-semibold ${membershipStatus ? 'text-green-600' : 'text-red-600'}`}>{membershipStatus ? "Active" : "Inactive"}</span></h1>
        </div>
        <div className="h-6 w-px bg-gray-200"></div>
        {membershipStatus && (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <h1 className="text-gray-700 font-medium">End Date: <span className="font-semibold text-gray-900">{membershipEndDate}</span></h1>
          </div>
        )}
      </div>
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
                className='bg-white rounded-lg w-auto p-4 shadow-md'
              >
                <div className="flex items-center justify-between mb-8">
                  <h1 >Adjust Membership End Date</h1>
                  <CloseButton onClick={() => setIsSettingsModalOpen(false)} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-full flex items-center gap-2 justify-between">
                    <h1 className="text-sm text-gray-600">Activate Membership</h1>
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
                  <div className={`flex flex-col gap-2 ${membershipStatus ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateTimePicker']}>
                        <DateTimePicker
                          onChange={handleDateTimeChange}
                          label="Select date and time"
                          slotProps={{
                            popper: {
                              placement: 'bottom-end',
                              modifiers: [
                                {
                                  name: 'flip',
                                  enabled: true,
                                  options: {
                                    altBoundary: true,
                                    rootBoundary: 'viewport',
                                    padding: 8,
                                  },
                                },
                                {
                                  name: 'preventOverflow',
                                  enabled: true,
                                  options: {
                                    altAxis: true,
                                    altBoundary: true,
                                    tether: true,
                                    rootBoundary: 'viewport',
                                    padding: 8,
                                  },
                                },
                              ],
                              sx: {
                                zIndex: 9999,
                              }
                            },
                            actionBar: {
                              actions: ['accept', 'cancel']
                            }
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>

                    {/* Display current duration */}
                    {(durationDays > 0 || durationHours > 0 || durationMinutes > 0) && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          Duration: {durationDays} days, {durationHours} hours, {durationMinutes} minutes
                        </p>
                      </div>
                    )}
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
                  <CloseButton onClick={() => {
                    setDateModalOpen(false);
                    setMembershipEnabled(false);
                  }
                  } />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <h1 className="text-sm font-medium text-gray-700">Membership End Date</h1>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Pick a date and time"
                          className="w-full"
                          onChange={handleConfirmDate}
                          slotProps={{ textField: { helperText: 'Please fill this field' } }}
                        />
                      </LocalizationProvider>

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
                      onClick={() => {
                        handleConfirmDate(date);
                        // console.log("Selected Date:", date);
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
