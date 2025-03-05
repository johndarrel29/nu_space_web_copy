import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from '../../components';


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