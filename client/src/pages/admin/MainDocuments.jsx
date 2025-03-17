import React, { useState } from "react";
import { MainLayout, Searchbar, DocumentTable } from "../../components";
import { Link } from "react-router-dom";

export default function MainDocuments() {
    const [toggle, setToggle] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggle = (index) => {
        setToggle(index);
    }

    return (
        <>              
            <div className=" md:w-full bg-card-bg p-6 rounded-lg shadow-md">
                <div className="w-1/2">
                    <Searchbar placeholder="Search an Organization"  searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>   
                </div>                       
            </div>            
                {/* Tab content*/}
                <div className="mt-6 bg-card-bg rounded-lg shadow-md">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 cursor-pointer">
                        <li className="me-2">
                            <Link  onClick={() => handleToggle(1)} className={toggle === 1 ? "inline-flex items-center justify-center p-4 text-[#314095] border-b-2 border-[#314095] rounded-t-lg active" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                    All
                            </Link>
                        </li>
                            <li className="me-2"> {/* Active:  text-blue-600 border-b-2 border-blue-600  fill="currentColor"*/}
                            <Link  onClick={() => handleToggle(2)} className={toggle === 2 ? "inline-flex items-center justify-center p-4 text-[#314095] border-b-2 border-[#314095] rounded-t-lg active" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"} aria-current="page">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor" viewBox="0 0 384 512"><path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/>
                            </svg>
                                Probationary
                            </Link>
                        </li>
                        <li className="me-2">
                            <Link  onClick={() => handleToggle(3)} className={toggle === 3 ? "inline-flex items-center justify-center p-4 text-[#314095] border-b-2 border-[#314095] rounded-t-lg active" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                            <svg className="w-4 h-4 me-2  dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/>
                                </svg>Professional
                            </Link>
                        </li>
                        <li className="me-2">
                            <Link  onClick={() => handleToggle(4)} className={toggle === 4 ? "inline-flex items-center justify-center p-4 text-[#314095] border-b-2 border-[#314095] rounded-t-lg active" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                                <svg className="w-4 h-4 me-2  dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                                </svg>Professional & Affiliates
                            </Link>
                        </li>
                        <li className="me-2">
                            <Link  onClick={() => handleToggle(5)} className={toggle === 5 ? "inline-flex items-center justify-center p-4 text-[#314095] border-b-2 border-[#314095] rounded-t-lg active" : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                            </svg>
                                    Special Interest
                            </Link>
                        </li>
                    </ul>
                </div>
                    
                    {/* Matches the tab content with the selected tab */}
                    <div className="border border-mid-gray bg-white   rounded-lg">
                            {toggle === 1 &&   <DocumentTable category="All" searchQuery={searchQuery}/>}
                            {toggle === 2 &&   <DocumentTable category="Probationary" searchQuery={searchQuery}/>}
                            {toggle === 3 &&  <DocumentTable category="Professional" searchQuery={searchQuery}/>}
                            {toggle === 4 &&  <DocumentTable category="Professional & Affiliates"searchQuery={searchQuery} />}
                            {toggle === 5 &&  <DocumentTable category="Special Interest" searchQuery={searchQuery}/>}
                        </div>

        </>
    );
    }