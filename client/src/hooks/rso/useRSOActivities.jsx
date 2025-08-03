
// API Calls
// for rso
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

// for rso updating activity
const updateActivity = useCallback(async (activityId, updatedData) => {
    setLoading(true);
    setError(null);

    console.log("Updating activity with ID:", activityId);
    console.log("Updated data:", updatedData);

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

// for rso deleting activity
const deleteActivity = useCallback(async (activityId) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
    };
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/rsoRep/activities/deleteActivity/${activityId}`, {
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

// no role - for fetching activity documents
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

// rso - for creating activity document
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

// no role - for deleting activity document
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

// fetch created activities for RSO representative
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

// for viewing activity details - two roles
const viewActivity = async ({ activityId }) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    console.log("viewActivity has been called with activityId:", activityId);

    const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
    };

    // display url based on the role 
    let url = '';

    const role = user?.role || '';

    switch (role) {
        case 'admin':
            url = `${process.env.REACT_APP_BASE_URL}/api/admin/activities/${activityId}`;
            console.log("Admin URL:", url);
            break;
        case 'rso_representative':
            url = `${process.env.REACT_APP_BASE_URL}/api/rsoRep/activities/viewRSOActivity/${activityId}`;
            console.log("RSO Representative URL:", url);
            break;
        default:
            break;
    }


    try {
        console.log("Fetching activity with URL:", url);
        const response = await fetch(url, {
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

function useRSOActivities() {

    const {
        mutate: createActivityMutate,
        isLoading: isCreatingActivity,
        isSuccess: isActivityCreated,
        isError: isActivityCreationError,
        error: activityCreationError,
    } = useMutation(createActivity, {
        onSuccess: (data) => {
            console.log("Activity created successfully:", data);
        }
    });

    const {
        mutate: updateActivityMutate,
        isLoading: isUpdatingActivity,
        isSuccess: isActivityUpdated,
        isError: isActivityUpdateError,
        error: activityUpdateError,
    } = useMutation(updateActivity, {
        onSuccess: (data) => {
            console.log("Activity updated successfully:", data);
        }
    });

    const {
        mutate: deleteActivityMutate,
        isLoading: isDeletingActivity,
        isSuccess: isActivityDeleted,
        isError: isActivityDeletionError,
        error: activityDeletionError,
    } = useMutation(deleteActivity, {
        onSuccess: (data) => {
            console.log("Activity deleted successfully:", data);
        }
    });

    const {
        data: activityLocalData,
        isLoading: activityLocalLoading,
        isError: activityLocalError,
        error: activityLocalQueryError,
        refetch: refetchLocalActivityData,
    } = useQuery({
        queryKey: ["activities"],
        queryFn: fetchLocalActivity,
        onSuccess: (data) => {
            console.log("Activities fetched successfully:", data);
            setActivities(data);
        }
        ,
        onError: (error) => {
            console.error("Error fetching activities:", error);
            setError(error.message);
        }
    });

    const {
        data: activityDetails,
        isLoading: activityDetailsLoading,
        isError: activityDetailsError,
        error: activityDetailsQueryError,
        refetch: refetchActivityDetails,
    } = useQuery({
        queryKey: ["documents"],
        queryFn: fetchActivityDocument,
        onSuccess: (data) => {
            console.log("Documents fetched successfully:", data);
            setDocuments(data);
        }
        ,
        onError: (error) => {
            console.error("Error fetching documents:", error);
            setError(error.message);
        }
    });

    return {
        // for creating activity
        createActivityMutate,
        isCreatingActivity,
        isActivityCreated,
        isActivityCreationError,
        activityCreationError,

        // for updating activity
        updateActivityMutate,
        isUpdatingActivity,
        isActivityUpdated,
        isActivityUpdateError,
        activityUpdateError,

        // for deleting activity
        deleteActivityMutate,
        isDeletingActivity,
        isActivityDeleted,
        isActivityDeletionError,
        activityDeletionError,

        // for fetching activities
        activityLocalData,
        activityLocalLoading,
        activityLocalError,
        activityLocalQueryError,
        refetchLocalActivityData,

        // for fetching activity details
        activityDetails,
        activityDetailsLoading,
        activityDetailsError,
        activityDetailsQueryError,
        refetchActivityDetails
    }
}