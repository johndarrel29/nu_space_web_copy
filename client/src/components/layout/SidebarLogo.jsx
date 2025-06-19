import style from "../../css/SidebarLogo.module.css";
import whiteLogo from "../../assets/images/white-nu-space.png";
import blueLogo from "../../assets/images/blue-nu-space.png";
import iconLogo from "../../assets/images/tab-logo.png";

function SidebarLogo (logoStyle) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
    
        <img 
        src={user?.role === "rso_representative" ? blueLogo : whiteLogo} 
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