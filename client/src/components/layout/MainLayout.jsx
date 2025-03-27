
import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb } from "../ui";

function MainLayout({ children, tabName, headingTitle }) {
  return (
    <div className="h-screen  bg-background"> 
    <div className="flex ">
      <Sidebar />
      <div className="fixed h-full z-0 left-[15%] w-[calc(100%-15%)] sm:left-[14%] sm:w-[calc(100%-14%)]  md:left-[10%] md:w-[calc(100%-10%)]  lg:w-[calc(100%-18%)] lg:left-[18%]">
        <main className="h-full overflow-y-auto p-4">
          <div className="mb-6">
            {/* <h1 className={style.tabName}>{tabName}</h1> */}
            <Breadcrumb style={style.tabName} unSelected={style.disabled}/>
            <h2 className={style.headingTitle}>{headingTitle}</h2>
          </div>
          {children}
          </main>
      </div>
      
    </div>
    </div>
  );
}

export default MainLayout;