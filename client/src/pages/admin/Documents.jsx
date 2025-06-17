
import { Outlet } from 'react-router-dom';
import { MainLayout } from "../../components";


export default function Documents() {


    return (
        <>
            <MainLayout
            tabName="Documents"
            headingTitle="Manage document approval"
            > 
            <div className="border border-mid-gray bg-white rounded-lg p-4">
                <Outlet />
            </div>
                

            </MainLayout>


        </>
    );
    }