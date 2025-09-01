import { useState, useEffect, useCallback } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import useTokenStore from "../store/tokenStore";

const fetchAdminDocsRequest = async () => {
    try {
        const token = useTokenStore.getState().token;

        console.log("Fetching admin documents...", token);

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/dashboard/adminDocuments`, {
            method: "GET",
            headers: {
                Authorization: token,
            }
        });

        console.log("Response status:", response);

        if (!response.ok) {
            throw new Error("Failed to fetch admin documents");
        }

        const data = await response.json();
        console.log("Admin documents data:", data);
        return data.documents ?? data; // <-- return the array if present, else fallback

    } catch (error) {
        console.error("Error fetching admin documents:", error.message);
        throw error;
    }
}

const fetchAccreditationRequest = async () => {
    try {
        const token = useTokenStore.getState().token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/dashboard/documents/accreditation`, {
            method: "GET",
            headers: {
                Authorization: token,
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch accreditation data");
        }

        const data = await response.json();
        return data.accreditation ?? data;

    } catch (error) {
        console.error("Error fetching accreditation data:", error.message);
        throw error;
    }
}

const fetchActivityRequest = async () => {
    try {
        const token = useTokenStore.getState().token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/dashboard/documents/fetch-activities`, {
            method: "GET",
            headers: {
                Authorization: token,
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch activity data");
        }

        const data = await response.json();
        return data.activity ?? data;

    } catch (error) {
        console.error("Error fetching activity data:", error.message);
        throw error;
    }
}

const fetchCreatedActivityRequest = async () => {
    try {
        const token = useTokenStore.getState().token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/dashboard/rso/activities`, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Failed to create activity");
        }

        const data = await response.json();
        return data.activity ?? data;

    } catch (error) {
        console.error("Error creating activity:", error.message);
        throw error;
    }
}



const useDashboard = () => {

    const {
        data: adminDocs,
        isLoading: isLoadingAdminDocs,
        isError: isErrorAdminDocs,
        error: errorAdminDocs
    } = useQuery({
        queryKey: ['adminDocs'],
        queryFn: fetchAdminDocsRequest
    });

    const {
        data: accreditation,
        isLoading: isLoadingAccreditation,
        isError: isErrorAccreditation,
        error: errorAccreditation
    } = useQuery({
        queryKey: ['accreditation'],
        queryFn: fetchAccreditationRequest
    });

    const {
        data: activity,
        isLoading: isLoadingActivity,
        isError: isErrorActivity,
        error: errorActivity
    } = useQuery({
        queryKey: ['activity'],
        queryFn: fetchActivityRequest
    });

    const {
        data: createdActivities,
        isLoading: isLoadingCreatedActivities,
        isError: isErrorCreatedActivities,
        error: errorCreatedActivities
    } = useQuery({
        queryKey: ['createdActivities'],
        queryFn: fetchCreatedActivityRequest
    });

    return {
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
    };
}

export default useDashboard;