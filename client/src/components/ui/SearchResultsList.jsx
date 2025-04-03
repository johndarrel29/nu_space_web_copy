import React from 'react'
import { Button } from '../../components'

function SearchResultsList({showSearch = [], searchQuery}) {
    console.log("Search Results: ", showSearch);

  return (
    <div className='absolute top-full left-0 w-full bg-white shadow-lg rounded-md z-10 overflow-x-auto max-h-[200px] z-50 overflow-x-auto'>
        {showSearch?.length > 0 ? (
            showSearch.map((org, id) => {
            console.log("org: ", org);
            return (
                <div key={id} className='flex flex-col items-center justify-center p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer '>
                    <h1>
                        {org}
                    </h1>                   
                </div>
            );
        })
        ) : (
            searchQuery &&
            <div className='flex flex-col space-y-2 items-center justify-center h-full p-6'>
                <h1 className='text-dark-gray'><em>No Results Found.</em></h1>
                <Button className='text-gray-500 pl-2 pr-2'>{`Create "${searchQuery}"`}</Button>
            </div>
        )}
    </div>
  )
}

export default SearchResultsList