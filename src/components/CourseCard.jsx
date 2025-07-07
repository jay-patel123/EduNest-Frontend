"use client"

import { useState } from "react"
import { Star, Users, Clock, DollarSign } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"

const CourseCard = ({ course, onEnroll }) => {
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleModuleEnroll = async () => {
    try {
      setEnrolling(true)
      await onEnroll()
    } catch (error) {
      console.error("Error enrolling in course:", error)
      setError("Failed to enroll in course modules")
    } finally {
      setEnrolling(false)
    }
  }

  const handleFullCourseEnroll = async () => {
    try {
      setEnrolling(true)
      setError(null)

      

      // Get user points to check if they have enough
      const userData = await api.get("/student/profile")
      const userPoints = userData.rewardPoints || 0
      const requiredPoints = course.price 

      if (userPoints < requiredPoints) {
        // Not enough points - redirect to payment page
        navigate("/course-payment", {
          state: {
            courseId: course.id,
            courseName: course.name,
            price: course.price,
            teacherName: course.teacherName,
            requiredPoints: requiredPoints,
            insufficientPoints: true,
          },
        })
        return
      }

      // If they have enough points, confirm purchase
      const confirmPurchase = window.confirm(
        `You have enough points to purchase this course. ${requiredPoints} points will be deducted from your account. Continue?`,
      )

      if (confirmPurchase) {
        // Enroll in the course using points
        const response = await api.post("/enrollment/course", {
          courseId: course.id,
          paymentMethod: "points",
          points: requiredPoints,
        })

        alert("Course purchased successfully! You can now access it from My Courses.")
        navigate("/my-courses")
      }
    } catch (error) {
      console.error("Error enrolling in full course:", error)
      setError("Failed to enroll in course")
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="course-card">
      <div className="course-image">
        <img
          src={course.courseImage || "/placeholder.svg?height=200&width=300"}
          alt={course.name}
          onError={(e) => {
            e.target.onerror = null // Prevent infinite loop
            e.target.src = "/placeholder.svg?height=200&width=300"
          }}
        />
        <span className="course-level">{course.level}</span>
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.name}</h3>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <div className="meta-item">
            <Star className="star-icon" size={16} />
            <span>{course.rating}</span>
          </div>
          <div className="meta-item">
            <Users size={16} />
            <span>{course.students} students</span>
          </div>
        </div>

        <div className="course-footer">
          <div className="teacher-info">
            <img
              src={course.teacherPhoto || "/placeholder.svg?height=50&width=50"}
              alt={course.teacherName}
              className="teacher-photo"
              onError={(e) => {
                e.target.onerror = null // Prevent infinite loop
                e.target.src = "/placeholder.svg?height=50&width=50"
              }}
            />
            <span className="teacher-name">{course.teacherName}</span>
          </div>
          <div className="course-price">
           
            <span>₹ {course.price}</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="enroll-buttons">
        <br/>
          <Button className="enroll-button" onClick={handleModuleEnroll} disabled={enrolling}>
            {enrolling ? "Enrolling..." : "Enroll Module "}
          </Button>
          <br/>
          <br/>
          <Button
            className="enroll-full-button"
            onClick={handleFullCourseEnroll}
            disabled={enrolling}
            variant="secondary"
          >
            {enrolling ? "Processing..." : "Enroll Full Course"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard

