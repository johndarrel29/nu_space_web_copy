import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useRSO from '../../hooks/useRSO';

export default function DropdownSearch({ isDisabled, category, setSelectedCategory, selectedCategory, isSorting, setSelectedSorting, role }) {
  const { organizations, loading } = useRSO();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  // const [ selectedSorting, setSelectedSorting ] = useState("");

  
  // Extract only RSO_acronym values
  const options = organizations.map((org) => ({
    value: org._id, 
    label: org.RSO_acronym, 

  }));

  useEffect(() => {
    setIsLoading(loading); 
  }, [loading]);

  useEffect(() => {
    if (isDisabled || role === "student") {
      setSelectedOption(null);
      setSelectedCategory("N/A");
    }
  }, [isDisabled, role, setSelectedCategory]);

  //convert the selected category to a string

  return (
    <Select
    placeholder={category ? category : "Select an RSO"}
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled || role === "student"}
      isClearable={true}
      isSearchable={true}
      menuPortalTarget={document.body}
      value={category ? options.find((opt) => opt.value === category) : selectedOption}
      onChange={(option) => {
        setSelectedOption(isSorting ?  option : option);
        setSelectedCategory(option ? option.value : "N/A");
        console.log("Selected option:", option);
        // console.log("Selected category:", option ? option.label : "N/A");
        if (isSorting) {
          setSelectedSorting(option ? option.label : "N/A");
          console.log("Selected sorting:", option ? option.label : "N/A");
        }
      }}
    />
  );
}
