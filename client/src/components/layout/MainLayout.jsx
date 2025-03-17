
import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb } from "../ui";

function MainLayout({ children, tabName, headingTitle }) {
  return (
    <div className="h-screen  bg-background"> 
    <div className="flex ">
        <Sidebar />
      <div className="fixed left-[18%] w-[calc(100%-18%)] h-full z-0">
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