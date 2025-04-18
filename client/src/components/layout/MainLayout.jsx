import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb } from "../ui";

function MainLayout({ children, tabName, headingTitle }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(localStorage.getItem("user"));

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative h-screen z-0 left-[15%] w-[calc(100%-15%)] sm:left-[14%] sm:w-[calc(100%-14%)] md:left-[10%] md:w-[calc(100%-10%)] lg:w-[calc(100%-18%)] lg:left-[18%]">
        {/* Top Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 bg-white border border-mid-gray h-16 p-4 z-10 flex items-center justify-end">
          {/* Logout Button */}
          <div
            className="flex items-center cursor-pointer space-x-2 hover:bg-mid-gray p-2 rounded-md"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-off-black size-4"
              viewBox="0 0 512 512"
            >
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
            <h1>Log Out</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="mt-16 h-[calc(100%-4rem)] overflow-y-auto p-4">
          <div className="mb-6 flex flex-col">
            <Breadcrumb style={style.tabName} unSelected={style.disabled} />
            <h2 className={style.headingTitle}>{headingTitle}</h2>
          </div>

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;