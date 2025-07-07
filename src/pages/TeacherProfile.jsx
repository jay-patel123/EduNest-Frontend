

"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Phone, MapPin, Edit, BookOpen, Users, DollarSign, Star, Award, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/TeacherProfile.css"

const TeacherProfile = () => {
  const navigate = useNavigate()
  const [teacherInfo, setTeacherInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await api.get("/teacher/profile")
        setTeacherInfo(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")

        // Fallback to mock data if API fails
        setTeacherInfo({
          name: "Dr. Jane Smith",
          email: "jane.smith@example.com",
          contactNumber: "+1 (555) 123-4567",
          city: "New York, NY",
          about:
            "Experienced educator with a passion for online learning. Specializing in computer science and web development.",
          areas_of_expertise: ["React", "JavaScript", "Node.js", "Python", "Machine Learning"],
          course_created: 5,
          totalEarning: 15000,
          balance: 2500,
          profilepicURL:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60",
          join_date: "2023-01-15",
          
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      
        <Loader />
    
    )
  }

  if (error && !teacherInfo) {
    return (
      
        <div className="error-container">
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      
    )
  }

  // // Calculate mock stats for UI display
  const totalStudents = 1234 // This would come from API in a real app
  const averageRating = 4.8 // This would come from API in a real app

  // Mock achievements based on teacher data
  const achievements = [
    { icon: <Award />, title: "Top Rated Instructor" },
    { icon: <Users />, title: `${totalStudents > 1000 ? "1000+" : totalStudents} Students Milestone` },
    { icon: <BookOpen />, title: `${teacherInfo.course_created} Courses Published` },
  ]

  return (
    
      <div className="teacher-profile-container">
        <div className="profile-header">
          <Button variant="ghost" onClick={() => navigate("/teacher-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Dashboard
          </Button>
          <h1>Teacher Profile</h1>
          <Link to="/teacher/edit-profile">
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="profile-content">
          <Card className="profile-card">
            <CardContent>
              <div className="profile-info">
                <img
                  src={teacherInfo.profilepicURL || "/placeholder.svg?height=400&width=400"}
                  alt={teacherInfo.name}
                  className="profile-photo"
                />
                <div>
                  <h2>{teacherInfo.name}</h2>
                  <p className="bio">{teacherInfo.about}</p>
                  <div className="contact-info">
                    <div className="info-item">
                      <Mail size={18} />
                      <span>{teacherInfo.email}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={18} />
                      <span>{teacherInfo.contactNumber}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={18} />
                      <span>{teacherInfo.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="stats-grid">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherInfo.enrolledStudents.length}</div>
               </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses Created</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherInfo.course_created}</div>
               </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance:</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold"> ₹{teacherInfo.balance}</div>
               </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherInfo.averageRating}</div>
               </CardContent>
            </Card>
          </div>

          <Card className="expertise-card">
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="expertise-list">
                {teacherInfo.areas_of_expertise &&
                  teacherInfo.areas_of_expertise.map((skill, index) => (
                    <span key={index} className="expertise-tag">
                      {skill}
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>

         
        </div>
      </div>
    
  )
}

export default TeacherProfile

