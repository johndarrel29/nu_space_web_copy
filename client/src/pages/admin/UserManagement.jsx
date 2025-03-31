import { useState, useEffect, useMemo, memo  } from "react";
import { MainLayout, Table, Searchbar, Button } from "../../components";

  // function to handle the search and filter
  const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole }) => {
    return (
      <>
      {/* search query */}
      <div className=" w-full px-4 py-4 bg-card-bg rounded-md shadow-md flex flex-col space-x-0 space-y-2  md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
        <div className="w-full lg:w-full md:w-full">
        <label 
          htmlFor="roleFilter" 
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
          <Searchbar
            placeholder="Search an Organization"
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
        <div className="w-full lg:w-1/2 md:w-full">
            <label className="block mb-2 text-sm font-medium text-transparent select-none">
              Action
            </label>
            <Button className="w-full flex justify-center items-center">
                <div className='flex flex-row items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="fill-white size-4"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                  <h1>Create New Account</h1>
                </div>

            </Button>
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
            headingTitle="Monitor RSO and Student accounts"
            > 
            <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery}  setSelectedRole={setSelectedRole}  />
            
            <Table data={memoizedData} searchQuery={searchQuery} selectedRole={selectedRole}/>
            
                
            </MainLayout>

        </>
    );


      }