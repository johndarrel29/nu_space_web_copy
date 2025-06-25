import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes = () => {
    const { user } = useAuth();
    // Check if the user is authenticated
    // If user is authenticated, return the Outlet to render child routes

    return user ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;