"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Edit, Trash2, Users, DollarSign, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/CourseManagement.css"

const CourseManagement = () => {
  const {teacherId}=useParams("teacherId")
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/course/teacher/${teacherId}`)
        console.log("Teacher courses response:", response)

        // Check if response is an array
        if (Array.isArray(response)) {
          setCourses(response)
        } else {
          // If response is not an array, check if it has a data property that might be an array
          if (response && Array.isArray(response.data)) {
            setCourses(response.data)
          } else {
            // If we can't find an array, set an empty array and log an error
            console.error("Unexpected API response format:", response)
            setCourses([])
            setError("Unexpected API response format. Please try again.")
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load courses")
        setCourses([]) // Initialize with empty array to prevent undefined error
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // This endpoint is not explicitly mentioned in the API docs, but it's a common pattern
        await api.delete(`/course/${courseId}`)

        // Update the courses list after deletion
        setCourses(courses.filter((course) => course._id !== courseId))
      } catch (error) {
        console.error(`Error deleting course with id: ${courseId}`, error)
        alert("Failed to delete course. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      
        <Loader fullscreen/>
      
    )
  }

  return (
    
      <div className="course-management-container">
        <div className="course-management-header">
          <Button variant="ghost" onClick={() => navigate("/teacher-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Dashboard
          </Button>
          <h1>Course Management</h1>
          <Link to="/teacher/create-course" className="create-course-btn">
            Create New Course
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {courses.length === 0 ? (
          <div className="no-courses">
            <p>You haven't created any courses yet.</p>
            <Link to="/teacher/create-course" className="create-first-course-btn">
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="courses-list">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-stats">
                    <div className="stat-item">
                      <Users size={16} />
                      <span>{course.modules.length || 0} Modules</span>
                    </div>
                    <div className="stat-item">
                      <DollarSign size={16} />
                      <span>${course.price}</span>
                    </div>
                  </div>
                </div>
                <div className="course-actions">
                  <Link to={`/teacher/edit-course/${course._id}`} className="edit-btn">
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button onClick={() => handleDeleteCourse(course._id)} className="delete-btn">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
  )
}

export default CourseManagement

