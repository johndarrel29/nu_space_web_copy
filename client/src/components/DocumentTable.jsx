
import React, { useState, useEffect } from "react";


export default function DocumentTable({category}) {
    const [data, setData] = useState([]);

        //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

        // Filter data based on category
        const filteredData = category === "All" 
        ? data 
        : data.filter(item => item.category === category);

    const records = filteredData.slice(indexOfFirstPost, indexOfLastPost);


    const npage = Math.ceil(filteredData.length / postsPerPage);


    function prePage() {
        if (currentPage !== 1) {
          setCurrentPage(currentPage - 1);
        }
      }
      
      function nextPage() {
        if (currentPage !== npage) {
          setCurrentPage(currentPage + 1);
        } else {
          setCurrentPage(npage);
        }
      }

   useEffect(() => {
       fetch("/data/RSO_DATA.json")
         .then((response) => response.json())
         .then((json) => setData(json))
         .catch((error) => console.error("Error loading data:", error));
     }, []); 

     

    return (
      //table
        <div className="overflow-x-auto p-10  ">
            <table className="table-auto w-full pr-50 border-collapse ">
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700   cursor-pointer">
                    {records.map((data, index) => (

                        <tr key={index} className=" rounded-lg hover:bg-gray-100 ">
                            <td className="px-4 py-3 "> 
                            <div className="flex items-center">
                            <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                              <img class="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
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
            
            {/* Pagination */}
            <div className='bg-red  w-full fixed bottom-10'>
            <nav>
              <ul className="flex justify-center">
                <li className={ `page-item mx-1 px-3 py-2 bg-gray-200 font-semibold rounded ${ currentPage === 1 || npage === 0  ? "text-gray-400" : " text-gray-800 "}`}>
                    <button className='page-link' 
                    onClick={prePage}>Prev</button>
                </li>

                <div className="px-4 py-2 font-semibold">
                {npage > 0 ? `${currentPage} of ${npage}` : "0 of 0"}
                </div>
                                
                <li className={ `page-item mx-1 px-3 py-2 bg-gray-200 font-semibold rounded ${ currentPage === npage || npage === 0  ? "text-gray-400" : " text-gray-800"}`}>
                    <button className='page-link '
                    onClick={nextPage}>Next</button>
                </li>

                
              </ul>
              
            </nav>  
          </div>
        </div>
    );
}
