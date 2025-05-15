import React, { useState, useEffect } from "react";
import { ActivityCard, Searchbar, ReusableDropdown, Button } from "../../components";
import { useActivities, useUser } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { ActivitySkeleton } from '../../components';

{/* make this page to be used in rso page. */}

export default function MainDocuments() {
  const { activities, loading, error } = useActivities();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const { data, fetchData } = useUser();

    console.log("User data:", data);

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
        console.log("Selected Activity:", activity);
        navigate(`main-activities`, { state: { activity }}); // Navigate to the activity details page
    };

    console.log("Activities:", activities);
    console.log("User data:", user.assigned_rso);


    return (
        <> 

        {user.role === "student/rso" && (
            <div className="w-full flex justify-end mb-4">
                <Button onClick={() => navigate("document-action")}>
                Create an Activity</Button>
            </div>
        )}
        <div className=" mb-4 w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
                <div className="w-full lg:w-full md:w-full">
                    <Searchbar placeholder="Search an Organization"  searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                </div>
                <div className="w-full lg:w-1/2 md:w-full">
                    <ReusableDropdown 
                    options={[ "A-Z", "Most Joined", "Recently Added"]}
                    showAllOption={true}
                    />
                </div>
            </div>
        {user?.role === "admin" ? (
            <>
            {loading && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                <ActivitySkeleton/>
                </div>)
                }
              {error && <p>Error: {error.message}</p>}
              {!loading && !error && (
            <div className="grid grid-cols-3 gap-3 mt-4">
                {activities.map((activity) => (
                  <ActivityCard
                      key={activity._id}
                      activity={activity}
                      Activity_name={activity.Activity_name}
                      Activity_description={activity.Activity_description}
                      Activity_image={activity.Activity_image}
                      Activity_registration_total={activity.Activity_registration_total}
                      onClick={handleActivityClick} 
                  />
                ))}
             
            </div>
             )}
                    
            

        
            </>
        ) : (
            <>
            {loading && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                    <ActivitySkeleton/>
                <ActivitySkeleton/>
                </div>)
                }
              {error && <p>Error: {error.message}</p>}
              {!loading && !error && (
            <div className="grid grid-cols-3 gap-3 mt-4">
                {activities.map((activity) => (
                  <ActivityCard
                      key={activity._id}
                      activity={activity}
                      Activity_name={activity.Activity_name}
                      Activity_description={activity.Activity_description}
                      Activity_image={activity.Activity_image}
                      Activity_registration_total={activity.Activity_registration_total}
                      onClick={handleActivityClick} // Add onClick handler if needed
                  />
                ))}
             
            </div>
             )}
                    
            </>    

        )} 
      

        </>
    );
    }