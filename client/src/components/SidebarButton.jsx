import style from '../css/SidebarButton.module.css';
import sidebar from '../css/Sidebar.module.css';
import classNames from 'classnames';
import { useState } from 'react';

function SidebarButton({ icon, text, onClick, active }) {
  // State to track whether the button is active or not
  const [isActive, setIsActive] = useState(false);

  // Toggle active state on click
  const handleClick = () => {
    setIsActive((prevState) => !prevState);
    if (onClick) onClick();
  };


  return (

<div
    title={text}
    className={classNames(style.hoverDiv, 'relative flex items-center gap-2', sidebar.button,{
      [sidebar.activeButton]: active
    })}  
    onClick={handleClick}>
        <img src={icon} alt="Dashboard" className={style.icon}/>
            <h1 className={style.sidebarText}>{text}</h1>
</div>
  );
}

export default SidebarButton;