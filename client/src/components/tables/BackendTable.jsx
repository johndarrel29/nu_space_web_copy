import Badge from "../ui/Badge";
import { useAdminDocuments, useCoordinatorDocuments, useAVPDocuments, useDirectorDocuments, useAdminAcademicYears } from "../../hooks";
import { FormatDate } from "../../utils";
import { Searchbar, ReusableDropdown, DropdownSearch } from "../../components";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStoreWithAuth } from '../../store';
import { CardSkeleton } from '../../components';

// TODO: Add loading and error states for the table
// TODO: Fix the loading to show a skeleton loader
// TODO: Debounce the search input to avoid too many API calls
// NOTE: dropdownsearch currently doesn't filter because submittedBy model returns null

export default function BackendTable({ activeTab, rsoId = "" }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isOnRSODetailsPage = location.pathname.includes("/rsos/rso-details");

    console.log("Is on RSO Details Page:", isOnRSODetailsPage ? "Yes" : "No");
    console.log("current active tab ", activeTab);

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
    const { avpDocuments } = useAVPDocuments(filters);
    const { directorDocuments } = useDirectorDocuments(filters);
    const {
        coordinatorDocuments,
        documentsLoading,
        documentsError,
        documentsErrorMessage,
        refetchDocuments,
        isRefetchingDocuments,
        isDocumentsFetched,
    } = useCoordinatorDocuments(filters);

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
    ];

    useEffect(() => {
        if (isOnRSODetailsPage) {
            setFilters(prev => ({
                ...prev,
                rsoId: rsoId, // Changed from rso to rsoId to match the property used in API calls
                purpose: "recognition",
                page: 1
            }));
            console.log("Setting RSO filter with ID:", rsoId); // Added logging to debug
        }
    }, [isOnRSODetailsPage, rsoId]);

    console.log("is avp? ", isAVP);

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
        if (activeTab === 0 || activeTab === "All" && !isOnRSODetailsPage) {
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
        } else if (activeTab === 2 || activeTab === "Activity Documents" && !isOnRSODetailsPage) {
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
            case "approved":
                return <Badge style="success" text="Approved" />;
            case "rejected":
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
        console.log("value to be stored in rsoId: ", value)
        setFilters(prev => ({ ...prev, rsoId: value, page: 1 }));
    };

    const handleAcademicYear = (value) => {
        console.log("value to be stored: ", value)
        setFilters(prev => ({ ...prev, yearId: value, page: 1 }));
    };

    const handleRowClick = (row) => {
        const route = isOnRSODetailsPage ? `/admin-documents/${row._id}` : `${row._id}`;
        navigate(route, {
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
                        <label htmlFor="document-search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Documents
                        </label>
                        <Searchbar
                            id="document-search"
                            onChange={handleSearch}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder="Search documents..."
                        />
                    </div>
                    {!isOnRSODetailsPage && (
                        <div className="w-full mt-4 md:mt-0 lg:w-1/2 md:w-full">
                            <label htmlFor="rso-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by RSO
                            </label>
                            <DropdownSearch
                                id="rso-filter"
                                isSorting={true}
                                setSelectedSorting={handleRSO}
                                setSelectedCategory={() => console.log("Category selected")}
                                valueType="id"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* more filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 w-full gap-4">
                <div className="w-full mb-2 md:mb-0">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Status Filter
                    </label>
                    <ReusableDropdown
                        id="status-filter"
                        onChange={(e) => handleSorted(e.target.value)}
                        options={["All Organizations", "Approved", "Pending", "Rejected"]}
                    />
                </div>
                {console.log("academic years:", academicYears?.years)}
                <div className="w-full mb-2 md:mb-0">
                    <label htmlFor="academic-year" className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year
                    </label>
                    <select
                        id="academic-year"
                        onChange={(e) => handleAcademicYear(e.target.value)}
                        className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                    >
                        <option value="">Select Academic Year</option>
                        {academicYears?.years?.map(year => (
                            <option
                                key={year._id}
                                value={year._id}
                            >
                                {year.label || "no data"}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-full mb-2 md:mb-0">
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        id="start-date"
                        type="date"
                        className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
                        placeholder="Start Date"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        id="end-date"
                        type="date"
                        className="w-full h-10 rounded-md bg-white border border-mid-gray p-1 font-bold"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value, page: 1 }))}
                        placeholder="End Date"
                    />
                </div>
            </div>
            {console.log("table data before render ", tableData)}
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
                            {console.log("table data ", tableData)}
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
                                                        <span className="text-md font-semibold text-gray-900">
                                                            {row.title}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            submitted by {row.submittedBy?.RSO_acronym || "N/A"}
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
                                                    {handleBadge(row.document_status)}
                                                </span>
                                            </td>

                                            <td className="p-3">
                                                {/* there's two dates: createdAt and updatedAt. clarify with darrel */}
                                                <span className="text-sm font-light text-gray-600 flex items-center">
                                                    {FormatDate(row.createdAt)}
                                                </span>
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