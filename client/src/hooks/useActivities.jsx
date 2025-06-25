import { useState, useEffect, useCallback } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";


function useActivities(activityId, debouncedQuery, sorted, RSO, RSOType, college) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const queryClient = useQueryClient();

    const createActivity = useCallback(async (activity) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        try {
            const isFileUpload = activity.Activity_image instanceof File;
            let body;
            let headers = {
                "Authorization": token ? `Bearer ${formattedToken}` : "",
            };

            if (isFileUpload) {
                const formData = new FormData();

                Object.entries(activity).forEach(([key, value]) => {
                    if (key === "Activity_imagePreview") {
                        return;
                    } else if (key === "Activity_image" && value instanceof File) {
                        formData.append("file", value);
                    } else {
                        formData.append(key, value);
                    }
                });



                body = formData;
            } else {
                headers["Content-Type"] = "application/json";
                body = JSON.stringify(activity);
            }

            console.log("Submitting new activity:", activity);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/activities/createActivity`, {
                method: "POST",
                headers,
                body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
            }

            const json = await response.json();
            console.log("Activity created:", json);
            setSuccess(true);
            return json.activity || null;

        } catch (err) {
            console.error("Error creating activity:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateActivity = useCallback(async (activityId, updatedData) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;


            const isFileUpload = updatedData.Activity_image instanceof File;
            const formData = new FormData();

            if (isFileUpload) {

                Object.entries(updatedData).forEach(([key, value]) => {
                    formData.append(key, value);
                });
            }

            const headers = {
                "Authorization": token ? `Bearer ${formattedToken}` : "",
                ...(!isFileUpload && { "Content-Type": "application/json" }),
            }
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/activities/updateActivity/${activityId}`, {
                method: "PUT",
                headers,
                body: isFileUpload ? formData : JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const json = await response.json();
            setSuccess(true);
            console.log("Activity updated:", json);

            setActivities((prevActivities) =>
                prevActivities.map((activity) =>
                    activity._id === activityId ? json.activity : activity
                )
            );

        } catch (err) {
            console.error("Error updating data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }
        , []);

    const deleteActivity = useCallback(async (activityId) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/activities/deleteActivity/${activityId}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error: ${response.status} - ${response.statusText}\n${errorBody}`);
            }

            const json = await response.json();
            return json.activity || null;
        } catch (err) {
            console.error("Error deleting data:", err);
            setError(err);
            throw err;
        }
    }, []);


    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token,
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/activities/allRSOActivities`, {
                method: "GET",
                headers,
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const json = await response.json();
            setActivities(json.activities || []);
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchActivity = useCallback(async () => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/activities/getActivities`, {
                method: "GET",
                headers,
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const json = await response.json();
            return json.activities || [];
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err);
        }
    }
        , []);

    const fetchRSOActivity = async (activityId) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const BaseURL = `${process.env.REACT_APP_BASE_URL}/api/admin/activities`;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };

        console.log("url sending: " + `${BaseURL}/${activityId}/documents`);

        const response = await fetch(`${BaseURL}/${activityId}/documents`, {
            method: "GET",
            headers,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const json = await response.json();
        console.log("Full activity fetch response:", json);

        return {
            documents: json.documents || [],
            preActivityDocuments: json.preActivityDocuments || [],
            postActivityDocuments: json.postActivityDocuments || [],
        };
    };

    const fetchAdminActivity = async ({
        pageParam = 1,
        query = "",
        sorted = "",
        RSO = "",
        RSOType = "",
        college = ""
    }) => {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const url = new URL(`${process.env.REACT_APP_BASE_URL}/api/admin/activities/`);
        url.searchParams.set("page", pageParam);
        url.searchParams.set("limit", 12);
        if (query) url.searchParams.set("search", query);
        if (RSO) url.searchParams.set("RSO", RSO)
        if (RSOType) url.searchParams.set("RSOType", RSOType);
        if (college) url.searchParams.set("college", college);
        if (sorted) url.searchParams.set("sorted", sorted);

        console.log("Fetching admin activities with URL:", url.toString());
        console.log("url search params:", url.searchParams.set("search", query));

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${formattedToken}` : "",
            }
        }
        )
        // const response = await fetch(`${process.env.REACT_APP_FETCH_ADMIN_ACTIVITIES_URL}?${queryParams.toString()}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": token ? `Bearer ${formattedToken}` : "",
        //     },
        // });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }


        const data = await response.json();
        return {
            activities: data.activities,
            nextPage: data.pagination?.hasNextPage ? pageParam + 1 : undefined,
        }
        // return response.json();

    }

    const fetchActivityDocument = async (activityId) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/activities/${activityId}/documents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${formattedToken}` : "",
            },
        });

        return response.json();
    }

    const createActivityDocument = async ({ activityId, formData }) => {
        const token = localStorage.getItem("token");
        setLoading(true);
        // const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/activities/${activityId}/documents`, {
                method: "POST",
                headers: {
                    "Authorization": token ? token : "",
                },
                body: formData,
            });
            return response.json();
        } catch (err) {
            console.error("Error creating activity document:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);

        }

    }

    const deleteActivityDocument = async ({ activityId, documentId }) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/activities/${activityId}/documents/${documentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${formattedToken}` : "",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        return response.json();
    }

    const fetchLocalActivity = async () => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };

        // Create URL with query parameters for sorting
        const url = new URL(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/activities/getRSOCreatedActivities`);
        if (sorted) {
            url.searchParams.set("sorted", sorted);
        }
        if (debouncedQuery) {
            url.searchParams.set("search", debouncedQuery);
        }

        console.log("url sending with params: " + url.toString());

        const response = await fetch(url, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const json = await response.json();
        console.log("Full activity fetch response:", json);

        return json.activities || []
    }

    const viewActivity = async ({ activityId }) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };

        try {
            console.log("finding ", `${process.env.REACT_APP_BASE_URL}/api/admin/activities/${activityId}`);

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/activities/${activityId}`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const json = await response.json();
            return json.activity || [];
        } catch (err) {
            console.error("Error loading data:", err);
        }
    }


    const {
        data: viewActivityData,
        isSuccess: viewActivitySuccess,
        isLoading: viewActivityLoading,
        isError: viewActivityError
    } = useQuery({
        queryKey: ["activity", activityId],
        queryFn: () => viewActivity({ activityId }),
        enabled: !!activityId,
        onSuccess: (data) => {
            console.log("Activities fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching activities:", error);
        },
    })

    const {
        data: localActivities,
        isLoading: isLocalActivitiesLoading,
        isError: isLocalActivitiesError,
        error: localActivitiesError,
        refetch: refetchLocalActivities,
        isSuccess: isLocalActivitiesSuccess,
    } = useQuery({
        queryKey: ["localActivities"],
        queryFn: fetchLocalActivity,
        enabled: false,
        onSuccess: (data) => {
            console.log("Local activities fetched successfully:", data);
            queryClient.invalidateQueries(["localActivities"]);
        },
        onError: (error) => {
            console.error("Error fetching local activities:", error);
            setError(error);
        },
    })

    const {
        mutate: deleteActivityDoc,
        data: deletedActivity,
        error: deleteError,
        isLoading: isDeleting,
    } = useMutation({
        mutationFn: deleteActivityDocument,
        onSuccess: (data) => {
            console.log("Activity created successfully:", data);
            queryClient.invalidateQueries(["activities"]);
        },
        onError: (error) => {
            console.error("Error creating activity:", error);
            setError(error);
        },
    })


    const {
        mutateAsync: createActivityDoc,
        data: createdActivity,
        isError: createError,
        isSuccess: isCreatingSuccess,
        isLoading: isCreatingLoading,
    } = useMutation({
        mutationFn: createActivityDocument,
        onSuccess: () => {
            queryClient.invalidateQueries(["activities", activityId]);
        },
    })


    const {
        data: activityDocument,
        error: activityDocumentError,
        isLoading: isActivityDocumentLoading,
        isError: isActivityDocumentError,
    } = useQuery({
        queryKey: ["activities", activityId],
        queryFn: () => fetchActivityDocument(activityId),
        enabled: !!activityId,
    })


    const {
        data: adminPaginatedActivities,
        error: adminError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["adminActivities", debouncedQuery, sorted, RSO, RSOType, college],
        queryFn: ({ pageParam = 1 }) =>
            fetchAdminActivity({ pageParam, query: debouncedQuery, sorted: sorted, RSO: RSO, RSOType: RSOType, college: college }),
        // enabled: !!debouncedQuery || !!sorted || !!RSO || !!RSOType || !!college,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })


    const {
        data: rsoActivity,
        error: errorQuery,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["rso-activity", activityId],
        queryFn: () => fetchRSOActivity(activityId),
        enabled: !!activityId,
    })



    useEffect(() => {
        fetchData();
    }, [fetchData]);



    return {
        activities,
        fetchActivity,
        loading,
        error,
        success,
        createActivity,
        updateActivity,
        deleteActivity,
        rsoActivity,
        errorQuery,
        isLoading,
        isError,

        adminError,

        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        adminPaginatedActivities,
        adminError,

        activityDocument,
        activityDocumentError,
        isActivityDocumentLoading,
        isActivityDocumentError,

        createActivityDoc,
        deleteActivityDoc,
        createError,
        isCreatingSuccess,
        isCreatingLoading,

        localActivities,
        isLocalActivitiesLoading,
        isLocalActivitiesError,
        localActivitiesError,
        refetchLocalActivities,
        isLocalActivitiesSuccess,

        viewActivityData,
        viewActivityError,
    };
}

export default useActivities;
