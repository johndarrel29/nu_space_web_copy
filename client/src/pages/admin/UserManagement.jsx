import { useState, useEffect, useMemo, memo  } from "react";
import { MainLayout, Table, Searchbar, Button } from "../../components";
import   { useModal, useUser }  from "../../hooks";
import { AnimatePresence } from "framer-motion";
import { CreateUserModal } from "../../components";

  // function to handle the search and filter
  const UserFilter = memo(({ searchQuery, setSearchQuery, setSelectedRole, selectedRole, openModal }) => {

    return (
      <>
      {/* search query */}
      <div className=" w-full flex flex-col space-x-0 md:flex-row md:space-x-2 md:space-y-0 sm:flex-col sm:space-y-2 sm:space-x-0">
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


    // Memoize the data to prevent unnecessary re-renders
    const memoizedData = useMemo(() => data, [data]);



    return (
        <>
            <MainLayout
            tabName="User Management"
            headingTitle="Monitor Student/RSO and Student accounts"
            > 
          <div className="w-full flex flex-col gap-4 bg-card-bg rounded-lg p-4 border border-mid-gray">
            <UserFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery}  setSelectedRole={setSelectedRole} openModal={openModal}/>
              
            <Table data={memoizedData} searchQuery={searchQuery} selectedRole={selectedRole}/>
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