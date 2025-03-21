import { useState, useEffect, useMemo, memo  } from "react";
import { MainLayout, Table, Searchbar } from "../../components";

//TODO: fetch data from the server and display it in the table --Checked
//TODO: Make changes to the table component to display the data

  // function to handle the search and filter
  const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole }) => {
    return (
      <>
      <div className="flex space-x-2 w-full px-4 py-4 bg-card-bg rounded-md shadow-md">
        <div className="w-1/2">
          <Searchbar
            placeholder="Search an Organization"
            searchQuery={searchQuery || ''}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="w-full">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-1/2 h-10 border border-mid-gray rounded-md p-1 bg-textfield"
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="student/RSO">Student/RSO</option>
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