import { useState, useEffect } from "react";
import { RSOTable, Searchbar, Notification } from "../../components";
import RSOForm from "../../components/RSOForm";
import { motion, AnimatePresence } from "framer-motion"; 

export default function MainRSO({ organizations: initialOrganizations, createRSO, updateRSO, deleteRSO }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setOrganizations(initialOrganizations);
  }, [initialOrganizations]);

  const addOrganization = (newOrg) => {
    setOrganizations((prevOrgs) => [...prevOrgs, newOrg]);
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