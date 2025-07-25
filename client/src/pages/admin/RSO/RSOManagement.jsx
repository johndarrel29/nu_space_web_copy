import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function RSOManagement() {
  return (
    <div className="grid grid-cols-1 w-full">
      <Outlet />
    </div>
  );
}