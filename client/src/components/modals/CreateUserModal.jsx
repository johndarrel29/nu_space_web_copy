import { motion } from "framer-motion";
import { Backdrop } from "../ui";
import  { DropIn }  from "../../animations/DropIn";
import { TextInput, TabSelector, DropdownSearch } from "../ui";
import { useState } from "react";


export default function CreateUserModal({ closeModal }) {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        {label: "Student"},
        {label: "Student/RSO"}
    ];


    


    return (
        <>
            <Backdrop className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
            <motion.div
            className="bg-white overflow-hidden rounded-lg shadow-lg w-[90%] max-w-[600px] p-4"
            variants={DropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            >
                <div className=" p-6 z-10">
                    <h2 className="text-xl font-semibold mb-4">Create New Account</h2>
                    <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}/>


                    {activeTab === 0 ? <StudentForm/> : <StudentRSOForm role="student/rso"/>}
                    <button onClick={closeModal} className="mt-4 text-primary">Close</button>
                </div>             
            </motion.div>
            </Backdrop>

        </>

    );


  }
function StudentForm({}) {
      return (
      <>
      <div className="flex flex-row gap-4 ">
        <div>
            <label htmlFor="firstName">First Name</label>
            <TextInput name="firstName" type="text" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" />
        </div>
        <div>
            <label htmlFor="lastName">Last Name</label>
            <TextInput name="lastName" type="text" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" />
        </div>
    </div>

    <label htmlFor="email">Email</label>
    <TextInput name="email" type="email" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" placeholder="---@students.national-u.edu.ph" />
    </>
    );
    }

function StudentRSOForm({role}) {
    const [selectedRole, setSelectedRole] = useState(role || "student");


        return (
        <>
        <div className="flex flex-row gap-4 ">
          <div>
              <label htmlFor="firstName">First Name</label>
              <TextInput name="firstName" type="text" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" />
          </div>
          <div>
              <label htmlFor="lastName">Last Name</label>
              <TextInput name="lastName" type="text" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" />
          </div>
      </div>
      
  
      <label htmlFor="email">Email</label>
      <TextInput name="email" type="email" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" placeholder="---@students.national-u.edu.ph" />
    
    <label htmlFor="role">Role</label>
    <DropdownSearch 
    id="category"
    isDisabled={selectedRole !== "student/rso"}
    role={role}
    />
      </>

      
      );
      }
  