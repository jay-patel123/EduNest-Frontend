"use client"

import { useState, useEffect } from "react"
import { Gift, Award, Star, TrendingUp, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/MyPoints.css"

const MyPoints = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pointsData, setPointsData] = useState({
    totalPoints: 0,
    availablePoints: 0,
    redeemedPoints: 0,
    pointsHistory: [],
  })

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        setLoading(true)

        
        // Fetch student profile to get current reward points
        const profileResponse = await api.get("/student/profile")
        console.log("Student profile:", profileResponse)

        // Fetch points history
        const rewardResponse = await api.get("/reward")
        console.log("Reward history:", rewardResponse)

        if (!profileResponse || !rewardResponse) {
          throw new Error("Failed to fetch points data")
        }

        // Get available points from student profile
        const availablePoints = profileResponse.rewardPoints || 0

        // Process reward history if available
        let pointsHistory = []
        if (rewardResponse && rewardResponse.rewardHistory) {
          const rewardHistory = rewardResponse.rewardHistory

          pointsHistory = rewardHistory.pointsChanged.map((points, index) => ({
            id: index + 1,
            type: getPointType(rewardHistory.reasons[index]),
            name: rewardHistory.reasons[index] || "Points Transaction",
            points: points,
            date: rewardHistory.timestamps[index] || new Date().toISOString(),
          }))
        }

        setPointsData({
          totalPoints: availablePoints,
          availablePoints: availablePoints,
          redeemedPoints: 0, // This could be calculated if you have redemption data
          pointsHistory: pointsHistory,
        })
      } catch (error) {
        console.error("Error fetching points data:", error)
        setError("Failed to load points data")

        // Fallback to mock data
        setPointsData({
          totalPoints: 1500,
          availablePoints: 1500,
          redeemedPoints: 0,
          pointsHistory: [
            {
              id: 1,
              type: "quiz",
              name: "React Basics Assessment",
              points: 250,
              date: "2024-02-01",
              rank: 1,
            },
            {
              id: 2,
              type: "monthly",
              name: "Monthly Bonus",
              points: 10,
              date: "2024-01-15",
            },
            {
              id: 3,
              type: "course",
              name: "Full Course Completion Bonus",
              points: 30,
              date: "2024-01-10",
              courseName: "JavaScript Fundamentals",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPointsData()
  }, [navigate])

  // Helper function to determine point type based on reason
  const getPointType = (reason) => {
    if (!reason) return "bonus"

    const reasonLower = reason.toLowerCase()
    if (reasonLower.includes("quiz")) return "quiz"
    if (reasonLower.includes("course")) return "course"
    if (reasonLower.includes("monthly")) return "monthly"
    return "bonus"
  }

  const getPointsIcon = (type) => {
    switch (type) {
      case "quiz":
        return <Star className="history-icon quiz" />
      case "monthly":
        return <Calendar className="history-icon monthly" />
      case "course":
        return <Award className="history-icon course" />
      default:
        return <TrendingUp className="history-icon" />
    }
  }

  if (loading) {
    return <Loader fullscreen />
  }

  return (
    <div className="my-points-container">
      <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back To Dashboard
      </Button>
      <br />
      <br />

      <div className="points-header">
        <h1>My Points</h1>
        <div className="points-summary">
          {/* <div className="points-card total">
            <Star className="points-icon" />
            <div className="points-info">
              <span className="points-label">Total Points</span>
              <span className="points-value">{pointsData.totalPoints}</span>
            </div>
          </div> */}
          <div className="points-card available">
            <Gift className="points-icon" />
            <div className="points-info">
              <span className="points-label">Available Points</span>
              <span className="points-value">{pointsData.availablePoints}</span>
            </div>
          </div>
        {/* * <div className="points-card redeemed">
            <Award className="points-icon" />
            <div className="points-info">
              <span className="points-label">Redeemed Points</span>
              <span className="points-value">{pointsData.redeemedPoints}</span>
            </div>
          </div> */}
        </div> 
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="points-content">
        <div className="points-history">
          <h2>Points History</h2>
          <div className="history-list">
            {pointsData.pointsHistory.length === 0 ? (
              <div className="no-history-message">
                <p>No points history available yet.</p>
              </div>
            ) : (
              pointsData.pointsHistory.slice().reverse().map((item) => (
                <div key={item.id} className="history-card">
                  <div className="history-info">
                    <div className="history-header">
                      {getPointsIcon(item.type)}
                      <div className="history-details">
                        <h3>{item.name}</h3>
                        {item.type === "quiz" && item.rank && <span className="quiz-rank">Rank #{item.rank}</span>}
                        {item.type === "course" && <span className="course-name">{item.courseName}</span>}
                      </div>
                    </div>
                    <span className="history-date">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="earned-points">
                    <TrendingUp className="earned-icon" />
                    <span>
                      {item.points > 0 ? "+" : ""}
                      {item.points} points
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPoints

