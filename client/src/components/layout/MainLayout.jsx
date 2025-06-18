import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb, Button } from "../ui";
import { useEffect, useRef, useState } from "react";
import { useUserProfile } from "../../hooks";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import Skeleton from "react-loading-skeleton";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

//TODO: make the sidebar collapsed on mobile and it should go over the main content

function MainLayout({ children, tabName, headingTitle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [ loading, setLoading ] = useState(false);
  const { user, isLoading, isError, error } = useUserProfile();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isCollapsed } = useSidebar();
  
  const excludedPaths = ["/document"];
  const isUserStatusActive = user?.assigned_rso?.RSO_status === false && user?.role === "student/rso";

  const shouldShowOverlay = isUserStatusActive && !excludedPaths.includes(currentPath);

  console.log("isUserStatusActive:", isUserStatusActive);


const isStudentRSO = user?.role === "student/rso";
const isAdmin = user?.role === "admin";
const isSuperAdmin = user?.role === "superadmin";

console.log(isSuperAdmin && "Super Admin detected");

useEffect(() => {
  if (error) {
    console.log("Profile‐load error state is now:", error);
  }
}, [error]);



    useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user"); 
    window.location.href = "/login";
  };


  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content Area */}
      <div 
      className={`relative h-screen z-0 transition-all duration-300 
      ${isCollapsed ? 'left-[15%] w-[calc(100%-15%)]' : 'left-[80px] w-[calc(100%-80px)]'}`}>
        {/* Top Navigation Bar */}
        <div className="flex flex-col w-full">
          <div className="fixed top-0 left-0 right-0 bg-white border border-mid-gray h-16 p-4 z-50 flex items-center justify-end gap-4">
          {/* admin and super admin only */}
          {(isAdmin || isSuperAdmin) && (
            <Button style={"secondary"}>
              <div className="flex items-center gap-2 text-sm font-light ">
                Create Announcement
              </div>
            </Button>
          )}
          {/* student rso only */}
          {isStudentRSO && (
            <div className="rounded-full h-8 w-8 hover:bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 fill-gray-800" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/></svg>
            </div>
          )}
          <div className='flex items-center justify-between text-center pr-6 '>

            
            <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative"
            ref={dropdownRef} >
            <div className="flex items-center justify-center rounded-full h-8 w-8 cursor-pointer hover:bg-light-gray group">
              {isStudentRSO ? (
                <img
                  src={user?.assigned_rso?.signed_picture || DefaultPicture}
                  alt="Profile"
                  className="rounded-full h-full w-full object-cover"
                />
              ) : 
              (isAdmin || isSuperAdmin) ? (
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-8 fill-gray-700" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
                </div>
              )
              :
              (
                <img
                  src={DefaultPicture}
                  alt="Profile"
                  className="rounded-full h-full w-full object-cover"
                />
              )}
            </div>
          
          

          {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-6 right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-40 pl-2 pr-2">
                    <div 
                      className="w-full flex items-start gap-2  py-2 text-sm rounded mb-2 "
                    >
                      <div className="flex items-center gap-2">
                        {/* profile picture */}
                        {isStudentRSO ? (
                          <div className="rounded-full h-8 w-8 bg-gray-200">
                            <img src={user?.assigned_rso?.signed_picture || DefaultPicture} alt="Profile" className="rounded-full h-full w-full object-cover" />
                          </div>
                        ) : 
                        (isAdmin || isSuperAdmin) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-8 fill-gray-700" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>

                        ) : (
                          <div className="rounded-full h-8 w-8 bg-gray-200">
                            <img src={DefaultPicture} alt="Profile" className="rounded-full h-full w-full object-cover" />
                          </div>
                        )}

                        {/* name */}
                        <div className="flex flex-col justify-center items-start">
                          <h1 className="text-sm font-bold">
                          {loading ? (
                  <div className="flex flex-col justify-center items-start w-[120px]">
                    <Skeleton width={80} height={10} />
                    <Skeleton width={100} height={10} />
                  </div>
                    )
                    :
                    error ? (
                      <div className="flex flex-col justify-center items-start w-[120px]">
                        <h1 className='text-sm font-light text-gray-600 h-4 w-24'>User not found</h1>
                      </div>
                    ) :
                    
                    isStudentRSO ? (
                      <div className="flex flex-col justify-center items-start w-[200px]">
                        <h1 className='text-sm font-bold'>{user?.assigned_rso?.RSO_acronym || 'N/A'}</h1>
                        <h2 className='text-xs w-full truncate text-gray-500 text-start'>{user?.assigned_rso?.RSO_name || 'Not Assigned'}</h2>
                      </div>
                    )
                    :
                    (isAdmin || isSuperAdmin) && (
                      <>
                      <div className='flex flex-col justify-center items-start w-[120px]'>
                        <div>
                          <h1 className='text-sm font-bold'>{user?.firstName} {user?.lastName}</h1>
                        </div>
                        <h1 className='text-xs truncate text-gray-500'>{isAdmin ? "Admin" : ""}</h1>
                      </div>

                      </>
                    )
                    }
                          </h1>
                        </div>
                      </div>
                    </div>

                    {/* line separator */}
                    <div className="h-px w-full bg-gray-200 mb-2"></div>

                    <div 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-off-black hover:bg-gray-100 cursor-pointer rounded mb-2"
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="fill-off-black size-4" viewBox="0 0 512 512">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                      </svg>
                      Log Out
                    </div>
                  </div>
                )}
              </div>
          </div>
          </div>
          {isUserStatusActive && (
            <div className="fixed top-16 left-[10%] bg-white w-full h-8  z-30">
              <div className="flex items-center justify-center h-full bg-yellow-100 text-yellow-800">
                <h1 className="text-sm font-semibold">
                  <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="fill-yellow-800 size-4" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                      This account is in view-only mode. Settle Documents to enable editing.
                  </div>
                </h1>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
            {shouldShowOverlay && (
              <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center pointer-events-auto">
                <h1 className="text-yellow-800 font-semibold bg-yellow-100 px-4 py-2 rounded shadow">
                  View-only mode enabled
                </h1>
              </div>
            )}
          <main className="mt-16 h-full overflow-y-auto p-4 pl-12 pr-12">
            <div className="mb-6 flex flex-col">
              <Breadcrumb style={style.tabName} unSelected={style.disabled} />
            </div>

            {/* Page Content */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;