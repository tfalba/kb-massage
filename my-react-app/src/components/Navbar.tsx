import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: If you want to add specific styles for the Navbar

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/faq">FAQ</Link>
        </li>
        <li>
          <Link to="/book-now">Book Now</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;