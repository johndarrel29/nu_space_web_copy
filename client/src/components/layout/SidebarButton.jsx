import style from '../../css/SidebarButton.module.css';
import sidebar from '../../css/Sidebar.module.css';
import classNames from 'classnames';
import { useState } from 'react';


function SidebarButton({ icon, text, onClick, active, iconPath, isCollapsed }) {


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
      className={(user?.role === "rso_representative") ?
        (classNames(isCollapsed ? style.hoverDivRSOExpanded : style.hoverDivRSO, 'relative flex items-center gap-2', sidebar.button, {
          [sidebar.activeButtonRSO]: active
        })
        ) : (
          classNames(isCollapsed ? style.hoverDivExpanded : style.hoverDiv, 'relative flex items-center gap-2', sidebar.button, {
            [sidebar.activeButton]: active
          })
        )} onClick={handleClick}>

      {/* the icon */}
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        height="20"
        width="20"
        className={classNames(user?.role === "rso_representative" ? `fill-primary flex-shrink-0` : `fill-white flex-shrink-0`,
          { [sidebar.activeIcon]: user?.role === "rso_representative" && active })}
      >
        <path
          d={iconPath} />
      </svg>
      {user?.role === 'rso_representative' &&
        (<h1 className={isCollapsed ? style.sidebarTextExpandedRSO : (style.sidebarTextRSO && 'hidden')}>{text}</h1>)
      }
      {(user?.role === 'admin' || user?.role === 'super_admin') &&
        (
          (<h1 className={isCollapsed ? style.sidebarTextExpanded : (style.sidebarText && 'hidden')}>
            {text}
          </h1>)
        )}
    </div>
  );
}

export default SidebarButton;