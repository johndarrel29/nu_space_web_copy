import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCentralizedForms } from '../../../hooks'

export default function Forms() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    const {
        allForms,
        isLoadingAllForms,
        isRefetchingAllForms,
        errorAllForms
    } = useAdminCentralizedForms();

    // Sample data - this would typically come from an API
    const sampleForms = [
        { id: 1, title: "RSO Registration Form", category: "Registration", createdAt: "2023-12-10", status: "Published" },
        { id: 2, title: "Event Request Form", category: "Events", createdAt: "2023-11-25", status: "Published" },
        { id: 3, title: "Budget Request Form", category: "Finance", createdAt: "2024-01-05", status: "Draft" },
        { id: 4, title: "Activity Evaluation Form", category: "Assessment", createdAt: "2023-10-15", status: "Published" },
        { id: 5, title: "Officer Information Form", category: "Registration", createdAt: "2024-02-01", status: "Draft" },
        { id: 6, title: "Facilities Reservation Form", category: "Logistics", createdAt: "2024-01-20", status: "Published" },
    ];

    useEffect(() => {
        if (allForms) {
            console.log("All centralized forms:", allForms);
        } else if (!isLoadingAllForms && !isRefetchingAllForms) {
            console.log("No centralized forms available.");
        }

        if (errorAllForms) {
            console.error("Error fetching centralized forms:", errorAllForms);
        }
    }, [allForms, isLoadingAllForms, isRefetchingAllForms, errorAllForms]);

    // Filter forms based on search query and filter type
    const filteredForms = sampleForms.filter(form => {
        const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || form.category === filterType;
        return matchesSearch && matchesFilter;
    });

    // Categories for filtering
    const categories = ['all', 'Registration', 'Events', 'Finance', 'Assessment', 'Logistics'];

    return (
        <div className="p-6">
            {/* Header with Create Form button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Forms Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage forms for your organization</p>
                </div>
                <button
                    onClick={() => navigate('/forms-builder')}
                    className="mt-4 md:mt-0 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Form
                </button>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Forms</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search for forms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 block w-full rounded-md border-gray-300 border p-2 focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/4">
                        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                        <select
                            id="filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="block w-full rounded-md border-gray-300 border p-2 focus:border-primary focus:ring-primary"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {filteredForms.map(form => (
                    <div key={form.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{form.title}</h3>
                                    <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {form.category}
                                    </span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${form.status === 'Published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {form.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-4">Created on: {form.createdAt}</p>
                            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => navigate(`/form-viewer?id=${form.id}`)}
                                    className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/forms-builder?edit=${form.id}`)}
                                    className="text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    className="text-gray-400 hover:text-gray-700 font-medium text-sm flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredForms.length === 0 && (
                <div className="bg-white rounded-lg shadow p-10 text-center">
                    <div className="mx-auto h-20 w-20 text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No forms found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                    <button
                        onClick={() => navigate('/forms-builder')}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Your First Form
                    </button>
                </div>
            )}
        </div>
    );
}