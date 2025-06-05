import React, { useState } from "react";
import { ActivityCard, Searchbar, ReusableDropdown, Button, ActivitySkeleton, DropdownSearch } from "../../components";
import { useActivities, useUser, useRSO } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DefaultPicture from "../../assets/images/default-picture.png"; 

// NOTE: Some pages inside adminPaginatedActivities.pages might be undefined
// if rso, fetch data from http://localhost:5000/api/activities/getRSOCreatedActivities
// if admin, fetch data from http://localhost:5000/api/admin/activities/

export default function MainDocuments() {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { data } = useUser();
  const { organizations } = useRSO();
  const activityId = data?.activityId 
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [sorted, setSorted] = useState(null);
  const [RSO, setRSO] = useState("All");
  const [RSOType, setRSOType] = useState("All");
  const [college, setCollege] = useState("All");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedSorting, setSelectedSorting] = useState("");
  

  const { 
    activities, 
    loading, 
    error, 
    fetchActivity, 
    fetchLocalActivities, 
    adminActivity, 
    adminError,
    fetchNextPage, 
    hasNextPage,
    isFetchingNextPage,
    adminPaginatedActivities,

    localActivities,
    isLocalActivitiesLoading,
    isLocalActivitiesError,
    localActivitiesError,
    refetchLocalActivities,
    isLocalActivitiesSuccess,
  } = useActivities(activityId, debouncedQuery, sorted, RSO, RSOType, college);


  const allActivities = adminPaginatedActivities?.pages?.flatMap(page => page?.activities || []) || [];
  // console.log("Admin Paginated Activities Images:", adminPaginatedActivities?.pages?.flatMap(page => page.activities.map(activity => activity.activityImageUrl)));

  console.log("adminPaginatedActivities:", allActivities);
  console.log("role of user:", user?.role);

  const rso = (organizations ?? []).map((orgs) => orgs.RSO_acronym);


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
    // console.log("selectedSorting:", selectedSorting);
    setRSO(value);
  }

  const handleSorted = (value) => {
    console.log("Selected Sort Option:", value);
    if (value === "All") {
      setSorted(null);
    }

    setSorted(value);
    // Implement sorting logic here based on the selected value
  }
  const handleRSOType = (value) => {
    console.log("Selected RSO:", value);
    if (value === "All") {
      setRSOType(null);
    }
    setRSO(value);
    // Implement RSO filtering logic here based on the selected value

  }

  const handleCollege = (value) => {
    console.log("Selected College:", value);
    if (value === "All") {
      setCollege(null);
    }
    setCollege(value);
    // Implement college filtering logic here based on the selected value
  }

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
        console.log("Selected Activity:", activity);
        navigate(`/documents/${activity._id}`);
    };

    console.log("activities:", fetchActivity);


// Filter activities for RSO members to only show their RSO's activities
const filteredActivities = user?.role === "student/rso" 
  ? activities.filter(activity => 
      user.assigned_rso?.some(rso => rso._id === activity.RSO_id._id)
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
  user.role === "student/rso" ? localActivities :
  (user.role === "admin" || user.role === "superadmin") ? allActivities :
  [];

  return (
    <div>
      {/* Header and Create Button */}
      <div >
        
        {user?.role === "student/rso" && (
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleCreate}
              className="bg-[#312895] hover:bg-[#312895]/90 text-white px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-white size-4" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
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
          { user.role === "student/rso" ? (            
          <div>
            <ReusableDropdown
              icon={true}
              options={["A-Z", "Most Joined", "Recently Added"]}
              showAllOption={false}
              onChange={handleSorted}
              value={sorted}
              buttonClass="border-[#312895] text-[#312895]"
            />
          </div>
          ) 
          :
          (
            <DropdownSearch 
            //fetch acronym for category
            isSorting={true}
            // options={rso}
            // setSelectedCategory={(val) => handleRSO(val)}
            setSelectedSorting={handleRSO}
            setSelectedCategory={() => {}} 
            />
          )
        }
        </div>

        {(user.role === "admin" || user.role === "superadmin") && (
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
              className="cursor-pointer font-medium text-[#312895]"
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
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
                    buttonClass="border-[#312895] text-[#312895]"
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
                    value={RSO}
                    buttonClass="border-[#312895] text-[#312895]"
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
                    buttonClass="border-[#312895] text-[#312895]"
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
      error ? (
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
                    {error || "An error occurred while fetching activities."}
                </p>
            </div>
      )
      :
      !loading && !error ? (
        <>
        <div className="flex items-center justify-center mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 ">

            {activitiesToShow?.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                Activity_name={activity.Activity_name}
                Activity_description={activity.Activity_description}

                //user imageUrl if student/rso role
                Activity_image={ 
                  user?.role === "student/rso" ? activity?.imageUrl || DefaultPicture :
                  user?.role === "admin" || user?.role === "superadmin" ?
                  activity?.activityImageUrl || DefaultPicture : DefaultPicture}
                Activity_registration_total={activity.Activity_registration_total}
                onClick={handleActivityClick}
                Activity_datetime={handleDateTime(activity.Activity_datetime) || "N/A"}
                Activity_place={activity.Activity_place}
                statusColor={activity.Activity_status === 'done' ? 'bg-green-500' : 
                            activity.Activity_status === 'pending' ? 'bg-[#FFCC33]' : 
                            'bg-red-500'}
              />
            ))}

            {activitiesToShow?.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col items-center justify-center p-8 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#312895]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-[#312895]">No activities found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
              )  
            }
          </div>
        </div>
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

        </>
      )
      :
       (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#312895]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-[#312895]">No activities found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      )
    }


    </div>
  );
}