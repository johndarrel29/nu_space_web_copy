import logo from "../../assets/images/NUSpace_blue.png";
import whiteLogo from "../../assets/images/NUSpace_new.png";

function Header({ theme }) {
  return (
    <img
      src={theme === "dark" ? logo : whiteLogo}
      alt="Logo" className="h-8  ml-12  object-contain"
      draggable="false"
    />
  );
}

export default Header;