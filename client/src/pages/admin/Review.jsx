import React from 'react'

function Review () {
  return (
    <>
      {/* back button */}
      <div className='flex flex-row items-center justify-start mb-4'>
        <button className=' bg-light-gray text-off-black font-semibold py-2 px-4 rounded hover:bg-mid-gray' onClick={() => window.history.back()}>
          <div className='flex flex-row items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-current text-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            <h1>
              Back
            </h1>
          </div>
        </button>
      </div>

      {/* file card */}
      <div className='bg-card-bg w-full h-min-[300px] p-4 rounded-md border border-mid-gray'>
        <div className='flex flex-row items-center justify-start space-between space-x-12'>
          {/* icon and document name */}
            <div className='flex flex-row items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className='size-6 fill-current text-off-black mr-2' viewBox="0 0 384 512"><path d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"/></svg>
                <h1 className='hover:underline cursor-pointer'>DocumentFileName.docx</h1>
                <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-current text-off-black' viewBox="0 0 512 512"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
            </div>
            {/* status */}
            <div>
                <span class="bg-yellow-100 border border-yellow-800 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-md dark:bg-yellow-900 dark:text-yellow-300">Pending</span>
            </div>
            {/* size */}
            <div>
                <h2 className='text-sm text-gray-500'>13MB</h2>
            </div>
            {/* download button  */}
            <button class="bg-light-gray hover:bg-mid-gray text-off-black font-bold py-2 px-4 rounded inline-flex items-center">
              <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
              <span>Download</span>
            </button>
        </div>
      </div>

    {/* review form */}
    <div className='bg-card-bg w-full h-min-[300px] p-4 rounded-md border border-mid-gray mt-4'>
        <div >
        <div className='flex items-start justify-start'>
            <h1 className='text-lg font-semibold '>Review Document</h1>
        </div>
            <div className="flex flex-col items-center justify-center mt-4">
              {/* create row checkbox */}
              <div className="flex items-center justify-start space-x-4">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                  <label for="vehicle1">Approve</label>
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                  <label for="vehicle1">Reject</label>
              </div>
              <div className="w-1/2">
                  <label htmlFor="large-input">Remarks</label>
                  <input type="text" id="large-input" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>            
              </div>
             </div>
        </div>
    </div>
    </>

  )
}

export default Review