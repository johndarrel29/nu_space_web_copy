import React, { act, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Searchbar } from '../../components';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { div } from 'three/tsl';

function Activities() {
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
  
    <div className="flex  justify-start mb-4  p-6 bg-card-bg rounded-lg shadow-md">
      <div className='w-1/2'>
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Find an Activity"/>
      </div>
    </div>
    
    {/* information and row count */}
    <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700 font-semibold">
          Showing {filteredActivities.length} result{filteredActivities.length !== 1 ? "s" : ""}
          {searchQuery && ` of ${searchQuery}`}
        </span>

      </div>

    <div className=' max-h-[600px] overflow-y-auto  border border-gray-300 rounded-lg  bg-card-bg'>
        <ActivitiesTable activities={filteredActivities}  />
    </div>
        </>
    );

}


    function ActivitiesTable({ activities }) {
      const navigate = useNavigate();

      return (
      
      <table className="min-w-full border-collapse pl-6 pr-6">
      <thead className='bg-card-bg sticky top-0 z-10 shadow-md' >
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