import logo from "../assets/images/nu-space.png";


function Header () {
  return (
    <img src={logo} alt="Logo" className="h-4  ml-12  object-contain" draggable="false"/>
  );
}

export default Header;