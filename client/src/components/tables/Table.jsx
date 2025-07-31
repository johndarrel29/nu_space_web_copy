'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActionModal, TableRow } from '../../components';
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../../components';
import { AnimatePresence } from "framer-motion";
import { useModal, useUser } from "../../hooks";
import { toast } from 'react-toastify';

// fix error 403 when changing login user, then going to the table page, partially fixed
// error 403 when role is coordinator
// ${process.env.REACT_APP_BASE_URL}/api/admin/user/fetchUsers:
// error "You have no authorized access to this resource"

// Table Component
const Table = React.memo(({ searchQuery, selectedRole }) => {
  const [mode, setMode] = useState('delete');
  const { data, updateUserMutate, deleteUserMutate, error, refetch, isLoading } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const { isOpen, openModal, closeModal } = useModal();
  const [success, setSuccess] = useState(false);
  const [filterError, setFilterError] = useState(null);

  useEffect(() => {
    refetch();
  }, []);

  console.log("Users data:", data);

  // Makes the search query debounced so that it doesn't render on every key stroke
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const safeSearchQuery = debouncedSearchQuery || '';
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredRecords = useMemo(() => {
    try {
      setFilterError(null);

      if (!Array.isArray(data)) {
        console.error("Users is not an array:", data);

        return [];
      }

      return data.filter(user => {
        const matchesSearch = ['firstName', 'lastName', 'email'].some(field =>
          typeof user[field] === 'string' && user[field].toLowerCase().includes(safeSearchQuery.toLowerCase())
        );

        const matchesRole = !selectedRole ||
          (selectedRole === "student" ? user.role?.toLowerCase() === "student" :
            selectedRole === "rso_representative" ? user.role?.toLowerCase() === "rso_representative" :
              selectedRole === "admin" ? user.role?.toLowerCase() === "admin" :
                selectedRole === "coordinator" ? user.role?.toLowerCase() === "coordinator" :
                  selectedRole === "super_admin" ? user.role?.toLowerCase() === "super_admin" :
                    false
          );
        return matchesSearch && matchesRole;
      });
    } catch (error) {
      console.error(`Error filtering records: ${error.message}`);
      setFilterError(error.message);
      return [];
    }

  }, [data, safeSearchQuery, selectedRole]);

  const records = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredRecords.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredRecords, currentPage, postsPerPage]);

  const npage = useMemo(() => Math.ceil(filteredRecords?.length / postsPerPage), [filteredRecords, postsPerPage]);

  const handleOpenModal = useCallback((mode, user) => {
    setSuccess(false);
    openModal();
    setMode(mode);
    setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setSelectedUser(null);
  }, []);

  const handleConfirm = useCallback(async (_id, updatedData) => {

    if (updatedData) {

      // If the role is being changed to 'student', ensure that assigned_rso is removed
      if (updatedData.role === 'student') {
        // Don't send category data in the update request when role is student
        updatedData.category = null;
        updatedData.assignedRSO = null;
        updatedData.assigned_rso = null; // Remove assigned_rso if role is 'student'
      }

      // If the role is 'rso_representative', ensure the category is assigned to assigned_rso
      if (updatedData.role === 'rso_representative' && updatedData.category) {
        updatedData.category = null;
        // updatedData.assigned_rso = updatedData.category;
      }

      if (updatedData.role === 'coordinator') {
        // Don't send category data in the update request when role is coordinator
        updatedData.category = null;
        updatedData.assignedRSO = null;
        updatedData.assigned_rso = null; // Remove assigned_rso if role is 'coordinator'
      }

      if (updatedData.role === 'super_admin') {
        // Don't send category data in the update request when role is super_admin
        updatedData.category = null;
        updatedData.assignedRSO = null;
        updatedData.assigned_rso = null; // Remove assigned_rso if role is 'super_admin'
      }

      if (updatedData.role === 'admin') {
        // Don't send category data in the update request when role is admin
        updatedData.category = null;
        updatedData.assignedRSO = null;
        updatedData.assigned_rso = null; // Remove assigned_rso if role is 'admin'
      }

    }

    try {
      if (updatedData) {
        console.log("Data being sent:", updatedData);

        await updateUserMutate.mutateAsync({ userId: _id, userData: updatedData });

        toast.success("User updated successfully");

      } else {
        // Delete user
        console.log("Deleting user with ID:", _id);
        await deleteUserMutate.mutateAsync(_id);
        console.log("User deleted successfully with ID:", _id);

        toast.success("User deleted successfully");
      }
      // Refetch data after the operation
      setSuccess(true);
      await refetch();
    } catch (error) {
      console.error("Error updating/deleting user:", error);
      toast.error("Error updating/deleting user");
    } finally {
      closeModal();
      setSuccess(false);
    }
  }, [refetch]);


  const changePageNum = useCallback((page) => setPostsPerPage(Number(page)), []);
  const prePage = useCallback(() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev), []);
  const nextPage = useCallback(() => setCurrentPage(prev => prev < npage ? prev + 1 : prev), [npage]);


  return (
    <div className=' min-w-full mt-2 sm:min-w-1/2 '>
      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {isOpen && (

          <ActionModal

            onClose={handleCloseModal}
            mode={mode}
            id={selectedUser?._id}
            name={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
            createdAt={selectedUser?.createdAt}
            email={selectedUser?.email}
            role={selectedUser?.role}
            category={selectedUser?.assigned_rso?.RSO_acronym}
            user={selectedUser}
            onConfirm={handleConfirm}
            loading={isLoading}
            success={success}

          />


        )}
      </AnimatePresence>


      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700 font-semibold">
          Showing {filteredRecords?.length} result{filteredRecords?.length !== 1 ? "s" : ""}
          {searchQuery && ` of ${safeSearchQuery}`}
        </span>
        <li className="flex justify-center ">
          <select
            className={`w-24 h-10 rounded-md bg-white border border-mid-gray p-1 font-bold  ${npage > 0 ? "text-off-black" : "text-gray-400 opacity-50"}`}
            onChange={(e) => changePageNum(e.target.value)}
            disabled={npage === 0}
          >
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
            <option value="50">50 rows</option>
          </select>
        </li>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-500 font-medium text-center max-w-md px-4">
            {typeof error === 'string' ? error : error?.message || 'An unknown error occurred'}
          </p>
        </div>
      )
        : filterError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex flex-col items-center mb-4">
            <p className="text-red-500 font-medium text-center">
              Error filtering data: {filterError}
            </p>
          </div>
        ) :
          data?.length > 0 ? (
            <div className="w-full">
              <div className=' overflow-x-auto w-full border border-mid-gray rounded-md'>
                <table className=" lg:min-w-full divide-y divide-gray-200 rounded-md ">
                  <thead className="border-b border-mid-gray bg-textfield ">
                    <tr className='rounded-md text-left text-xs font-medium font-bold uppercase tracking-wider '>
                      <th scope="col" className='px-6 py-3'>
                        <div className="flex items-center justify-center">
                          Name
                        </div>
                      </th>
                      <th scope="col" className='px-6 py-3'>
                        <div className="flex items-center justify-center">
                          Date Created
                        </div>
                      </th>
                      <th scope="col" className='px-6 py-3'>
                        <div className="flex items-center justify-center">
                          Role
                        </div>
                      </th>
                      <th scope="col" className='px-6 py-3'>
                        <div className="flex items-center justify-center">
                          Assigned RSO
                        </div>
                      </th>
                      <th scope="col" className='px-6 py-3'>
                        <div className="flex items-center justify-center">
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-bg divide-y divide-gray-200">
                    {records?.length > 0 ? records?.map((user, index) => (


                      <TableRow key={index} userRow={user} onOpenModal={handleOpenModal} index={(currentPage - 1) * postsPerPage + index + 1} />
                    )) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center" colSpan={5}>
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : <CardSkeleton />}

      <div className='w-full bottom-20 mt-4'>
        <nav>
          <ul className="flex justify-center space-x-2">

            <li className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded ${currentPage === 1 || npage === 0 ? "text-gray-400" : "text-gray-800"}`}>
              <button className='page-link' onClick={prePage}>Prev</button>
            </li>
            <div className="px-4 py-2 font-semibold">
              {npage > 0 ? `${currentPage} of ${npage}` : "0 of 0"}
            </div>
            <li className={`page-item mx-1 px-3 py-2 bg-white border border-mid-gray rounded-md font-semibold rounded ${currentPage === npage || npage === 0 ? "text-gray-400" : "text-gray-800"}`}>
              <button className='page-link' onClick={nextPage}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
});

export default Table;