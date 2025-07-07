"use client"
import "../assets/styles/Footer.css"
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate()
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-content">
          <div className="footer-section logo-section">
            <h2> <span className="graduation-cap">🎓</span>EduNest</h2>
            <p className="tagline">Empowering education for everyone</p>
            <div className="social-icons">
              <a href="https://www.linkedin.com/in/sahil-undhad-9ba268285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/UndhadSahil?t=I_yIo3wSyCRPM0BkA7wVwA&s=09" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/sahil-undhad-9ba268285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/undhadsahil?igsh=MWUzeDVva3E4YnY5YQ==" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section contact-section">
            <h3>Contact Us</h3>
            <p>+91 9023454590</p>
            <p>edunest.official2@gmail.com</p>
            <p>admin@gmail.com</p>
          </div>

          <div className="footer-section address-section">
            <h3>Address</h3>
            <p>1234 Learning Avenue</p>
            <p>Ahmedabad - 320008</p>
            <p>Gujarat,India</p>
          </div>

          <div className="footer-section cta-section">
            <h3>Start Learning Today</h3>
            <button className="cta-button" onClick={() => navigate("/view-courses")}>Enroll Now</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">&copy; 2025 EduNest. All rights reserved | Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  )
}

export default Footer

