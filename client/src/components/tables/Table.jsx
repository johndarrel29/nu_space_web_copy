'use client'

import React, { useState, useEffect } from 'react';
import LoadingAnimation from '../layout/LoadingAnimation';
import ActionModal from '../modals/ActionModal';
import editIcon from "../../assets/icons/pen-solid.svg";
import deleteIcon from "../../assets/icons/trash-solid (3).svg";

 
// TableRow Component
const TableRow = ({ user, onOpenModal }) => {
  const handleEditClick = () => {
    onOpenModal("edit", user); 
  };

  const handleDeleteClick = () => {
    onOpenModal("delete", user); 
  };
  

  return (
    <tr className='hover:bg-gray-100'>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{user.id}</div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {[user.first_name, user.last_name].filter(Boolean).join(' ')}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.date}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.type === 'Student' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {user.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.type === 'Student' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {user.type === 'Student' ? user.type : 'RSO Name'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {user.quantity}
        <div className='space-x-2 h-8 w-8 flex justify-center items-center'>

         <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 hover:bg-gray-300 transition duration-300 cursor-pointer"
         onClick={handleEditClick}
         
         >          
            <img src={editIcon} alt="edit" className="size-4"/>
         </div>
         <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 hover:bg-gray-300 transition duration-300 cursor-pointer"
         onClick={handleDeleteClick}
         >          
            <img src={deleteIcon} alt="edit" className="size-4"/>
         </div>
       
          

        </div>

      </td>
    </tr>
  );
};

// Table Component
const Table = ({ searchQuery, data }) => {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('delete');
  const [selectedUser, setSelectedUser] = useState(null); 
  const safeSearchQuery = searchQuery || ''; 
  const [users, setUsers] = useState([]);
  
  const handleOpenModal = (mode, user) => {
    console.log("Modal open");
    setShowModal(true);
    setMode(mode);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    console.log("Modal close");
    setShowModal(false);
    setSelectedUser(null);
  }
  // useEffect to set users
  useEffect(() => {
    setUsers(data);
  }, [data, searchQuery]);
  

  //Filtering
  const filteredRecords = users.filter((user) =>
    user.first_name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(safeSearchQuery.toLowerCase())
  );


    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const records = filteredRecords.slice(indexOfFirstPost, indexOfLastPost);
    

    const npage = Math.ceil(filteredRecords.length / postsPerPage); //tells number of pages

    useEffect(() => {
      setCurrentPage(1);
    }, [safeSearchQuery, filteredRecords.length ]);

    useEffect(() => {
      console.log("Users updated in state:", users);
    }, [users]);
  
    
    function prePage() {
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }
    }
    
    function nextPage() {
      if (currentPage !== npage) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(npage);
      }
    }
    
    
    const handleConfirm = (id, updatedData) => {
      if (updatedData) { // Edit action
        console.log("Editing user with ID:", id, "Updated Data:", updatedData);
    
        setUsers((prevUsers) => [...prevUsers.map((user) =>
          user.id === id ? {...user, ...updatedData } : user
        )]);
        // {
          
        //   console.log("Before update:", prevUsers); 
        //   console.log("Updating ID:", id, "with Data:", updatedData);

        //   const updatedUsers = prevUsers.map(user => 
        //     user.id === id ? { ...user, ...updatedData } : user
        //   );
        //   console.log("Updated users state:", updatedUsers);
        //   return updatedUsers;
        // });
    
      } else { // Delete action
        console.log("Deleting user with ID:", id);
    
        setUsers((prevUsers) => {
          const filteredUsers = prevUsers.filter(user => user.id !== id);
          console.log("Users after deletion:", filteredUsers);
          return filteredUsers;
        });
      }
    };
    
    // console.log("Test calling handleConfirm directly...");



  return ( 
  <>
    <div className='p-6'>
    
      {/* Rendering of modal */}
          {showModal && (
        <ActionModal
          onClose={handleCloseModal}
          mode={mode}
          id={selectedUser ? selectedUser.id : ''}
          name={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''}
          date={selectedUser ? selectedUser.date : ''}
          email={selectedUser ? selectedUser.email : ''}
          role={selectedUser ? selectedUser.type : ''}
          user={selectedUser} 
          onConfirm={handleConfirm}
        />
      )}

      {data.length > 0 ? (
        <table  className="min-w-full divide-y divide-gray-200 overflow-x-auto ">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

          {/* conditional to assess if there are records to display*/}
            {filteredRecords.filter((user) => {
              return (  
                
                user.first_name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
                user.last_name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(safeSearchQuery.toLowerCase())
              );
            }).length > 0 ? (
              filteredRecords.map((user) => <TableRow key={user.id} user={user} onOpenModal={handleOpenModal} />)
            ) : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center" colSpan={6}>
                  No records found
                </td>
              </tr>
            )}
            
          </tbody>
        </table>

          ) : (
            <LoadingAnimation />
          )}

          {/* Pagination */}
          <div className='bg-red  w-full bottom-20'>
            <nav>
              <ul className="flex justify-center">
                <li className={ `page-item mx-1 px-3 py-2 bg-gray-200 font-semibold rounded ${ currentPage === 1 || npage === 0  ? "text-gray-400" : " text-gray-800 "}`}>
                    <button className='page-link' 
                    onClick={prePage}>Prev</button>
                </li>

                <div className="px-4 py-2 font-semibold">
                {npage > 0 ? `${currentPage} of ${npage}` : "0 of 0"}
                </div>
                                
                <li className={ `page-item mx-1 px-3 py-2 bg-gray-200 font-semibold rounded ${ currentPage === npage || npage === 0  ? "text-gray-400" : " text-gray-800"}`}>
                    <button className='page-link '
                    onClick={nextPage}>Next</button>
                </li>

                
              </ul>
              
            </nav>  
          </div>
    </div>
    
            
  </>

  );

};

export default Table;