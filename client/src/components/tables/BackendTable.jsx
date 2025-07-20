import React from "react";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import Badge from "../ui/Badge";
import { useDocumentManagement } from "../../hooks";
import { FormatDate } from "../../utils";
import { Searchbar, ReusableDropdown } from "../../components";

// make table design reusable
// make parameter and metadata logic for the table
// add loading and error states for the table

export default function BackendTable() {
    const {
        allDocuments,
        allDocumentsLoading,
        allDocumentsError,
        allDocumentsQueryError,
        refetchAllDocuments,
    } = useDocumentManagement();

    console.log("allDocuments", allDocuments);

    // Table headings for document management
    const tableHeading = [
        { key: "name", name: "Document Name" },
        { key: "purpose", name: "Purpose" },
        { key: "status", name: "Status" },
        { key: "date", name: "Date Created" },
        { key: "actions", name: "Actions" }
    ];

    // Badge renderer for document status
    const handleBadge = (badge) => {
        if (badge === "pending") {
            return <Badge style="primary" text={"Pending"} />;
        }
        if (badge === "Approved") {
            return <Badge style="success" text={"Approved"} />;
        }
        if (badge === "Rejected") {
            return <Badge style="error" text={"Rejected"} />;
        }
        return <Badge style="primary" text={badge || "Unknown"} />;
    };

    return (
        <div className="p-4">
            {/* Filters Section */}
            <div className="mt-4 mb-4 w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
                {/* <div className="w-full lg:w-full md:w-full">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search an organization"
                            className="w-full p-2 pl-10 border border-mid-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </div>
                </div> */}
                <div className="w-full justify-between flex flex-col md:flex-row items-center gap-2">
                    <div className="w-full">
                        <Searchbar placeholder={"Search documents..."}></Searchbar>
                    </div>
                    <div className="w-full mt-4 md:mt-0 lg:w-1/2 md:w-full">
                        <ReusableDropdown options={["All Organizations", "Approved", "Pending", "Rejected"]} />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4 w-full">
                <span className="text-gray-700 font-semibold">
                    Showing {allDocuments?.signedDocuments.length} results
                </span>
                <li className="flex justify-center ">
                    <select
                        className={`w-24 h-10 rounded-md bg-white border border-mid-gray p-1 font-bold`}
                    >
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                    </select>
                </li>
            </div>

            {/* Table Section */}
            <div className="border border-mid-gray rounded-md">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="border-b border-mid-gray bg-textfield ">
                            <tr className="rounded-md text-left text-xs font-medium font-bold uppercase tracking-wider ">
                                {tableHeading.map((heading, index) => (
                                    <th
                                        key={`header-${index}-${heading.key || heading.name}`}
                                        className="text-left p-3"
                                    >
                                        <h1 className="text-gray-900 dark:text-white">
                                            {heading.name}
                                        </h1>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {allDocuments?.signedDocuments?.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-mid-gray hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    {/* Organization Name with Image */}
                                    <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {row.title}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* College */}
                                    <td className="p-3">
                                        <span className="text-sm text-gray-600 dark:text-white">
                                            {row.purpose || "N/A"}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {handleBadge(row.status)}
                                        </span>
                                    </td>

                                    {/* Date Created */}
                                    <td className="p-3">
                                        <span className="text-sm font-light text-gray-600 dark:text-white flex items-center ">
                                            {FormatDate(row.updatedAt)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3">
                                        <div className="rounded-full w-8 h-8 bg-white flex justify-center items-center cursor-pointer group">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="fill-gray-600 size-4 group-hover:fill-off-black"
                                                viewBox="0 0 448 512"
                                            >
                                                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="w-full bottom-20 mt-4">
                <nav>
                    <ul className="flex justify-center space-x-2">
                        <li
                            className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded`}
                        >
                            <button className="page-link">Prev</button>
                        </li>
                        <div className="px-4 py-2 font-semibold">1 of 1</div>
                        <li
                            className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded`}
                        >
                            <button className="page-link">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}