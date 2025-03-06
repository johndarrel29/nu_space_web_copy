import { useState } from "react";
import { useEffect } from "react";
import { MainLayout, Table, Searchbar } from "../../components";

export default function UserManagement() {
const [data, setData] = useState([]);
const [searchQuery, setSearchQuery] = useState('');

// fetch data from json file
useEffect(() => {
    fetch("/data/MOCK_DATA.json")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

    return (
        <>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor RSO and Student accounts"
            > 
             
            <Searchbar placeholder="Search an Organization"  searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <Table data={data} searchQuery={searchQuery}/>
                
            </MainLayout>

        </>
    );
    }