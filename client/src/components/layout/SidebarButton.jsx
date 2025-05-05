import style from '../../css/SidebarButton.module.css';
import sidebar from '../../css/Sidebar.module.css';
import classNames from 'classnames';
import { useState } from 'react';


function SidebarButton({ icon, text, onClick, active, iconPath }) {


  // State to track whether the button is active or not
  const [isActive, setIsActive] = useState(false);

  // Toggle active state on click
  const handleClick = () => {
    setIsActive((prevState) => !prevState);
    if (onClick) onClick();
  };

  const user = JSON.parse(localStorage.getItem("user"));


  return (

<div
    title={text}
    className={ user?.role === "student/rso" ? 
      (classNames(style.hoverDivRSO, 'relative flex items-center gap-2', sidebar.button,{
      [sidebar.activeButtonRSO]: active
    })
  ) : (
      classNames(style.hoverDiv, 'relative flex items-center gap-2', sidebar.button,{
        [sidebar.activeButton]: active
      })
  )} onClick={handleClick}>
        {/* <img src={icon} alt="Dashboard" className={style.icon}/>  */}
        <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 576 512" 
        height="20"
        width="20"
        className={  user?.role === "student/rso" ?  `fill-primary flex-shrink-0` : `fill-white flex-shrink-0`}
        >
        <path 
        d={iconPath}/>
        </svg>
        <h1 className={style.sidebarText}>{text}</h1>
  </div>
  );
}

export default SidebarButton;