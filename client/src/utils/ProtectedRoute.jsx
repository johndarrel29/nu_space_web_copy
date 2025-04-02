import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(localStorage.getItem("user"));

    return user ? <Outlet/> : <Navigate to="/login" />;
}

export default ProtectedRoutes;