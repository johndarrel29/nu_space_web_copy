'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LoadingAnimation from '../layout/LoadingAnimation';
import ActionModal from '../modals/ActionModal';
import editIcon from "../../assets/icons/pen-to-square-solid.svg";
import deleteIcon from "../../assets/icons/trash-solid.svg";
import 'react-loading-skeleton/dist/skeleton.css'
import { CardSkeleton } from '../../components'; 
import axios from "axios";


// TableRow Component
const TableRow = ({ user, onOpenModal, index }) => {
  const handleActionClick = (action) => () => {
    onOpenModal(action, user);
  };

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const roleClass = user.role === 'student' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <tr className='hover:bg-gray-200' >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{index}</div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{fullName}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.college}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass}`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass}`}>
          {user.role === 'student' ? user.role : 'RSO Name'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {user.quantity}
        <div className='space-x-2 h-8 w-8 flex justify-center items-center'>
          <div 
            className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 hover:bg-gray-300 transition duration-300 cursor-pointer"
            onClick={handleActionClick('edit')}
          >          
            <img src={editIcon} alt="edit" className="size-4"/>

          </div>
          <div 
            className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 hover:bg-gray-300 transition duration-300 cursor-pointer"
            onClick={handleActionClick('delete')}
          >          
            <img src={deleteIcon} alt="delete" className="size-4"/>
          </div>
        </div>
      </td>
    </tr>
  );
};

// Table Component
const Table = React.memo(({ searchQuery, data, selectedRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('delete');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    console.log("Data received:", data, "Type:", typeof data);
    setUsers(Array.isArray(data) ? data : []);
  }, [data]);

  useEffect(() => {
    console.log("Data received:", data); // Check if data is an array
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
    return users.filter(user => {
      const matchesSearch = ['firstName', 'lastName', 'email'].some(field => 
        user[field]?.toLowerCase().includes(safeSearchQuery.toLowerCase())
      );
    
      const matchesRole = selectedRole === "" || 
      (selectedRole === "student" ? user.type.toLowerCase() === "student" : 
      selectedRole === "student/RSO" ? user.type.toLowerCase().includes("/rso") : false);
    
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
    setShowModal(true);
    setMode(mode);
    setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedUser(null);
  }, []);

  
  console.log("Current users:", users);

  const handleConfirm = useCallback(async (_id, updatedData) => {
    const token = localStorage.getItem("token");
    const formattedToken = token?.startsWith("Bearer ") ? token.slice(7) : token;

    if (updatedData) {
      console.log("Updated data being sent:", updatedData);
    }

    const url = `/api/auth/user/${_id}`; 

    console.log("Attempting DELETE request to:", url); 
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${formattedToken}` : "",
    };
  
    try {
      if (updatedData) {
        console.log("ID being sent:", _id); // Should be a valid MongoDB ObjectId
        console.log("Data being sent:", updatedData); // Should contain type: "student/rso"
        console.log("Update API URL:", `${process.env.REACT_APP_UPDATE_USER_URL}/${_id}`);
        // Use PATCH instead of PUT
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
            user._id === _id ? { ...user, ...response.data } : user
          )
        );
      } else {
        console.log("Delete URL:", `${process.env.REACT_APP_DELETE_USER_URL}/${_id}`);
        // Delete user
        await axios.delete(`${process.env.REACT_APP_DELETE_USER_URL}/${_id}`, { headers });
  
        setUsers(prevUsers => prevUsers.filter(user => user._id !== _id));
      }
    } catch (error) {
      console.error("Error updating/deleting user:", error);
    }
  }, []);
  

  const changePageNum = useCallback((page) => setPostsPerPage(Number(page)), []);
  const prePage = useCallback(() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev), []);
  const nextPage = useCallback(() => setCurrentPage(prev => prev < npage ? prev + 1 : prev), [npage]);

  useEffect(() => setUsers(data), [data]);
 

  return (
    <div className=' min-w-full mt-6 sm:min-w-1/2 '>
      
      {showModal && (
        
        <ActionModal
        
          onClose={handleCloseModal}
          mode={mode}
          id={selectedUser?._id}
          name={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
          date={selectedUser?.date}
          email={selectedUser?.email}
          role={selectedUser?.role}
          user={selectedUser}
          onConfirm={handleConfirm}
        />
      )}

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
        <div className="border border-mid-gray rounded-md mb-4 rounded-md p-6 bg-card-bg">
        <table className="min-w-full divide-y divide-gray-200 rounded-md  overflow-x-auto ">
          <thead className="bg-card-bg rounded-md ">
            <tr className='rounded-md text-left text-xs font-medium font-bold uppercase tracking-wider'>
              <th scope="col" className='px-6 py-3 '>Name</th>
              <th scope="col" className='px-6 py-3'>Date Created</th>
              <th scope="col" className='px-6 py-3'>Role</th>
              <th scope="col" className='px-6 py-3'>Category</th>
              <th scope="col" className='px-6 py-3'>Actions</th>
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
      ) : <CardSkeleton/>}

      <div className='w-full bottom-20'>
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