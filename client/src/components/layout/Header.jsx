import logo from "../../assets/images/nu-space.png";
import whiteLogo from "../../assets/images/white-nu-space.png";

function Header ({theme}) {
  return (
    <img 
      src={theme === "dark" ? logo :  whiteLogo} 
      alt="Logo" className="h-4  ml-12  object-contain"
      draggable="false"
    />
  );
}

export default Header;