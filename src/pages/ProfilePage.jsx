

"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit, LogOut, Camera,ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/ProfilePage.css"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [studentInfo, setStudentInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)

        const data = await api.get("/student/profile")

        // Log the response for debugging
        console.log("Profile response:", data)

        // Process the data to ensure it's in the right format
        const processedData = {
          name: data.name || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          profilepicURL: data.profilepicURL || "",
          about: data.about || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          join_date: data.join_date || new Date().toISOString(),
          courses_enrolled: data.courses_enrolled.length || 0,
          modules_enrolled: Array.isArray(data.courses_enrolled)
          ? data.courses_enrolled.reduce((total, course) => total + (course.modules?.length || 0), 0)
          : 0,
          rewardPoints: data.rewardPoints || 0,
          recent_achievement: Array.isArray(data.recent_achievement) ? data.recent_achievement : [],
        }

        setStudentInfo(processedData)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")

        // Fallback to mock data if API fails
        setStudentInfo({
          name: "Emily Johnson",
          email: "emily.johnson@example.com",
          contactNumber: "+1 (555) 123-4567",
          profilepicURL:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60",
          about:
            "Passionate about web development and always eager to learn new technologies. Currently focusing on mastering React and Node.js.",
          skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
          join_date: "2023-09-01",
          courses_enrolled: 5,
          modules_enrolled: 8,
          rewardPoints: 120,
          recent_achievement: [
            "Completed Advanced JavaScript Course",
            "Earned React Developer Certificate",
            "Contributed to open-source project",
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    // Import and use the logout function from auth.js
    import("../utils/api").then(({ logout }) => {
      logout()
      window.location.href = "/login"
    })
  }

  // Helper function to safely render potentially complex data
  const safeRender = (data) => {
    if (data === null || data === undefined) return ""
    if (typeof data === "object") return JSON.stringify(data)
    return data
  }

  if (loading) {
    return (
      
        <Loader fullscreen/>
      
    )
  }

  if (error && !studentInfo) {
    return (
    
        <div className="error-container">
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      
    )
  }

  return (
    
      <div className="profile-container">
        <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Dashboard
          </Button>
          <br/>
        <h1 className="profile-title">My Profile</h1>
        <br/>

        <div className="profile-content">
          <div className="profile-left-section">
            <div className="profile-photo-section">
              <div className="profile-photo-wrapper">
                <img
                  src={studentInfo.profilepicURL || "/placeholder.svg?height=400&width=400"}
                  alt={studentInfo.name}
                  className="profile-photo"
                />
              </div>
              <h2>{safeRender(studentInfo.name)}</h2>
              <p className="bio">{safeRender(studentInfo.about)}</p>
            </div>

            <div className="contact-info">
              <div className="info-item">
                <Mail size={18} />
                <span>{safeRender(studentInfo.email)}</span>
              </div>
              <div className="info-item">
                <Phone size={18} />
                <span>{safeRender(studentInfo.contactNumber)}</span>
              </div>
              {studentInfo.location && (
                <div className="info-item">
                  <MapPin size={18} />
                  <span>{safeRender(studentInfo.city)}</span>
                </div>
              )}
              <div className="info-item">
                <Calendar size={18} />
                <span>
                  Joined{" "}
                  {new Date(studentInfo.join_date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </span>
              </div>
            </div>

            <Link to="/edit-profile" className="edit-profile-btn">
              <Edit size={16} />
              Edit Profile
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="profile-right-section">
            <section className="course-progress">
              <h3>Course Progress</h3>
              <div className="progress-stats">
                <div className="stat-item">
                  <BookOpen size={20} />
                  <div className="stat-info">
                    <span>Courses Enrolled</span>
                    <span className="stat-value">{safeRender(studentInfo.courses_enrolled)}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Award size={20} />
                  <div className="stat-info">
                    <span>Total Modules Enrolled</span>
                    <span className="stat-value">{safeRender(studentInfo.modules_enrolled)}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Award size={20} />
                  <div className="stat-info">
                    <span>Reward Points</span>
                    <span className="stat-value">{safeRender(studentInfo.rewardPoints)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="skills-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {studentInfo.skills &&
                  studentInfo.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {safeRender(skill)}
                    </span>
                  ))}
              </div>
            </section>

            <section className="achievements-section">
              <h3>Recent Achievements</h3>
              <ul className="achievements-list">
                {studentInfo.recent_achievement && studentInfo.recent_achievement.length > 0 ? (
                  studentInfo.recent_achievement.map((achievement, index) => (
                    <li key={index}>{safeRender(achievement)}</li>
                  ))
                ) : (
                  <li className="no-achievements">No achievements yet</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    
  )
}

export default ProfilePage

