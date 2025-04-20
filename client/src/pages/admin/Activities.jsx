import React, {  useEffect, useMemo, useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import { Searchbar, Button } from '../../components';

function Activities() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch data at the parent level
    fetch("/data/MOCK_ACTIVITIES.json")
      .then((response) => response.json())
      .then((json) => setActivities(json))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

    // Filter data based on search query
    const filteredActivities = useMemo(() => {
      return activities.filter((activity) => 
        (activity.activity_name || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }, [activities, searchQuery]);

  return (
  <>
      {/* back button */}
      <div className='flex flex-row items-center justify-start mb-4'>
        <Button
          style='secondary'
          className='px-4'
          onClick={() => navigate(-1)}
        >
          <div className='flex flex-row items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-current text-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            <h1>
              Back
            </h1>
          </div>
        </Button>
      </div>

    <div className=' rounded-lg bg-card-bg p-4 shadow-md'>
        <div className='w-1/2 mb-2'>
          <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Find an Activity"/>
        </div>

        {/* information and row count */}
        <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 font-semibold">
              Showing {filteredActivities.length} result{filteredActivities.length !== 1 ? "s" : ""}
              {searchQuery && ` of ${searchQuery}`}
            </span>

          </div>

        <ActivitiesTable activities={filteredActivities}  />
    </div>
        </>
    );

}


    function ActivitiesTable({ activities }) {
      const navigate = useNavigate();

      return (
      
      <table className="min-w-full border-collapse pl-6 pr-6">
      <thead className='bg-card-bg sticky top-0 z-10' >
        <tr className=" text-gray-700 ">
          <th className="px-4 py-4 text-center font-light">Number</th>
          <th className="px-4 py-4 text-center font-light">Activity Name</th>
          <th className="px-12 py-4 text-center font-light">Activity Status</th>
          <th className="px-12 py-4 text-center font-light">Document Status</th>
          <th className="px-12 py-4 text-center font-light">Date of Creation</th>
        </tr>
      </thead>
      <tbody className='p-6'>
        {activities.map((activity, index) => {
      const getStatusClass = status => status === "Done" ? "text-green-600" : "text-red-600";

      const activityStatus = getStatusClass(activity.activity_status);
      const documentStatus = getStatusClass(activity.document_status);
      return <tr key={index} className="bg-card-bg hover:bg-light-gray cursor-pointer rounded-lg " onClick={() => navigate("requirements")}>
                  <td className='text-center'>{index + 1}</td>
                  <td className="px-4 py-2 text-left">
                    {activity.activity_name}
                    </td>
                  <td className={`px-4 py-2 text-center ${activityStatus}`}>{activity.activity_status}</td>
                  <td className={`px-16 py-2 text-center text-green-600 ${documentStatus}`}>{activity.document_status}</td>
                  <td className="px-16 py-2 text-center">{activity.date}</td>
            </tr>;
    })}

      </tbody>
    </table>);
    }
  export default Activities