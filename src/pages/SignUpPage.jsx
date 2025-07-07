"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import api from "../utils/api"
import "../assets/styles/Auth.css"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("student")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    profilepicURL: "",
    about: "",
    skills: [],
    areas_of_expertise: [],
    city: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    if (e.target.name === "skills" || e.target.name === "areas_of_expertise") {
      setFormData({ ...formData, [e.target.name]: e.target.value.split(",") })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Use api.public.post for registration to avoid sending Authorization header
      const res = await api.public.post(`/${selectedRole}/register`, formData)
      alert(res.message || "Registration successful! Please verify your email.")
      navigate(`/verify-otp?email=${formData.email}&role=${selectedRole}`)
    } catch (error) {
      console.error("Registration error:", error)
      alert(error.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-circle"></div>
      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-logo">
              <Link to="/">
                <span className="graduation-cap">🎓</span>
                EduNest
              </Link>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${selectedRole === "student" ? "active" : ""}`}
                onClick={() => setSelectedRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`role-btn ${selectedRole === "teacher" ? "active" : ""}`}
                onClick={() => setSelectedRole("teacher")}
              >
                Teacher
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                className="form-input"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="student@coursehub.io"
                className="form-input"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  className="form-input"
                  onChange={handleChange}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="1234567890"
                className="form-input"
                onChange={handleChange}
                required
              />
            </div>
 

            <div className="form-group">
              <label htmlFor="about">About</label>
              <textarea
                id="about"
                name="about"
                placeholder="Tell us about yourself"
                className="form-input"
                onChange={handleChange}
              ></textarea>
            </div>

            {selectedRole === "student" ? (
              <div className="form-group">
                <label htmlFor="skills">Skills (comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  placeholder="React, JavaScript, Node.js"
                  className="form-input"
                  onChange={handleChange}
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="areas_of_expertise">Areas of Expertise (comma-separated)</label>
                  <input
                    type="text"
                    id="areas_of_expertise"
                    name="areas_of_expertise"
                    placeholder="Web Development, Machine Learning"
                    className="form-input"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="New York"
                    className="form-input"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="auth-divider">or</div>

            <a href="/login" className="secondary-btn">
              Already have an account?
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}

