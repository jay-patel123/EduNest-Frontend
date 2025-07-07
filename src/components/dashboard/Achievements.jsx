import React from "react"
import { Award, Zap, Target, Book, Star, Coffee } from "lucide-react"

const Achievements = () => {
  const achievements = [
    { icon: <Award />, name: "First Course", earned: true },
    { icon: <Zap />, name: "Fast Learner", earned: true },
    { icon: <Target />, name: "Accuracy", earned: true },
    { icon: <Book />, name: "Bookworm", earned: false },
    { icon: <Star />, name: "Rising Star", earned: false },
    { icon: <Coffee />, name: "Dedication", earned: false },
  ]

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Achievements</h3>
        <span className="achievement-count">
          {achievements.filter((a) => a.earned).length}/{achievements.length}
        </span>
      </div>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <div key={index} className={`achievement-item ${achievement.earned ? "earned" : ""}`}>
            <div className="achievement-icon">{achievement.icon}</div>
            <span className="achievement-name">{achievement.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Achievements

