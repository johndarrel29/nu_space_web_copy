import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

function useRSO() {
const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);

    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
    };

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching data from:", process.env.REACT_APP_FETCH_RSO_URL);
      const response = await fetch(`${process.env.REACT_APP_FETCH_RSO_URL}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log("Fetched data:", json);
      setOrganizations(Array.isArray(json.rsos) ? json.rsos : []);
    } catch (err) {
      setError(err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures fetchData is created only once

  useEffect(() => {
    fetchData();
  }, [fetchData]); 
        

  const createRSO = async (newOrg) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
      console.log("Submitting new RSO:", newOrg);
      console.log("Request URL:", process.env.REACT_APP_CREATE_RSO_URL);

          // Create FormData if RSO_picture exists (file upload)
    const isFileUpload = newOrg.RSO_picture instanceof File;

    
    let body;
    let headers = {
      "Authorization": `Bearer ${formattedToken}`,
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

      

    const response = await fetch(`${process.env.REACT_APP_CREATE_RSO_URL}`, {
      method: "POST",
      headers,
      body,
    });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("RSO created:", result);

      // Update the state with the new organization
      setOrganizations((prevOrgs) => [...prevOrgs, result]);
    } catch (error) {
      console.error("Error creating RSO:", error);
      setError(`Error: ${error.message}`);
    }
  };

  //   const updateRSO = async (id, updatedOrg) => {
  //   setLoading(true);
  //   setError(null);

  //   const isFormData = updatedOrg instanceof FormData;

  //   try {
  //     const token = localStorage.getItem("token");
  //     const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

  //     const headers = {
  //       // "Content-Type": "application/json",
  //       "Authorization": token ? `Bearer ${formattedToken}` : "",
  //       ...(isFormData ? {} : { "Content-Type": "application/json" }),
  //     };

  //     const response = await fetch(`${process.env.REACT_APP_UPDATE_RSO_URL}/${id}`, {
  //       method: "PATCH",
  //       headers,
  //       body: isFormData ? updatedOrg : JSON.stringify(updatedOrg),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //     }

  //     const result = await response.json();
  //     console.log("RSO updated:", result);

  //     // Update the state with the updated organization
  //     setOrganizations((prevOrgs) =>
  //       prevOrgs.map((org) => (org._id === id ? result.updatedRSO : org))
  //     );
  //   } catch (err) {
  //     console.error("Error updating RSO:", err);
  //     setError(`Error: ${err.message}`);
  //   }
  // };

const updateRSO = async (id, updatedOrg) => {
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

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
      "Authorization": token ? `Bearer ${formattedToken}` : "",
      // Let the browser set Content-Type automatically for FormData (includes boundary)
      ...(!isFileUpload && { "Content-Type": "application/json" }),
    };

    const response = await fetch(`${process.env.REACT_APP_UPDATE_RSO_URL}/${id}`, {
      method: "PATCH",
      headers,
      body: isFileUpload ? formData : JSON.stringify(updatedOrg),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log("RSO updated:", result);

    setOrganizations((prevOrgs) =>
      prevOrgs.map((org) => (org._id === id ? result.updatedRSO : org))
    );
  } catch (err) {
    console.error("Error updating RSO:", err);
    setError(`Error: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const deleteRSO = async (id) => {
  setLoading(true);
  setError(null);

    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

      const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      };

      const response = await fetch(`${process.env.REACT_APP_DELETE_RSO_URL}/${id}`, {
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
      setError(`Error: ${err.message}`);
    }
  };

  const fetchWebRSO = async () => {
    const token = localStorage.getItem("token");
    console.log("Stored token:", token);

    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    const response = await fetch(`${process.env.REACT_APP_FETCH_RSO_WEB_URL}`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
      },
    });
    return response.json();
  }

  const {
    data
  } = useQuery({
    queryKey:["rsoData"],
    queryFn: fetchWebRSO,

  })

  // console.log("React Query fetched data:", JSON.stringify(data, null, 2));

  return { organizations, error, loading, createRSO, updateRSO, deleteRSO, fetchData,   queryData: data, 
  };
}

export default useRSO;