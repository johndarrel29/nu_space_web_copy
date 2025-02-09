import style from '../css/SidebarButton.module.css';
import classNames from 'classnames';
import { useState } from 'react';

function SidebarButton({ icon, text, onClick }) {
  // State to track whether the button is active or not
  const [isActive, setIsActive] = useState(false);

  // Toggle active state on click
  const handleClick = () => {
    setIsActive((prevState) => !prevState);
    if (onClick) onClick();
  };


  return (

<div 
    className={classNames(style.hoverDiv, 'relative flex items-center gap-2', {
        // [style.active]: isActive // Apply active class if clicked
    })}  
    onClick={handleClick}>
        <img src={icon} alt="Dashboard" className={style.icon}/>
            <h1 className={style.sidebarText}>{text}</h1>
</div>
  );
}

export default SidebarButton;