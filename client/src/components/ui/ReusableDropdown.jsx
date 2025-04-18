import React from "react";
const ReusableDropdown = ({ options, showAllOption }) => {

    return (
        <select 
        className="bg-light-gray border border-mid-gray rounded-md p-2 w-full focus:ring-off-black"
        defaultValue=""
        >
        {showAllOption && <option value="all">All</option>}
          {options.map((label, index) => (
            <option key={index} value={label}>
              {label}
            </option>
          ))}
        </select>
      );
};

export default ReusableDropdown;
