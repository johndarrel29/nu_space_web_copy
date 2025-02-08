import sidebar from '../css/Sidebar.module.css';
import Header from "../components/Header";

function Sidebar() {
  return (
    <div className={sidebar.container}>
      <div className="pt-6">
      <Header/>
      </div>
      
    </div>
  );
}

export default Sidebar;