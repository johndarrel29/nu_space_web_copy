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
            setActivities(json.activities || []);
        } catch (err) {
            console.error("Error loading data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { activities, loading, error };
}

export default useActivities;
