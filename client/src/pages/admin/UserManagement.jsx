import { useState, useEffect, useMemo, memo  } from "react";
import { MainLayout, Table, Searchbar } from "../../components";


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

  // fetch data from json file
  useEffect(() => {
      fetch("/data/MOCK_DATA.json")
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error("Error loading data:", error));
        console.log("data is: ", data);
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