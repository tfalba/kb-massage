import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/kara-logo5.png'

export default function Navbar() {
    const { pathname } = useLocation();
    return (
        <nav className='Navbar'>
            <img className='Navbar-logo logo' src={logo} alt='the top ' />

            <div className='Navbar-links'>
                <Link className={pathname === "/" ? "Navbar-active" : ""} to="/">Home</Link>
                <Link className={pathname === "/about" ? "Navbar-active" : ""} to="/about">About</Link>
                {/* <Link className={pathname === "/services" ? "Navbar-active" : ""} to="/services">Services</Link> */}
                <Link className={pathname === "/services-alt" ? "Navbar-active" : ""} to="/services-alt">Services</Link>

                {/* <Link className={`button ${pathname === "/booking" ? "Navbar-active" : ""}`} to="/booking" >Book Now</Link>
                <Link className={`button ${pathname === "/booking-alt" ? "Navbar-active" : ""}`} to="/booking-alt" >Book (Alt)</Link> */}

            </div>
        </nav>
    )
}