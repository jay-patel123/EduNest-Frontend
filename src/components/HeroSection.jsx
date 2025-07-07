import React from "react"
import "../assets/styles/HeroSection.css"
import { Link } from "react-router-dom"

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-logo">
          <span className="graduation-cap">🎓</span>
          EduNest
        </div>
        <h2>Enhance your Customizable learning experience with ... </h2>
        <Link to='/view-courses'>
        <button className="explore-btn">Explore courses</button>
        </Link>
      </div>
    </section>
  )
}

export default HeroSection

