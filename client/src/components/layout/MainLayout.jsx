import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb, Button, Backdrop, SidebarButton } from "../../components";
import { useEffect, useRef, useState } from "react";
import { useUserProfile } from "../../hooks";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import Skeleton from "react-loading-skeleton";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";

//TODO: make the sidebar collapsed on mobile and it should go over the main content

function MainLayout({ children, tabName, headingTitle }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [ loading, setLoading ] = useState(false);
  const { isLoading, isError, error, webProfile, isWebProfileLoading, isWebProfileError, refetchWebProfile } = useUserProfile();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isCollapsed } = useSidebar();
  const excludedPaths = ["/document"];
  const isUserStatusActive = user?.assigned_rso?.RSO_status === false && user?.role === "rso_representative";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const shouldShowOverlay = isUserStatusActive && !excludedPaths.includes(currentPath);

  console.log("isUserStatusActive:", isUserStatusActive);


const isStudentRSO = user?.role === "rso_representative";
const isAdmin = user?.role === "admin";
const isSuperAdmin = user?.role === "super_admin";

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
      // wait 1 second before logging out
    setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
      sessionStorage.removeItem("user"); 
      window.location.href = "/login";
    }, 1000);
  };


  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar/>

      {/* mobile sidebar */}
      <Backdrop className={`${mobileSidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-ease-in-out duration-300 xl:hidden`}/>
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} fixed top-0 left-0 h-screen z-50 bg-white w-[60%] lg:w-1/4 p-6 transition-ease-in-out duration-300 xl:hidden`}>

        <div className="flex items-center justify-between ">

          {/* header */}
          Logo
          <div 
          onClick={() => setMobileSidebarOpen(false)}
          className='transition-ease-in-out duration-300 aspect-square w-10 bg-white border border-mid-gray rounded-full flex items-center justify-center cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
          </div>
        </div>

        {/* Buttons */}
        <SidebarButton 
        isCollapsed={true}
        iconPath={"M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z"}
        text="Documents" 
        active={location.pathname === "/document"} 
        onClick={() => navigate("/document")}
        />
        {/* change back to user-management once ready */}
        <SidebarButton
        isCollapsed={true}
        iconPath={"M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0c-14.7 0-26.7-11.9-26.7-26.7zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"}
        text="User Management" 
        active={location.pathname === "/user-management"} 
        onClick={() => navigate("/user-management")}
        />
        <SidebarButton
        isCollapsed={true}
        iconPath={"M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.6C495 83.4 512 107.5 512 134.6l0 242.9c0 27-17 51.2-42.5 60.3l-192 68.6c-13.9 5-29.1 5-43.1 0l-192-68.6C17 428.6 0 404.5 0 377.4L0 134.6c0-27 17-51.2 42.5-60.3l192-68.6zM256 66L82.3 128 256 190l173.7-62L256 66zm32 368.6l160-57.1 0-188L288 246.6l0 188z"} 
        text="Activities" 
        active={location.pathname.startsWith("/documents")} 
        onClick={() => navigate("/documents")}
        />

        <div className="mt-4 mb-4 bg-mid-gray py-[1px] rounded"></div> {/* Separator line */}

      <SidebarButton
      isCollapsed={true}
      iconPath={"M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"} 
      text="RSO Account" 
      active={location.pathname === "/account"} 
      onClick={() => navigate("/account")}
      />
      </div>


      {/* Main Content Area */}
      <div 
      className={`relative h-screen z-0 transition-all duration-300 
      ${isCollapsed ? 'xl:left-[15%] xl:w-[calc(100%-15%)] w-full' : 'xl:left-[80px] xl:w-[calc(100%-80px)] w-full'}`}>

        {/* Top Navigation Bar */}
        <div className="flex flex-col w-full">
          <div className="fixed top-0 left-0 right-0 bg-white border border-mid-gray h-16 p-4 z-50 flex items-center justify-between gap-4">
          
          {/* collapse sidebar button */}
          <div 
          onClick={() => setMobileSidebarOpen(true)}
          className='block xl:invisible transition-ease-in-out duration-300 aspect-square w-10 bg-white border border-mid-gray rounded-full flex items-center justify-center cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
          </div>

          {/* group notification module and profile picture */}
          <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-2 justify-center">
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
                      //replace user with API call user
                      isStudentRSO ? (
                        <div className="flex flex-col justify-center items-start w-[200px]">
                          <h1 className='text-sm font-bold'>{webProfile?.assigned_rso?.RSO_acronym || 'N/A'}</h1>
                          <h2 className='text-xs w-full truncate text-gray-500 text-start'>{webProfile?.assigned_rso?.RSO_name || 'Not Assigned'}</h2>
                        </div>
                      )
                      :
                      (isAdmin || isSuperAdmin) ? (
                        <>
                        <div className='flex flex-col justify-center items-start w-[120px]'>
                          <div>
                            <h1 className='text-sm font-bold'>{webProfile?.firstName} {webProfile?.lastName}</h1>
                          </div>
                          <h1 className='text-xs truncate text-gray-500'>{isAdmin ? "Admin" : ""}</h1>
                        </div>

                        </>
                      )
                      :
                      (
                        <div className="flex flex-col justify-center items-start w-[120px]">
                          <h1 className='text-sm font-light text-gray-600 h-4 w-24'>User not found</h1>
                        </div>
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
          <main className={`mt-16 h-full overflow-y-auto p-4 pl-12 pr-12 
            ${isCollapsed ? 'left-[15%] ' : 'left-[80px] '}`}>
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