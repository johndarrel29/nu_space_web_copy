
import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";

function MainLayout({ children, tabName, headingTitle }) {
  return (
    <div className="p-4">
    <div className="flex">
        <Sidebar />
      <main className="flex-1 pl-[18%] p-4">
        <h1 className={style.tabName}>{tabName}</h1>
        <h2 className={style.headingTitle}>{headingTitle}</h2>
        {children}
        </main>
    </div>
    </div>
  );
}

export default MainLayout;