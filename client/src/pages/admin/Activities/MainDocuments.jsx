import React, { useState } from "react";
import { ActivityCard, Searchbar, ReusableDropdown, Button, ActivitySkeleton, DropdownSearch } from "../../../components";
import { useActivities, useUser, useRSO } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DefaultPicture from "../../../assets/images/default-picture.png";
import { useUserStoreWithAuth } from '../../../store';

// system enhancement: use isLoading to make loading animation when fetching or filtering activities  

export default function MainDocuments() {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { data } = useUser();
  const { organizations } = useRSO();
  const activityId = data?.activityId
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [sorted, setSorted] = useState("All");
  const [RSO, setRSO] = useState("All");
  const [RSOType, setRSOType] = useState("All");
  const [college, setCollege] = useState("All");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { isUserRSORepresentative, isUserAdmin, isCoordinator } = useUserStoreWithAuth();
  const [documentError, setDocumentError] = useState(null);


  const {
    activities,
    loading,
    error,
    fetchActivity,
    fetchLocalActivities,
    adminActivity,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    adminPaginatedActivities,
    adminError,

    localActivities,
    isLocalActivitiesLoading,
    isLocalActivitiesError,
    localActivitiesError,
    refetchLocalActivities,
    isLocalActivitiesSuccess,
  } = useActivities(activityId, debouncedQuery, sorted, RSO, RSOType, college);

  const allActivities = adminPaginatedActivities?.pages?.flatMap(page => page?.activities || []) || [];

  const rso = (organizations ?? []).map((orgs) => orgs.RSO_acronym);

  // set document error based on user role
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "coordinator" || user?.role === "super_admin") {
      setDocumentError(adminError);
    } else if (user?.role === "rso_representative") {
      setDocumentError(error);
    } else {
      setDocumentError(null);
    }
  }, [adminError, error, user?.role]);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const result = await fetchActivity();
        console.log("Fetched Activities:", result);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };

    loadActivities();
  }, [fetchActivity]);

  useEffect(() => {
    if (isUserRSORepresentative) {
      refetchLocalActivities();
    }
  }, [isUserRSORepresentative, refetchLocalActivities]);

  const handleCreate = () => {
    navigate("document-action", {
      state: {
        mode: "create",
      },
    });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleRSO = (value) => {
    console.log("Selected RSO:", value);
    setRSO(value);
  }

  const handleSorted = (value) => {
    console.log("Selected Sort Option:", value);
    if (value === "All") {
      setSorted(null);
    } else {
      setSorted(value);
    }
  }
  const handleRSOType = (value) => {
    console.log("Selected RSO Type:", value);
    if (value === "All") {
      setRSOType(null);
    } else {
      setRSOType(value);
    }
  }

  const handleCollege = (value) => {
    console.log("Selected College:", value);
    if (value === "All") {
      setCollege(null);
    }
    setCollege(value);
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    console.log("Selected Activity:", activity);
    navigate(`/documents/${activity._id}`);
  };

  console.log("activities:", fetchActivity);

  const assignedRSOs = Array.isArray(user?.assigned_rso)
    ? user.assigned_rso
    : user?.assigned_rso
      ? [user.assigned_rso]
      : [];


  // Filter activities for RSO members to only show their RSO's activities
  const filteredActivities = user?.role === "rso_representative"
    ? activities.filter(activity =>
      assignedRSOs.some(rso => rso?._id === activity?.RSO_id?._id)
    )
    : activities;

  // Log after the assignment (not inside the filter)
  console.log("Filtered Activities:", filteredActivities);

  const handleDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  const activitiesToShow =
    isUserRSORepresentative ?
      (localActivities || [])
        // Apply search filter first
        .filter(activity => {
          if (!searchQuery) return true;
          return (
            activity.Activity_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.Activity_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.Activity_place?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
        // Then apply sorting
        .sort((a, b) => {
          if (!sorted) return 0;
          switch (sorted) {
            case "A-Z":
              return (a.Activity_name || "").localeCompare(b.Activity_name || "");
            case "Most Joined":
              return (b.Activity_registration_total || 0) - (a.Activity_registration_total || 0);
            case "Recently Added":
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case "All":
              return 0;
            default:
              return 0;
          }
        }) :
      (isUserAdmin || isCoordinator) ? allActivities :
        [];

  console.log("user role:", user.role);
  console.log("activitiesToShow:", activitiesToShow?.length > 0);

  return (
    <div className="w-full">

      {/* Header and Create Button */}
      <div >
        {user?.role === "rso_representative" && (
          <div className="flex justify-end mb-4 gap-2">
            <Button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary-active text-white px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-white size-4" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" /></svg>
                Create an Activity
              </div>
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <Searchbar
              placeholder="Search an Activity"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          {isUserRSORepresentative ? (
            <div>
              <ReusableDropdown
                icon={true}
                options={["All", "A-Z", "Most Joined", "Recently Added"]}
                showAllOption={false}
                onChange={(e) => handleSorted(e.target.value)}
                value={sorted}
                buttonClass="border-primary  text-primary "
              />
            </div>
          )
            :
            (
              <DropdownSearch
                isSorting={true}
                setSelectedSorting={handleRSO}
                setSelectedCategory={() => { }}
              />
            )
          }
        </div>

        {/* More Filter Section for Admin and Super Admin */}
        {(isUserAdmin || isCoordinator) && (
          <div
            aria-disabled="false"
            data-accordion-container
            data-accordion-mode="exclusive"
            className="group block w-full"
          >
            <div
              data-accordion-toggle
              data-accordion-target="#basicAccordion1"
              aria-expanded="false"
              className="cursor-pointer font-medium text-primary "
            >
              <div className="flex items-center gap-2">
                More Filter
                <svg data-accordion-icon-close xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#312895" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.4-7.5h-15" />
                </svg>
                <svg data-accordion-icon-open xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="#312895" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              </div>
            </div>

            <div
              id="basicAccordion1"
              className="overflow-hidden transition-all duration-300 border-b border-slate-200 pl-1 pr-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 py-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="RSO" className="text-sm font-medium text-gray-600">
                    Sort By
                  </label>
                  <ReusableDropdown
                    icon={true}
                    options={["All", "A-Z", "Most Joined", "Recently Added"]}
                    showAllOption={false}
                    onChange={(e) => handleSorted(e.target.value)}
                    value={sorted}
                    buttonClass="border-primary  text-primary "
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="RSOType" className="text-sm font-medium text-gray-600">
                    RSO Type
                  </label>
                  <ReusableDropdown
                    id="RSOType"
                    options={["All", "Professional & Affiliates", "Professional", "Special Interest", "Probationary"]}
                    showAllOption={false}
                    onChange={(e) => handleRSOType(e.target.value)}
                    value={RSOType}
                    buttonClass="border-primary  text-primary "
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="college" className="text-sm font-medium text-gray-600">
                    College
                  </label>
                  <ReusableDropdown
                    id="college"
                    options={["All", "CCIT", "CBA", "COA", "COE", "CAH", "CEAS", "CTHM"]}
                    value={college}
                    showAllOption={false}
                    onChange={(e) => handleCollege(e.target.value)}
                    buttonClass="border-primary  text-primary "
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Activity Cards Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <ActivitySkeleton count={8} />
        </div>
      )
        :
        (isUserAdmin && documentError) ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-500 font-medium text-center max-w-md px-4">
              {documentError?.message || "An error occurred while fetching activities."}
            </p>
          </div>
        )
          :

          activitiesToShow.length > 0 ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 ">

                  {activitiesToShow?.map((activity) => (
                    <ActivityCard
                      key={activity._id}
                      activity={activity}
                      Activity_name={activity.Activity_name}
                      Activity_description={activity.Activity_description}
                      RSO_acronym={activity.RSO_id?.RSO_acronym || "N/A"}
                      //user imageUrl if rso_representative role
                      Activity_image={
                        isUserRSORepresentative ? activity?.imageUrl || DefaultPicture :
                          (isUserAdmin || isCoordinator) ?
                            activity?.activityImageUrl || DefaultPicture : DefaultPicture}
                      Activity_registration_total={activity?.Activity_registration_total}
                      onClick={handleActivityClick}
                      Activity_datetime={handleDateTime(activity?.Activity_start_datetime) || "N/A"}
                      Activity_place={activity?.Activity_place}
                      statusColor={activity?.Activity_status}
                    />
                  ))}
                </div>
              </div>

              {/* Load More Button */}
              {(isUserAdmin || isCoordinator) && allActivities.length > 12 && (
                <div className="flex justify-center mt-6">
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
              )}

            </>
          )
            : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary /50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-primary ">No activities found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            )
      }
    </div>
  );
}