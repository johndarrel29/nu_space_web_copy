import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb } from "../ui";
import { useEffect, useRef, useState } from "react";
import { useUserProfile } from "../../hooks";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import Skeleton from "react-loading-skeleton";
import { useLocation } from "react-router-dom";

function MainLayout({ children, tabName, headingTitle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [ loading, setLoading ] = useState(false);
  const { user, isLoading, isError, error } = useUserProfile();
  const location = useLocation();
  const currentPath = location.pathname;

  
  console.log("user firstName:", user?.firstName);
  console.log("user lastName:", user?.lastName);
  console.log("user ", user);
  console.log("user status ", user?.assigned_rso?.RSO_status);
  console.log("user picture", user?.rso?.RSO_picture);
  
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
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative h-screen z-0 left-[15%] w-[calc(100%-15%)] sm:left-[14%] sm:w-[calc(100%-14%)] md:left-[10%] md:w-[calc(100%-10%)] lg:w-[calc(100%-18%)] lg:left-[18%]">
        {/* Top Navigation Bar */}
        <div className="flex flex-col w-full">
          <div className="fixed top-0 left-0 right-0 bg-white border border-mid-gray h-16 p-4 z-50 flex items-center justify-end gap-8">

          <div className='flex items-center justify-between text-center pr-6 '>
            <div className="flex justify-start items-center gap-2 pr-6">
            {loading ? (
                <Skeleton circle={true} height={32} width={32} />
            )
            :
              <div className='rounded-full h-8 w-8 bg-gray-200 '>
                {          
                error ? (
                  <img
                    src={DefaultPicture}
                    alt="Profile"
                    className="rounded-full h-full w-full object-cover"
                  />
            )
                :
                isStudentRSO ? (
                  
                  <img
                      src={user?.assigned_rso?.signed_picture || DefaultPicture}
                    alt="Profile"
                    className="rounded-full h-full w-full object-cover"
                  />
                )
                :
                isAdmin ? (
                  <img
                    src={DefaultPicture}
                    alt="Profile"
                    className="rounded-full h-full w-full object-cover"
                  />
                ) 
                :
                <img
                  src={DefaultPicture}
                  alt="Profile"
                  className="rounded-full h-full w-full object-cover"
                />
                
                }

              </div>
            }

            {/* the text */}
              <div className='flex flex-col justify-center items-start'>

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
                  <div className="flex flex-col justify-center items-start w-[120px]">
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

                

              </div>
            </div>
            
            <div 
            // onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            ref={dropdownRef} >
            <div className="flex items-center justify-center rounded-full h-8 w-8 cursor-pointer hover:bg-light-gray group">
              <svg xmlns="http://www.w3.org/2000/svg" className="fill-gray-800 size-6 group-hover:fill-off-black" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </div>
          
          

          {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-6  right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40">
                    <div 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-off-black hover:bg-gray-100 cursor-pointer"
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
          <main className="mt-16 h-[calc(100%-4rem)] overflow-y-auto p-4 pl-12 pr-12">
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