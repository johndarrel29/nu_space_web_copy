import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useTokenStore from "../store/tokenStore";

// TODO: double check the endpoints and ensure they are correct
// especially at membership date related endpoints

// for admin create RSO
const createRSO = async (newOrg) => {
    setLoading(true);
    setSuccess(false);

    // change RSO_picture to RSO_image
    if (newOrg.RSO_picture && newOrg.RSO_picture instanceof File) {
        newOrg.RSO_image = newOrg.RSO_picture;
        delete newOrg.RSO_picture;

    }

    try {
        const token = useTokenStore.getState().getToken();
        const isFileUpload = newOrg.RSO_image instanceof File;


        let body;
        let headers = {
            "Authorization": token || "",
        };


        if (isFileUpload) {
            const formData = new FormData();

            Object.entries(newOrg).forEach(([key, value]) => {
                if (key === "RSO_picturePreview") return;
                if (key === "RSO_picture") {
                    formData.append("RSO_image", value);
                    return;
                }

                if (key === "RSO_tags" && Array.isArray(value)) {
                    value.forEach((tag) => formData.append("RSO_tags[]", tag));
                } else {
                    formData.append(key, value);
                }
            });
            console.log("Final FormData created:");
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            body = formData;
        } else {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(newOrg);
        }



        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/createRSO`, {
            method: "POST",
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating RSO:", errorData);

            setCreateError(errorData.message || `Error: ${response.status} - ${response.statusText}`);
            console.error("createRSO error:", createError);
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log("RSO created:", result);
        setSuccess(true);

        // Update the state with the new organization
        setOrganizations((prevOrgs) => [...prevOrgs, result]);
    } catch (error) {
        const errorData = await error.response?.json();
        console.error("Error creating RSO:", errorData || error);
    } finally {
        setLoading(false);
    }
};

// admin update an rso
// This function handles both file uploads and regular JSON updates
const updateRSO = async (id, updatedOrg) => {
    setLoading(true);
    setUpdateError(null);
    setSuccess(false);

    try {
        const token = useTokenStore.getState().getToken();

        // Create FormData if RSO_picture exists (file upload)
        const isFileUpload = updatedOrg.RSO_picture instanceof File;
        const formData = new FormData();

        if (isFileUpload) {
            // Append all fields (including the file) to FormData
            Object.keys(updatedOrg).forEach((key) => {
                if (key === "RSO_picture") {
                    formData.append("RSO_image", updatedOrg[key]);
                } else {
                    formData.append(key, updatedOrg[key]);
                }
            });
        }

        const headers = {
            "Authorization": token || "",
            // Let the browser set Content-Type automatically for FormData (includes boundary)
            ...(!isFileUpload && { "Content-Type": "application/json" }),
        };

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/update-rso/${id}`, {
            method: "PATCH",
            headers,
            body: isFileUpload ? formData : JSON.stringify(updatedOrg),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        setSuccess(true);
        console.log("RSO updated:", result);

        setOrganizations((prevOrgs) =>
            prevOrgs.map((org) => (org._id === id ? result.updatedRSO : org))
        );
    } catch (err) {
        console.error("Error updating RSO:", err);
        setUpdateError(`Error: ${err.message}`);
    } finally {
        setLoading(false);

    }
};

// admin update RSO status
const updateRSOStatus = async ({ id, status }) => {
    const token = useTokenStore.getState().getToken();

    const headers = {
        "Content-Type": "application/json",
        "Authorization": token || "",
    };

    console.log("Updating RSO status:", { id, status });

    const body = JSON.stringify({ RSO_membershipStatus: status });

    const response = await fetch(`${process.env.REACT_APP_UPDATE_RSO_URL}/${id}`, {
        method: "PATCH",
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(`Failed to update RSO status: ${response.status}`);

    }

    return response.json();
}

// admin delete an rso
const deleteRSO = async (id) => {
    setLoading(true);


    try {
        const token = useTokenStore.getState().getToken();

        const headers = {
            "Content-Type": "application/json",
            "Authorization": token || "",
        };

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/deleteRSO/${id}`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        console.log("RSO deleted");

        // Update the state by removing the deleted organization
        setOrganizations((prevOrgs) => prevOrgs.filter((org) => org._id !== id));
    } catch (err) {
        console.error("Error deleting RSO:", err);
        setDeleteError(`Error: ${err.message}`);

    } finally {
        setLoading(false);

    }
};

// Fetch all RSOs
const fetchWebRSO = async () => {
    console.log("Fetching web RSO data...");

    try {
        const token = useTokenStore.getState().getToken();
        console.log("Stored token:", token);
        // const token = localStorage.getItem("token");

        console.log("Fetching web RSO data from:", `${process.env.REACT_APP_BASE_URL}/api/admin/rso/allRSOweb`, "with token:", token);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/allRSOweb`, {
            method: "GET",
            headers: {
                "Authorization": token || "",
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const rsoData = await response.json();
        console.log("Fetched web RSO rsoData from controller:", rsoData);
        return rsoData;
    } catch (error) {
        console.error("Error fetching RSO data:", error);
        throw error;
    }
}

// for admin update membership date
const updateMembershipDate = async ({ date }) => {
    const token = useTokenStore.getState().getToken();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/open-update-membership`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token || "",
        },
        body: JSON.stringify({ membershipEndDate: date }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update membership date: ${response.status}`);
    }
    return response.json();

}

// for admin get membership date
const getMembershipDate = async () => {
    try {
        const token = useTokenStore.getState().getToken();

        console.log("Fetching membership date with token:", token);

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/membership-status`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token || "",
            },
        });

        const responseData = await response.json();
        console.log("Membership date response data:", responseData);
        console.log("Membership date fetched successfully:", responseData);

        if (!response.ok) {
            throw new Error(`Failed to get membership date: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching membership date:", error);
        throw error;
    }

}

// for admin close membership date
const closeMembershipDate = async () => {
    const token = useTokenStore.getState().getToken();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/manual-close-membership`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token || "",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to close membership date: ${response.status}`);
    }
    return response.json();

}

