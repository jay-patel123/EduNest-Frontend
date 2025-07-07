import React from "react"
import { Bell, Award, Users, BookOpen, AlertTriangle } from "lucide-react"

const NotificationsPanel = () => {
  const notifications = [
    {
      icon: <BookOpen />,
      text: "New course added to your subscription",
      type: "course",
    },
    {
      icon: <Award />,
      text: "Your certification was approved!",
      type: "achievement",
    },
    {
      icon: <Users />,
      text: "New courses are available for your team!",
      type: "team",
    },
    {
      icon: <AlertTriangle />,
      text: "Your certification is on hold. Contact support.",
      type: "alert",
    },
  ]

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

