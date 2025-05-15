'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {ActionModal, TableRow } from '../../components';
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../../components'; 
import { AnimatePresence } from "framer-motion";
import   { useModal }  from "../../hooks";
import axios from "axios";

//Even when the data is null in assigned_rso, the data still retains on the server.
//make a way to display that if the user contains assigned_rso, then display it in the dropdownsearch.

// Table Component
const Table = React.memo(({ searchQuery, data, selectedRole }) => {
  const [mode, setMode] = useState('delete');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    console.log("Data received:", data, "Type:", typeof data);
    setUsers(Array.isArray(data) ? data : []);
  }, [data]);

  useEffect(() => {
    console.log("Data received:", data); 
    setUsers(data);
  }, [data]);


  
  console.log("Users data before filtering:", users);

  // Makes the search query debounced so that it doesn't render on every key stroke
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const safeSearchQuery = debouncedSearchQuery || '';
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredRecords = useMemo(() => {

    if (!Array.isArray(users)) {
      console.error("Users is not an array:", users);
      
      return []; // Return an empty array if users is not an array
    }

    return users.filter(user => {
      console.log(user);
      const matchesSearch = ['firstName', 'lastName', 'email'].some(field => 
        typeof user[field] === 'string' && user[field].toLowerCase().includes(safeSearchQuery.toLowerCase())
      );
    
      console.log("selectedRole value:", selectedRole);
      console.log("user type:", user.type);
      console.log("user role:", user.role);
      const matchesRole = !selectedRole || 
      (selectedRole === "student" ? user.role?.toLowerCase() === "student" : 
      selectedRole === "student/rso" ? user.role?.toLowerCase()?.includes("/rso") : false);
    
    
      return matchesSearch && matchesRole;
    });
  }, [users, safeSearchQuery, selectedRole]);

  const records = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return filteredRecords.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredRecords, currentPage, postsPerPage]);

  const npage = useMemo(() => Math.ceil(filteredRecords.length / postsPerPage), [filteredRecords, postsPerPage]);

  const handleOpenModal = useCallback((mode, user) => {
    openModal();
    setMode(mode);
    setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setSelectedUser(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    try {
      const response = await axios.get(`${process.env.REACT_APP_FETCH_USERS_URL}`, {
        headers: {
          Authorization: `Bearer ${formattedToken}`,
        },
      });
      console.log("API Response:", response.data); 
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const deleteCategory = async (_id) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
  
    try {
      console.log("Attempting to delete category for user with ID:", _id);
      const response = await axios.delete(`${process.env.REACT_APP_DELETE_CATEGORY_URL}/${_id}`, {
        headers: {
          Authorization: `Bearer ${formattedToken}`,
        },
      });
  
      console.log("Category deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  

  const handleConfirm = useCallback(async (_id, updatedData) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
  
    // if (updatedData) {
    //   console.log("Updated data being sent:", updatedData);
      
    //   // Ensure that assigned_rso is part of updatedData
    //   if (updatedData.category && !updatedData.assignedRSO) {
    //     updatedData.assigned_rso = updatedData.category; // Add category to assigned_rso
    //   }
  
    //   // Ensure that assigned_rso is in updatedData
    //   if (!updatedData.assignedRSO) {
    //     console.error("Missing assignedRSO in updatedData!");
    //     // Handle this case accordingly (perhaps set a default value)
    //   }
    // }

    if (updatedData) {
      console.log("Updated data being sent:", updatedData);
  
      // If the role is being changed to 'student', ensure that assigned_rso is removed
      if (updatedData.role === 'student') {
        await deleteCategory(_id); // Call the delete function
        // Don't send category data in the update request when role is student
        updatedData.category = null;
        updatedData.assignedRSO = null;
        updatedData.assigned_rso = null; // Remove assigned_rso if role is 'student'
      }
  
      // If the role is 'student/rso', ensure the category is assigned to assigned_rso
      if (updatedData.role === 'student/rso' && updatedData.category) {
        updatedData.assigned_rso = updatedData.category;
      }
  
      // Log to check if assigned_rso is being set correctly
      console.log("Final updated data:", updatedData);
    }
  
    const url = `/api/auth/user/${_id}`; 
  
    console.log("Attempting PATCH request to:", url); 
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
    };
  
    try {
      if (updatedData) {
        console.log("ID being sent:", _id); // Should be a valid MongoDB ObjectId
        console.log("Data being sent:", updatedData); // Should contain type: "student/rso"
        console.log("Update API URL:", `${process.env.REACT_APP_UPDATE_USER_URL}/${_id}`);
        
        const response = await axios.patch(
          `${process.env.REACT_APP_UPDATE_USER_URL}/${_id}`,
          updatedData,
          { 
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": token ? `Bearer ${formattedToken}` : "",
            }
          }
        );
  
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === _id ? { ...user, ...response.data.user } : user
          )
        );
      } else {
        console.log("Delete URL:", `${process.env.REACT_APP_DELETE_USER_URL}/${_id}`);
        // Delete user
        await axios.delete(`${process.env.REACT_APP_DELETE_USER_URL}/${_id}`, { headers });
  
        setUsers(prevUsers => prevUsers.filter(user => user._id !== _id));
      }
      // Refetch users after the operation
      await fetchUsers();
    } catch (error) {
      console.error("Error updating/deleting user:", error);
    } finally {
      // Close the modal after the operation
      closeModal();
    }
  }, [fetchUsers]);
  

  const changePageNum = useCallback((page) => setPostsPerPage(Number(page)), []);
  const prePage = useCallback(() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev), []);
  const nextPage = useCallback(() => setCurrentPage(prev => prev < npage ? prev + 1 : prev), [npage]);

  useEffect(() => setUsers(data), [data]);
 

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

        />
        
        
      )}
      </AnimatePresence>
      

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-700 font-semibold">
          Showing {filteredRecords.length} result{filteredRecords.length !== 1 ? "s" : ""}
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

      {data.length > 0 ? (
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
                  Category
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
            {records.length > 0 ? records.map((user, index) => (
              
              
              <TableRow key={index} user={user} onOpenModal={handleOpenModal} index={(currentPage - 1) * postsPerPage + index + 1}/>
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
      ) : <CardSkeleton/>}

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