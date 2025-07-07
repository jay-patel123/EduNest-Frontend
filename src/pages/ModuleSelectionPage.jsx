"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, BookOpen, Clock, DollarSign, Lock, Unlock, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/ModuleSelectionPage.css"

const ModuleSelectionPage = () => {
  const {  courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollingModule, setEnrollingModule] = useState(null)
  const [userPoints, setUserPoints] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("success") // success or error

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

       

        // Fetch student profile to get available points and enrolled modules
        const studentProfile = await api.get("/student/profile")
        setUserPoints(studentProfile.rewardPoints || 0)

        console.log("Fetching course details for ID:", courseId)
        // Fetch course details
        const response = await api.get(`/course/${courseId}`)
        console.log("Course details response:", response)

        // Get enrolled modules from student profile
        const enrolledModules = new Set()

        // Check if the student has enrolled in this course
        if (studentProfile.courses_enrolled && Array.isArray(studentProfile.courses_enrolled)) {
          // Find the course enrollment
          const courseEnrollment = studentProfile.courses_enrolled.find(
            (enrollment) => enrollment.courseId === courseId,
          )

          // If found, add all enrolled module IDs to the set
          if (courseEnrollment && Array.isArray(courseEnrollment.modules)) {
            courseEnrollment.modules.forEach((moduleId) => {
              enrolledModules.add(moduleId.toString())
            })
          }
        }

        console.log("Enrolled modules:", enrolledModules)

        // Process the data
        const courseData = response

        // Check if modules is an array and process it
        let processedModules = []
        if (Array.isArray(courseData.modules)) {
          processedModules = courseData.modules.map((module) => {
            // Check if this module is in the enrolled modules set
            const moduleId = module._id || module
            const isEnrolled = enrolledModules.has(moduleId.toString())

            return {
              id: moduleId,
              name: module.title || "Untitled Module",
              description: module.description || "No description available",
              duration: module.durationHours ? `${module.durationHours}h ${module.durationMinutes || 0}m` : "1h 30m",
              price: module.sell_price || module.price || 0,
              isLocked: !isEnrolled, // Set locked status based on enrollment
              contentCount: Array.isArray(module.content) ? module.content.length : 0,
              pointsRequired: (module.sell_price || module.price || 0) * 1, // Convert price to points (1$ = 100 points)
            }
          })
        }

        setCourse({
          id: courseData._id || courseId,
          title: courseData.title || "Course Title",
          description: courseData.description || "No description available",
          instructor: courseData.teacherId.name || "Instructor Name",
          modules: processedModules,
        })
      } catch (error) {
        console.error("Error fetching course details:", error)
        setError("Failed to load course details. Please try again later.")

        // Fallback to mock data if API fails
        setCourse({
          id: courseId,
          title: "Introduction to React",
          description: "Learn the basics of React, including components, state, props, and hooks.",
          instructor: "Sarah Wilson",
          modules: [
            {
              id: 1,
              name: "Getting Started with React",
              description: "Learn the basics of React and set up your development environment.",
              duration: "1h 30m",
              price: 19.99,
              isLocked: false,
              contentCount: 5,
              pointsRequired: 1999,
            },
            {
              id: 2,
              name: "Components and Props",
              description: "Understand React components and how to pass data with props.",
              duration: "2h 15m",
              price: 24.99,
              isLocked: true,
              contentCount: 8,
              pointsRequired: 2499,
            },
            {
              id: 3,
              name: "State and Lifecycle",
              description: "Learn about state management and component lifecycle methods.",
              duration: "2h 45m",
              price: 29.99,
              isLocked: true,
              contentCount: 10,
              pointsRequired: 2999,
            },
          ],
        })

        // Mock user points for testing
        setUserPoints(3000)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId, navigate])

  const handleUnlock = async (moduleId) => {
    try {
      setEnrollingModule(moduleId)

      const module = course.modules.find((m) => m.id === moduleId)
      if (!module) {
        throw new Error("Module not found")
      }

      // Check if user has enough points
      if (userPoints < module.pointsRequired) {
        setAlertType("error")
        setAlertMessage(
          `You don't have enough points to unlock this module. Required: ${module.pointsRequired} points.`,
        )
        setShowAlert(true)

        // Hide alert after 3 seconds
        setTimeout(() => {
          setShowAlert(false)
        }, 3000)

        return
      }

      // Unlock module with points
      const response = await api.post("/enrollment/module", {
        moduleId,
        courseId,
        paymentMethod: "points",
        points: module.pointsRequired,
      })

      console.log("Module unlock response:", response)

      // Update user points
      setUserPoints((prev) => prev - module.pointsRequired)

      // Update module status in UI
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, isLocked: false } : m)),
      }))

      // Show success message
      setAlertType("success")
      setAlertMessage(`Module unlocked successfully! ${module.pointsRequired} points have been deducted.`)
      setShowAlert(true)

      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    } catch (error) {
      console.error("Error handling module unlock:", error)

      setAlertType("error")
      setAlertMessage(error.message || "Failed to unlock module. Please try again.")
      setShowAlert(true)

      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    } finally {
      setEnrollingModule(null)
    }
  }

  const handleStartLearning = (moduleId) => {
    navigate(`/module/${moduleId}`)
  }

  if (loading) {
    return <Loader fullScreen />
  }

  if (!course) {
    return (
      <div className="error-container">
        <h2>Course not found</h2>
        <Button onClick={() => navigate("/view-courses")}>Back to Courses</Button>
      </div>
    )
  }

  return (
    <div className="module-selection-container">
      {showAlert && (
        <div className={`alert-message ${alertType}`}>
          {alertType === "error" ? (
            <AlertCircle className="alert-icon" size={20} />
          ) : (
            <Unlock className="alert-icon" size={20} />
          )}
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Courses
        </Button>
        <h1>{course.title}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="course-info">
        <p className="course-description"><strong>{course.description}</strong></p>
        {/* <div className="instructor-info">
          <span>Instructor: {course.instructor}</span>
        </div> */}
        <div className="user-points-display">
          <span>
            Your Available Points: <strong>{userPoints}</strong>
          </span>
        </div>
      </div>

      <div className="modules-list">
        <h2>Course Modules</h2>

        {course.modules.map((module) => (
          <div key={module.id} className={`module-card ${module.isLocked ? "locked" : ""}`}>
            <div className="module-content">
              <div className="module-title">
                <h3>{module.name}</h3>
                {module.isLocked ? (
                  <Lock className="lock-icon" size={18} />
                ) : (
                  <Unlock className="unlock-icon" size={18} />
                )}
              </div>
              {/* <p className="module-description">{module.description}</p> */}

              <div className="module-meta">
                {/* <div className="meta-item">
                  <Clock size={16} />
                  <span>{module.duration}</span>
                </div> */}
                <div className="meta-item">
                  <BookOpen size={16} />
                  <span>{module.contentCount} Modules </span>
                </div>
                {module.isLocked && (
                  <>
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <span>{module.price}</span>
                    </div>
                    <div className="meta-item points-required">
                      <span>{module.pointsRequired} points required</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="module-action">
              {module.isLocked ? (
                <button
                  className="unlock-button"
                  onClick={() => handleUnlock(module.id)}
                  disabled={enrollingModule === module.id}
                >
                  {enrollingModule === module.id ? "Unlocking..." : "Unlock with Points"}
                </button>
              ) : (
                <button className="start-button" onClick={() => handleStartLearning(module.id)}>
                  Start Learning
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModuleSelectionPage

