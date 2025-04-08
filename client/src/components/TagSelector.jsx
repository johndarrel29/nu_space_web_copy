import {Searchbar,SearchResultsList } from '../components';

export default function TagSelector({
    apiTags = [],
    selectedTags = [], 
    searchQuery,
    setSearchQuery,
    setShowSearch,
    setIsFocused,
    searchedData,
    handleTagClick,
    handleApiTagRemove
}) {

    const hasApiTags = apiTags && apiTags.length > 0;
    const hasTagData = selectedTags && selectedTags.length > 0;

    console.log("apiTags",apiTags)

    return(
    <>
    {/* Tag */}
    <div className=' mb-4'>
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tag</label>
    <div className='p-2 pl-4 pr-4'>
        <div className=' relative'>
            <Searchbar
            placeholder="Search a tag"
            style="secondary"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} 
            setShowSearch={setShowSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />

        <SearchResultsList 
        showSearch={searchedData} 
        searchQuery={searchQuery} 
        handleTagClick={handleTagClick}
        />    

        </div>

    {/* tag table */}
    <div className='w-full p-2 mt-2 bg-white border border-mid-gray rounded-lg'>
        
        <div className='grid grid-cols-4 items-center justify-center space-y-2'>
            {/* tag */}
            {/* ✅ API tags come first */}
            {/* {hasApiTags ?
             (apiTags.map((tag, index) => (
                <span key={`api-${index}`} className="flex items-center justify-center bg-green-100 text-green-700 text-xs font-medium me-2 px-2.5 py-0.5 rounded-[50px] dark:bg-gray-700 dark:text-green-300 border border-green-500">
                    <div className='flex flex-row items-center space-x-2 p-1'>
                        <h1 className='text-sm'>{tag}</h1>
                        <div
                            onClick={() => handleTagClick(tag)}
                            className='cursor-pointer hover:bg-gray-200 rounded-full p-1'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-green-600 size-4" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                        </div>
                    </div>
                </span>
            ))
            ) : hasTagData ? 
            selectedTags.map((tag, index) => (
                <span key={index} className="flex items-center justify-center  bg-blue-100 text-primary text-xs font-medium me-2 px-2.5 py-0.5 rounded-[50px] dark:bg-gray-700 dark:text-primary border border-primary">
                <div className='flex flex-row items-center space-x-2 p-1 '>
                    <h1 className='text-sm text-dark-gray text-primary'>{tag}</h1>
                    <div
                    onClick={() => handleTagClick(tag)}
                    className='cursor-pointer hover:bg-gray-200 rounded-full p-1'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-primary size-4" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </div>
                </div>
            </span>
            )
        ) : (
                <h1 className='text-sm text-dark-gray'><em>No tags selected.</em></h1>
        ) } */}

          {/* If there are no tags at all */}

        {!hasApiTags && !hasTagData && (
            <h1 className='text-sm text-dark-gray'><em>No tags selected.</em></h1>
        )}

        {/* API tags */}
        {hasApiTags && apiTags.map((tag, index) => (
            <span key={`api-${index}`} className="flex items-center justify-center bg-green-100 text-green-700 text-xs font-medium me-2 px-2.5 py-0.5 rounded-[50px] dark:bg-gray-700 dark:text-green-300 border border-green-500">
            <div className='flex flex-row items-center space-x-2 p-1'>
                <h1 className='text-sm'>{tag}</h1>
                <div
                onClick={() => handleApiTagRemove(tag)}
                className='cursor-pointer hover:bg-gray-200 rounded-full p-1'
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-green-600 size-4" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </div>
            </div>
            </span>
        ))}

        {/* Selected tags */}
        {hasTagData && selectedTags.map((tag, index) => (
            <span key={`selected-${index}`} className="flex items-center justify-center bg-blue-100 text-primary text-xs font-medium me-2 px-2.5 py-0.5 rounded-[50px] dark:bg-gray-700 dark:text-primary border border-primary">
            <div className='flex flex-row items-center space-x-2 p-1'>
                <h1 className='text-sm text-dark-gray text-primary'>{tag}</h1>
                <div
                onClick={() => handleTagClick(tag)}
                className='cursor-pointer hover:bg-gray-200 rounded-full p-1'
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-primary size-4" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </div>
            </div>
            </span>
        ))}
            
        </div>                       
    </div>
    </div>



</div>
    </>
    

    );
}