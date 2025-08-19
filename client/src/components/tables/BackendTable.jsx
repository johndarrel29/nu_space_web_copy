import Badge from "../ui/Badge";
import { useAdminDocuments, useCoordinatorDocuments, useAVPDocuments, useDirectorDocuments, useAdminAcademicYears } from "../../hooks";
import { FormatDate } from "../../utils";
import { Searchbar, ReusableDropdown, DropdownSearch } from "../../components";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStoreWithAuth } from '../../store';
import { CardSkeleton } from '../../components';

// TODO: Add loading and error states for the table
// TODO: Fix the loading to show a skeleton loader
// TODO: Debounce the search input to avoid too many API calls
// NOTE: dropdownsearch currently doesn't filter because submittedBy model returns null

export default function BackendTable({ activeTab }) {
    const navigate = useNavigate();
    const { isUserAdmin, isCoordinator, isDirector, isAVP } = useUserStoreWithAuth();

    // State
    const [searchQuery, setSearchQuery] = useState("");
    const [tableData, setTableData] = useState([]);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        purpose: "",
        status: "",
        rso: "",
        startDate: "",
        endDate: "",
        search: "",
        academicYear: ""
    });

    // Academic years data
    const {
        academicYears,
        academicYearsLoading,
        academicYearsError,
        academicYearsErrorMessage,
        refetchAcademicYears,
        isRefetchingAcademicYears,
        isAcademicYearsFetched,
    } = useAdminAcademicYears();

    // Documents data
    const { avpDocuments } = useAVPDocuments();
    const { directorDocuments } = useDirectorDocuments();
    const {
        coordinatorDocuments,
        documentsLoading,
        documentsError,
        documentsErrorMessage,
        refetchDocuments,
        isRefetchingDocuments,
        isDocumentsFetched,
    } = useCoordinatorDocuments();

    const {
        allDocuments,
        allDocumentsLoading,
        allDocumentsError,
        allDocumentsQueryError,
        refetchAllDocuments,
    } = useAdminDocuments(filters);

    // Table headings
    const tableHeading = [
        { key: "name", name: "Document Name" },
        { key: "purpose", name: "Purpose" },
        { key: "status", name: "Status" },
        { key: "date", name: "Date Created" },
        { key: "actions", name: "Actions" }
    ];

    // Effects
    useEffect(() => {
        if (coordinatorDocuments && isCoordinator) {
            setTableData(coordinatorDocuments?.documents);
        } else if (allDocuments && isUserAdmin) {
            setTableData(allDocuments);
        } else if (avpDocuments && isAVP) {
            setTableData(avpDocuments?.documents);
            console.log("avp docs ", avpDocuments);
        } else if (directorDocuments && isDirector) {
            setTableData(directorDocuments);
        }
    }, [coordinatorDocuments, allDocuments, avpDocuments, directorDocuments]);

    useEffect(() => {
        if (Object.values(filters).some(value => value !== "")) {
            refetchAllDocuments();
        }
    }, [filters, refetchAllDocuments]);

    useEffect(() => {
        if (activeTab === 0 || activeTab === "All") {
            setFilters(prev => ({
                ...prev,
                purpose: "",
                status: "",
                rso: "",
                startDate: "",
                endDate: "",
                search: ""
            }));
        } else if (activeTab === 1 || activeTab === "General Documents") {
            setFilters(prev => ({
                ...prev,
                purpose: "recognition",
                page: 1
            }));
        } else if (activeTab === 2 || activeTab === "Activity Documents") {
            setFilters(prev => ({
                ...prev,
                purpose: "activities",
                page: 1
            }));
        }
    }, [activeTab]);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery]);

    // Memoized values
    const documentType = useMemo(() => {
        if (activeTab === "All") return "";
        if (activeTab === "General Documents") return "recognition";
        if (activeTab === "Activity Documents") return "activities";
        return "";
    }, [activeTab]);

    // Handlers
    const handleBadge = (badge) => {
        switch (badge) {
            case "pending":
                return <Badge style="primary" text="Pending" />;
            case "Approved":
                return <Badge style="success" text="Approved" />;
            case "Rejected":
                return <Badge style="error" text="Rejected" />;
            default:
                return <Badge style="primary" text={badge || "Unknown"} />;
        }
    };

    const handleSorted = (value) => {
        let statusValue = "";
        if (value === "Approved") statusValue = "approved";
        else if (value === "Pending") statusValue = "pending";
        else if (value === "Rejected") statusValue = "rejected";

        setFilters(prev => ({
            ...prev,
            status: statusValue,
            page: 1
        }));
    };

    const handleNextPage = () => {
        if (filters.page < tableData.pagination.totalPages) {
            setFilters(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (filters.page > 1) {
            setFilters(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    const handleRSO = (value) => {
        setFilters(prev => ({ ...prev, rso: value, page: 1 }));
    };

    const handleAcademicYear = (value) => {
        setFilters(prev => ({ ...prev, yearId: value, page: 1 }));
    };

    const handleRowClick = (row) => {
        navigate(`${row._id}`, {
            state: {
                documentId: row._id,
                documentTitle: row.title,
                documentSize: row.documentSize,
                documentType: row.purpose,
                url: row.url
            }
        });
    };

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
                            placeholder="Search documents..."
                        />
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
                <div className="w-full">
                    <ReusableDropdown
                        onChange={(e) => handleAcademicYear(e.target.value)}
                        options={academicYears?.years || []}
                        icon={true}
                        placeholder="Academic Year"
                    />
                </div>
                <input
                    type="date"
                    className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value, page: 1 }))}
                    placeholder="End Date"
                />
            </div>

            <div className="flex justify-between items-center mb-4 w-full">
                <span className="text-gray-700 font-semibold">
                    Showing {tableData?.signedDocuments ? tableData.signedDocuments.length : tableData?.length || 0} results
                </span>
                <li className="flex justify-center">
                    <select
                        value={filters.limit}
                        onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
                        className="w-24 h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                    >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                    </select>
                </li>
            </div>

            {/* Table Section */}
            {allDocumentsLoading ? (
                <CardSkeleton />
            ) : (
                <div className="border border-mid-gray rounded-md">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="border-b border-mid-gray bg-textfield">
                                <tr className="rounded-md text-left text-xs font-medium font-bold uppercase tracking-wider">
                                    {tableHeading.map((heading, index) => (
                                        <th
                                            key={`header-${index}-${heading.key || heading.name}`}
                                            className="text-left p-3"
                                        >
                                            <h1 className="text-gray-900">
                                                {heading.name}
                                            </h1>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {(tableData?.signedDocuments || tableData).length > 0 ? (
                                    (tableData?.signedDocuments || tableData).map((row, index) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => handleRowClick(row)}
                                            className="border-b border-mid-gray hover:bg-gray-100 cursor-pointer"
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {row.title}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-3">
                                                <span className="text-sm text-gray-600">
                                                    {row.purpose || "N/A"}
                                                </span>
                                            </td>

                                            <td className="p-3">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {handleBadge(row.status)}
                                                </span>
                                            </td>

                                            <td className="p-3">
                                                <span className="text-sm font-light text-gray-600 flex items-center">
                                                    {FormatDate(row.updatedAt)}
                                                </span>
                                            </td>

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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={tableHeading.length} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="mt-2 text-sm font-medium text-gray-500">No documents found</p>
                                                <p className="text-xs text-gray-400">Try adjusting your filters or search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="w-full bottom-20 mt-4">
                <nav>
                    <ul className="flex justify-center space-x-2">
                        <li className="page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded">
                            <button
                                className="page-link"
                                onClick={handlePrevPage}
                                disabled={filters.page === 1}
                            >
                                Prev
                            </button>
                        </li>
                        <div className="px-4 py-2 font-semibold">
                            {`${filters.page} of ${tableData?.pagination?.totalPages || 0}`}
                        </div>
                        <li className="page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded">
                            <button
                                className="page-link"
                                onClick={handleNextPage}
                                disabled={filters.page === tableData?.pagination?.totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}