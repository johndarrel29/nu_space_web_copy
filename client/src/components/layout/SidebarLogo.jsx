import style from "../../css/SidebarLogo.module.css";
import whiteLogoText from "../../assets/images/NUSpace_new.png";
import blueLogoText from "../../assets/images/NUSpace_blue.png";
import yellowLogo from "../../assets/images/icon_yellow.png";
import blueLogo from "../../assets/images/icon_blue.png";

import iconLogo from "../../assets/images/tab-logo.png";
import { useUserStoreWithAuth } from "../../store";

function SidebarLogo({ logoStyle }) {
  const { isUserRSORepresentative, isUserAdmin, isSuperAdmin } = useUserStoreWithAuth();

  return (
    <div>
      {logoStyle === "expanded" && (
        <img
          src={isUserRSORepresentative ? blueLogoText : whiteLogoText}
          alt="Logo"
          className="h-8 ml-4 object-contain opacity-100 transition-opacity duration-100 ease-out md:opacity-1"
          draggable="false"
        />
      )}
      {logoStyle === "collapsed" && (
        <div className={style.iconContainer}>
          <img
            src={isUserRSORepresentative ? blueLogo : yellowLogo}
            alt="Logo"
            className="h-8 object-contain opacity-100 ml-0 transition-opacity duration-300 ease-in"
            draggable="false"
          />
        </div>
      )}


    </div>


  );
}

export default SidebarLogo;