import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import './Nevbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <ScrollLink
  to="hero"
  smooth={true}
  duration={500}
  className="logo"
  onClick={() => setMenuOpen(false)}
  spy={true}
>
  PARENT
</ScrollLink>

      <ul className={`nav-links navbar-center ${menuOpen ? 'open' : ''}`}>
    <li>
      <ScrollLink to="hero" activeClass="active" smooth spy duration={500} onClick={() => setMenuOpen(false)}>Home</ScrollLink>
    </li>
    <li>
      <ScrollLink to="about" activeClass="active" smooth spy duration={500} onClick={() => setMenuOpen(false)}>About</ScrollLink>
    </li>
    <li>
      <ScrollLink to="services" activeClass="active" smooth spy duration={500} onClick={() => setMenuOpen(false)}>Services</ScrollLink>
    </li>
    <li>
      <ScrollLink to="contact" activeClass="active" smooth spy duration={500} onClick={() => setMenuOpen(false)}>Contact</ScrollLink>
    </li>
  </ul>
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? '✖' : '☰'}
      </button>
        
    </nav>
  );
};

export default Navbar;
