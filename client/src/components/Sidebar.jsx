import sidebar from '../css/Sidebar.module.css';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/Header";
import dashboardIcon from "../assets/icons/gauge-solid.svg"
import usersIcon from "../assets/icons/users-solid.svg"
import userIcon from "../assets/icons/user-solid.svg"
import documentIcon from "../assets/icons/file-solid.svg"
import classNames from 'classnames';
import SidebarButton from '../components/SidebarButton';
import logo from "../assets/images/tab-logo.png";
import SidebarLogo from '../components/SidebarLogo';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={sidebar.container}>
      <div className="pt-6">
      <SidebarLogo/>

      </div>
      
      {/* The contents of the sidebar */}

        <div className={sidebar.sidebarContainer}>
          <SidebarButton icon={dashboardIcon} text="Dashboard" active={location.pathname === "/dashboard"} onClick={() => navigate("/dashboard")}/>
          <SidebarButton icon={usersIcon} text="User Management" active={location.pathname === "/user-management"} onClick={() => navigate("/user-management")}/>
          <SidebarButton icon={documentIcon} text="Documents" active={location.pathname === "/documents"} onClick={() => navigate("/documents")}/>
        

        <div className={sidebar.separator}></div> {/* Separator line */}


        </div>
        <div className={sidebar.sidebarContainer}>
        <SidebarButton icon={userIcon} text="Admin Account" active={location.pathname === "/admin-account"} onClick={() => navigate("/admin-account")}/>
        </div>  



    </div>

  );
}

export default Sidebar;