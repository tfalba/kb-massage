import { Link, useLocation } from "react-router-dom";
import logo from "../assets/kara-logo5.png";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="Navbar aic">
      <img className="Navbar-logo logo" src={logo} alt="the top " />

      <div className="Navbar-links flex-col">
        <Link className={pathname === "/" ? "Navbar-active" : ""} to="/">
          Home
        </Link>
        <Link
          className={pathname === "/about" ? "Navbar-active" : ""}
          to="/about"
        >
          About
        </Link>
        <Link
          className={pathname === "/services" ? "Navbar-active" : ""}
          to="/services"
        >
          Services
        </Link>
      </div>
    </nav>
  );
}
