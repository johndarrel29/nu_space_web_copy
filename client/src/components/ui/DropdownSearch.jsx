import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useRSO from '../../hooks/useRSO';

export default function DropdownSearch({ isDisabled, category, setSelectedCategory, selectedCategory }) {
  const { organizations, loading } = useRSO();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  
  // Extract only RSO_acronym values
  const options = organizations.map((org) => ({
    value: org._id, 
    label: org.RSO_acronym, 

  }));

  useEffect(() => {
    setIsLoading(loading); 
  }, [loading]);

  useEffect(() => {
    if (isDisabled) {
      setSelectedOption(null); 
    }
  }, [isDisabled]);

  return (
    <Select
    placeholder={category ? category : "Select an RSO"}
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled}
      isClearable={true}
      isSearchable={true}
      menuPortalTarget={document.body}
      value={category ? options.find((opt) => opt.value === category) : selectedOption}
      onChange={(option) => {
        setSelectedOption(option);
        setSelectedCategory(option ? option.value : "N/A");
        console.log("Selected option:", option);
      }}
    />
  );
}
