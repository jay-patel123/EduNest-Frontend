import React from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const DashboardCalendar = () => {
  const currentDate = new Date()
  const month = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2>
          {month} {year}
        </h2>
        <div className="calendar-nav">
          <button className="icon-btn">
            <ChevronLeft />
          </button>
          <button className="icon-btn">
            <Calendar />
          </button>
          <button className="icon-btn">
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {/* Calendar Grid Implementation */}
        <div className="calendar-days">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>
        {/* Calendar dates would be dynamically generated */}
      </div>
    </div>
  )
}

export default DashboardCalendar

