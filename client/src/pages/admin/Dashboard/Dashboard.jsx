import { useState } from 'react';

export default function Dashboard() {
  // Static mock data for document statistics
  const [stats] = useState({
    totalDocuments: 342,
    pendingApproval: 28,
    recentlyApproved: 47,
    documentsByType: {
      activities: 156,
      recognition: 89,
      renewal: 72,
      other: 25
    },
    documentsByStatus: {
      approved: 215,
      pending: 78,
      rejected: 49
    },
    recentActivity: [
      { id: 1, title: "Annual Report 2023", status: "approved", date: "2023-12-01" },
      { id: 2, title: "Budget Proposal", status: "pending", date: "2023-12-05" },
      { id: 3, title: "Event Documentation", status: "rejected", date: "2023-12-10" },
      { id: 4, title: "Club Recognition", status: "approved", date: "2023-12-12" },
      { id: 5, title: "Student Council Minutes", status: "pending", date: "2023-12-15" }
    ]
  });

  // Helper function for status badges
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-0.5 text-xs rounded-full";
    switch (status) {
      case "approved":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case "pending":
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Pending</span>;
      case "rejected":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  return (
    <div className="w-full p-4">
      {/* Page title */}
      <div className="mb-6">
        <p className="text-gray-600">Overview of all document activities and statistics</p>
      </div>

      {/* Top stats row - 3 equal columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Total Documents */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Total Documents</span>
            <span className="text-3xl font-bold mt-2">{stats.totalDocuments}</span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Pending Approval</span>
            <span className="text-3xl font-bold mt-2 text-blue-600">{stats.pendingApproval}</span>
          </div>
        </div>

        {/* Recently Approved */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Recently Approved</span>
            <span className="text-3xl font-bold mt-2 text-green-600">{stats.recentlyApproved}</span>
          </div>
        </div>
      </div>

      {/* Main bento grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Documents by Type - Spans 2 columns */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Documents by Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats.documentsByType).map(([type, count]) => (
              <div key={type} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="text-xs text-gray-500 capitalize">{type}</div>
                <div className="text-xl font-bold">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents by Status - Vertical stacked */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Documents by Status</h2>
          <div className="space-y-3">
            {Object.entries(stats.documentsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="capitalize text-gray-600">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity - Spans full width on smaller screens, 2 columns on larger */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div className="flex flex-col">
                  <span className="font-medium">{activity.title}</span>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
                {getStatusBadge(activity.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
              Upload Document
            </button>
            <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Create Template
            </button>
            <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row - Wide rectangle for document timeline */}
      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-4">Monthly Document Activity</h2>
        <div className="h-52 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
          <span className="text-gray-400">Chart Placeholder - Monthly Document Statistics</span>
        </div>
      </div>
    </div>
  );
}
