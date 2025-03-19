import React, { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components';


const Requirements = () => {
  const navigate = useNavigate();
  
  return (
    <>
      {/* back button */}
      <div className='flex flex-row items-center justify-start mb-4'>
        <Button
          style='secondary'
          className='px-4'
          onClick={() => navigate(-1)}
        >
          <div className='flex flex-row items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className='size-4 fill-current text-off-black' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            <h1>
              Back
            </h1>
          </div>
        </Button>
      </div>

       <div className='bg-card-bg max-h-[800px] items-center justify-center border border-mid-gray rounded-lg w-full'>
        <div className='flex justify-start items-center p-4 font-bold '>
          <h1 className='text-bold'>Activity Name</h1>
        </div>
        {/* divider */}
        <div className="bg-mid-gray w-full h-px"></div>

        {/* table */}
        <div className='max-h-[400px] overflow-y-auto '>
          <RequirementsTable/>
        </div>          
      </div>       
    </>
  )
}

    function RequirementsTable() {
      const navigate = useNavigate();
      const [documents, setDocuments] = useState([]);
  
      useEffect(() => {
        fetch("/data/MOCK_DOCUMENTS.json")
          .then((response) => response.json())
          .then((json) => setDocuments(json))
          .catch((error) => console.error("Error loading data:", error));
          console.log("data is: ", documents);
      }, []);
    
        // Memoize the data to prevent unnecessary re-renders
        const memoizedData = useMemo(() => documents, [documents]);
        

      return (
      <table className="min-w-full border-collapse ">
      <thead className='shadow-md bg-card-bg sticky top-0 z-10 '>
        <tr className=" text-gray-700 ">
          <th className="px-4 py-2 text-center">Document</th>
          <th className="px-4 py-2 text-center">File</th>
          <th className="px-12 py-2 text-center">Size</th>
          <th className="px-12 py-2 text-center">Status</th>
          <th className="px-12 py-2 text-center">Remarks</th>
        </tr>
      </thead>
      <tbody >
        {memoizedData.map((document, index) => {
      const getStatusClass = status => status === "Done" ? "text-green-600" : "text-red-600";
      const getRemarks = remarks => remarks === "Yes" ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-4">
      <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z"/>
      </svg> : "";

      const documentStatus = getStatusClass(document.status);
      const remarks = getRemarks(document.remarks);
      return <tr key={index} className="hover:bg-light-gray cursor-pointer rounded-lg " onClick={() => navigate("../review", { state: { fromRequirements: true } })}>
                  <td className='text-center'>{index + 1}</td>
                  <td className="px-4 py-3 text-left">{document.file}</td> 
                  <td className="px-4 py-3 text-center text-dark-gray text-sm" >{document.size}</td>
                  <td className={`px-16 py-3 text-center text-green-600 ${documentStatus}`}>{document.status}</td>
                  <td className=" flex items-center justify-center fill-dark-gray">
                      <div 
                        className={remarks ? " flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 hover:bg-gray-300 cursor-pointer" : ""}
                      >          
                        {remarks}
                      </div>
                    </td>
            </tr>;
    })}

      </tbody>
    </table>);
    }

export default Requirements