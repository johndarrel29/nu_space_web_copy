import { useState, useEffect } from "react";
import { RSOTable, Searchbar, Notification } from "../../components";
import RSOForm from "../../components/RSOForm";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import  useSearchQuery  from "../../hooks/useSearchQuery";

export default function MainRSO() {
  const { searchQuery, setSearchQuery } = useSearchQuery(); 
  const [organizations, setOrganizations] = useState([]);
  const [notification, setNotification] = useState(null);
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

  const handleNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
      {/* Left Pane */}
      <div className="bg-card-bg rounded-xl p-4 w-full flex-1 shadow-md">
        <div className="bg-card-bg sticky top-0 z-10 ">
          <h1>Create an RSO Account</h1>
          <hr className="my-4 border-gray-400" />
        </div>
        {/* Scroll Container */}
        <div className="overflow-x-auto max-h-[450px] ">
          <RSOForm createRSO={createRSO} onSubmit={handleNotification} />
        </div>
      </div>

      {/* Right Pane */}
      <div className="bg-card-bg rounded-xl p-4 w-full flex-1 shadow-md">
        <div className="bg-card-bg sticky top-0 z-10 ">
          <h1>History</h1>
          <hr className="my-4 border-gray-400" />
          <Searchbar placeholder="Search an Organization" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        {/* Scroll Container */}
        <div className="overflow-x-auto max-h-[400px]">
        {loading && <Skeleton count={6} height={60}/>}
        {error && <p>Error: {error}</p>}
          <RSOTable 
            data={organizations} 
            searchQuery={searchQuery} 
            onUpdate={setOrganizations} 
            updateRSO={updateRSO} 
            deleteRSO={deleteRSO} 
          />
        </div>
      </div>

      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {/* Notification Component */}
        {notification && (
          <Notification notification={notification} />
        )}
      </AnimatePresence>
    </div>
  );
}