"use client"

import { useState, useEffect } from "react"
import { Search, Mail, Phone, Calendar, BookOpen, Gift, ArrowLeft, AlertCircle } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Select, SelectOption } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import "../../assets/styles/admin/StudentManagement.css"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import Loader from "../../components/Loader"

const StudentManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterEnrollment, setFilterEnrollment] = useState("all")
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await api.get("/admin/student")

        if (response && Array.isArray(response.students)) {
          setStudents(response.students)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        setError("Failed to load students. Please try again.")
        // Fallback to mock data
        setStudents([
          {
            _id: 1,
            name: "Emily Johnson",
            email: "emily.johnson@example.com",
            contactNumber: "+1 (555) 123-4567",
            profilepicURL:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
            join_date: "2023-09-01",
            courses_enrolled: [{ courseId: "course1" }, { courseId: "course2" }, { courseId: "course3" }],
            rewardPoints: 299,
            isActive: true,
          },
          {
            _id: 2,
            name: "Michael Brown",
            email: "michael.brown@example.com",
            contactNumber: "+1 (555) 987-6543",
            profilepicURL:
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&auto=format&fit=crop",
            join_date: "2023-08-15",
            courses_enrolled: [{ courseId: "course1" }, { courseId: "course2" }],
            rewardPoints: 199,
            isActive: true,
          },
          {
            _id: 3,
            name: "Sophia Martinez",
            email: "sophia.martinez@example.com",
            contactNumber: "+1 (555) 456-7890",
            profilepicURL:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop",
            join_date: "2023-07-20",
            courses_enrolled: [
              { courseId: "course1" },
              { courseId: "course2" },
              { courseId: "course3" },
              { courseId: "course4" },
            ],
            rewardPoints: 399,
            isActive: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleStatusChange = async (studentId, currentStatus) => {
    try {
      setLoading(true)

      // Call the appropriate API endpoint based on current status
      if (currentStatus) {
        await api.put(`/admin/student/deactivate/${studentId}`)
      } else {
        await api.put(`/admin/student/activate/${studentId}`)
      }

      // Update the local state
      setStudents((prevStudents) =>
        prevStudents.map((student) => (student._id === studentId ? { ...student, isActive: !currentStatus } : student)),
      )
    } catch (error) {
      console.error(`Error ${currentStatus ? "deactivating" : "activating"} student:`, error)
      alert(`Failed to ${currentStatus ? "deactivate" : "activate"} student. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const getEnrollmentFilter = (date) => {
    const now = new Date()
    const enrollmentDate = new Date(date)
    const monthsDiff =
      (now.getFullYear() - enrollmentDate.getFullYear()) * 12 + now.getMonth() - enrollmentDate.getMonth()

    if (filterEnrollment === "all") return true
    if (filterEnrollment === "thisMonth" && monthsDiff === 0) return true
    if (filterEnrollment === "lastMonth" && monthsDiff === 1) return true
    if (filterEnrollment === "thisYear" && monthsDiff <= 12) return true

    return false
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && student.isActive) ||
      (filterStatus === "inactive" && !student.isActive)

    const matchesEnrollment = getEnrollmentFilter(student.join_date)

    return matchesSearch && matchesStatus && matchesEnrollment
  })

  if (loading && students.length === 0) {
    return <Loader fullScreen />
  }

  return (
    <div className="student-management-container">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Student Management</h1>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <SelectOption value="all">All Status</SelectOption>
            <SelectOption value="active">Active</SelectOption>
            <SelectOption value="inactive">Inactive</SelectOption>
          </Select>

          <Select
            value={filterEnrollment}
            onChange={(e) => setFilterEnrollment(e.target.value)}
            className="filter-select"
          >
            <SelectOption value="all">All Time</SelectOption>
            <SelectOption value="thisMonth">This Month</SelectOption>
            <SelectOption value="lastMonth">Last Month</SelectOption>
            <SelectOption value="thisYear">This Year</SelectOption>
          </Select>
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.length === 0 ? (
          <div className="no-results">
            <p>No students found matching your criteria</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student._id} className="student-card">
              <CardContent>
                <div className="student-header">
                  <img
                    src={student.profilepicURL || "/placeholder.svg"}
                    alt={student.name}
                    className="student-avatar"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=100&width=100"
                    }}
                  />
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <span className={`status-badge ${student.isActive ? "active" : "inactive"}`}>
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="contact-info">
                  <div className="contact-item">
                    <Mail className="icon" size={16} />
                    <span>{student.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone className="icon" size={16} />
                    <span>{student.contactNumber || "No phone number"}</span>
                  </div>
                  <div className="contact-item">
                    <Calendar className="icon" size={16} />
                    <span>Joined: {new Date(student.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <BookOpen className="icon" size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Courses</span>
                      <span className="stat-value">
                        {student.totalCoursesEnrolled ? student.totalCoursesEnrolled : 0}
                      </span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Gift className="icon" size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Reward Points</span>
                      <span className="stat-value">{student.rewardPoints || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                 
                  <Button
                    variant={student.isActive ? "destructive" : "success"}
                    size="sm"
                    onClick={() => handleStatusChange(student._id, student.isActive)}
                    disabled={loading}
                  >
                    {student.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default StudentManagement

