import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components';
import { Outlet } from 'react-router-dom';

export default function RSOManagement() {

  return (
    <>
      <MainLayout
        tabName="RSO Management"
        headingTitle="Create RSO Account"
      >

        <Outlet />
      </MainLayout>
    </>
  );
}