"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft, AlertCircle } from "lucide-react"
import "../assets/styles/StudentEnrollments.css"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import Loader from "../components/Loader"

const StudentEnrollments = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

       

        // Fetch enrolled students
        console.log("Fetching enrolled students...")
        const response = await api.get("/teacher/enrolledstudents")
        console.log("Enrolled students response:", response)

        if (response && Array.isArray(response.enrolledStudents)) {
          setStudents(response.enrolledStudents)
        } else if (response && Array.isArray(response.students)) {
          setStudents(response.students)
        } else {
          throw new Error("Invalid API response format")
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        setError("Failed to load students. Please try again.")

        // Use mock data if there's an error
        setStudents([
          {
            _id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            profilepicURL:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop",
            about: "Passionate about learning new technologies",
            skills: ["JavaScript", "React", "Node.js"],
            city: "New York",
          },
          {
            _id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            profilepicURL:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
            about: "Frontend developer with 2 years of experience",
            skills: ["HTML", "CSS", "JavaScript"],
            city: "San Francisco",
          },
          {
            _id: "3",
            name: "Alex Johnson",
            email: "alex.johnson@example.com",
            profilepicURL:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop",
            about: "Computer Science student",
            skills: ["Python", "Java", "C++"],
            city: "Chicago",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.about && student.about.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (loading) {
    return (
      
        <Loader />
      
    )
  }

  return (
    
      <div className="student-enrollments-container">
        <div className="enrollments-header">
          <Button variant="ghost" onClick={() => navigate("/teacher-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Dashboard
          </Button>
          <h1>Student Enrollments</h1>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search students..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <div className="no-enrollments">
            <p>No students enrolled</p>
          </div>
        ) : (
          <div className="students-list">
            {filteredStudents.map((student) => (
              <div key={student._id} className="student-card">
                <img
                  src={student.profilepicURL || "/placeholder.svg?height=100&width=100"}
                  alt={student.name}
                  className="student-avatar"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=100&width=100"
                  }}
                />
                <div className="student-info">
                  <h3>{student.name}</h3>
                  {/* <p className="student-email">{student.email || "No email available"}</p> */}
                  <p className="student-about">{student.about || "No bio available"}</p>
                  <div className="student-details">
                    <p>
                      <strong>Skills:</strong> {student.skills?.join(", ") || "N/A"}
                    </p>
                    {/* <p>
                      <strong>City:</strong> {student.city || "Not provided"}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  )
}

export default StudentEnrollments

