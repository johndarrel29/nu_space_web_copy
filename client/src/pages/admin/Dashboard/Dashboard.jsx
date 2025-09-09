import { useState, useEffect } from 'react';
import { useDashboard, useAdminUser, useRSODetails } from '../../../hooks';
import { Button, Backdrop, CloseButton, ReportPage } from '../../../components'
import { FormatDate } from '../../../utils';
import { useUserStoreWithAuth } from '../../../store';
import defaultImage from '../../../assets/images/default-picture.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { DropIn } from "../../../animations/DropIn";

// map the data throughout the UI

// Static function to get RSO data
function getRSODataLabel() {
  return "RSO data";
}

export default function Dashboard() {
  const { isUserRSORepresentative, isUserAdmin, isCoordinator } = useUserStoreWithAuth();
  const navigate = useNavigate();
  const {
    adminDocs,
    isLoadingAdminDocs,
    isErrorAdminDocs,
    errorAdminDocs,

    accreditation,
    isLoadingAccreditation,
    isErrorAccreditation,
    errorAccreditation,

    activity,
    isLoadingActivity,
    isErrorActivity,
    errorActivity,

    createdActivities,
    isLoadingCreatedActivities,
    isErrorCreatedActivities,
    errorCreatedActivities,
  } = useDashboard();
  const [username, setUsername] = useState("");

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });


  console.log("Created Activities:", createdActivities);

  console.log(isUserRSORepresentative && "documents data ", {
    accreditation,
    activity,
  })

  const {
    rsoDetails,
    isRSODetailsLoading,
    isRSODetailsError,
    isRSODetailsSuccess,
  } = useRSODetails();

  const {
    // fetching admin profile
    adminProfile,
    isAdminProfileLoading,
    isAdminProfileError,
    adminProfileError,
    refetchAdminProfile,
    isAdminProfileRefetching,
  } = useAdminUser();

  console.log("admin Profile:", adminProfile)
  console.log("RSO Details:", rsoDetails?.rso?.RSO_name)

  useEffect(() => {
    if (isUserRSORepresentative) {
      setUsername(rsoDetails?.rso?.RSO_name || "RSO User");
    } else {
      setUsername(adminProfile?.user?.firstName || "Admin User");
    }
  }, [isUserRSORepresentative, adminProfile, rsoDetails]);

  // Extract dashboard stats from adminDocs if available
  const dashboardStats = adminDocs?.dashboard;

  // Compute stats for ReportPage, fallback to 0 for all fields
  const stats = {
    totalDocuments: isUserRSORepresentative
      ? accreditation?.documents?.totalDocuments ?? 0
      : dashboardStats?.totalDocuments ?? 0,
    pendingApproval: isUserRSORepresentative
      ? accreditation?.documents?.pendingApproval ?? 0
      : dashboardStats?.totalPendingDocuments ?? 0,
    recentlyApproved: isUserRSORepresentative
      ? accreditation?.documents?.rejectedDocuments ?? 0
      : dashboardStats?.recentlyApprovedDocuments ?? 0,
    documentsByType: {
      activities: isUserRSORepresentative
        ? activity?.data?.allPreDocs ?? 0
        : dashboardStats?.documentsByType?.activities ?? 0,
      recognition: isUserRSORepresentative
        ? activity?.data?.allPostDocs ?? 0
        : dashboardStats?.documentsByType?.recognition ?? 0,
      renewal: isUserRSORepresentative
        ? activity?.data?.renewal ?? 0
        : dashboardStats?.documentsByType?.renewal ?? 0,
      other: isUserRSORepresentative
        ? activity?.data?.other ?? 0
        : dashboardStats?.documentsByType?.other ?? 0,
    },
    documentsByStatus: {
      approved: isUserRSORepresentative
        ? activity?.data?.approvedDocuments ?? 0
        : dashboardStats?.approvedDocuments ?? 0,
      pending: isUserRSORepresentative
        ? activity?.data?.pendingDocuments ?? 0
        : dashboardStats?.pendingDocuments ?? 0,
      rejected: isUserRSORepresentative
        ? activity?.data?.rejectedDocuments ?? 0
        : dashboardStats?.rejectedDocuments ?? 0,
    },
    recentActivity: isUserRSORepresentative
      ? createdActivities?.activities?.map((activity) => ({
        id: activity._id,
        title: activity.Activity_name,
        status: activity.status || activity.document_status,
        date: activity.updatedAt,
      })) ?? []
      : dashboardStats?.documentList?.map((doc) => ({
        id: doc._id,
        title: doc.title,
        status: doc.document_status,
        date: doc.updatedAt,
      })) ?? [],
  };

  // Map stats fields to their paired UI titles/labels
  const statsTitle = {
    totalDocuments: isUserRSORepresentative
      ? "Total Accreditation Documents"
      : "Total Documents",
    pendingApproval: isUserRSORepresentative
      ? "Pending Accreditation Documents"
      : "Pending Approval",
    recentlyApproved: isUserRSORepresentative
      ? "Rejected Accreditation Documents"
      : "Recently Approved",
    documentsByType: {
      activities: isUserRSORepresentative
        ? "Pre Documents"
        : "Activities",
      recognition: isUserRSORepresentative
        ? "Post Documents"
        : "Recognition",
      renewal: "Renewal",
      other: "Other",
    },
    documentsByStatus: {
      approved: "approved",
      pending: "pending",
      rejected: "rejected",
    },
    recentActivity: isUserRSORepresentative
      ? "Created Activities"
      : "Recent Activity",
  };

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

  // Modal state for Generate Report
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isReportModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isReportModalOpen]);

  return (
    <div className="w-full p-4 bg-white min-h-screen">
      {/* Page title */}
      <div className="mb-6">
        <h1 className='text-xl'>
          Hello, <span className='font-bold text-primary'>{username || "User"}</span>
        </h1>
      </div>

      {/* Top stats row - 3 equal columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Total Documents */}
        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">
              {isUserRSORepresentative ? "Total Accreditation Documents" : "Total Documents"}
            </span>
            <span className="text-3xl font-bold mt-2">
              {isUserRSORepresentative
                ? accreditation?.documents?.totalDocuments ?? "0"
                : dashboardStats?.totalDocuments ?? "0"}
            </span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">
              {isUserRSORepresentative ? "Pending Accreditation Documents" : "Pending Approval"}
            </span>
            <span className="text-3xl font-bold mt-2">
              {isUserRSORepresentative
                ? accreditation?.documents?.pendingDocuments ?? "0"
                : dashboardStats?.totalPendingDocuments ?? "0"}
            </span>
          </div>
        </div>

        {/* Recently Approved */}
        <div className="bg-white border border-blue-100 shadow-sm rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">
              {isUserRSORepresentative ? "Rejected Accreditation Documents" : "Recently Approved"}
            </span>
            <span className="text-3xl font-bold mt-2 text-green-600">
              {isUserRSORepresentative
                ? accreditation?.documents?.rejectedDocuments ?? "0"
                : dashboardStats?.recentlyApprovedDocuments ?? "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Main bento grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Documents by Type - Spans 2 columns */}
        <div className="bg-white border border-blue-100 shadow rounded-lg p-5 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">{isUserRSORepresentative ? "Activity Documents by Type" : "Documents by Type"}</h2>
          <div className='flex items-center gap-4'>
            {/* Activities */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex-1">
              <div className="text-xs capitalize">
                {isUserRSORepresentative ?
                  activity ? "Pre Documents" : "loading"
                  : dashboardStats?.documentsByType?.activities ? "Activities" : "loading"}
              </div>
              <div className="text-xl font-bold">
                {
                  isUserRSORepresentative ?
                    activity?.data?.allPreDocs ?? "0"
                    : dashboardStats?.documentsByType?.activities ?? "0"}
              </div>
            </div>
            {/* Recognition */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex-1">
              <div className="text-xs capitalize">
                {isUserRSORepresentative ?
                  activity ? "Post Documents" : "loading"
                  : dashboardStats?.documentsByType?.recognition ? "Recognition" : "loading"}
              </div>
              <div className="text-xl font-bold">
                {isUserRSORepresentative ?
                  activity?.data?.allPostDocs ?? "0"
                  : dashboardStats?.documentsByType?.recognition ?? "0"}
              </div>
            </div>
          </div>
        </div>
        {/* Documents by Status - Vertical stacked */}
        <div className="bg-white border border-blue-100 shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">{isUserRSORepresentative ? "Activity Documents" : "Documents by Status"}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="capitalize text-gray-600">approved</span>
              <span className="font-semibold text-green-700">
                {
                  isUserRSORepresentative ? activity?.data?.approvedDocuments ?? "0" :
                    dashboardStats?.approvedDocuments ?? "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="capitalize text-gray-600">pending</span>
              <span className="font-semibold">
                {isUserRSORepresentative ? activity?.data?.pendingDocuments ?? "0" : dashboardStats?.pendingDocuments ?? "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="capitalize text-gray-600">rejected</span>
              <span className="font-semibold text-red-700">
                {isUserRSORepresentative ? activity?.data?.rejectedDocuments ?? "0" : dashboardStats?.rejectedDocuments ?? "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity - Spans full width on smaller screens, 2 columns on larger */}
        <div className="bg-white border border-blue-100 shadow rounded-lg p-5 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {!isUserRSORepresentative && (
              dashboardStats?.documentList?.length > 0 ? (
                dashboardStats.documentList.map((activity) => (
                  <div key={activity._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{activity.title}</span>
                      <span className="text-xs text-gray-500">{FormatDate(activity.updatedAt)}</span>
                    </div>
                    {getStatusBadge(activity.document_status)}
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400 text-sm">No recent activity.</span>
                </div>
              )
            )}

            {isUserRSORepresentative && (
              createdActivities?.activities?.length > 0 ? (
                createdActivities.activities.map((activity) => (
                  <div key={activity._id} className="flex justify-start items-center border-b border-gray-100 pb-2 px-4 gap-4 hover:bg-blue-50 rounded transition-colors">
                    <img
                      src={activity.imageUrl || defaultImage}
                      alt={activity.Activity_name}
                      className="w-12 h-12 object-cover rounded-md border border-blue-100 bg-gray-100"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{activity.Activity_name}</span>
                      <span className="text-xs text-gray-500">{FormatDate(activity.updatedAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-400 text-sm">No created activities.</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-blue-100 shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2 w-full">
            <Button onClick={() => setIsReportModalOpen(true)}>
              Generate Report
            </Button>
            {isUserRSORepresentative && (
              <Button style={"secondary"} onClick={() => navigate('/documents')}>
                Upload Document
              </Button>
            )}
            {(isUserAdmin && isCoordinator) && (
              <Button style={"secondary"} onClick={() => navigate('/admin-documents/templates')}>
                Create Template
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {isReportModalOpen && (
        <>
          <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" />
          <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center">
            <motion.div
              className="bg-white rounded-lg p-0 w-full max-w-2xl shadow-lg flex flex-col"
              style={{ minHeight: 300 }}
              variants={DropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header: spans full width */}
              <div className='flex justify-between items-center px-8 pt-8 pb-4 border-b border-gray-100'>
                <h2 className="text-lg font-medium text-[#312895]">
                  Generate Report
                </h2>
                <CloseButton onClick={() => setIsReportModalOpen(false)} />
              </div>
              {/* Static Content */}
              <div
                className="px-8 py-8 mx-auto w-full overflow-y-auto"
                style={{
                  maxWidth: '794px', // A4 width in px at 96dpi
                  minHeight: '400px',
                  width: '100%',
                  maxHeight: '60vh',
                }}
              >
                <div className="space-y-4">
                  <ReportPage
                    reference={contentRef}
                    reportTitle={isUserRSORepresentative ? rsoDetails?.rso?.RSO_name : "SDAO Report"}
                    dashboardData={stats}
                  />
                </div>
              </div>
              {/* Actions, always visible at bottom */}
              <div className="w-full flex flex-col md:flex-row justify-end items-stretch px-8 py-6 gap-3 border-t border-gray-100 bg-white">
                <Button
                  onClick={() => setIsReportModalOpen(false)}
                  style="secondary"
                >
                  Close
                </Button>
                <Button
                  onClick={reactToPrintFn}
                  className="px-6 bg-[#312895] hover:bg-[#312895]/90 text-white"
                >
                  Generate
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

