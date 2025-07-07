"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../assets/styles/Navbar.css"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Close menu when clicking outside
  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span className="graduation-cap">🎓</span>
          EduNest
        </Link>
      </div>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/view-courses" onClick={closeMenu}>
            Courses
          </Link>
        </li>
        <li>
          <Link to="/features" onClick={closeMenu}>
            Features
          </Link>
        </li>
        <li>
          <Link to="/benefits" onClick={closeMenu}>
            Benefits
          </Link>
        </li>
        <li>
          <Link to="/offers" onClick={closeMenu}>
            Offers
          </Link>
        </li>
      </ul>

      <div className={`navbar-actions ${menuOpen ? "active" : ""}`}>
        <Link to="/login" className="login-btn" onClick={closeMenu}>
          Log in
        </Link>
        <Link to="/signup" className="signup-btn" onClick={closeMenu}>
          Sign up for free
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
