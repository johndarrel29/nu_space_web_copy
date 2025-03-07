import React, { useState, useEffect } from 'react';
import Select from 'react-select';


export default function DropdownSearch({ isDisabled }) {
  const [options, setOptions] = useState([]); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    //json for dropdown elements
    fetch("/data/orgsData.json") 
      .then((response) => response.json())
      .then((data) => {
        setOptions(data); 
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dropdown data:', error);
        setIsLoading(false);
      });
  }, []);

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
  )

};


