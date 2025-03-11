import { useState } from "react";
import { RSOTable, Searchbar } from "../../components";
import RSOForm from "../../components/RSOForm";


export default function MainRSO() {
 const [searchQuery, setSearchQuery] = useState('');
 const [modalOpen, setModalOpen] = useState(false);
 const [organizations, setOrganizations] = useState([]);



 const addOrganization = (newOrg) => {
     setOrganizations((prevOrgs) => [...prevOrgs, newOrg]);
 };

 
 const handleOpen = () => {
    setModalOpen(!modalOpen);
  };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
            {/* Left Pane */}
            <div className="bg-gray-200 rounded-xl p-4 w-full flex-1 ">
                <div className="bg-gray-200 sticky top-0 z-10 ">
                <h1>Create an RSO Account</h1>
                <hr className="my-4 border-gray-400" />
            </div>

                {/* Scroll Container */}
            <div className="overflow-x-auto max-h-[450px] ">
                <RSOForm addOrganization={addOrganization}/>
            </div>
                
            </div>

            {/* Right Pane */}
            <div className="bg-gray-200 rounded-xl p-4 w-full flex-1 ">
                    <div className="bg-gray-200 sticky top-0 z-10 ">

                    <h1>History</h1>
                    <hr className="my-4 border-gray-400" />
                    <Searchbar placeholder="Search an Organization"  searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                       

                </div>
                
            {/* Scroll Container */}
                <div className="overflow-x-auto max-h-[400px]">
                
                 <RSOTable data={organizations} searchQuery={searchQuery} onUpdate={setOrganizations} />
               
                    
                </div>
                
            </div>
        </div>
    );

    
      }