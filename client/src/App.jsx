
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Documents from './pages/admin/Documents';
import AdminAccount from './pages/admin/AdminAccount';
import MainActivities from './pages/admin/MainActivities';
import Activities from './pages/admin/Activities';
import MainDocuments from './pages/admin/MainDocuments';
import RSOManagement from './pages/admin/RSOManagement';
import Requirements from './pages/admin/Requirements';
import { ThemeProvider } from '@material-tailwind/react';
import MainRSO from './pages/admin/MainRSO';
import PreLoader from './components/Preloader';
import { useEffect, useState } from 'react';
import Review from './pages/admin/Review';
import { SkeletonTheme } from 'react-loading-skeleton'
import ProtectedRoutes from './utils/ProtectedRoute';

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
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticates user and redirects to dashboard if already logged in */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/documents" element={<Documents />} >
              <Route index element={<MainDocuments />} />
              <Route path="main-activities" element={<MainActivities />} >
                <Route index element={<Activities />} />
                <Route path="requirements" element={<Requirements />} />
                <Route path="review" element={<Review/>}/>
              </Route>
            </Route>
            <Route path="/admin-account" element={<AdminAccount />} />
            
            <Route path="/rso-management" element={<RSOManagement />} >
              <Route index element={<MainRSO />} />
            </Route>
          </Route>
        
      </Routes>
      </SkeletonTheme>
      )}   
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
