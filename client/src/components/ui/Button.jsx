// import style from '../../css/Button.module.css';
import classNames from "classnames";

function Button({ children, onClick, style, className }) {
  const baseClasses = style === "secondary" ? `bg-light-gray text-off-black font-semibold py-2 rounded hover:bg-mid-gray` : `bg-primary text-white font-bold  py-2 rounded-md 
  text-center mt-6 transition duration-200 ease-in-out 
  hover:brightness-90 `


  return (
    <button 
      className={classNames(baseClasses, className)}
      onClick={onClick}>
        {children}
    </button>
  );
}

export default Button;