import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useRSO from '../../hooks/useRSO';

export default function DropdownSearch({ isDisabled }) {
  const { organizations, loading } = useRSO();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  
  // Extract only RSO_acronym values
  const options = organizations.map((org) => ({
    value: org.RSO_acronym,
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
      placeholder="Select an organization"
      options={options}
      isLoading={isLoading}
      isDisabled={isDisabled}
      isClearable={true}
      isSearchable={true}
      value={selectedOption} 
      onChange={setSelectedOption}
    />
  );
}
