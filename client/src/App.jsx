
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Documents from './pages/admin/Documents';
import AdminAccount from './pages/admin/AdminAccount';
import Activities from './pages/admin/Activities';
import MainDocuments from './pages/admin/MainDocuments';
import RSOManagement from './pages/admin/RSOManagement';
import Requirements from './pages/admin/Requirements';
import { ThemeProvider } from '@material-tailwind/react';
import MainRSO from './pages/admin/MainRSO';
import PreLoader from './components/Preloader';
import { gsap } from "gsap";
import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (same as GSAP animation delay in Preloader.js)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); 

    return () => clearTimeout(timer); // Cleanup function
  }, []);

  return (
<ThemeProvider>
    <BrowserRouter>
      {loading ? (<PreLoader />
      ): (
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/documents" element={<Documents />} >
          <Route index element={<MainDocuments />} />
          <Route path="activities" element={<Activities />} />
          <Route path="requirements" element={<Requirements />} />
        </Route>
        <Route path="/admin-account" element={<AdminAccount />} />
        
        <Route path="/rso-management" element={<RSOManagement />} >
          <Route index element={<MainRSO />} />
        </Route>
      </Routes>
      )}
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
