'use client'

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import  { FormatDate }  from '../../utils';
import { motion } from "framer-motion";
import { Backdrop, Dropdown, DropdownSearch, Button, CloseButton } from "../../components";
import  { DropIn }  from "../../animations/DropIn";

export default function ActionModal({ onClose, mode, id, name, createdAt, email, role, category, onConfirm, success, loading }) {
  const [selectedRole, setSelectedRole] = useState(role || "student");
  const [selectedCategory, setSelectedCategory] = useState(category || "N/A");
  const formattedDate = FormatDate(createdAt);

  useEffect(() => {
    if (mode === "edit") {
      setSelectedRole(role);
    }
  }, [mode, role]);

  useEffect(() => {
    if (mode === "edit") {
      setSelectedCategory(category || "N/A");
    }
  }, [mode, category]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onClose();
      }, 3000); 

      // Reset the selected role and category after a successful action
    }
  }, [success, onClose]);


  console.log("onConfirm exists?", typeof onConfirm === "function");


  const handleConfirm = () => {
    console.log("handleConfirm inside ActionModal triggered");

    if (mode === "edit") {
      console.log("role: ", selectedRole)
      
      const updatedData = {
        role: selectedRole,
        // category: selectedCategory,
              // Only include the category if the role is not "student"
      ...(selectedRole !== "student" && { category: selectedCategory }),
        assignedRSO: selectedCategory,  
      };
      console.log("category: ", selectedCategory);
      console.log("Inside ActionModal: Data before calling onConfirm:", updatedData);
      console.log("ID being sent:", id);  
      onConfirm(id, updatedData);
    } else if (mode === "delete") {
      console.log("Inside ActionModal (DELETE MODE): Calling onConfirm with:", id);
      onConfirm(id); 
    }
  
    // onClose();
  };

  return (
    <>
    <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"/>

        <motion.div className="fixed inset-0 z-50 w-screen overflow-auto"
          variants={DropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {mode === 'delete' ? (
                  // Delete Confirmation Layout
                  <>
                    <div className='flex flex-row justify-between'>
                      <div className='flex flex-row space-x-2 items-center justify-center mb-4'>
                          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                            <ExclamationTriangleIcon className="size-6 text-red-600" />
                          </div>
                          <label className="text-base font-semibold text-gray-900">
                              Delete Account
                            </label>
                        </div>
                        <div>
                          <CloseButton className="absolute top-4 right-4" onClick={onClose}/>
                        </div>
                        
                    </div>
                      
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left mb-4">
                      <p className="mt-2 text-md text-off-black">
                        Are you sure you want to delete <em>{name}'s</em> account? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </>
                ) : (
                  // Edit Role Layout
                  <>
                    <div className='flex flex-row justify-between '>
                      <div className="flex items-center space-x-2">
                        <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-[#BAC1E3] sm:mx-0 sm:size-10">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary" fill='none'>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                          </svg>
                        </div>      
                        <div><h1 className="font-bold">Edit Account Role</h1></div>
                      </div>
                      <div>
                          <CloseButton className="absolute top-4 right-4" onClick={onClose} />
                      </div>
                        
                    </div>

                  <div className="grid grid-cols-2 gap-4"> 

                    <div className="col-span-2"></div>

                    <div>
                      <h1 className="text-primary">Name:</h1>
                      <h1>{name}</h1>
                    </div>

                    <div className="grid grid-cols-1">
                      <h1>Role:</h1>
                      <Dropdown setSelectedRole={setSelectedRole} selectedRole={selectedRole} />
                    </div>

                    <div>
                      <h1 className="text-primary">Date Created:</h1>
                      <h1>{formattedDate}</h1>
                    </div>

                    <div>
                      <h1>Category:</h1>
                      <DropdownSearch 
                      isDisabled={selectedRole !== "student/rso"}
                      category={category}
                      setSelectedCategory={setSelectedCategory}
                      selectedCategory={selectedCategory}
                      />
                    </div>

                    <div>
                      <h1 className="text-primary">Email:</h1>
                      <h1>{email}</h1>
                    </div>
                  </div>
                  </>
                )}

          {/* Buttons */}
              <div className="flex flex-row justify-end items-center space-x-2">
                { success && (
                  <div className="text-green-600 text-sm font-semibold">
                    {mode === 'delete' ? 'Account deleted successfully.' : 'Account updated successfully.'}
                  </div>
                )}

                <Button
                    type="button"
                    style="secondary"
                    onClick={onClose}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    className={`
                      ${mode === 'delete' ? 'bg-red-600 hover:bg-red-500' : ''}
                    `}
                  >
                    {(loading && !success)
                      ? (mode === 'delete' ? 'Deleting...' : 'Saving...')
                      :   
                    (mode === 'delete' ? 'Delete' : 'Save')
                    }

                    
                  </Button>
              </div>    
              
              </div>

              
            </div>
          </div>
        </motion.div>

      
    </>

  );
}
