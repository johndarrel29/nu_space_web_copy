import React from 'react';
import DefaultPicture from "../../assets/images/default-picture.png";

function ActivityCard({ 
  onClick, 
  activity,
  Activity_name,
  Activity_description,
  Activity_image,
  Activity_registration_total,
  statusColor = "bg-gray-400" // Default color if not provided
}) {
  return (
    <div 
      className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(activity)}
      title={Activity_name}
    >
      {/* Image with status badge */}
      <div className="relative h-40 w-full">
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColor}`}>
          {activity.Activity_status || 'Ongoing'}
        </div>
        <img 
          src={Activity_image || DefaultPicture}
          alt={Activity_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[#312895] text-lg line-clamp-1">
            {Activity_name}
          </h3>
          <div className="flex items-center bg-[#312895]/10 px-2 py-1 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-[#312895]" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd" 
              />
            </svg>
            <span className="text-xs font-medium text-[#312895] ml-1">
              {Activity_registration_total}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {Activity_description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-[#312895]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd" 
              />
            </svg>
            <span>{new Date(activity.Activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center text-[#312895]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd" 
              />
            </svg>
            <span className="truncate max-w-[100px]">{activity.Activity_place}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;