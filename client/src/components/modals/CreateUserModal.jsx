import { motion } from "framer-motion";
import { Backdrop } from "../ui";
import  { DropIn }  from "../../animations/DropIn";
import { TextInput, TabSelector, DropdownSearch } from "../ui";
import { useState } from "react";
import { Button, CloseButton } from "../../components";


export default function CreateUserModal({ closeModal }) {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        {label: "Student"},
        {label: "RSO Representative"}
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
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-xl font-semibold">Create New Account</h2>
                        <CloseButton onClick={closeModal} />
                    </div>
                    
                    
                    <div className="mb-4">
                        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}/>
                    </div>
                    


                    {activeTab === 0 ? <StudentForm/> : <StudentRSOForm role="rso_representative"/>}

                    <div className="flex flex-row space-x-2  justify-end">
                        <Button onClick={closeModal} className="text-off-black px-4" style="secondary">Cancel</Button>
                        <Button className="px-4">
                            <div className="flex flex-row space-x-2 items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="fill-white size-4"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                                <h1>Create Account</h1>
                            </div>
                        </Button>
                    </div>

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
    <div className="mb-6">
        <label htmlFor="email">Email</label>
        <TextInput name="email" type="email" className="w-full p-2 bg-light-gray border border-mid-gray rounded focus:outline-none focus:ring-2 focus:ring-off-black" placeholder="---@students.national-u.edu.ph" />
    </div>
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
          <div >
              <label htmlFor="lastName">Last Name</label>
              <TextInput name="lastName" type="text" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" />
          </div>
      </div>
      
        <label htmlFor="email">Email</label>
        <TextInput name="email" type="email" className="w-full p-2 bg-light-gray border border-mid-gray rounded mb-4 focus:outline-none focus:ring-2 focus:ring-off-black" placeholder="---@students.national-u.edu.ph" />        

    
        <div className="mb-6">
            <label htmlFor="role">Role</label>
            <DropdownSearch 
            id="category"
            isDisabled={selectedRole !== "rso_representative"}
            role={role}
            />
        </div>

      </>

      
      );
      }
  