
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import { ThemeProvider } from '@material-tailwind/react';
import PreLoader from './components/Preloader';
import { useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import ProtectedRoutes from './utils/ProtectedRoute';
import { DocumentPage, RSOAccountPage, UserMgmtPage, ActivityDocuments, MainActivityPage, CreateActivity, Document, ActivityPage } from './pages/rso';
import { Activities, Account, Dashboard, DocumentAction, Documents, MainActivities, MainDocuments, MainRSO, Requirements, Review, RSODetails, RSOManagement, UserManagement, RSOAction} from './pages/admin';
import { initMaterialTailwind } from '@material-tailwind/html';

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
          {/* rso */}
            <Route path="/activity-page" element={<ActivityPage />}> 
              <Route index element={<MainActivityPage />} />
              <Route path="activity-documents" element={<ActivityDocuments />} />
              <Route path="create-activity" element={<CreateActivity />} />
            </Route>
            <Route path="/rso-account" element={<RSOAccountPage />} />
            <Route path="/rso-user-management" element={<UserMgmtPage />} />
            <Route path="/document" element={<Document />} /> 
                
            

          {/* sdao */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/documents" element={<Documents />} >
              <Route index element={<MainDocuments />} />
              <Route path="document-action" element={<DocumentAction />} />
              {/* <Route path="main-activities" element={<MainActivities />} > */}
              <Route path=":activityId" element={<MainActivities />} >
                <Route index element={<Activities />} />
                <Route path="requirements" element={<Requirements />} />
                <Route path="review" element={<Review/>}/>
              </Route>
              
            </Route>
            <Route path="/account" element={<Account />} />
            
            <Route path="/rso-management" element={<RSOManagement />} >
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
  );
}

export default App;
