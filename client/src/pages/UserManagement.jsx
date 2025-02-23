import MainLayout from "../components/MainLayout";
import Table from "../components/Table";
import { useState } from "react";
import { useEffect } from "react";

export default function UserManagement() {
const [data, setData] = useState([]);

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
            <Table data={data}/>
                
            </MainLayout>

        </div>
    );
    }