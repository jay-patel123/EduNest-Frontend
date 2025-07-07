import React from "react"
import { Clock, Check, Info } from "lucide-react"

const NewCourses = () => {
  const courses = []

  return (
    <div className="dashboard-card">
      <h2>New courses available</h2>
      <div className="new-courses-list">
        {courses.map((course, index) => (
          <div key={index} className="new-course-item">
            <div className="course-info">
              <h3>{course.name}</h3>
              <span className="deadline">{course.deadline}</span>
            </div>
            <div className="course-actions">
              <button className="status-btn">{course.status}</button>
              {course.certification && <Check className="certification-icon" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewCourses

