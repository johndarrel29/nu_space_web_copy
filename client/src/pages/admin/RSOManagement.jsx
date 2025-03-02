import React, { useState } from 'react';
import MainLayout from "../../components/MainLayout";
import { Outlet } from 'react-router-dom';


export default function Activities() {
    return (
        <div>
            <MainLayout
            tabName="RSO Management"
            headingTitle="Create RSO Account"
            > 
            <Outlet/>
            </MainLayout>

        </div>
    );
}