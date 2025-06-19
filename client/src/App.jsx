import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import { ThemeProvider } from '@material-tailwind/react';
import PreLoader from './components/Preloader';
import { useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import ProtectedRoutes from './utils/ProtectedRoute';
import { MainLayout } from './components';
import { Document } from './pages/rso';
import { FormsBuilder, Activities, Account, Dashboard, DocumentAction, Documents, MainActivities, MainDocuments, MainRSO, RSODetails, RSOManagement, UserManagement, RSOAction } from './pages/admin';
import { initMaterialTailwind } from '@material-tailwind/html';
import { SidebarProvider } from './context/SidebarContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMaterialTailwind(); 
  }, []);

  useEffect(() => {
    // Simulate loading time (same as GSAP animation delay in Preloader.js)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarProvider>
      <ThemeProvider>
        <BrowserRouter>
          {loading ? (
            <PreLoader />
          ) : (
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              <Routes>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes for authenticated users */}
                <Route element={<ProtectedRoutes />}>
                  {/* RSO routes */}
                  <Route 
                    path="/document" 
                    element={
                      <MainLayout 
                        tabName="Documents" 
                        headingTitle="View and Upload Documents"
                      >
                        <Document />
                      </MainLayout>
                    } 
                  />
                  
                  {/* SDAO admin routes */}
                  <Route path="/error" element={<ErrorPage />} />
                  
                  <Route 
                    path="/dashboard" 
                    element={
                      <MainLayout 
                        tabName="Dashboard" 
                        headingTitle="See previous updates"
                      >
                        <Dashboard />
                      </MainLayout>
                    } 
                  />
                  
                  <Route 
                    path="/user-management" 
                    element={
                      <MainLayout 
                        tabName="User Management" 
                        headingTitle="Monitor RSO Representative and Student accounts"
                      >
                        <UserManagement />
                      </MainLayout>
                    } 
                  />
                  
                  <Route 
                    path="/documents" 
                    element={
                      <MainLayout 
                        tabName="Documents" 
                        headingTitle="Manage document approval"
                      >
                        <Documents />
                      </MainLayout>
                    } 
                  >
                    <Route index element={<MainDocuments />} />
                    <Route path="document-action" element={<DocumentAction />} />
                    <Route path=":activityId" element={<MainActivities />}>
                      <Route index element={<Activities />} />
                    </Route>
                  </Route>
                  
                  <Route 
                    path="/account" 
                    element={
                      <MainLayout 
                        tabName="Admin Account" 
                        headingTitle="Admin Full Name"
                      >
                        <Account />
                      </MainLayout>
                    } 
                  />
                  
                  <Route path="/forms-builder" element={<FormsBuilder />} />
                  
                  <Route 
                    path="/rso-management" 
                    element={
                      <MainLayout 
                        tabName="RSO Management" 
                        headingTitle="Manage RSO Account"
                      >
                        <RSOManagement />
                      </MainLayout>
                    } 
                  >
                    <Route index element={<MainRSO />} />
                    <Route path="rso-action" element={<RSOAction />} />
                    <Route path="rso-details" element={<RSODetails />} />
                  </Route>
                </Route>
              </Routes>
            </SkeletonTheme>
          )}   
        </BrowserRouter>
      </ThemeProvider>
    </SidebarProvider>
  );
}

export default App;

/*
Removed routes:
- /activity-page
- /rso-account
- /rso-user-management
- requirements subroute under documents/:activityId
- review subroute under documents/:activityId
*/