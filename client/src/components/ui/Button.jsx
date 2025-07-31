
import classNames from "classnames";

function Button({ children, onClick, style, className, disabled }) {
  const baseClasses = style === "secondary" ? ` px-4 text-off-black font-semibold py-2 rounded  border border-gray-400 hover:bg-gray-100` : `bg-[#312895] text-white font-bold  py-2 px-4 rounded-md 
  text-center transition duration-200 ease-in-out 
  hover:brightness-90 `


  return (
    <button
      disabled={disabled}
      className={classNames(baseClasses, className)}
      onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;