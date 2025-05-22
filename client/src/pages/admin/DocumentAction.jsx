import React, { useState } from 'react';
import { TextInput, Button } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActivities } from '../../hooks';

function DocumentAction() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, data, from } = location.state || {};
  const { createActivity, updateActivity, deleteActivity } = useActivities();
  
  const [activityData, setActivityData] = useState(() => {
    if (mode === 'edit' && data) {
      return {
        Activity_name: data.Activity_name || '',
        Activity_image: data.Activity_image || '',
        Activity_time: data.Activity_time || '',
        Activity_date: data.Activity_date?.split('T')[0] || '',
        Activity_place: data.Activity_place || '',
        Activity_description: data.Activity_description || '',
        Activity_GPOA: data.Activity_GPOA ?? false
      };
    }
    return {
      Activity_name: '',
      Activity_image: '',
      Activity_time: '',
      Activity_date: '',
      Activity_place: '',
      Activity_description: '',
      Activity_GPOA: false
    };
  });

  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setActivityData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to match the API requirement
    const apiData = {
      ...activityData,
      Activity_GPOA: activityData.Activity_GPOA.toString() // Convert boolean to string if needed
    };
    try {
      let result;

      if (isEdit && data?._id) {
              // Update existing activity
      result = await updateActivity(data._id, apiData);
      console.log("Activity updated:", result);
      } else {

        const created = await createActivity(apiData);
        console.log("Activity created:", created);
        
              if (created) {
                navigate(from || "/admin/documents", {
                  state: { message: isEdit ? "Activity updated successfully!" : "Activity created successfully!" },
                });
              }
      }

    }
    catch (error) {
      console.error("Error submitting form:", error);
    }
    
    console.log("Submitting data:", apiData);
    // Here you would typically make your API call
  };

  const handleDelete = async (e) => {
    e.preventDefault();

console.log("Deleting activity with ID:", data?._id);

    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await deleteActivity(data._id);
        console.log("Activity deleted");
        navigate(from || "/admin/documents", {
          state: { message: "Activity deleted successfully!" },
        });
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  }

  return (
    <>
      <div className='mb-8'>
        <Button
          style={"secondary"}
          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {mode === "edit" ? "Edit Activity Details" : mode === "create" ? "Create New Activity" : "View Activity Details"}
      </h1>

      <div className="flex items-center justify-center w-full">
        {/* details */}
        <div className="space-y-6 w-full max-w-2xl">
          <section className="bg-white p-4 rounded-2xl space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            <TextInput 
              placeholder="Activity Name" 
              value={activityData.Activity_name} 
              onChange={handleChange('Activity_name')} 
            />
            <TextInput 
              placeholder="Activity Image URL" 
              value={activityData.Activity_image} 
              onChange={handleChange('Activity_image')} 
            />
            <TextInput 
              placeholder="Description" 
              value={activityData.Activity_description} 
              onChange={handleChange('Activity_description')} 
            />
            <TextInput 
              type="date" 
              value={activityData.Activity_date} 
              onChange={handleChange('Activity_date')} 
            />
            <TextInput 
              placeholder="Time (e.g., 08:00 AM)" 
              value={activityData.Activity_time} 
              onChange={handleChange('Activity_time')} 
            />
            <TextInput 
              placeholder="Place" 
              value={activityData.Activity_place} 
              onChange={handleChange('Activity_place')} 
            />
          </section>

          <section className="bg-white p-4 rounded-2xl space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">GPOA Status</h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={activityData.Activity_GPOA}
                onChange={handleChange('Activity_GPOA')}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Is GPOA Activity</span>
            </label>
          </section>
        </div>
      </div>

      <div className="mt-10 flex justify-end space-x-4">
        {isEdit && (
          <Button style="secondary" onClick={handleDelete}>
            Delete Activity
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {isEdit ? "Save Changes" : "Create Activity"}
        </Button>
      </div>
    </>
  );
}

export default DocumentAction;