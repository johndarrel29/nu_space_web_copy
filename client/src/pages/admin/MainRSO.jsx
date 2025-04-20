import { useState, useEffect } from "react";
import { RSOTable, Searchbar, Notification, TabSelector } from "../../components";
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
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "RSOs"},
    { label: "Create RSO", 
    icon: 
  <svg className="w-4 h-4 me-2  dark:text-blue-500" fill="currentColor"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>  
  }
];

  const categories = [
    "Table",
    "Create RSO",
  ];



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
    <>
    <div className="grid grid-cols-1 w-full">
      <div className="w-full bg-card-bg p-6 pt-0 rounded-lg shadow-md">
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 1 ? (
      <>

        {/* Scroll Container */}
        <div className="h-full mt-4">
          <RSOForm createRSO={createRSO} onSubmit={handleNotification} />
        </div>
      </>

      ) : (
        <>
        <div className="bg-card-bg sticky top-0 z-10 mt-4">
          <Searchbar placeholder="Search an Organization" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        {/* Scroll Container */}
        <div className="h-full">
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
        </>


        )}
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
    </>
  );
}