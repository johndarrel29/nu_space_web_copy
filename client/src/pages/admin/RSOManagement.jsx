import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components';
import MainRSO from './MainRSO';

export default function RSOManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
        console.log("Fetching data from:", process.env.REACT_APP_FETCH_RSO_URL); // Log the URL
        const response = await fetch(`${process.env.REACT_APP_FETCH_RSO_URL}`, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const text = await response.text();
        console.log("Response text:", text);

        const json = JSON.parse(text);
        console.log("Fetched data:", json);
        setOrganizations(Array.isArray(json.rsos) ? json.rsos : []);
      } catch (err) {
        setError(err.message);
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createRSO = async (newOrg) => {
    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

      const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      };

      const response = await fetch(`${process.env.REACT_APP_CREATE_RSO_URL}`, {
        method: "POST",
        headers,
        body: JSON.stringify(newOrg),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("RSO created:", result);

      // Update the state with the new organization
      setOrganizations((prevOrgs) => [...prevOrgs, result]);
    } catch (err) {
      console.error("Error creating RSO:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const updateRSO = async (id, updatedOrg) => {
    try {
      const token = localStorage.getItem("token");
      const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

      const headers = {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${formattedToken}` : "",
      };
      console.log("Update RSO URL:", `${process.env.REACT_APP_UPDATE_RSO_URL}/${id}`);
      const response = await fetch(`${process.env.REACT_APP_UPDATE_RSO_URL}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedOrg),
      });

    

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("RSO updated:", result);

      // Update the state with the updated organization
      setOrganizations((prevOrgs) =>
        prevOrgs.map((org) => (org._id === id ? result.updatedRSO : org))
      );
    } catch (err) {
      console.error("Error updating RSO:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const deleteRSO = async (id) => {
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

  return (
    <>
      <MainLayout
        tabName="RSO Management"
        headingTitle="Create RSO Account"
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <MainRSO 
          organizations={organizations} 
          createRSO={createRSO} 
          updateRSO={updateRSO} 
          deleteRSO={deleteRSO} 
        />
      </MainLayout>
    </>
  );
}