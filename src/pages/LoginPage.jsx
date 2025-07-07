"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate,Link } from "react-router-dom"
import api, { setAuthToken, setUserData } from "../utils/api"
import "../assets/styles/Auth.css"
import Loader from "../components/Loader"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const navigate = useNavigate()


  useEffect(() => {
    localStorage.clear()
  }, [])


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)

      // Determine which API endpoint to use based on selected role
      const endpoint = `/${selectedRole}/login`
      console.log("Login endpoint:", endpoint)

      const data = await api.post(endpoint, formData)
      console.log("Login response:", data)

      // Extract token and user data
      const { token, [selectedRole]: userData } = data
     console.log("Token:*")
     console.log(token)
      if (!token) {
        throw new Error("No token received from server")
      }

      // Store token and user data
      setAuthToken(token)

      // Store user data with role
      const userDataWithRole = { ...userData, role: selectedRole }
      setUserData(userDataWithRole)

      // Store role separately for easier access
      localStorage.setItem("role", selectedRole)

      // Navigate based on role
      navigate(`/${selectedRole}-dashboard`)
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader fullScreen />
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

          {error && <div className="auth-error">{error}</div>}

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
              <button
                type="button"
                className={`role-btn ${selectedRole === "admin" ? "active" : ""}`}
                onClick={() => setSelectedRole("admin")}
              >
                Admin
              </button>
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

            <button type="submit" className="submit-btn">
              Log in
            </button>

            <div className="auth-divider">or</div>

            <a href="/signup" className="secondary-btn">
              Create new account
            </a>
          </form>
        </div>
      </div>
    </div>
  )
}


