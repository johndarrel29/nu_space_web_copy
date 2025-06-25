import { useState, useEffect, useMemo, memo } from "react";
import { MainLayout, Table, Searchbar, Button } from "../../components";
import { useModal, useUser, useRSO } from "../../hooks";
import { AnimatePresence } from "framer-motion";
import { CreateUserModal, ReusableTable } from "../../components";
import { useUserProfile } from "../../hooks";
import { FormatDate } from "../../utils";

//add error preferrably from query

// function to handle the search and filter
const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole, openModal }) => {


  return (
    <>
      {/* search query */}
      <div className="mt-4 w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
        <div className="w-full lg:w-full md:w-full">
          <label
            htmlFor="roleFilter"
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-white"
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
            className="block mb-2 mt-2 md:mt-0 text-sm font-medium text-gray-600 dark:text-white"
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
            <option value="super_admin">Super Admin</option>
            <option value="student">Student</option>
            <option value="rso_representative">RSO Representative</option>
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
  const user = JSON.parse(localStorage.getItem("user"));
  const { user: profileUser, isLoading } = useUserProfile();
  const {
    membersData,
  } = useRSO();

  const isUserStatusActive = profileUser?.assigned_rso?.RSO_status === false && profileUser?.role === "rso_representative";

  // Memoize the data to prevent unnecessary re-renders
  // const memoizedData = useMemo(() => data, [data]);

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
      <div className="w-full flex flex-col gap-4 bg-card-bg rounded-lg  border border-mid-gray p-4 pt-0">

        {/* table for admin & super admin */}
        {(user && (user.role === "admin" || user.role === "super_admin")) && (
          <>
            <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSelectedRole={setSelectedRole} openModal={openModal} />
            <Table
              searchQuery={searchQuery}
              selectedRole={selectedRole} />
          </>
        )}

        {user && user.role === "rso_representative" && (
          <>
            {(profileUser?.assigned_rso?.RSO_membershipStatus === true) && (
              <div className="flex items-center gap-6 w-full justify-start bg-white border border-mid-gray p-6 rounded-md mt-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${profileUser?.assigned_rso?.RSO_membershipStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <h1 className="text-gray-700 font-medium">Membership Status: <span className={`font-semibold ${profileUser?.assigned_rso?.RSO_membershipStatus ? 'text-green-600' : 'text-red-600'}`}>{profileUser?.assigned_rso?.RSO_membershipStatus ? "Active" : "Inactive"}</span></h1>
                </div>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <h1 className="text-gray-700 font-medium">End Date: <span className="font-semibold text-gray-900">{FormatDate(profileUser?.assigned_rso?.RSO_membershipEndDate)}</span></h1>
                </div>
              </div>
            )}

            {/* table for rso representative */}
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
          </>
        )}

      </div>

      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {isOpen && (
          <CreateUserModal closeModal={closeModal} />

        )}
      </AnimatePresence>
    </>
  );


}