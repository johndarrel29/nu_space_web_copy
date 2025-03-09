import { useState } from "react";
import { useEffect } from "react";
import { MainLayout, Table, Searchbar } from "../../components";

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

    return (
        <>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor RSO and Student accounts"
            > 
            <UserFilter   searchQuery={searchQuery} setSearchQuery={setSearchQuery}  setSelectedRole={setSelectedRole}  />
            <Table data={data} searchQuery={searchQuery} selectedRole={selectedRole}/>
                
            </MainLayout>

        </>
    );

    // function to handle the search and filter
    function UserFilter({searchQuery, setSearchQuery, setSelectedRole}) {
      return (<div className="flex space-x-2 w-full px-4 py-4 bg-gray-200 rounded-md">
                <div className="w-1/2">
                <Searchbar placeholder="Search an Organization" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div> 
                <div className="w-full">
                
                    <select  value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-1/2 h-10 border border-gray-400 rounded-md p-1">
                        <option value="">All</option>
                        <option value="student">Student</option>
                        <option value="student/RSO">Student/RSO</option>
                    </select>
                </div>
            </div>);
    }
      }