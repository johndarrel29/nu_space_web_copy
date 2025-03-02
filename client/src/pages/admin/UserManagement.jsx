import MainLayout from "../../components/MainLayout";
import Table from "../../components/Table";
import Searchbar from "../../components/Searchbar";
import { useState } from "react";
import { useEffect } from "react";

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
        <div>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor RSO and Student accounts"
            > 
             
            <Searchbar placeholder="Search an Organization"  searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <Table data={data} searchQuery={searchQuery}/>
                
            </MainLayout>

        </div>
    );
    }