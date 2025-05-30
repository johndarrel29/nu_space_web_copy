import { MainLayout, Button, TextInput, Badge } from "../../components";
import { useEffect, useState } from "react";
import { useUserProfile } from "../../hooks";
import DefaultPicture from "../../assets/images/default-profile.jpg";

export default function Account() {
  const { user, error, isLoading, isError, refetch } = useUserProfile();

  console.log("user", user);

  const isStudentRSO = user?.role === "student/rso";
  const isAdmin = user?.role === "admin";
  const isSuperAdmin = user?.role === "superadmin";

  // const [userProfile, setUserProfile] = useState(null);

  // // Fetch user profile data
  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       const data = await fetchUserProfile();
  //       if (data) {
  //         setUserProfile(data);
  //       } else {
  //         console.warn("fetchUserProfile returned no data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     }
  //   };

  //   loadProfile();
  // }, [fetchUserProfile]);

  return (
    <MainLayout tabName="Admin Account" headingTitle="Admin Full Name">
      <div className="border border-mid-gray bg-white rounded-lg p-4">
        <div className="flex flex-col justify-center items-center mb-4 w-full">
          {/* Profile Overview */}
          <div className="w-full md:w-auto md:col-span-1 flex justify-center md:justify-start">
            <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
              <img
                src={user?.assigned_rso?.RSO_picture || DefaultPicture}
                alt="Profile"
                className="size-16 rounded-full object-cover"
              />
              {(isAdmin || isSuperAdmin) && (
                <Badge text="Admin" style="primary" />
              )}
              {isStudentRSO && (
                <Badge text="RSO" style="secondary" />
              )}
              <div className="font-semibold text-lg">
                <h1>
                {isStudentRSO 
                  ? (user?.assigned_rso?.RSO_name || "loading...")
                  : (isAdmin || isSuperAdmin)
                  ? (
                    user?.firstName + " " + user?.lastName || "loading..."
                  )
                  : "loading..."}
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                      {isStudentRSO 
                      ? (user?.assigned_rso?.RSO_acronym || "loading...")
                      : (isAdmin || isSuperAdmin)
                      ? ('')
                      : "loading..."}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="w-full md:w-[30rem] md:col-span-2 gap-2">
            { isStudentRSO && (
              <>
                <h2 className="text-sm text-gray-500 font-light">Profile Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {console.log("user officer ", user?.assigned_rso?.RSO_Officers)}
                  { user?.assigned_rso?.RSO_Officers.map ((officer, index) => { 
                    return (
                      <div 
                      key={index}
                      className="flex flex-col justify-center w-full max-w-xs p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800 mx-auto">
                      <img src={DefaultPicture} alt="" className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square" />
                      <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                        <div className="my-2 space-y-1">
                          <h2 className="text-xl font-semibold sm:text-2xl">{officer.OfficerName || ''}</h2>
                          <p className="px-5 text-xs sm:text-base dark:text-gray-600">{officer.OfficerPosition || ''}</p>
                        </div>
                      </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <TextInput type="password" placeholder="Enter new password" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <TextInput type="password" placeholder="Confirm new password" />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button style="primary">Save</Button>
              <Button style="secondary">Cancel</Button>
            </div> */}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}