// for admin extend membership date
const extendMembershipDate = async ({ date, hours, minutes }) => {
    const token = useTokenStore.getState().getToken();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/rso/update-membership-endDate`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token || "",
        },
        body: JSON.stringify({ durationInDays: date, durationInHours: hours, durationInMinutes: minutes }),
    });

    if (!response.ok) {
        throw new Error(`Failed to extend membership date: ${response.status}`);
    }
    return response.json();

}

function useAdminRSO() {

    const {
        mutate: createRSOMutate,
        isLoading: isCreating,
        isSuccess: isCreateSuccess,
        isError: isCreateError,
        error: createError,
        reset: resetCreate,
    } = useMutation({
        mutationFn: createRSO,
        onSuccess: () => {
            console.log("RSO created successfully");
        },
        onError: (error) => {
            console.error("Error creating RSO:", error);
        },
    });

    const {
        mutate: updateRSOMutate,
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError,
        reset: resetUpdate,
    } = useMutation({
        mutationFn: updateRSO,
        onSuccess: () => {
            console.log("RSO updated successfully");
        },
        onError: (error) => {
            console.error("Error updating RSO:", error);
        },
    });

    const {
        mutate: updateRSOStatusMutate,
        isLoading: isUpdatingStatus,
        isSuccess: isUpdateStatusSuccess,
        isError: isUpdateStatusError,
        error: updateStatusError,
        reset: resetUpdateStatus,
    } = useMutation({
        mutationFn: updateRSOStatus,
        onSuccess: () => {
            console.log("RSO status updated successfully");
        },
        onError: (error) => {
            console.error("Error updating RSO status:", error);
        },
    });

    const {
        mutate: deleteRSOMutate,
        isLoading: isDeletingRSO,
        isSuccess: isDeleteRSOSuccess,
        isError: isDeleteRSOError,
        error: deleteRSOError,
    } = useMutation({
        mutationFn: deleteRSO,
        onSuccess: () => {
            console.log("RSO deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting RSO:", error);
        },
    });

    const {
        data: rsoData,
        isLoading: isRSOLoading,
        isError: isRSOError,
        error: rsoError,
        refetch: refetchRSOData,
    } = useQuery({
        queryKey: ["rsoData"],
        queryFn: fetchWebRSO,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 0,
        cacheTime: 0,
    });

    const {
        mutate: updateMembershipDateMutate,
        isLoading: isUpdateMembershipDateLoading,
        isSuccess: isUpdateMembershipDateSuccess,
        isError: isUpdateMembershipDateError,
        error: updateMembershipDateError,
        reset: resetUpdateMembershipDate,
    } = useMutation({
        mutationFn: updateMembershipDate,
        onSuccess: () => {
            console.log("Membership date updated successfully");
        },
        onError: (error) => {
            console.error("Error updating membership date:", error);
        },
    });

    const {
        data: membershipDateData,
        isLoading: isMembershipDateLoading,
        isSuccess: isMembershipDateSuccess,
        isError: isMembershipDateError,
        error: membershipDateError,
        refetch: refetchMembershipDate,
    } = useQuery({
        queryKey: ["membershipDate"],
        queryFn: getMembershipDate,
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 0,
        cacheTime: 0,
    });

    const {
        mutate: closeMembershipDateMutate,
        isLoading: isCloseMembershipDateLoading,
        isSuccess: isCloseMembershipDateSuccess,
        isError: isCloseMembershipDateError,
        error: closeMembershipDateError,
        reset: resetCloseMembershipDate,
    } = useMutation({
        mutationFn: closeMembershipDate,
        onSuccess: () => {
            console.log("Membership date closed successfully");
        },
        onError: (error) => {
            console.error("Error closing membership date:", error);
        },
    });

    const {
        mutate: extendMembershipDateMutate,
        isLoading: isExtendMembershipDateLoading,
        isSuccess: isExtendMembershipDateSuccess,
        isError: isExtendMembershipDateError,
        error: extendMembershipDateError,
        reset: resetExtendMembershipDate,
    } = useMutation({
        mutationFn: extendMembershipDate,
        onSuccess: () => {
            console.log("Membership date extended successfully");
        },
        onError: (error) => {
            console.error("Error extending membership date:", error);
        },
    });

    return {
        // for admin create RSO
        createRSOMutate,
        isCreating,
        isCreateSuccess,
        isCreateError,
        createError,
        resetCreate,

        // for admin update RSO
        updateRSOMutate,
        isUpdating,
        isUpdateSuccess,
        isUpdateError,
        updateError,
        resetUpdate,

        // for admin update RSO status
        updateRSOStatusMutate,
        isUpdatingStatus,
        isUpdateStatusSuccess,
        isUpdateStatusError,
        updateStatusError,
        resetUpdateStatus,

        // for admin delete RSO
        deleteRSOMutate,
        isDeletingRSO,
        isDeleteRSOSuccess,
        isDeleteRSOError,
        deleteRSOError,

        // fetching RSO data
        rsoData,
        isRSOLoading,
        isRSOError,
        rsoError,
        refetchRSOData,

        // for admin update membership date
        updateMembershipDateMutate,
        isUpdateMembershipDateLoading,
        isUpdateMembershipDateSuccess,
        isUpdateMembershipDateError,
        updateMembershipDateError,
        resetUpdateMembershipDate,

        // for admin get membership date
        membershipDateData,
        isMembershipDateLoading,
        isMembershipDateSuccess,
        isMembershipDateError,
        membershipDateError,
        refetchMembershipDate,

        // for admin close membership date
        closeMembershipDateMutate,
        isCloseMembershipDateLoading,
        isCloseMembershipDateSuccess,
        isCloseMembershipDateError,
        closeMembershipDateError,
        resetCloseMembershipDate,

        // for admin extend membership date
        extendMembershipDateMutate,
        isExtendMembershipDateLoading,
        isExtendMembershipDateSuccess,
        isExtendMembershipDateError,
        extendMembershipDateError,
        resetExtendMembershipDate,
    }
}

export default useAdminRSO;