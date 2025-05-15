import React from 'react';

function DocumentAction() {
  const activityData = {
    Activity_GPOA: false,
    Activity_date: "2025-04-01T00:00:00.000Z",
    Activity_description: "Makipag Hello",
    Activity_document_status: "not submitted",
    Activity_image: "",
    Activity_name: "Hello World Event asdjgasjkgda djasg dag kjhdagsjhd",
    Activity_place: "Basta jan lang sa kung saan man di mo alam basta don",
    Activity_publicity: false,
    Activity_registration_participants: ['67db77ff005837fe2394223c'],
    Activity_registration_total: 1,
    Activity_status: "pending",
    Activity_time: "16.00",
    CreatedBy: {
      _id: '67db77ff005837fe2394223c',
      firstName: 'b',
      lastName: 'b',
      email: 'b@students.national-u.edu.ph'
    },
    RSO_id: {
      _id: '67e0c358380e8d6de1a95519',
      RSO_name: 'NU Google Developers Group',
      RSO_acronym: 'NU GDG'
    },
    createdAt: "2025-04-05T06:04:45.797Z",
    updatedAt: "2025-05-08T04:56:28.008Z",
    _id: "67f0c7fde14cb898800b85ed"
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Activity Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Activity Name:</span> {activityData.Activity_name}</p>
              <p><span className="font-medium">Description:</span> {activityData.Activity_description}</p>
              <p><span className="font-medium">Date:</span> {formatDate(activityData.Activity_date)}</p>
              <p><span className="font-medium">Time:</span> {activityData.Activity_time}</p>
              <p><span className="font-medium">Place:</span> {activityData.Activity_place}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Status</h2>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Document Status:</span> {activityData.Activity_document_status}</p>
              <p><span className="font-medium">Approval Status:</span> {activityData.Activity_status}</p>
              <p><span className="font-medium">GPOA Activity:</span> {activityData.Activity_GPOA ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Publicity:</span> {activityData.Activity_publicity ? 'Public' : 'Private'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Registration</h2>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Total Participants:</span> {activityData.Activity_registration_total}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Organization</h2>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">RSO Name:</span> {activityData.RSO_id.RSO_name}</p>
              <p><span className="font-medium">RSO Acronym:</span> {activityData.RSO_id.RSO_acronym}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Created By</h2>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Name:</span> {activityData.CreatedBy.firstName} {activityData.CreatedBy.lastName}</p>
              <p><span className="font-medium">Email:</span> {activityData.CreatedBy.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">System Information</h2>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Created At:</span> {formatDate(activityData.createdAt)}</p>
              <p><span className="font-medium">Last Updated:</span> {formatDate(activityData.updatedAt)}</p>
              <p><span className="font-medium">Activity ID:</span> {activityData._id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Edit Activity
        </button>
      </div>
    </>
  );
}

export default DocumentAction;