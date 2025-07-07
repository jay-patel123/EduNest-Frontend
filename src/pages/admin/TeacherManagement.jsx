"use client"

import { useState, useEffect } from "react"
import { Search, Mail, Phone, BookOpen, Users, Star, ArrowLeft, AlertCircle } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Select, SelectOption } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import Loader from "../../components/Loader"
import "../../assets/styles/admin/TeacherManagement.css"

const TeacherManagement = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSpecialization, setFilterSpecialization] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [specializations, setSpecializations] = useState([])

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        const response = await api.get("/admin/teachers")

        if (response && Array.isArray(response.teachers)) {
          setTeachers(response.teachers)

          // Extract unique specializations for filter
          const uniqueSpecializations = [
            ...new Set(response.teachers.flatMap((teacher) => teacher.areas_of_expertise || []).filter(Boolean)),
          ]
          setSpecializations(uniqueSpecializations)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
        setError("Failed to load teachers. Please try again.")
        // Fallback to mock data
        setTeachers([
          {
            _id: 1,
            name: "Dr. Sarah Wilson",
            email: "sarah.wilson@example.com",
            contactNumber: "+1 (555) 123-4567",
            profilepicURL:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
            areas_of_expertise: ["React & Frontend Development"],
            total_students: 245,
            course_created: 5,
            totalEarning: 5600,
            averageRating: 4.8,
            isActive: true,
          },
          {
            _id: 2,
            name: "Prof. Michael Chen",
            email: "michael.chen@example.com",
            contactNumber: "+1 (555) 234-5678",
            profilepicURL:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop",
            areas_of_expertise: ["Python & Machine Learning"],
            total_students: 198,
            course_created: 4,
            totalEarning: 4800,
            averageRating: 4.7,
            isActive: true,
          },
          {
            _id: 3,
            name: "Emily Rodriguez",
            email: "emily.rodriguez@example.com",
            contactNumber: "+1 (555) 345-6789",
            profilepicURL:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop",
            areas_of_expertise: ["Data Science"],
            total_students: 175,
            course_created: 3,
            totalEarning: 3900,
            averageRating: 4.6,
            isActive: false,
          },
        ])

        setSpecializations(["React & Frontend Development", "Python & Machine Learning", "Data Science"])
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  const handleStatusChange = async (teacherId, currentStatus) => {
    try {
      setLoading(true)

      // Call the appropriate API endpoint based on current status
      if (currentStatus) {
        await api.put(`/admin/teacher/inactivate/${teacherId}`)
      } else {
        await api.put(`/admin/teacher/activate/${teacherId}`)
      }

      // Update the local state
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) => (teacher._id === teacherId ? { ...teacher, isActive: !currentStatus } : teacher)),
      )
    } catch (error) {
      console.error(`Error ${currentStatus ? "deactivating" : "activating"} teacher:`, error)
      alert(`Failed to ${currentStatus ? "deactivate" : "activate"} teacher. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && teacher.isActive) ||
      (filterStatus === "inactive" && !teacher.isActive)

    const matchesSpecialization =
      filterSpecialization === "all" ||
      (teacher.areas_of_expertise &&
        teacher.areas_of_expertise.some((expertise) =>
          expertise.toLowerCase().includes(filterSpecialization.toLowerCase()),
        ))

    return matchesSearch && matchesStatus && matchesSpecialization
  })

  if (loading && teachers.length === 0) {
    return <Loader fullScreen />
  }

  return (
    <div className="teacher-management-container">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Teacher Management</h1>
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
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <Select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="filter-select"
          >
            <SelectOption value="all">All Specializations</SelectOption>
            {specializations.map((specialization) => (
              <SelectOption key={specialization} value={specialization}>
                {specialization}
              </SelectOption>
            ))}
          </Select>

          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <SelectOption value="all">All Status</SelectOption>
            <SelectOption value="active">Active</SelectOption>
            <SelectOption value="inactive">Inactive</SelectOption>
          </Select>
        </div>
      </div>

      <div className="teachers-grid">
        {filteredTeachers.length === 0 ? (
          <div className="no-results">
            <p>No teachers found matching your criteria</p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <Card key={teacher._id} className="teacher-card">
              <CardContent>
                <div className="teacher-header">
                  <img
                    src={teacher.profilepicURL || "/placeholder.svg"}
                    alt={teacher.name}
                    className="teacher-avatar"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=100&width=100"
                    }}
                  />
                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <span className="specialization">
                      {teacher.areasOfExpertise && teacher.areasOfExpertise.length > 0
                        ? teacher.areasOfExpertise[0]
                        : "No specialization"}
                    </span>
                    <span className={`status-badge ${teacher.isActive ? "active" : "inactive"}`}>
                      {teacher.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="contact-info">
                  <div className="contact-item">
                    <Mail className="icon" size={16} />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="contact-item">
                    <Phone className="icon" size={16} />
                    <span>{teacher.contactNumber || "No phone number"}</span>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <Users className="icon" size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Students</span>
                      <span className="stat-value">{teacher.totalEnrolledStudents || 0}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <BookOpen className="icon" size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Courses</span>
                      <span className="stat-value">{teacher. coursesCreated || 0}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Star className="icon" size={16} />
                    <div className="stat-content">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value">{teacher.averageRating || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
              
                  <Button
                    variant={teacher.isActive ? "destructive" : "success"}
                    size="sm"
                    onClick={() => handleStatusChange(teacher._id, teacher.isActive)}
                    disabled={loading}
                  >
                    {teacher.isActive ? "Deactivate" : "Activate"}
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

export default TeacherManagement

