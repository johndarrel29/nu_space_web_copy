
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Documents from './pages/Documents';
import AdminAccount from './pages/AdminAccount';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/admin-account" element={<AdminAccount />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
