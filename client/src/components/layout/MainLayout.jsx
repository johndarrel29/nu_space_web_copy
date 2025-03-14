
import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb } from "../ui";

function MainLayout({ children, tabName, headingTitle }) {
  return (
    <div className="p-4">
    <div className="flex">
        <Sidebar />
      <main className="flex-1 pl-[18%] ">
        <div className="mb-6">
          {/* <h1 className={style.tabName}>{tabName}</h1> */}
          <Breadcrumb style={style.tabName} unSelected={style.disabled}/>
          <h2 className={style.headingTitle}>{headingTitle}</h2>
        </div>
        {children}
        </main>
    </div>
    </div>
  );
}

export default MainLayout;