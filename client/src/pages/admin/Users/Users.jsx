import { useState, useMemo, memo } from "react";
import { Table, Searchbar, CreateUserModal, ReusableTable, Button, Backdrop, CloseButton } from "../../../components";
import { useModal, useRSO, useUserProfile, useRSOUsers } from "../../../hooks";
import { motion, AnimatePresence } from "framer-motion";
import { DropIn } from "../../../animations/DropIn";
import { FormatDate } from "../../../utils";
import { useUserStoreWithAuth } from "../../../store";


//add error preferrably from query

// function to handle the search and filter
const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole, openModal }) => {

  const { isUserRSORepresentative, isUserAdmin, isSuperAdmin, isCoordinator, isDirector, isAVP } = useUserStoreWithAuth();
  return (
    <>
      {/* button to open create user modal */}
      {(isSuperAdmin) && (
        <div>
          <Button onClick={openModal}>Create User</Button>
        </div>
      )}

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
            {(isUserAdmin || isCoordinator) && (
              <>
                <option value="student">Student</option>
                <option value="rso_representative">RSO Representative</option>
              </>
            )}
            {(isSuperAdmin) && (
              <>
                <option value="admin">Admin</option>
                <option value="coordinator">Coordinator</option>
                <option value="super_admin">Super Admin</option>
              </>
            )}
          </select>
        </div>
      </div>


    </>


  );
});

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const user = JSON.parse(localStorage.getItem("user"));
  const { userProfile } = useUserProfile();
  const { isUserRSORepresentative, isUserAdmin, isSuperAdmin, isCoordinator, isDirector, isAVP } = useUserStoreWithAuth();

  const {
    rsoMembers,
    isErrorFetchingMembers,
    errorFetchingMembers,
    isRefetchingMembers
  } = useRSOUsers();

  console.log("and the members are ", rsoMembers?.members || null);

  const {
    membersData,
  } = useRSO();



  const tableRow = rsoMembers?.members?.map(member => ({
    _id: member._id,
    firstName: member.firstName,
    lastName: member.lastName,
    fullName: `${member.firstName} ${member.lastName}`,
    email: member.email
  })) || [];

  function tableHeading() {
    return [
      { name: "Index", key: "index" },
      { name: "Name", key: "fullName" },
      { name: "Email", key: "email" },
    ];
  }


  const tableRowFiltered = useMemo(() => {
    return tableRow.filter((row) => {
      const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
      const email = row.email.toLowerCase();
      // const college = row.college.toLowerCase();
      const search = searchQuery.toLowerCase();

      // Add this filtering logic
      return search === '' ||
        fullName.includes(search) ||
        email.includes(search)
      // college.includes(search);
    }).map((row, idx) => ({
      index: idx + 1,
      fullName: `${row.firstName} ${row.lastName}`,
      email: row.email,
      // college: row.college,
      // rsoMemberships: row.rsoMemberships,
      // activitiesParticipated: row.activitiesParticipated,
      id: row.id
    }));
  }, [tableRow, searchQuery]);

  // User Info Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalData, setUserModalData] = useState({
    email: "",
    fullName: "",
    id: undefined,
    index: 0
  });

  const handleOpenUserModal = (row) => {
    setUserModalData({
      email: row.email || "poquizjc@students.national-u.edu.ph",
      fullName: row.fullName || "John Darrel Poquiz",
      id: row.id,
      index: row.index
    });
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col">

        {/* table for admin & super admin */}
        {(isUserAdmin || isCoordinator || isSuperAdmin) && (
          <>
            <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSelectedRole={setSelectedRole} openModal={openModal} />
            <Table
              searchQuery={searchQuery}
              selectedRole={selectedRole} />
          </>
        )}
        {isUserRSORepresentative && (
          <>
            <div className="flex items-center gap-6 w-full justify-start bg-white border border-mid-gray p-6 rounded-md">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${userProfile?.rso?.yearlyData?.RSO_membershipStatus === true ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h1 className="text-gray-700 font-medium">Membership Status: <span className={`font-semibold ${userProfile?.rso?.yearlyData?.RSO_membershipStatus === true ? 'text-green-600' : 'text-red-600'}`}>{userProfile?.rso?.yearlyData?.RSO_membershipStatus === true ? "Active" : "Inactive"}</span></h1>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              {userProfile?.rso?.yearlyData?.RSO_membershipEndDate && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <h1 className="text-gray-700 font-medium">End Date: <span className="font-semibold text-gray-900">{FormatDate(userProfile?.rso?.yearlyData?.RSO_membershipEndDate)}</span></h1>
                </div>
              )}
            </div>

            {/* show error if rso membership is inactive */}
            {userProfile?.rso?.yearlyData?.RSO_membershipStatus === false && (
              <div className="mt-4 text-red-600">
                <p className="text-sm">RSO Membership is currently inactive. You are not allowed to update user membership.</p>
              </div>
            )}

            {/* table for rso representative */}
            <ReusableTable
              options={["All", "Student", "RSO"]}
              tableRow={tableRowFiltered}
              searchQuery={searchQuery}
              placeholder={"Search a user"}
              onClick={handleOpenUserModal}
              tableHeading={tableHeading()}
              columnNumber={9}
            >

            </ReusableTable>
          </>
        )}

      </div>

      {/* User Info Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <>
            <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" />
            <motion.div
              className="fixed inset-0 z-50 w-screen overflow-auto"
              variants={DropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 w-1/3">
                  <div className='flex justify-between items-center mb-6'>
                    <h2 className="text-lg font-medium text-[#312895]">
                      User Information
                    </h2>
                    <CloseButton onClick={handleCloseUserModal} />
                  </div>
                  <div className='space-y-4'>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="py-4 pr-8 text-gray-500">Full Name</td>
                          <td className="py-4 font-medium">{userModalData.fullName}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8 text-gray-500">Email</td>
                          <td className="py-4 font-medium">{userModalData.email}</td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8 text-gray-500">Index</td>
                          <td className="py-4 font-medium">{userModalData.index}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={handleCloseUserModal}
                      style="secondary"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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