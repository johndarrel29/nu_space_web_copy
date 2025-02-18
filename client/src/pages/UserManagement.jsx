import MainLayout from "../components/MainLayout";
import Table from "../components/Table";
import Searchbar from "../components/Searchbar";
import PreviewPane from "../components/PreviewPane";


export default function UserManagement() {
    return (
        <div>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor RSO and Student accounts"
            > 
                <Searchbar/>
                <Table/>

            </MainLayout>

        </div>
    );
    }