import { MainLayout } from '../../components';
import {  Outlet } from 'react-router-dom';


export default function ActivityPage() {

    return (
        <MainLayout
        tabName="Dashboard"
        headingTitle="See previous updates"
        >
            <Outlet/>
        </MainLayout>

    );
}