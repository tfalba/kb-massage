import { Link, useLocation } from "react-router-dom";
import logo from "../assets/kara-logo5.png";

export default function Navbar() {
  const { pathname } = useLocation();
  const linkBase =
    "font-montserrat text-[clamp(1rem,1.2vw,1.6rem)] font-light text-brand-cream transition-colors hover:text-white";
  const activeClass = "font-semibold text-white";

  return (
    <nav className="flex h-[max(12vw,14vh,105px)] w-full items-center justify-between bg-brand-forest px-[2vw] pr-[max(65px,9vw)]">
      <img
        className="logo w-[clamp(135px,20vw,220px)]"
        src={logo}
        alt="KB Massage logo"
      />

      <div className="flex flex-col items-end justify-between gap-2">
        <Link className={`${linkBase} ${pathname === "/" ? activeClass : ""}`} to="/">
          Home
        </Link>
        <Link
          className={`${linkBase} ${pathname === "/about" ? activeClass : ""}`}
          to="/about"
        >
          About
        </Link>
        <Link
          className={`${linkBase} ${pathname === "/services" ? activeClass : ""}`}
          to="/services"
        >
          Services
        </Link>
      </div>
    </nav>
  );
}
