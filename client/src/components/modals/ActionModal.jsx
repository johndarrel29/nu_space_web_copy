'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Dropdown from '../ui/Dropdown'
import DropdownSearch from '../ui/DropdownSearch'

export default function ActionModal({ onClose, mode, id, name, date, email, role, onConfirm }) {
  const [selectedRole, setSelectedRole] = useState(role || "Student");

  useEffect(() => {
    if (mode === "edit") {
      setSelectedRole(role);
    }
  }, [mode, role]);

  console.log("onConfirm exists?", typeof onConfirm === "function");


  const handleConfirm = () => {
    console.log("handleConfirm inside ActionModal triggered");

    if (mode === "edit") {
      const data = { type: selectedRole }; // Ensure data is defined
      console.log("Inside ActionModal: Data before calling onConfirm:", data);
      console.log("Inside ActionModal: Calling onConfirm with:", id, data);
      onConfirm(id, data); // Pass the defined data
    } else if (mode === "delete") {
      console.log("Inside ActionModal (DELETE MODE): Calling onConfirm with:", id);
      onConfirm(id); // No second parameter for delete
    }
  
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {mode === 'delete' ? (
                // Delete Confirmation Layout
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon className="size-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Delete Account
                    </DialogTitle>
                    <p className="mt-2 text-sm text-gray-500">
                      Are you sure you want to delete {name}'s account? This action cannot be undone.
                    </p>
                  </div>
                </div>
              ) : (
                // Edit Role Layout
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:size-10">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg> */}
                    </div>
                    <h1 className="pl-3 font-bold">Edit Account Role</h1>
                  </div>

                  <div className="col-span-2"></div>

                  <div>
                    <h1 className="text-blue-600">Name:</h1>
                    <h1>{name}</h1>
                  </div>

                  <div className="grid grid-cols-1">
                    <h1>Role:</h1>
                    <Dropdown setSelectedRole={setSelectedRole} selectedRole={selectedRole} />
                  </div>

                  <div>
                    <h1 className="text-blue-600">Date Created:</h1>
                    <h1>{date}</h1>
                  </div>

                  <div>
                    <h1>Category:</h1>
                    <DropdownSearch isDisabled={selectedRole === "Student"} />
                  </div>

                  <div>
                    <h1 className="text-blue-600">Email:</h1>
                    <h1>{email}</h1>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleConfirm}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto 
                ${mode === 'delete' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {mode === 'delete' ? 'Delete' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
