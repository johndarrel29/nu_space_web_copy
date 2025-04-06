import { motion } from "framer-motion";
import { Backdrop } from "../ui";
import  { DropIn }  from "../../animations/DropIn";

export default function CreateUserModal({ closeModal }) {
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
                    
                    <button onClick={closeModal} className="mt-4 text-blue-500">Close</button>
                </div>             
            </motion.div>
            </Backdrop>

        </>

    );
}