
import { Outlet } from 'react-router-dom';
import { MainLayout, Breadcrumb } from "../../components";


export default function Documents() {


    return (
        <div>
            <MainLayout
            tabName="Documents"
            headingTitle="Manage document approval"
            > 
                <Breadcrumb/>
                <Outlet />
                

            </MainLayout>


        </div>
    );
    }