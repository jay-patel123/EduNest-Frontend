"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Star, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/LeaderBoard.css"

const LeaderBoard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeFilter, setTimeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [leaderboardData, setLeaderboardData] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [quizInfo, setQuizInfo] = useState(null)
  const [availableQuizzes, setAvailableQuizzes] = useState([])
  const [selectedQuizId, setSelectedQuizId] = useState(null)

  // Fetch available quizzes for the dropdown
  useEffect(() => {
    const fetchAvailableQuizzes = async () => {
      try {
        const response = await api.get("/leaderboard/available/quiz")
        if (response && response.quizzes && Array.isArray(response.quizzes)) {
          setAvailableQuizzes(response.quizzes)

          // If there are quizzes, select the first one by default
          if (response.quizzes.length > 0) {
            setSelectedQuizId(response.quizzes[0]._id)
          }
        }
      } catch (error) {
        console.error("Error fetching available quizzes:", error)
      }
    }

    fetchAvailableQuizzes()
  }, [])

  // Fetch leaderboard data when a quiz is selected
  useEffect(() => {
    if (selectedQuizId) {
      fetchLeaderboardData(selectedQuizId)
    }
  }, [selectedQuizId])

  const fetchLeaderboardData = async (quizId) => {
    try {
      setLoading(true)

      // Get current user data
      const userData = getUserData()
      setCurrentUser(userData)

      // Fetch the leaderboard data for the selected quiz
      const endpoint = quizId ? `/leaderboard/${quizId}` : "/leaderboard"
      const response = await api.get(endpoint)
      console.log("Leaderboard data:", response)

      if (response && response.success && response.leaderboard && Array.isArray(response.leaderboard.topStudents)) {
        // Set quiz info
        setQuizInfo({
          id: response.quizId,
          topic: response.quizTopic || response.topic,
          totalMarks: response.totalMarks,
          rewardPoints: response.rewardPoints,
        })

        // Get only top 5 students
        const topFiveStudents = response.leaderboard.topStudents.slice(0, 5)

        // Transform data to match our component's expected format
        const formattedData = topFiveStudents.map((student, index) => {
          // Calculate reward points based on rank percentage
          const rankPercentage = getRankPercentage(index + 1)
          const calculatedRewardPoints = Math.round(response.rewardPoints * rankPercentage)

          return {
            id: student.studentId._id,
            name: student.studentId.name || `Student ${index + 1}`,
            photo: student.studentId.profilepicURL || "/placeholder.svg",
            rank: index + 1,
            points: student.marks || 0,
            quizScore: Math.round((student.marks / response.totalMarks) * 100) || 0,
            rewardPoints: calculatedRewardPoints,
            timeTaken: student.timeTaken || 0,
          }
        })

        setLeaderboardData(formattedData)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
      setError("Failed to load leaderboard")
      setLeaderboardData([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("userData")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error parsing user data:", error)
      return null
    }
  }

  // Get percentage based on rank
  const getRankPercentage = (rank) => {
    switch (rank) {
      case 1:
        return 1.0 // 100%
      case 2:
        return 0.85 // 85%
      case 3:
        return 0.7 // 70%
      case 4:
        return 0.5 // 50%
      case 5:
        return 0.3 // 30%
      default:
        return 0
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="rank-icon gold" />
      case 2:
        return <Medal className="rank-icon silver" />
      case 3:
        return <Medal className="rank-icon bronze" />
      default:
        return <Star className="rank-icon" />
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const handleQuizChange = (e) => {
    setSelectedQuizId(e.target.value)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <Loader fullscreen />
  }

  return (
    <div className="leaderboard-container">
      <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back To Dashboard
      </Button>
      <br />
      <br />

      <div className="leaderboard-header">
        <h1>Quiz Leaderboard</h1>

        {/* Quiz Selection Dropdown */}
        <div className="quiz-selector">
          <label htmlFor="quiz-select">Select Quiz:</label>
          <select id="quiz-select" className="quiz-select" value={selectedQuizId || ""} onChange={handleQuizChange}>
            {availableQuizzes.length === 0 ? (
              <option value="">No quizzes available</option>
            ) : (
              availableQuizzes.map((quiz) => (
                <option key={quiz._id} value={quiz._id}>
                  {quiz.topic} ({formatDate(quiz.startAt)})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="quiz-info">
          {quizInfo && (
            <div className="latest-quiz-info">
              <h3>{quizInfo.topic}</h3>
              <p>
                Total Marks: {quizInfo.totalMarks} | Reward Points: {quizInfo.rewardPoints}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {leaderboardData.length === 0 ? (
        <div className="no-data-message">
          <p>No leaderboard data available for this quiz</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboardData.map((user) => (
            <div key={user.id} className={`leaderboard-card rank-${user.rank}`}>
              <div className="rank-section">
                {getRankIcon(user.rank)}
                <span className="rank-number">#{user.rank}</span>
              </div>

              <div className="user-info">
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <div className="user-stats">
                    <span>Quiz score: {user.quizScore}%</span>
                    <span>•</span>
                    <span>Time: {formatTime(user.timeTaken)}</span>
                  </div>
                </div>
              </div>

              <div className="points-section">
                <div className="total-points">
                  <span className="points-label">Reward Points</span>
                  <span className="points-value">{user.rewardPoints}</span>
                </div>
                <div className="reward-status">
                  <span className="reward-pending">
                    {user.rank <= 5 ? `Eligible for ${user.rewardPoints} points` : "Not eligible for rewards"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LeaderBoard
