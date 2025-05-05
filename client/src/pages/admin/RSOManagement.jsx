import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components';
import { Outlet } from 'react-router-dom';

export default function RSOManagement() {

  return (
    <>
      <MainLayout
        tabName="RSO Management"
        headingTitle="Manage RSO Account"
      >
        <div className="grid grid-cols-1 w-full">
          <div className="border border-mid-gray bg-white rounded-lg p-4">
          <Outlet />
          </div>
        </div>
    
      </MainLayout>
    </>
  );
}