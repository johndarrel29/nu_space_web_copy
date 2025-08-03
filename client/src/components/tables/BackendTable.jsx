import Badge from "../ui/Badge";
import { useDocumentManagement } from "../../hooks";
import { FormatDate } from "../../utils";
import { Searchbar, ReusableDropdown, DropdownSearch } from "../../components";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// data not showng on coordinator UI


// goal:
// make table design reusable
// make parameter and metadata logic for the table
// add loading and error states for the table

// Next steps:
// fix the loading to show a skeleton loader
// debounce the search input to avoid too many API calls


// dropdownsearch currently doesnt filter because submittedBy model returns null 
// therefore, this component couldnt search the RSO

export default function BackendTable({ activeTab }) {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        purpose: "",
        status: "",
        rso: "",
        startDate: "",
        endDate: "",
        search: ""
    });
    const {
        allDocuments,
        allDocumentsLoading,
        allDocumentsError,
        allDocumentsQueryError,
        refetchAllDocuments,
    } = useDocumentManagement(filters);

    // refetch all documents when filters change
    useEffect(() => {
        if (Object.values(filters).some(value => value !== "")) {
            refetchAllDocuments();
        }
    }, [filters, refetchAllDocuments]);

    console.log("allDocuments", allDocuments);

    // Remove the state setting from useMemo
    const documentType = useMemo(() => {
        if (activeTab === "All") {
            return "";
        } else if (activeTab === "General Documents") {
            return "recognition";
        } else if (activeTab === "Activity Documents") {
            return "activities";
        }
        return "";
    }, [activeTab]);

    // Add a separate useEffect for setting the filters
    useEffect(() => {
        if (activeTab === 0 || activeTab === "All") {
            setFilters((prev) => ({
                ...prev,
                purpose: "",
                status: "",
                rso: "",
                startDate: "",
                endDate: "",
                search: ""
            }));
        } else if (activeTab === 1 || activeTab === "General Documents") {
            setFilters((prev) => ({
                ...prev,
                purpose: "recognition",
                page: 1
            }));
        } else if (activeTab === 2 || activeTab === "Activity Documents") {
            setFilters((prev) => ({
                ...prev,
                purpose: "activities",
                page: 1
            }));
        }
    }, [activeTab]);
    console.log("activeTab", activeTab);

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

    const handleSorted = (value) => {
        console.log("Selected Sort Option:", value);
        let statusValue = "";
        if (value === "Approved") statusValue = "approved";
        else if (value === "Pending") statusValue = "pending";
        else if (value === "Rejected") statusValue = "rejected";

        setFilters((prev) => ({
            ...prev,
            status: statusValue,
            page: 1 // Reset to first page on sort change
        }));
    };

    const handleNextPage = (newPage) => {
        if (filters.page < allDocuments.pagination.totalPages) {
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = (newPage) => {
        if (filters.page > 1) {
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleSearch = (value) => {
        setFilters((prev) => ({ ...prev, search: value }));
        console.log("Search value:", value);
    };

    const handleRSO = (value) => {
        setFilters((prev) => ({ ...prev, rso: value, page: 1 }));
        console.log("Selected RSO:", value);
    };


    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery]);

    return (
        <div className="p-4">
            {/* Filters Section */}
            <div className="mt-4 mb-4 w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">

                <div className="w-full justify-between flex flex-col md:flex-row items-center gap-2">
                    <div className="w-full">
                        <Searchbar
                            onChange={handleSearch}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder={"Search documents..."} ></Searchbar>
                    </div>
                    <div className="w-full mt-4 md:mt-0 lg:w-1/2 md:w-full">

                        <DropdownSearch
                            isSorting={true}
                            setSelectedSorting={handleRSO}
                            setSelectedCategory={() => console.log("Category selected")}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4 w-full gap-4">
                <div className="w-full">
                    <ReusableDropdown
                        onChange={(e) => handleSorted(e.target.value)}
                        options={["All Organizations", "Approved", "Pending", "Rejected"]}
                    />
                </div>
                <input
                    type="date"
                    className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                    value={filters.startDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value, page: 1 }))}
                    placeholder="Start Date"
                ></input>
                <input
                    type="date"
                    className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                    value={filters.endDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value, page: 1 }))}
                    placeholder="End Date"
                ></input>
            </div>

            <div className="flex justify-between items-center mb-4 w-full">
                <span className="text-gray-700 font-semibold">
                    Showing {allDocuments?.signedDocuments.length} results
                </span>
                <li className="flex justify-center ">
                    <select
                        value={filters.limit}
                        onChange={(e) => setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                        className={`w-24 h-10 rounded-md bg-white border border-mid-gray p-1 font-bold`}
                    >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                    </select>
                </li>
            </div>

            {/* Table Section */}
            {allDocumentsLoading && (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                </div>
            )}

            <div className="border border-mid-gray rounded-md">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="border-b border-mid-gray bg-textfield ">
                            <tr
                                className="rounded-md text-left text-xs font-medium font-bold uppercase tracking-wider ">
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
                                    onClick={() => navigate(`:documentId`, { state: { documentId: row.id } })}
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
                            <button className="page-link" onClick={handlePrevPage} disabled={filters.page === 1}>Prev</button>
                        </li>
                        {console.log("metadata", allDocuments?.pagination)}
                        <div className="px-4 py-2 font-semibold" >{`${filters.page} of ${allDocuments?.pagination?.totalPages}`}</div>
                        <li
                            className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded`}
                        >
                            <button className="page-link" onClick={handleNextPage} disabled={filters.page === allDocuments?.pagination?.totalPages}>Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}