import React, { useState } from 'react';
import {TextInput, Button } from '../../components';
function DocumentAction() {
  const [activityData, setActivityData] = useState({
    Activity_name: "Hello World Event asdjgasjkgda djasg dag kjhdagsjhd",
    Activity_description: "Makipag Hello",
    Activity_date: "2025-04-01",
    Activity_time: "16.00",
    Activity_place: "Basta jan lang sa kung saan man di mo alam basta don",
    Activity_document_status: "not submitted",
    Activity_status: "pending",
    Activity_GPOA: false,
    Activity_publicity: false,
    Activity_registration_total: 1,
    RSO_name: "NU Google Developers Group",
    RSO_acronym: "NU GDG",
    CreatedBy: {
      firstName: 'b',
      lastName: 'b',
      email: 'b@students.national-u.edu.ph'
    },
    createdAt: "2025-04-05T06:04:45.797Z",
    updatedAt: "2025-05-08T04:56:28.008Z",
    _id: "67f0c7fde14cb898800b85ed"
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setActivityData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // yyyy-mm-dd
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Activity Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <section className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            <TextInput placeholder="Activity Name" value={activityData.Activity_name} onChange={handleChange('Activity_name')} />
            <TextInput placeholder="Description" value={activityData.Activity_description} onChange={handleChange('Activity_description')} />
            <TextInput type="date" value={activityData.Activity_date} onChange={handleChange('Activity_date')} />
            <TextInput placeholder="Time" value={activityData.Activity_time} onChange={handleChange('Activity_time')} />
            <TextInput placeholder="Place" value={activityData.Activity_place} onChange={handleChange('Activity_place')} />
          </section>

          <section className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Status</h2>
            <TextInput placeholder="Document Status" value={activityData.Activity_document_status} onChange={handleChange('Activity_document_status')} />
            <TextInput placeholder="Approval Status" value={activityData.Activity_status} onChange={handleChange('Activity_status')} />
            <TextInput placeholder="GPOA Activity (true/false)" value={activityData.Activity_GPOA.toString()} onChange={handleChange('Activity_GPOA')} />
            <TextInput placeholder="Publicity (true/false)" value={activityData.Activity_publicity.toString()} onChange={handleChange('Activity_publicity')} />
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Registration</h2>
            <TextInput placeholder="Total Participants" value={activityData.Activity_registration_total} onChange={handleChange('Activity_registration_total')} />
          </section>

          <section className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Organization</h2>
            <TextInput placeholder="RSO Name" value={activityData.RSO_name} onChange={handleChange('RSO_name')} />
            <TextInput placeholder="RSO Acronym" value={activityData.RSO_acronym} onChange={handleChange('RSO_acronym')} />
          </section>

          <section className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">Created By</h2>
            <TextInput placeholder="First Name" value={activityData.CreatedBy.firstName} onChange={(e) => setActivityData(prev => ({ ...prev, CreatedBy: { ...prev.CreatedBy, firstName: e.target.value } }))} />
            <TextInput placeholder="Last Name" value={activityData.CreatedBy.lastName} onChange={(e) => setActivityData(prev => ({ ...prev, CreatedBy: { ...prev.CreatedBy, lastName: e.target.value } }))} />
            <TextInput placeholder="Email" value={activityData.CreatedBy.email} onChange={(e) => setActivityData(prev => ({ ...prev, CreatedBy: { ...prev.CreatedBy, email: e.target.value } }))} />
          </section>

          <section className="bg-white p-4 rounded-2xl shadow-sm border space-y-2 text-sm text-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">System Information</h2>
            <p><strong>Created At:</strong> {formatDate(activityData.createdAt)}</p>
            <p><strong>Last Updated:</strong> {formatDate(activityData.updatedAt)}</p>
            <p><strong>Activity ID:</strong> {activityData._id}</p>
          </section>
        </div>
      </div>

      <div className="mt-10 flex justify-end space-x-4">
        <Button style="secondary" onClick={() => console.log("Delete clicked")}>Delete Activity</Button>
        <Button onClick={() => console.log("Edit clicked", activityData)}>Save Changes</Button>
      </div>
    </>
  );
}

export default DocumentAction;
