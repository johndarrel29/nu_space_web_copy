import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOnlineStatus } from '../hooks';

const ProtectedRoutes = () => {
    const { user } = useAuth();
    const isOnline = useOnlineStatus();

    // Check if the user is authenticated
    // If user is authenticated, return the Outlet to render child routes

    if (!user) {
        console.log("User not authenticated, redirecting to login");
    }

    return isOnline && user ? <Outlet /> : !isOnline ? <Navigate to="/error" /> : <Navigate to="/" />;
}

export default ProtectedRoutes;