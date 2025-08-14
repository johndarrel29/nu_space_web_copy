import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useRSO from '../../hooks/useRSO';

export default function DropdownSearch({ isDisabled, category, setSelectedCategory, selectedCategory, isSorting, setSelectedSorting, role }) {
  const { loading, RSOData, fetchData } = useRSO();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultCategory] = useState(category);

  console.log("RSOData", RSOData);

  // Extract only RSO_acronym values
  const options = RSOData?.rsos?.map((org) => {
    const snapshot = org.RSO_snapshot || {};
    return {
      value: org.rsoId,
      label: snapshot.acronym,
    };
  }) || [];

  console.log("DropdownSearch options:", options);
  console.log("clicked dropdown item:", selectedOption);

  useEffect(() => {
    fetchData();
  }, [RSOData]);


  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (isDisabled || role === "student") {
      setSelectedOption(null);
      setSelectedCategory("N/A");
    }
  }, [isDisabled, role, setSelectedCategory]);

  return (
    <Select
      placeholder={category ? category : "Select an RSO"}
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled || role === "student"}
      isClearable={true}
      isSearchable={true}
      menuPortalTarget={document.body}
      value={category ? options?.find((opt) => opt.value === category) : selectedOption}
      onChange={(option) => {
        console.log("Dropdown change detected:");
        console.log("Selected option:", option);

        if (option === null) {
          // When clearing, set to empty string
          setSelectedOption(null);
          setSelectedCategory("");
          if (isSorting) {
            setSelectedSorting("");
          }
          console.log("Reset to empty string");
        } else {
          setSelectedOption(option);
          setSelectedCategory(option.value);
          if (isSorting) {
            setSelectedSorting(option.label);
          }
        }
      }}
    />
  );
}
