import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import InputModal from "../modals/InputModal";


export default function RSOTable({category, searchQuery}) {
    const [data, setData] = useState([]);
    const safeSearchQuery = searchQuery || ''; 
    const [selectedUser, setSelectedUser] = useState(null); 

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('delete');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("🔥 Users state after update:", users);
    }, [users]);  // Runs every time `users` is updated

        // Filter data based on category
        const filteredData = category === "All" 
        ? data 
        : data.filter(item => item.category === category);

const searchedData = filteredData.filter(item => 
    item.org_name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
    item.college.toLowerCase().includes(safeSearchQuery.toLowerCase()) 
);

   useEffect(() => {
       fetch("/data/RSO_DATA.json")
         .then((response) => response.json())
         .then((json) => {
            setData(json);
            setUsers(json || []); // Make sure users is always an array
        })

         .catch((error) => console.error("Error loading data:", error));
     }, []); 

     const handleCloseModal = () => {
        console.log("Modal close");
        setShowModal(false);
        setSelectedUser(null);
      }
    
//filtering data
const records = searchedData;

//showing data
const showModalInfo = (data) => {
    console.log("selected data: ", data);
    setShowModal(true);
    setSelectedUser(data);
}

const handleConfirm = (id, updatedData) => {
    if (!id) {
        console.error("❌ Missing ID! Cannot update or delete.");
        return;
    }

    if (!updatedData) {
        // If updatedData is undefined, it's a delete action
        console.log("🗑 Deleting user with ID:", id);

        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
        setData((prevData) => prevData.filter(user => user.id !== id));
        
        return;
    }

    console.log("🚀 Updating user with ID:", id, "Updated Data:", updatedData);

    setUsers((prevUsers) => prevUsers.map(user =>
        user.id === id ? { ...user, ...updatedData } : user
    ));

    setData((prevData) => prevData.map(user =>
        user.id === id ? { ...user, ...updatedData } : user
    ));
};


    return (
        <div>
            <table className="table-auto w-full pr-50 border-collapse">
                <tbody className="overflow-hidden bg-gray-200 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700   cursor-pointer ">
                {records.map((data, index) => (
                            //console.log(data) shows the data
                        <tr key={index} className=" rounded-lg hover:bg-gray-100 rounded-lg" onClick={() => showModalInfo(data)}>
                            <td className="px-4 py-3 "> 
                            <div className="flex items-center">
                            <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                              <img className="object-cover w-full h-full rounded-full" src={data.image} alt="" loading="lazy" />
                            </div>             
                                <div>
                                  <div >{data.org_name}</div>
                                  <div className="text-gray-500">{data.college}</div>
                                </div>
                            </div>
                            
                            </td>

                            <td >{data.category}</td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && selectedUser && (
                <InputModal
                    onClose={handleCloseModal}
                    id={selectedUser?.id}
                    image={selectedUser.image}
                    selectedType={selectedUser.type}
                    org_name={selectedUser.org_name}
                    college={selectedUser.college}
                    category={selectedUser.category}
                    email={selectedUser.email}
                    link={selectedUser.link}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}