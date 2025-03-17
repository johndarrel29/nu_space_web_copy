import { useState } from "react";
import { RSOTable, Searchbar, Notification } from "../../components";
import RSOForm from "../../components/RSOForm";
import { motion, AnimatePresence } from "framer-motion"; 

export default function MainRSO() {
 const [searchQuery, setSearchQuery] = useState('');
 const [modalOpen, setModalOpen] = useState(false);
 const [organizations, setOrganizations] = useState([]);
 const [notification, setNotification] = useState(null);

 const addOrganization = (newOrg) => {
     setOrganizations((prevOrgs) => [...prevOrgs, newOrg]);
 };

 const handleNotification = (message) => {
    setNotification(message);

    
    setTimeout(() => setNotification(null), 3000);
};

 
 const handleOpen = () => {
    setModalOpen(!modalOpen);
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
                <RSOForm addOrganization={addOrganization} onSubmit={handleNotification}/>
            </div>
               
            </div>

            {/* Right Pane */}
            <div className="bg-card-bg rounded-xl p-4 w-full flex-1 shadow-md">
                    <div className="bg-card-bg sticky top-0 z-10 ">
                    <h1>History</h1>
                    <hr className="my-4 border-gray-400" />
                    <Searchbar placeholder="Search an Organization"  searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                </div>
                
            {/* Scroll Container */}
                <div className="overflow-x-auto max-h-[400px]">
                
                 <RSOTable data={organizations} searchQuery={searchQuery} onUpdate={setOrganizations} />
               
                    
                </div>
                
            </div>

            <AnimatePresence
                  // Disable any initial animations on children that
                // are present when the component is first rendered
                initial={false}
                // Only render one component at a time.
                // The exiting component will finish its exit
                // animation before entering component is rendered
                exitBeforeEnter={true}
                // Fires when all exiting nodes have completed animating out

                onExitComplete={() => null}>
            {/* Notification Component */}
                {notification && (

                <Notification notification={notification}/>

                )}

            </AnimatePresence>
        </div>
    );

    
      }