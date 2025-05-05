import React from 'react';
import { Link } from 'react-router-dom';
import DefaultPicture from "../../assets/images/default-picture.png";

function ActivityCard({ onClick, activity }) {
  const {
    Activity_name,
    Activity_description,
    Activity_image,
    Activity_registration_total,
  } = activity;

  return (
      <div 
        onClick={() => onClick(activity)}
      className="flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0 rounded-lg p-2 w-full max-w-sm mx-auto  bg-white hover:bg-gray-200 cursor-pointer">
        <div className="w-full md:w-2/5 grid place-items-center">
          <img 
            src={Activity_image || DefaultPicture}
            alt="Mountain waterfall" 
            className="rounded-lg w-full h-auto object-cover aspect-[2/3]" 
          />
        </div>
        <div className="w-full md:w-3/5 flex flex-col space-y-1 p-2">
          {/* <div className="flex justify-between items-center">
            <p className="text-gray-500 text-xs font-medium hidden md:block">Vacations</p>
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-yellow-500" 
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                />
              </svg>
              <p className="text-gray-600 font-bold text-xs ml-1">
                4.96
                <span className="text-gray-500 font-normal">(76)</span>
              </p>
            </div>
            <div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-pink-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="bg-gray-200 px-2 py-0.5 rounded-full text-2xs font-medium text-gray-800 hidden md:block">
              Superhost
            </div>
          </div> */}
          <h3 className="font-bold text-gray-800 text-sm md:text-base">{Activity_name}</h3>
          <p className="text-gray-500 text-xs line-clamp-2">
            {Activity_description}
          </p>
          <p className="text-sm font-bold text-gray-800">
            {Activity_registration_total}
            <span className="font-normal text-gray-600 text-xs"> Members joined</span>
          </p>
        </div>
      </div>
  );
}

export default ActivityCard;