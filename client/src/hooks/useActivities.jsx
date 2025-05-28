import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

function useActivities(activityId) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ,
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_FETCH_ACTIVITIES_URL}`, {
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
            const response = await fetch(`${process.env.REACT_APP_FETCH_ACTIVITIES_URL}`, {
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
        const BaseURL = process.env.REACT_APP_FETCH_LOCAL_ACTIVITIES_BASE_URL;

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

    const fetchAdminActivity = async () => {
        const token = localStorage.getItem("token");
        console.log("Stored token:", token);
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

        const response = await fetch(`${process.env.REACT_APP_FETCH_ADMIN_ACTIVITIES_URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${formattedToken}` : "",
            },
        });

        return response.json();
        
    }

// const { data, error: errorQuery, isLoading, isError } = useQuery(
//   ["rso-activity", activityId],          
//   () => fetchRSOActivity(activityId),    
//   {
//     enabled: !!activityId,               
//   }
// );
const {
    data: adminActivity,
    error: adminError,
} = useQuery ({
    queryKey: ["adminActivity"],
    queryFn: fetchAdminActivity,
})

// console.log("Admin Activity:", adminActivity);

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


    // const createActivity = useCallback(async (activity) => {
    //     const token = localStorage.getItem("token");
    //     const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    //     const headers = {
    //         "Content-Type": "application/json",
    //         "Authorization": token ? `Bearer ${formattedToken}` : "",
    //     };
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_CREATE_ACTIVITIES_URL}`, {
    //             method: "POST",
    //             headers,
    //             body: JSON.stringify(activity),
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status} - ${response.statusText}`);
    //         }
    //         const json = await response.json();
    //         return json.activity || null;
    //     } catch (err) {
    //         console.error("Error loading data:", err);
    //         setError(err);
    //     }
    // }
    // , []);

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
        const response = await fetch(`${process.env.REACT_APP_CREATE_ACTIVITIES_URL}`, {
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
            const response = await fetch(`${process.env.REACT_APP_UPDATE_ACTIVITIES_URL}/${activityId}`, {
                method: "PUT",
                headers,    
                body: isFileUpload ? formData : JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const json = await response.json();
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
        const response = await fetch(`${process.env.REACT_APP_DELETE_ACTIVITIES_URL}/${activityId}`, {
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

useEffect(() => {
    fetchData();
}, [fetchData]);


    // const fetchLocalActivities = useCallback(async (activityId) => {
    //     const token = localStorage.getItem("token");
    //     const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    //     const headers = {
    //         "Content-Type": "application/json",
    //         "Authorization": token ? `Bearer ${formattedToken}` : "",
    //     };
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_FETCH_ACTIVITIES_URL}/${activityId}`, {
    //             method: "GET",
    //             headers,
    //         });
    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status} - ${response.statusText}`);
    //         }
    //         const json = await response.json();
    //         setActivities(json.activities || []);
    //     } catch (err) {
    //         console.error("Error loading data:", err);
    //         setError(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);




// useEffect(() => {
//     let hasFetched = false;

//     if (!hasFetched) {
//         fetchData();
//         hasFetched = true;
//     }
// }, [fetchData]);



    return { 
        activities, 
        fetchActivity, 
        loading, 
        error, 
        createActivity, 
        updateActivity, 
        deleteActivity, 
        rsoActivity, 
        errorQuery, 
        isLoading, 
        isError,

        adminActivity,
        adminError,
    };
}

export default useActivities;
