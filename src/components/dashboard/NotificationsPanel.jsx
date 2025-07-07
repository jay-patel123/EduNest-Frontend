import React from "react"
import { Bell, Award, Users, BookOpen, AlertTriangle } from "lucide-react"

const NotificationsPanel = () => {
  const notifications = []

  return (
    <div className="dashboard-card">
      <h2>Notifications</h2>
      <div className="notifications-list">
        {notifications.map((notification, index) => (
          <div key={index} className={`notification-item ${notification.type}`}>
            <div className="notification-icon">{notification.icon}</div>
            <p>{notification.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPanel

