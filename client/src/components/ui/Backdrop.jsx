import { motion } from "framer-motion";

const Backdrop = ({ children, onClick, className }) => {
 
  return (
    <motion.div
      onClick={onClick}
      className={className}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;