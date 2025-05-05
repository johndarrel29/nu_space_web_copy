import { useState, useEffect, useMemo, memo  } from "react";
import { MainLayout, Table, Searchbar, Button } from "../../components";
import   { useModal }  from "../../hooks";
import { AnimatePresence } from "framer-motion";
import { CreateUserModal } from "../../components";

  // function to handle the search and filter
  const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole, openModal }) => {

    return (
      <>
      {/* search query */}
      <div className=" w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
        <div className="w-full lg:w-full md:w-full">
        <label 
          htmlFor="roleFilter" 
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
          <Searchbar
            placeholder="Search a user"
            searchQuery={searchQuery || ''}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* dropdown role filter */}
        <div className="w-full lg:w-1/2 md:w-full">
        <label 
          htmlFor="roleFilter" 
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Filter by Role
        </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full h-10 border border-mid-gray rounded-md p-1 bg-textfield focus:outline-none focus:ring-off-black  focus:ring-1"
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="student/rso">Student/RSO</option>
          </select>
        </div>
      </div>


      </>


    );
  });

  export default function UserManagement() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, openModal, closeModal } = useModal();


  // fetch data from json file
// Fetch data from API
useEffect(() => {
  const fetchData = async () => {
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
      const response = await fetch(`${process.env.REACT_APP_FETCH_USERS_URL}`, {
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
  };
  

  fetchData();
}, []);


    // Memoize the data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => data, [data]);



    return (
        <>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor Student/RSO and Student accounts"
            > 
          <div className="w-full flex flex-col gap-4 bg-card-bg rounded-lg p-4 border border-mid-gray">
            <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery}  setSelectedRole={setSelectedRole} openModal={openModal}/>
              
            <Table data={memoizedData} searchQuery={searchQuery} selectedRole={selectedRole}/>
          </div>


          <AnimatePresence
              initial={false}
              exitBeforeEnter={true}
              onExitComplete={() => null}
          >
            {isOpen && (
                <CreateUserModal closeModal={closeModal}/>

            )}
            </AnimatePresence>
                
            </MainLayout>

        </>
    );


      }