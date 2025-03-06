
import { Outlet } from 'react-router-dom';
import { MainLayout, Breadcrumb } from "../../components";


export default function Documents() {


    return (
        <>
            <MainLayout
            tabName="Documents"
            headingTitle="Manage document approval"
            > 
                <Breadcrumb/>
                <Outlet />
                

            </MainLayout>


        </>
    );
    }