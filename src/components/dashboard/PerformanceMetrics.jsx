import React from "react"
import { PieChart, BarChart } from "lucide-react"

const PerformanceMetrics = () => {
  const metrics = [
    { label: "Courses inbox", value: 5 },
    { label: "Your completed courses", value: 12 },
    { label: "Your certifications", value: 9 },
    { label: "Planned courses", value: 2 },
    { label: "Organized courses", value: 1 },
  ]

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h2>Your performance metrics</h2>
        <button className="icon-btn">
          <PieChart />
        </button>
      </div>
      <div className="metrics-list">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <span className="metric-label">{metric.label}</span>
            <span className="metric-value">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PerformanceMetrics

