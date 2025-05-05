
import { Outlet } from 'react-router-dom';
import { MainLayout } from "../../components";


export default function Documents() {


    return (
        <>
            <MainLayout
            tabName="Documents"
            headingTitle="Manage document approval"
            > 
                <Outlet />
                

            </MainLayout>


        </>
    );
    }