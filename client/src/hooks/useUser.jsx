import { useEffect, useState, useCallback } from "react";

function useUser() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
      // fetch data from json file
// Fetch data from API

    const fetchData = useCallback(async () => {
      const token = localStorage.getItem("token");
      console.log("Stored token:", token);
    
      // Remove 'Bearer ' prefix if already included
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
    
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      };
    
      setLoading(true);
      setError(null);
    
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/user/fetchUsers`, {
          method: "GET",
          headers, 
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    
        const json = await response.json();
        console.log("Fetched data:", json);
        setData(Array.isArray(json.users) ? json.users : []);
      } catch (err) {
        setError(err.message);
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
        fetchData();
      }, [fetchData]); 

    console.log("data", data);
    

    
    


  
    return{ data, loading, error, fetchData };
};

export default useUser;