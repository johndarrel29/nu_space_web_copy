import { useState, useEffect, useCallback } from "react";

function useActivities() {
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

    const createActivity = useCallback(async (activity) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${formattedToken}` : "",
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_CREATE_ACTIVITIES_URL}`, {
                method: "POST",
                headers,
                body: JSON.stringify(activity),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const json = await response.json();
            return json.activity || null;
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err);
        }
    }
    , []);

    const updateActivity = useCallback(async (activityId, updatedData) => {
        const token = localStorage.getItem("token");
        const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": token ? token : "",
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_UPDATE_ACTIVITIES_URL}/${activityId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const json = await response.json();
            return json.activity || null;
        } catch (err) {
            console.error("Error updating data:", err);
            setError(err);
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



    return { activities, fetchActivity, loading, error, createActivity, updateActivity, deleteActivity };
}

export default useActivities;
