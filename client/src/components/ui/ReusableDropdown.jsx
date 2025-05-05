import React from "react";
const ReusableDropdown = ({ options, showAllOption, value, onChange}) => {

    return (
        <select 
        className="w-full h-10 border border-mid-gray rounded-md p-1 bg-textfield focus:outline-none focus:ring-off-black  focus:ring-1"
        defaultValue=""
        value={value}
        onChange={onChange}
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
