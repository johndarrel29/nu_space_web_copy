import React, { useState } from "react";
import { ActivityCard, Searchbar, ReusableDropdown, Button, ActivitySkeleton } from "../../components";
import { useActivities, useUser } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function MainDocuments() {
  const { activities, loading, error, fetchActivity, fetchLocalActivities } = useActivities();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { data } = useUser();
  const [selectedActivity, setSelectedActivity] = useState(null);


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

  const filterSearch = (activities) => {
    if (!searchQuery) return activities;
    return activities.filter((activity) =>
      activity.Activity_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
        console.log("Selected Activity:", activity);
        navigate(`main-activities`, { state: { activity }}); // Navigate to the activity details page
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Header and Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#312895]">Activities</h1>
          <p className="text-sm text-gray-600">
            {user?.role === "student/rso" ? "Your RSO Activities" : "All Activities"}
          </p>
        </div>
        
        {user?.role === "student/rso" && (
          <Button 
            onClick={handleCreate}
            className="bg-[#312895] hover:bg-[#312895]/90 text-white px-4 py-2"
          >
            Create an Activity
          </Button>
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
          <div>
            <ReusableDropdown
              icon={true}
              options={["A-Z", "Most Joined", "Recently Added"]}
              showAllOption={true}
              buttonClass="border-[#312895] text-[#312895]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="RSO" className="text-sm font-medium text-[#312895]">
              RSO
            </label>
            <ReusableDropdown
              id="RSO"
              options={["All", "College of Engineering", "College of Arts and Sciences", "College of Business Administration"]}
              showAllOption={true}
              buttonClass="border-[#312895] text-[#312895]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="college" className="text-sm font-medium text-[#312895]">
              College
            </label>
            <ReusableDropdown
              id="college"
              options={["All", "College of Engineering", "College of Arts and Sciences", "College of Business Administration"]}
              showAllOption={true}
              buttonClass="border-[#312895] text-[#312895]"
            />
          </div>
        </div>
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
                    {error.message || "An error occurred while fetching activities."}
                </p>
            </div>
      )
      :
      !loading && !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filterSearch(activities).map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              Activity_name={activity.Activity_name}
              Activity_description={activity.Activity_description}
              Activity_image={activity.Activity_image}
              Activity_registration_total={activity.Activity_registration_total}
              onClick={handleActivityClick}
              statusColor={activity.Activity_status === 'approved' ? 'bg-green-500' : 
                          activity.Activity_status === 'pending' ? 'bg-[#FFCC33]' : 
                          'bg-red-500'}
            />
          ))}
        </div>
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