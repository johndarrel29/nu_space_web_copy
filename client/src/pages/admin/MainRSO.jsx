import { useState, useEffect } from "react";
import { RSOTable, Searchbar, Notification } from "../../components";
import RSOForm from "../../components/RSOForm";
import { AnimatePresence } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import  useSearchQuery from "../../hooks/useSearchQuery";
import  useRSO from "../../hooks/useRSO";

export default function MainRSO() {
  const { organizations, error, loading, fetchData, createRSO, updateRSO, deleteRSO } = useRSO();
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [notification, setNotification] = useState(null);
  const [orgList, setOrgList] = useState(organizations); 

  useEffect(() => {
    setOrgList(organizations);
  }, [organizations]);


  useEffect(() => {
    fetchData();
  }, []);


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
            onUpdate={setOrgList} 
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