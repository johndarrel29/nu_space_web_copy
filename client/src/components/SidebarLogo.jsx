import style from "../css/SidebarLogo.module.css";
import whiteLogo from "../assets/images/white-nu-space.png";
import iconLogo from "../assets/images/tab-logo.png";

function SidebarLogo () {
  return (
    <div>
    
        <img 
        src={whiteLogo} 
        alt="Logo" className={style.imageStyle}
        draggable="false"
        />
 
      <div className={style.iconContainer}>
            <img 
            src={iconLogo} 
            alt="Logo" className={style.icon}
            draggable="false"
            />
        </div>

    </div>


  );
}

export default SidebarLogo;