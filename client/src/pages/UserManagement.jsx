import MainLayout from "../components/MainLayout";
import Table from "../components/Table";
import DeleteModal from "../components/DeleteModal";


export default function UserManagement() {
    return (
        <div>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor RSO and Student accounts"
            > 
                <Table/>
                
            </MainLayout>

        </div>
    );
    }