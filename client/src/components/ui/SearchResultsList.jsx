import React from 'react'
import { Button } from '../../components'
import { useTagSelector } from '../../hooks';

function SearchResultsList({showSearch = [], searchQuery, handleTagClick}) {
    console.log("Search Results: ", showSearch);
    const { createTagMutation } = useTagSelector();

  return (
    <div className=' absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-10 overflow-x-auto max-h-[400px] z-50 overflow-x-auto'>
        {showSearch?.length > 0 ? (
            showSearch.map((org, id) => {
            console.log("org: ", org);
            return (

            <div 
            key={id} 
            onClick={() => {handleTagClick(org)}}
            className='flex flex-col items-start justify-center p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer '
            >
                <h1>
                    {org}
                </h1>
            </div>
            );
        })
        ) : (
            searchQuery &&
            <div className='flex flex-col space-y-2 items-center justify-center h-full p-6'>
                <h1 className='text-gray-400'><em>No Results Found.</em></h1>
                {/* separator */}
                <div className='w-full border-t border-gray-200'></div>
                <div className='flex items-center justify-center gap-2'>
                    <h2 className='font-bold'>Create:</h2>
                    <div 
                        onClick={() => {
                            // handleTagClick(searchQuery);
                            createTagMutation(
                                searchQuery, 
                                {
                                    onSuccess: (data) => {
                                        
                                        handleTagClick(data.tag.tag);
                                        console.log("Tag created successfully:", data);
                                    },
                                    onError: (error) => {
                                        console.error("Error creating tag:", error);
                                    }
                                }
                            );
                        } }
                        className='rounded-md bg-mid-gray p-1 hover:bg-gray-200 cursor-pointer'>
                            <div className='flex flex-row items-center justify-between gap-2 p-1'>
                                <h1>{searchQuery}</h1>
                            </div>
                        </div>
                    </div>
                </div>

        )}
    </div>
  )
}

export default SearchResultsList