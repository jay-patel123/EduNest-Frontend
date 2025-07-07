import React from "react"

const WeeklyTimetable = () => {
  const getCurrentWeek = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() ))
    const week = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push({
        date: day.getDate(),
        day: day.toLocaleString("default", { weekday: "short" }),
      })
    }

    return week
  }

  const weekDays = getCurrentWeek()

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Weekly Timetable</h3>
      </div>
      <div className="timetable-grid">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`timetable-day ${day.day === new Date().toLocaleString("default", { weekday: "short" }) ? "current-day" : ""}`}
          >
            <div className="day-number">{day.date}</div>
            <div className="day-name">{day.day}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyTimetable

