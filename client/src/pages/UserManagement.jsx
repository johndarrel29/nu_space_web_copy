import Sidebar from "../components/Sidebar";
import MainLayout from "../components/MainLayout";
import Table from "../components/Table";
import Searchbar from "../components/Searchbar";

export default function UserManagement() {
    return (
        <div>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor RSO and Student accounts"
            > 
                <h1>Test</h1>
                <Searchbar/>
                <Table/>
            </MainLayout>

        </div>
    );
    }