import { useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaClipboardList,
  FaListAlt,
} from "react-icons/fa";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && isOpen) closeNavbar();
  };

  const navLinks = [
    { to: "/add", icon: <FaPlusCircle />, label: "Add Item" },
    { to: "/orders", icon: <FaClipboardList />, label: "Orders" },
    { to: "/list", icon: <FaListAlt />, label: "List Items" },
  ];

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="mobile-header">
        <button
          className="menu-toggle"
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <NavLink to="/">
          <img src={logo} alt="Logo" className="logo" />
        </NavLink>
      </div>

      {/* Sidebar */}
      <div
        className={`admin-navbar ${isOpen ? "open" : ""}`}
        role="navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="admin-navbar-header">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="logo" />
          </NavLink>
        </div>
        <ul className="admin-nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={closeNavbar} // Close the navbar on navigation
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="logout-section">
          <NavLink to="/logout"  onClick={handleLogout} >
            <FaSignOutAlt />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

Navbar.propTypes = {
  handleLogout: PropTypes.func.isRequired, // Validate handleLogout as a function and it's required
};

export default Navbar;
