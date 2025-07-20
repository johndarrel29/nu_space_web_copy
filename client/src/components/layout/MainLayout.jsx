import Sidebar from "./Sidebar";
import style from "../../css/Sidebar.module.css";
import { Breadcrumb, Button, Backdrop, SidebarButton } from "../../components";
import { use, useEffect, useRef, useState } from "react";
import { useUserProfile } from "../../hooks";
import DefaultPicture from "../../assets/images/default-profile.jpg";
import Skeleton from "react-loading-skeleton";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import NewLogo from "../../assets/images/newLogo.png"
import { useAuth } from "../../context/AuthContext";

function MainLayout({ children, tabName, headingTitle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const {
    userProfile,
    userProfileError,
    isUserProfileLoading,
    isUserProfileError,
    refetchUserProfile,
    deleteOfficerMutate,
    isDeleting,
    isDeleteError,
  } = useUserProfile();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isCollapsed } = useSidebar();
  const excludedPaths = ["/document"];
  const isUserStatusActive = user?.assigned_rso?.RSO_status === false && user?.role === "rso_representative";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const shouldShowOverlay = isUserStatusActive && !excludedPaths.includes(currentPath);
  const [profileData, setProfileData] = useState(null);
  const [isNotificationClicked, setIsNotificationClicked] = useState(false);
  const notificationRef = useRef(null);

  const isStudentRSO = user?.role === "rso_representative";
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    if (userProfile) {
      console.log("User profile loaded successfully:", userProfile);
      console.log("rso:", userProfile?.rso);
    }
  }, [userProfile]);

  useEffect(() => {
    refetchUserProfile();
  }, [refetchUserProfile]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationClicked(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  })

  console.log("User profile data:", userProfile);

  useEffect(() => {
    if (isStudentRSO) {
      setProfileData(userProfile?.rso || null);
    } else if (isAdmin || isSuperAdmin) {
      setProfileData(userProfile?.user || null);
    }
  })

  useEffect(() => {
    if (userProfileError) {
      console.log("Profile load userProfileError state is now:", userProfileError);
    }
  }, [userProfileError]);

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
      logout();
    }, 1000);

  };

  const isOnAnnouncementPage = currentPath.includes("/announcement");

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* mobile sidebar */}
      <Backdrop className={`${mobileSidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-ease-in-out duration-300 xl:hidden`} />
      <div className={`${mobileSidebarOpen ? 'block' : 'hidden'} fixed top-0 left-0 h-screen z-50 ${isStudentRSO ? `bg-white` : `bg-primary`} w-[300px]  p-6 transition-ease-in-out duration-300 xl:hidden`}>

        <div className="flex items-center justify-between ">

          {/* header */}
          <img src={NewLogo} alt="NU Space" className="h-8" />
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className={`transition-ease-in-out duration-300 aspect-square w-10 ${isStudentRSO ? `bg-white border border-mid-gray` : `bg-primary border border-white`} rounded-full flex items-center justify-center cursor-pointer`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`size-4 ${isStudentRSO ? `fill-off-black` : `fill-white`}`} viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" /></svg>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-2 h-full  ">
          <SidebarButton
            isCollapsed={true}
            iconPath={
              isStudentRSO
                ? "M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z"
                : isAdmin
                  ? "M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"
                  : "M144 160A80 80 0 1 0 144 0a80 80 0 1 0 0 160zm368 0A80 80 0 1 0 512 0a80 80 0 1 0 0 160zM0 298.7C0 310.4 9.6 320 21.3 320l213.3 0c.2 0 .4 0 .7 0c-26.6-23.5-43.3-57.8-43.3-96c0-7.6 .7-15 1.9-22.3c-13.6-6.3-28.7-9.7-44.6-9.7l-42.7 0C47.8 192 0 239.8 0 298.7zM320 320c24 0 45.9-8.8 62.7-23.3c2.5-3.7 5.2-7.3 8-10.7c2.7-3.3 5.7-6.1 9-8.3C410 262.3 416 243.9 416 224c0-53-43-96-96-96s-96 43-96 96s43 96 96 96zm65.4 60.2c-10.3-5.9-18.1-16.2-20.8-28.2l-103.2 0C187.7 352 128 411.7 128 485.3c0 14.7 11.9 26.7 26.7 26.7l300.6 0c-2.1-5.2-3.2-10.9-3.2-16.4l0-3c-1.3-.7-2.7-1.5-4-2.3l-2.6 1.5c-16.8 9.7-40.5 8-54.7-9.7c-4.5-5.6-8.6-11.5-12.4-17.6l-.1-.2-.1-.2-2.4-4.1-.1-.2-.1-.2c-3.4-6.2-6.4-12.6-9-19.3c-8.2-21.2 2.2-42.6 19-52.3l2.7-1.5c0-.8 0-1.5 0-2.3s0-1.5 0-2.3l-2.7-1.5zM533.3 192l-42.7 0c-15.9 0-31 3.5-44.6 9.7c1.3 7.2 1.9 14.7 1.9 22.3c0 17.4-3.5 33.9-9.7 49c2.5 .9 4.9 2 7.1 3.3l2.6 1.5c1.3-.8 2.6-1.6 4-2.3l0-3c0-19.4 13.3-39.1 35.8-42.6c7.9-1.2 16-1.9 24.2-1.9s16.3 .6 24.2 1.9c22.5 3.5 35.8 23.2 35.8 42.6l0 3c1.3 .7 2.7 1.5 4 2.3l2.6-1.5c16.8-9.7 40.5-8 54.7 9.7c2.3 2.8 4.5 5.8 6.6 8.7c-2.1-57.1-49-102.7-106.6-102.7zm91.3 163.9c6.3-3.6 9.5-11.1 6.8-18c-2.1-5.5-4.6-10.8-7.4-15.9l-2.3-4c-3.1-5.1-6.5-9.9-10.2-14.5c-4.6-5.7-12.7-6.7-19-3l-2.9 1.7c-9.2 5.3-20.4 4-29.6-1.3s-16.1-14.5-16.1-25.1l0-3.4c0-7.3-4.9-13.8-12.1-14.9c-6.5-1-13.1-1.5-19.9-1.5s-13.4 .5-19.9 1.5c-7.2 1.1-12.1 7.6-12.1 14.9l0 3.4c0 10.6-6.9 19.8-16.1 25.1s-20.4 6.6-29.6 1.3l-2.9-1.7c-6.3-3.6-14.4-2.6-19 3c-3.7 4.6-7.1 9.5-10.2 14.6l-2.3 3.9c-2.8 5.1-5.3 10.4-7.4 15.9c-2.6 6.8 .5 14.3 6.8 17.9l2.9 1.7c9.2 5.3 13.7 15.8 13.7 26.4s-4.5 21.1-13.7 26.4l-3 1.7c-6.3 3.6-9.5 11.1-6.8 17.9c2.1 5.5 4.6 10.7 7.4 15.8l2.4 4.1c3 5.1 6.4 9.9 10.1 14.5c4.6 5.7 12.7 6.7 19 3l2.9-1.7c9.2-5.3 20.4-4 29.6 1.3s16.1 14.5 16.1 25.1l0 3.4c0 7.3 4.9 13.8 12.1 14.9c6.5 1 13.1 1.5 19.9 1.5s13.4-.5 19.9-1.5c7.2-1.1 12.1-7.6 12.1-14.9l0-3.4c0-10.6 6.9-19.8 16.1-25.1s20.4-6.6 29.6-1.3l2.9 1.7c6.3 3.6 14.4 2.6 19-3c3.7-4.6 7.1-9.4 10.1-14.5l2.4-4.2c2.8-5.1 5.3-10.3 7.4-15.8c2.6-6.8-.5-14.3-6.8-17.9l-3-1.7c-9.2-5.3-13.7-15.8-13.7-26.4s4.5-21.1 13.7-26.4l3-1.7zM472 384a40 40 0 1 1 80 0 40 40 0 1 1 -80 0z"
            }
            text={isStudentRSO ? "Documents" : isAdmin ? "Dashboard" : "User Management"}
            active={isStudentRSO ? (location.pathname === "/document") : isAdmin ? (location.pathname.startsWith("/dashboard")) : isSuperAdmin ? (location.pathname === "/user-management") : false}
            onClick={() => navigate(isStudentRSO ? "/document" : isAdmin ? "/dashboard" : isSuperAdmin ? "/user-management" : "/userProfileError")}
          />
          {/* change back to user-management once ready */}
          {(isAdmin || isStudentRSO) && (
            <>
              <SidebarButton
                isCollapsed={true}
                iconPath={
                  isStudentRSO
                    ? "M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0c-14.7 0-26.7-11.9-26.7-26.7zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
                    :
                    "M144 160A80 80 0 1 0 144 0a80 80 0 1 0 0 160zm368 0A80 80 0 1 0 512 0a80 80 0 1 0 0 160zM0 298.7C0 310.4 9.6 320 21.3 320l213.3 0c.2 0 .4 0 .7 0c-26.6-23.5-43.3-57.8-43.3-96c0-7.6 .7-15 1.9-22.3c-13.6-6.3-28.7-9.7-44.6-9.7l-42.7 0C47.8 192 0 239.8 0 298.7zM320 320c24 0 45.9-8.8 62.7-23.3c2.5-3.7 5.2-7.3 8-10.7c2.7-3.3 5.7-6.1 9-8.3C410 262.3 416 243.9 416 224c0-53-43-96-96-96s-96 43-96 96s43 96 96 96zm65.4 60.2c-10.3-5.9-18.1-16.2-20.8-28.2l-103.2 0C187.7 352 128 411.7 128 485.3c0 14.7 11.9 26.7 26.7 26.7l300.6 0c-2.1-5.2-3.2-10.9-3.2-16.4l0-3c-1.3-.7-2.7-1.5-4-2.3l-2.6 1.5c-16.8 9.7-40.5 8-54.7-9.7c-4.5-5.6-8.6-11.5-12.4-17.6l-.1-.2-.1-.2-2.4-4.1-.1-.2-.1-.2c-3.4-6.2-6.4-12.6-9-19.3c-8.2-21.2 2.2-42.6 19-52.3l2.7-1.5c0-.8 0-1.5 0-2.3s0-1.5 0-2.3l-2.7-1.5zM533.3 192l-42.7 0c-15.9 0-31 3.5-44.6 9.7c1.3 7.2 1.9 14.7 1.9 22.3c0 17.4-3.5 33.9-9.7 49c2.5 .9 4.9 2 7.1 3.3l2.6 1.5c1.3-.8 2.6-1.6 4-2.3l0-3c0-19.4 13.3-39.1 35.8-42.6c7.9-1.2 16-1.9 24.2-1.9s16.3 .6 24.2 1.9c22.5 3.5 35.8 23.2 35.8 42.6l0 3c1.3 .7 2.7 1.5 4 2.3l2.6-1.5c16.8-9.7 40.5-8 54.7 9.7c2.3 2.8 4.5 5.8 6.6 8.7c-2.1-57.1-49-102.7-106.6-102.7zm91.3 163.9c6.3-3.6 9.5-11.1 6.8-18c-2.1-5.5-4.6-10.8-7.4-15.9l-2.3-4c-3.1-5.1-6.5-9.9-10.2-14.5c-4.6-5.7-12.7-6.7-19-3l-2.9 1.7c-9.2 5.3-20.4 4-29.6-1.3s-16.1-14.5-16.1-25.1l0-3.4c0-7.3-4.9-13.8-12.1-14.9c-6.5-1-13.1-1.5-19.9-1.5s-13.4 .5-19.9 1.5c-7.2 1.1-12.1 7.6-12.1 14.9l0 3.4c0 10.6-6.9 19.8-16.1 25.1s-20.4 6.6-29.6 1.3l-2.9-1.7c-6.3-3.6-14.4-2.6-19 3c-3.7 4.6-7.1 9.5-10.2 14.6l-2.3 3.9c-2.8 5.1-5.3 10.4-7.4 15.9c-2.6 6.8 .5 14.3 6.8 17.9l2.9 1.7c9.2 5.3 13.7 15.8 13.7 26.4s-4.5 21.1-13.7 26.4l-3 1.7c-6.3 3.6-9.5 11.1-6.8 17.9c2.1 5.5 4.6 10.7 7.4 15.8l2.4 4.1c3 5.1 6.4 9.9 10.1 14.5c4.6 5.7 12.7 6.7 19 3l2.9-1.7c9.2-5.3 20.4-4 29.6 1.3s16.1 14.5 16.1 25.1l0 3.4c0 7.3 4.9 13.8 12.1 14.9c6.5 1 13.1 1.5 19.9 1.5s13.4-.5 19.9-1.5c7.2-1.1 12.1-7.6 12.1-14.9l0-3.4c0-10.6 6.9-19.8 16.1-25.1s20.4-6.6 29.6-1.3l2.9 1.7c6.3 3.6 14.4 2.6 19-3c3.7-4.6 7.1-9.4 10.1-14.5l2.4-4.2c2.8-5.1 5.3-10.3 7.4-15.8c2.6-6.8-.5-14.3-6.8-17.9l-3-1.7c-9.2-5.3-13.7-15.8-13.7-26.4s4.5-21.1 13.7-26.4l3-1.7zM472 384a40 40 0 1 1 80 0 40 40 0 1 1 -80 0z"}

                text="User Management"
                active={location.pathname === "/user-management"}
                onClick={() => navigate("/user-management")}
              />
              {isAdmin && (
                <SidebarButton
                  isCollapsed={true}
                  iconPath={"M208 80c0-26.5 21.5-48 48-48l64 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-8 0 0 40 152 0c30.9 0 56 25.1 56 56l0 32 8 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-64 0c-26.5 0-48-21.5-48-48l0-64c0-26.5 21.5-48 48-48l8 0 0-32c0-4.4-3.6-8-8-8l-152 0 0 40 8 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-64 0c-26.5 0-48-21.5-48-48l0-64c0-26.5 21.5-48 48-48l8 0 0-40-152 0c-4.4 0-8 3.6-8 8l0 32 8 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-64 0c-26.5 0-48-21.5-48-48l0-64c0-26.5 21.5-48 48-48l8 0 0-32c0-30.9 25.1-56 56-56l152 0 0-40-8 0c-26.5 0-48-21.5-48-48l0-64z"}
                  text="RSO Management"
                  active={location.pathname.startsWith("/rso-management")}
                  onClick={() => navigate("/rso-management")}
                />
              )}
              <SidebarButton
                isCollapsed={true}
                iconPath={"M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.6C495 83.4 512 107.5 512 134.6l0 242.9c0 27-17 51.2-42.5 60.3l-192 68.6c-13.9 5-29.1 5-43.1 0l-192-68.6C17 428.6 0 404.5 0 377.4L0 134.6c0-27 17-51.2 42.5-60.3l192-68.6zM256 66L82.3 128 256 190l173.7-62L256 66zm32 368.6l160-57.1 0-188L288 246.6l0 188z"}
                text="Activities"
                active={location.pathname.startsWith("/documents")}
                onClick={() => navigate("/documents")}
              />
            </>
          )}

          {/* Separator line */}
          <div className="mt-4 mb-4 bg-mid-gray py-[1px] rounded"></div>

          <SidebarButton
            isCollapsed={true}
            iconPath={"M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"}
            text={isStudentRSO ? "RSO Account" : isAdmin ? "Admin Account" : isSuperAdmin ? "Super Admin Account" : "User Account"}
            active={location.pathname === "/account"}
            onClick={() => navigate("/account")}
          />
        </div>
      </div>


      {/* Main Content Area */}
      <div
        className={`relative h-screen z-0 transition-all duration-300 
      ${isCollapsed ? 'xl:left-[250px] xl:w-[calc(100%-250px)] w-full' : 'xl:left-[80px] xl:w-[calc(100%-80px)] w-full'}`}>

        {/* Top Navigation Bar */}
        <div className="flex flex-col w-full">
          <div className="fixed top-0 left-0 right-0 bg-white border border-mid-gray h-16 p-4 z-50 flex items-center justify-between gap-4">

            {/* collapse sidebar button */}
            <div
              onClick={() => setMobileSidebarOpen(true)}
              className='block xl:invisible transition-ease-in-out duration-300 aspect-square w-10 bg-white border border-mid-gray rounded-full flex items-center justify-center cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" className='fill-off-black size-4' viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" /></svg>
            </div>

            {/* group notification module and profile picture */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(isOnAnnouncementPage ? -1 : "/announcements")}
                style={"secondary"}
                className={`${isOnAnnouncementPage ? "bg-gray-100" : ""}`}

              >
                <div className={`flex items-center gap-2 text-sm font-light`}>
                  {isOnAnnouncementPage ? (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                      Cancel
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /></svg>
                      Announcements
                    </div>
                  )}
                </div>
              </Button>


              <div className='flex items-center justify-between text-center pr-6 '>


                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative"
                  ref={dropdownRef} >
                  <div className="flex items-center justify-center rounded-full h-8 w-8 cursor-pointer hover:bg-light-gray group">
                    {isStudentRSO ? (
                      <img
                        src={profileData?.RSO_picture || DefaultPicture}
                        alt="Profile"
                        className="rounded-full h-full w-full object-cover"
                      />
                    ) :
                      (isAdmin || isSuperAdmin) ? (
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-8 fill-gray-700" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" /></svg>
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
                    <div className="absolute top-6 right-0 mt-2 w-64 bg-white rounded-md border border-mid-gray py-1 z-40 pl-2 pr-2">
                      <div
                        className="w-full flex items-start gap-2  py-2 text-sm rounded mb-2 "
                      >
                        <div className="flex items-center gap-2 justify-center">
                          {/* profile picture */}
                          {console.log("profileData", profileData)}
                          {isStudentRSO ? (
                            <div className="rounded-full h-8 w-8 bg-gray-200">
                              <img src={profileData?.RSO_picture || DefaultPicture} alt="Profile" className="rounded-full h-full w-full object-cover" />
                            </div>
                          ) :
                            (isAdmin || isSuperAdmin) ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="size-8 fill-gray-700" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" /></svg>

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
                                    <h1 className='text-sm font-bold'>{profileData?.RSO_acronym || 'N/A'}</h1>
                                    <h2 className='text-xs w-full truncate text-gray-500 text-start'>{profileData?.RSO_name || 'Not Assigned'}</h2>
                                  </div>
                                )
                                  :
                                  (isAdmin || isSuperAdmin) ? (
                                    <>
                                      <div className='flex flex-col justify-center items-start w-[120px]'>
                                        <div>
                                          <h1 className='text-sm font-bold'>{profileData?.firstName} {profileData?.lastName}</h1>
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-yellow-800 size-4" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
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
          <main className={`mt-16 h-full overflow-y-auto p-4 lg:pl-12 lg:pr-12 
            ${isCollapsed ? 'left-[15%] ' : 'left-[80px] '}`}>
            <div className="mb-6 flex flex-col">
              <Breadcrumb style={style.tabName} unSelected={style.disabled} />
            </div>

            {/* Page Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {children}
            </div>
          </main>
          {(location.pathname === '/form-viewer' && isAdmin) && (
            <div className="w-full py-6 bg-white fixed bottom-0 z-40 mt-auto flex items-center justify-center gap-4 border-t border-mid-gray">
              <Button
                style="secondary"
              >
                Reject
              </Button>
              <Button>
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;