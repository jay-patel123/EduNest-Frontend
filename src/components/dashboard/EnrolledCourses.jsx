import React from "react"
import { Check, X } from "lucide-react"

const EnrolledCourses = () => {
  const courses = [
    {
      name: "Introduction to MERN Technology",
      subscription: "Today",
      status: "Enrolled",
      progress: 75,
    },
    {
      name: "React.js Fundamentals",
      subscription: "Tomorrow",
      status: "Enrolled",
      progress: 45,
    },
    {
      name: "Node.js Essentials",
      subscription: "Yesterday",
      status: "Enrolled",
      progress: 25,
    },
  ]

  return (
    <div className="dashboard-card enrolled-courses">
      <h3>Your enrolled courses</h3>
      <div className="courses-list">
        {courses.map((course, index) => (
          <div key={index} className="course-item">
            <div className="course-info">
              <h4>{course.name}</h4>
              <span className="subscription-date">{course.subscription}</span>
            </div>
            <div className="course-status">
              <span className={`status-badge ${course.status.toLowerCase()}`}>{course.status}</span>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="progress-text">{course.progress}%</span>
              </div>
              {course.progress === 100 ? <Check className="status-icon" /> : <X className="status-icon" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnrolledCourses

