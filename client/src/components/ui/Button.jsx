
import classNames from "classnames";

function Button({ children, onClick, style, className }) {
  const baseClasses = style === "secondary" ? `bg-transparent px-4 text-off-black font-semibold py-2 rounded  border border-gray-500` : `bg-[#312895] text-white font-bold  py-2 px-4 rounded-md 
  text-center transition duration-200 ease-in-out 
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