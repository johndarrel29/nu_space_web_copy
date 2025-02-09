import sidebar from '../css/Sidebar.module.css';
import Header from "../components/Header";
import dashboardIcon from "../assets/icons/gauge-solid.svg"
import userIcon from "../assets/icons/users-solid.svg"
import documentIcon from "../assets/icons/file-solid.svg"
import classNames from 'classnames';
import SidebarButton from '../components/SidebarButton';

function Sidebar() {
  return (
    <div className={sidebar.container}>
      <div className="pt-6">
      <Header theme="light"/>
      </div>
      
      {/* The contents of the sidebar */}

        <div className={sidebar.sidebarContainer}>
          <SidebarButton icon={dashboardIcon} text="Dashboard" active={true} onClick={() => console.log("clicked")}/>
          <SidebarButton icon={userIcon} text="User Accounts" active={true} onClick={() => console.log("clicked")}/>
          <SidebarButton icon={documentIcon} text="Documents" active={true} onClick={() => console.log("clicked")}/>
        

        <div className={sidebar.separator}></div> {/* Separator line */}
        </div>  


    </div>

  );
}

export default Sidebar;