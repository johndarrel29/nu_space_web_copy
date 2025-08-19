import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import MainLogin from './pages/MainLogin';
import PasswordAction from './pages/PasswordAction';
import EmailAction from './pages/EmailAction';
import MainRegister from './pages/MainRegister';
import ErrorPage from './pages/ErrorPage';
import { ThemeProvider } from '@material-tailwind/react';
import PreLoader from './components/Preloader';
import { useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import ProtectedRoutes from './utils/ProtectedRoute';
import { MainLayout } from './components';
import { Document } from './pages/rso';
import { AnnouncementsPage, Forms, FormsBuilder, FormViewerPage, Activities, Account, Dashboard, DocumentAction, Documents, MainActivities, MainDocuments, MainRSO, RSODetails, RSOParent, Users, RSOAction, AdminDocuments, AdminTemplates, DocumentDetails, MainAdmin, AcademicYear } from './pages/admin';
import { initMaterialTailwind } from '@material-tailwind/html';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateToken, messaging } from './config/firebase';
import { onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';



function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMaterialTailwind();
  }, []);

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);

      toast.info(payload.notification.body);
    });
  }, [generateToken]);

  useEffect(() => {
    // Simulate loading time (same as GSAP animation delay in Preloader.js)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <SidebarProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />

            {loading ? (
              <PreLoader />
            ) : (
              <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                <Routes>
                  <Route path="/" element={<Login />}>
                    <Route index element={<MainLogin />} />
                    <Route path="password-action" element={<PasswordAction />} />
                    <Route path="email-action" element={<EmailAction />} />
                    <Route path="register" element={<MainRegister />} />
                  </Route>

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
                      path="/users"
                      element={
                        <MainLayout
                          tabName="Users"
                          headingTitle="Monitor RSO Representative and Student accounts"
                        >
                          <Users />
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
                    <Route
                      path="/announcements"
                      element={
                        <MainLayout
                          tabName="Announcements"
                          headingTitle="View and Manage Announcements"
                        >
                          <AnnouncementsPage />
                        </MainLayout>
                      }
                    />

                    <Route path="/admin-documents" element={
                      <MainLayout
                        tabName="Admin Documents"
                      >
                        <AdminDocuments />
                      </MainLayout>
                    }>
                      <Route index element={<MainAdmin />} />
                      <Route path=":documentId" element={<DocumentDetails />} />
                      <Route path="templates" element={<AdminTemplates />} />
                    </Route>

                    <Route path="/academic-year" element={
                      <MainLayout
                        tabName="Academic Year"
                        headingTitle="Manage Academic Years"
                      >
                        <AcademicYear />
                      </MainLayout>
                    } />

                    <Route path="/forms" element={
                      <MainLayout
                        tabName="Forms"
                        headingTitle="Manage Forms"
                      >
                        <Forms />
                      </MainLayout>
                    } />

                    <Route path="/forms-builder" element={<FormsBuilder />} />
                    <Route path="/form-viewer" element={<FormViewerPage />} />

                    {/* RSO Management routes */}
                    <Route
                      path="/rsos"
                      element={
                        <MainLayout
                          tabName="RSOs"
                          headingTitle="Manage RSO Account"
                        >
                          <RSOParent />
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
    </AuthProvider>
  );
}

export default App;

/*
Removed routes:
- /activity-page
- /rso-account
- /rso-users
- requirements subroute under documents/:activityId
- review subroute under documents/:activityId
*/