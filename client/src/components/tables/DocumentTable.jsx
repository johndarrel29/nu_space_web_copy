
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';


export default function DocumentTable({category, searchQuery}) {
    const [data, setData] = useState([]);
    const navigate = useNavigate();


        //Pagination
        //Removed pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const safeSearchQuery = searchQuery || ''; 


        // Filter data based on category
        const filteredData = category === "All" 
        ? data 
        : data.filter(item => item.category === category);

        const searchedData = filteredData.filter(item => 
          item.org_name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
          item.college.toLowerCase().includes(safeSearchQuery.toLowerCase()) 
      );
          
  //filtering data
    const records = searchedData;


    const npage = Math.ceil(filteredData.length / postsPerPage);


   useEffect(() => {
       fetch("/data/RSO_DATA.json")
         .then((response) => response.json())
         .then((json) => setData(json))
         .catch((error) => console.error("Error loading data:", error));
     }, []); 

     

    return (
      //table
        <div className="overflow-x-auto p-10  max-h-[400px]">
            <table className="table-auto w-full pr-50 border-collapse ">
                <tbody className="overflow-hidden bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700   cursor-pointer ">
                    {records.map((data, index) => (
                            //console.log(data) shows the data
                        <tr key={index} className=" rounded-lg hover:bg-gray-100 rounded-lg" onClick={() => navigate("main-activities")}>
                            <td className="px-4 py-3 "> 
                            <div className="flex items-center">
                            <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                              <img class="object-cover w-full h-full rounded-full" src={data.image} alt="" loading="lazy" />
                            </div>             
                                <div>
                                  <div >{data.org_name}</div>
                                  <div className="text-gray-500">{data.college}</div>
                                </div>
                            </div>
                            
                            </td>

                            <td >{data.category}</td>

                        </tr>
                    ))}

                </tbody>
            </table>

        </div>
    );
}
