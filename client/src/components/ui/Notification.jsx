import { motion } from "framer-motion";

const notificationVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.2,
    transition: { duration: 0.1 },
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: { ease: "easeOut", duration: 0.15 },
  },
  hover: { scale: 1.05, transition: { duration: 0.1 } },
};

const styleType = () => ({
  background: "linear-gradient(15deg, #6adb00, #04e800)",
});

const Notification = ({ notification }) => {


  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 p-4 rounded-md shadow-lg text-white"
      style={styleType()}
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
    >
      <h3 className="text-black ">{notification}</h3>
    </motion.div>
  );
};

export default Notification;
