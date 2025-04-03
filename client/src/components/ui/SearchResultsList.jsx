import React from 'react'
import { Button } from '../../components'

function SearchResultsList({showSearch = [], searchQuery, handleTagClick}) {
    console.log("Search Results: ", showSearch);

  return (
    <div className='absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-10 overflow-x-auto max-h-[200px] z-50 overflow-x-auto'>
        {showSearch?.length > 0 ? (
            showSearch.map((org, id) => {
            console.log("org: ", org);
            return (

            <div 
            key={id} 
            onClick={() => {handleTagClick(org)}}
            className='flex flex-col items-center justify-center p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer '
            >
                <div className='flex flex-row items-center space-x-2'>
                    <div>
                        <h1>
                            {org}
                        </h1>
                    </div>

                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    </div>    
                </div>
            
            </div>
            );
        })
        ) : (
            searchQuery &&
            <div className='flex flex-col space-y-2 items-center justify-center h-full p-6'>
                <h1 className='text-dark-gray'><em>No Results Found.</em></h1>
                <Button 
                className='text-gray-500 pl-2 pr-2'
                onClick={() => {handleTagClick(searchQuery)}}
                >
                    {`Create "${searchQuery}"`}
                </Button>
            </div>
        )}
    </div>
  )
}

export default SearchResultsList