


"use client"

import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import api from "../utils/api"
import "../assets/styles/Auth.css"

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const email = searchParams.get("email")
  const role = searchParams.get("role")

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    // Check if email and OTP are provided
    if (!email || !otp) {
      alert("Please enter both email and OTP.")
      return
    }

    try {
      setLoading(true)
      console.log("Verifying OTP...")
      console.log("Email:", email, "OTP:", otp, "Role:", role)

      // Convert OTP to integer
      const otpInt = Number.parseInt(otp, 10)

      if (isNaN(otpInt)) {
        alert("Invalid OTP format. Please enter a numeric OTP.")
        return
      }

      // Make the API request using public.post to avoid sending Authorization header
      const data = await api.public.post(`/${role}/verify-otp`, { email, otp: otpInt })

      // Show success message and navigate
      alert(data.message)
      navigate("/login")
    } catch (error) {
      // Handle errors more clearly
      console.log("OTP verification error:", error)
      alert(error.message || "Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setLoading(true)
      const data = await api.public.post(`/${role}/resend-otp`, { email })
      alert(data.message)
    } catch (error) {
      alert(error.message || "Failed to resend OTP. Please try again.")
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

          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <h2>OTP Verification</h2>
            <p>Please enter the 6-digit OTP sent to your email.</p>

            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="number"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit OTP"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="auth-divider">or</div>

            <button type="button" className="secondary-btn" onClick={handleResendOtp} disabled={loading}>
              {loading ? "Processing..." : "Resend OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}



