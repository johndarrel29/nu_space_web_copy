import React, { useState, useEffect } from "react";
import InputModal from "../modals/InputModal";

export default function RSOTable({ data, searchQuery, onUpdate }) {
    const safeSearchQuery = searchQuery || '';
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    

    // Filter data 
    const searchedData = data.filter(org => 
        (org.orgName || '').toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
        (org.acronym || '').toLowerCase().includes(safeSearchQuery.toLowerCase()) 
      );
      

    const records = searchedData;

    const showModalInfo = (org) => {
    console.log("selected data: ", org);
    setShowModal(true);
    setSelectedUser(org);
    }

         const handleCloseModal = () => {
        console.log("Modal close");
        setShowModal(false);
        setSelectedUser(null);
      }

      const handleConfirm = (id, updatedData) => {
        if (!updatedData) {
          onUpdate(data.filter(org => org.id !== id));
          return;
        }
      
        console.log(" Saving or updating entry", updatedData);
      
        // Update if ID exists, otherwise add new entry
        const updatedRecords = data.some(org => org.id === id)
          ? data.map(org => org.id === id ? { ...org, ...updatedData } : org) 
          : [...data, updatedData]; 
      
        onUpdate(updatedRecords);
      };
      
      


    return (
        <table className="w-full ">
            <tbody >
                {records.map((org, index) => (
                    <tr key={index} className="mb-4"
                    onClick={() => showModalInfo(org)}
                    >
                      <div className="grid grid-cols-2 p-4 hover:bg-gray-300 border  rounded-lg cursor-pointer">
                        <div className="flex items-center gap-4 ">
                          <td >
                              <img src={org.image} alt={org.orgName} width="50" height="50" 
                              className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
                              />
                          </td>
                        
                       
                          <div className="grid grid-col-1">
                            <div>
                              <td>
                                <h1 className="text-lg font-semibold">
                                {org.orgName}
                                </h1>
                                </td>
                              </div>
                            <div><td>{org.email}</td></div>
                          </div>                         
                        </div>
                          <div >

                            <h1 className="text-gray-600 ">
                            <td>{org.type}</td>
                            </h1>
                          </div>
                          
                      </div>
                    </tr>
                ))}
            </tbody>

{/* TODO: replace the map function with the correct data. make sure to include search, delete, and update functionality */}
            {showModal && selectedUser && (
                <InputModal
                    onClose={handleCloseModal}
                    id={selectedUser?.id}
                    acronym={selectedUser.acronym}
                    image={selectedUser.image}
                    orgName={selectedUser.orgName}
                    phone={selectedUser.phone}
                    type={selectedUser.type}
                    description={selectedUser.description}
                    email={selectedUser.email}
                    website={selectedUser.website}
                    onConfirm={handleConfirm}
                />
            )}
        </table>


    );
}
