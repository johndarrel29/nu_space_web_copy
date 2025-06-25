import React, { useState, useCallback } from "react";
import { ReusableDropdown, Searchbar } from "../ui";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import Badge from "../ui/Badge"
import { CardSkeleton } from '../../components';
import { useActivities } from "../../hooks";

export default function ReusableTable({
    columnNumber,
    tableHeading,
    tableRow,
    options,
    value,
    onChange,
    showAllOption,
    onActionClick,
    onClick,
    children,
    placeholder,
    error,
    isLoading,
    onDocumentClick,
    activityId = null, // Default to null if not provided
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [showSearch, setShowSearch] = useState(false);
    const { deleteActivityDoc } = useActivities();

    console.log("loading", isLoading);
    console.log("error", error);

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;

    const filteredRows = tableRow.filter((row) => {
        return Object.values(row).some((value) => {
            if (typeof value === "string") {
                return value.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (typeof value === "number") {
                return value.toString().includes(searchQuery.toLowerCase());
            }
            return false;
        });
    });

    const handleDelete = (activityId, documentId) => {
        if (activityId && documentId) {
            console.log("passing id: ", activityId, " and doc id ", documentId);
            deleteActivityDoc({ activityId, documentId });
        } else {
            console.error("Activity ID or Document ID is missing");
        }

    }

    const handleBadge = (badge) => {
        if (badge === "pending") {
            return <Badge style="primary" text={"Pending"} />
        }
        if (badge === "Approved") {
            return <Badge style="success" text={"Approved"} />
        }
        if (badge === "Rejected") {
            return <Badge style="error" text={"Rejected"} />
        }
    }

    const currentPosts = filteredRows.slice(firstPostIndex, lastPostIndex);

    const pages = Array.from({ length: Math.ceil(filteredRows.length / postsPerPage) }, (_, i) => i + 1);

    const currentPageHandler = (selectedPage) => {
        if (selectedPage < 1 || selectedPage > pages.length) return; // Prevent going out of bounds
        setCurrentPage(selectedPage);
    }
    console.log("searchQUery", searchQuery);

    const handlePostsPerPageChange = (event) => {
        const value = event.target.value;
        setPostsPerPage(value); // Reset to the first page when changing posts per page
    }

    return (
        <>
            {/* searchbar and dropdown */}
            <div className="mt-4 mb-4 w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
                <div className="w-full lg:w-full md:w-full">
                    <Searchbar placeholder={placeholder || "Search an organization"} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
                <div className="w-full mt-4 md:mt-0 lg:w-1/2 md:w-full">
                    <ReusableDropdown
                        icon={true}
                        options={options}
                        showAllOption={showAllOption}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 w-full">
                <span className="text-gray-700 font-semibold">
                    Showing {filteredRows.length > 0 ? filteredRows.length : "0"} results
                </span>
                <li className="flex justify-center ">
                    <select
                        className={`w-24 h-10 rounded-md bg-white border border-mid-gray p-1 font-bold`}
                        value={postsPerPage}
                        onChange={handlePostsPerPageChange}
                    >
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                    </select>
                </li>
            </div>

            {/* children */}
            {children ? (
                <div className="flex justify-center mb-4">
                    {children}
                </div>
            ) :
                error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg flex flex-col items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-red-500 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-red-500 font-medium text-center max-w-md px-4">
                            {error}
                        </p>
                    </div>
                )
                    :
                    (
                        <div className="border border-mid-gray rounded-md">
                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="w-full flex justify-center">
                                        <CardSkeleton></CardSkeleton>
                                    </div>
                                )
                                    :
                                    (
                                        <table className="w-full min-w-[800px]">
                                            <thead className="border-b border-mid-gray bg-textfield ">
                                                <tr
                                                    className="rounded-md text-left text-xs font-medium font-bold uppercase tracking-wider ">
                                                    {tableHeading.slice(0, columnNumber).map((heading, index) => (
                                                        <th key={`header-${index}-${heading.key || heading.name}`} className="text-left p-3">
                                                            <h1 className="text-gray-900 dark:text-white">{heading.name}</h1>
                                                        </th>
                                                    ))}
                                                </tr>

                                            </thead>


                                            <tbody>
                                                {currentPosts.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={columnNumber} className="p-3 text-center">
                                                            <div className="text-gray-500">
                                                                No results found
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    currentPosts.map((row, index) => (
                                                        <tr
                                                            key={row.id}
                                                            onClick={() => onClick(row)}
                                                            className="border-b border-mid-gray hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">

                                                            {tableHeading.slice(0, columnNumber).map((heading) => (
                                                                <td key={heading.id} className="p-3">

                                                                    {
                                                                        ["title", "status", "submittedBy", "createdAt", "actions"].includes(heading.key)
                                                                            ? (
                                                                                <>
                                                                                    <div className="py-0">
                                                                                        {heading.key === "title" && (
                                                                                            <div className="flex items-center space-x-3">
                                                                                                <div className="text-sm font-medium text-gray-900">{firstPostIndex + index + 1}</div>
                                                                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.title}</span>
                                                                                            </div>
                                                                                        )}
                                                                                        {heading.key === "status" && (
                                                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{handleBadge(row.status)}</span>
                                                                                        )}
                                                                                        {heading.key === "submittedBy" && (
                                                                                            <span className="font-light text-gray-600 dark:text-white flex items-center text-xs ">{row.submittedBy}</span>
                                                                                        )}
                                                                                        {heading.key === "createdAt" && (
                                                                                            <span className="text-sm font-light text-gray-600 dark:text-white flex items-center ">{row.createdAt}</span>
                                                                                        )}
                                                                                        {heading.key === "actions" && (
                                                                                            <div
                                                                                                onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    handleDelete(activityId, row.id);
                                                                                                }
                                                                                                }
                                                                                                className="rounded-full w-8 h-8 bg-white flex justify-center items-center cursor-pointer group">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-600 size-4 group-hover:fill-off-black" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                </>
                                                                            ) : ["RSO_name", "RSO_College", "picture"].includes(heading.key)
                                                                                ? (
                                                                                    // Grouping these in one <td> with custom layout
                                                                                    <div className="flex items-center space-x-3">
                                                                                        <div className="text-sm font-medium text-gray-900">{firstPostIndex + index + 1}</div>
                                                                                        {/* If it's the name column and image exists, show it */}
                                                                                        {heading.key === "RSO_name" && (
                                                                                            <img
                                                                                                src={
                                                                                                    row.picture &&
                                                                                                        !row.picture.includes("example.com")
                                                                                                        // && 
                                                                                                        // row.picture.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) // Check if it's an image URL
                                                                                                        ? row.picture
                                                                                                        : DefaultPicture
                                                                                                }
                                                                                                alt={row.RSO_name}
                                                                                                className="w-10 h-10 rounded-full object-cover"
                                                                                                onError={(e) => {
                                                                                                    e.target.src = DefaultPicture; // Fallback if image fails to load
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                        <div className="flex flex-col">
                                                                                            {heading.key === "RSO_name" && (
                                                                                                <>
                                                                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.RSO_name}</span>
                                                                                                    <span className="text-xs text-gray-500">{row.RSO_College}</span>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    // typeof row[heading.key] === 'string' && row[heading.key].match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                                                                                    //     <img src={row[heading.key] || row.RSO_picture} alt="table content" className="w-12 h-12 object-cover rounded-full" />
                                                                                    //     ) : 
                                                                                    (
                                                                                        <p className="text-gray-900 dark:text-white">{row[heading.key]}</p>
                                                                                    )
                                                                                )
                                                                    }
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    )))}
                                            </tbody>
                                        </table>
                                    )
                                }
                            </div>
                        </div>
                    )}


            {/* pagination */}
            <div className='w-full bottom-20 mt-4'>
                <nav>
                    <ul className="flex justify-center space-x-2">

                        <li className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded`}>
                            <button className='page-link' onClick={() => currentPageHandler(currentPage - 1)}>Prev</button>
                        </li>
                        <div className="px-4 py-2 font-semibold">
                            {pages.length > 0 ? `${currentPage} of ${pages.length}` : "0 of 0"}
                        </div>
                        <li className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded`}>
                            <button className='page-link' onClick={() => currentPageHandler(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}