import { useState, useEffect, useMemo, memo  } from "react";
import { MainLayout, Table, Searchbar, Button } from "../../components";
import   { useModal, useUser, useRSO }  from "../../hooks";
import { AnimatePresence } from "framer-motion";
import { CreateUserModal, ReusableTable } from "../../components";
import { useUserProfile } from "../../hooks";

  // function to handle the search and filter
  const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole, openModal }) => {
    

    return (
      <>
      {/* search query */}
      <div className="mt-4 w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
        <div className="w-full lg:w-full md:w-full">
        <label 
          htmlFor="roleFilter" 
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
          <Searchbar
            placeholder="Search a user"
            searchQuery={searchQuery || ''}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* dropdown role filter */}
        <div className="w-full lg:w-1/2 md:w-full">
        <label 
          htmlFor="roleFilter" 
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
            Filter by Role
        </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full h-10 border border-mid-gray rounded-md p-1 bg-textfield focus:outline-none focus:ring-off-black  focus:ring-1"
          >
            <option value="">All</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
            <option value="student">Student</option>
            <option value="student/rso">Student/RSO</option>
          </select>
        </div>
      </div>


      </>


    );
  });

  export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const {data = [], loading, error, fetchData } = useUser(); // Fetch data from the custom hook
  const user = JSON.parse(localStorage.getItem("user"));
  const { user: profileUser, isLoading, isError, error: useError } = useUserProfile();
  const {
    membersData,
    isMembersLoading,
    membersError,
    refetchMembers,
    membersSuccess,
  } = useRSO();


  const isUserStatusActive = profileUser?.assigned_rso?.RSO_status === false && profileUser?.role === "student/rso";
  console.log("isUserStatusActive:", isUserStatusActive);

    // Memoize the data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => data, [data]);

    const tableRow = (membersData ?? []).map(member => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      college: member.college,
      role: member.role,
      rsoMemberships: member.rsoMemberships || 0,
      activitiesParticipated: member.activitiesParticipated || 0,
      interests: member.interests || [],
      createdAt: member.createdAt
    }))

//     const tableRow = [
//   {
//     id: "67db77ff005837fe2394223c",
//     firstName: "b",
//     lastName: "b",
//     email: "b@students.national-u.edu.ph",
//     college: "CCIT",
//     role: "student/rso",
//     rsoMemberships: 7,
//     activitiesParticipated: 3,
//     interests: [
//       "hackaton",
//       "coding",
//       "music",
//       "community building",
//       "technology",
//       "problem-solving",
//       "finance",
//       "leadership",
//       "algorithm design"
//     ],
//     createdAt: "2025-03-20T02:05:51.778Z"
//   },
//   {
//     id: "68db77ff005837fe2394224d",
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@students.national-u.edu.ph",
//     college: "Engineering",
//     role: "student/rso",
//     rsoMemberships: 5,
//     activitiesParticipated: 2,
//     interests: [
//       "robotics",
//       "engineering",
//       "technology",
//       "problem-solving"
//     ],
//     createdAt: "2025-04-15T10:30:22.123Z"
//   },
//   {
//     id: "69db77ff005837fe2394225e",
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@students.national-u.edu.ph",
//     college: "Business",
//     role: "student/rso",
//     rsoMemberships: 3,
//     activitiesParticipated: 4,
//     interests: [
//       "finance",
//       "leadership",
//       "entrepreneurship",
//       "marketing"
//     ],
//     createdAt: "2025-02-10T08:15:45.456Z"
//   },
//   {
//     id: "70db77ff005837fe2394226f",
//     firstName: "Mike",
//     lastName: "Johnson",
//     email: "mike.johnson@students.national-u.edu.ph",
//     college: "Arts",
//     role: "student/rso",
//     rsoMemberships: 2,
//     activitiesParticipated: 1,
//     interests: [
//       "music",
//       "painting",
//       "community building"
//     ],
//     createdAt: "2025-05-01T14:22:33.789Z"
//   }
// ];

const tableRowFiltered = useMemo(() => {
  return tableRow.filter((row) => {
    const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
    const email = row.email.toLowerCase();
    const college = row.college.toLowerCase();
    const search = searchQuery.toLowerCase();
    
    // Add this filtering logic
    return search === '' || 
      fullName.includes(search) || 
      email.includes(search) || 
      college.includes(search);
  }).map(row => ({
    fullName: `${row.firstName} ${row.lastName}`,
    email: row.email,
    college: row.college,
    rsoMemberships: row.rsoMemberships,
    activitiesParticipated: row.activitiesParticipated,
    id: row.id
  }));
}, [tableRow, searchQuery]);



    return (
        <>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor Student/RSO and Student accounts"
            > 
          <div className="w-full flex flex-col gap-4 bg-card-bg rounded-lg  border border-mid-gray p-4 pt-0">
            {(user && (user.role === "admin" || user.role === "superadmin")) && (
              <>
                <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery}  setSelectedRole={setSelectedRole} openModal={openModal}/> 
                <Table 
                error={error}
                data={memoizedData} 
                searchQuery={searchQuery} 
                selectedRole={selectedRole}/>             
              </>
              )}

            {user && user.role === "student/rso" && (
              
              <ReusableTable 
              options={["All", "Student", "RSO"]}
              tableRow={tableRowFiltered} 
              searchQuery={searchQuery}
              placeholder={"Search a user"}
              onClick={(row => console.log(row))}
              tableHeading={[
                { name: "Name", key: "fullName" },
                { name: "Email", key: "email" },
                { name: "College", key: "college" },
                { name: "RSO Memberships", key: "rsoMemberships" },
                { name: "Activities Participated", key: "activitiesParticipated" },
            ]}
              columnNumber={9}
              >

              </ReusableTable>
            )}

          </div>


          <AnimatePresence
              initial={false}
              exitBeforeEnter={true}
              onExitComplete={() => null}
          >
            {isOpen && (
                <CreateUserModal closeModal={closeModal}/>

            )}
            </AnimatePresence>
                
            </MainLayout>

        </>
    );


      }