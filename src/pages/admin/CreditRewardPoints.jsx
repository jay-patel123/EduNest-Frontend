// "use client"

// import { useState, useEffect } from "react"
// import { ArrowLeft, Trophy, Medal, Star, Check, AlertCircle, RefreshCw } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// import Loader from "../../components/Loader"
// import api from "../../utils/api"
// import "../../assets/styles/admin/CreditRewardPoints.css"

// const CreditRewardPoints = () => {
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(true)
//   const [processingCredit, setProcessingCredit] = useState(false)
//   const [quizzes, setQuizzes] = useState([])
//   const [selectedQuiz, setSelectedQuiz] = useState(null)
//   const [leaderboardData, setLeaderboardData] = useState([])
//   const [showAlert, setShowAlert] = useState(false)
//   const [alertMessage, setAlertMessage] = useState("")
//   const [alertType, setAlertType] = useState("success")

//   useEffect(() => {
//     fetchQuizzes()
//   }, [])

//   const fetchQuizzes = async () => {
//     try {
//       setLoading(true)
//       const response = await api.get("/leaderboard/available/quiz")

//       if (response && response.quizzes && Array.isArray(response.quizzes)) {
//         setQuizzes(response.quizzes)
//       } else {
//         throw new Error("Invalid response format")
//       }
//     } catch (error) {
//       console.error("Error fetching quizzes:", error)
//       showAlertMessage("Failed to load quizzes", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchLeaderboard = async (quizId) => {
//     try {
//       setLoading(true)
//       setSelectedQuiz(quizId)

//       const response = await api.get(`/leaderboard/${quizId}`)
//       console.log("Leaderboard data:", response)

//       if (response && response.success && response.leaderboard && Array.isArray(response.leaderboard.topStudents)) {
//         // Get only top 5 students
//         const topFiveStudents = response.leaderboard.topStudents.slice(0, 5)

//         // Transform data to match our component's expected format
//         const formattedData = topFiveStudents.map((student, index) => {
//           // Calculate reward points based on rank percentage
//           const rankPercentage = getRankPercentage(index + 1)
//           const calculatedRewardPoints = Math.round(response.rewardPoints * rankPercentage)

//           return {
//             id: student.studentId._id,
//             name: student.studentId.name || `Student ${index + 1}`,
//             email: student.studentId.email || "",
//             photo: student.studentId.profilepicURL || "/placeholder.svg",
//             rank: index + 1,
//             points: student.marks || 0,
//             quizScore: Math.round((student.marks / response.totalMarks) * 100) || 0,
//             rewardPoints: calculatedRewardPoints,
//             timeTaken: student.timeTaken || 0,
//           }
//         })

//         setLeaderboardData(formattedData)
//       } else {
//         throw new Error("Invalid response format")
//       }
//     } catch (error) {
//       console.error("Error fetching leaderboard:", error)
//       showAlertMessage("Failed to load leaderboard data", "error")
//       setLeaderboardData([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const creditRewardPoints = async () => {
//     if (!selectedQuiz) {
//       showAlertMessage("Please select a quiz first", "error")
//       return
//     }

//     try {
//       setProcessingCredit(true)
//       const response = await api.get(`/admin/quiz/leaderboard/credit-reward/${selectedQuiz}`)

//       if (response && response.success) {
//         showAlertMessage("Reward points credited successfully!", "success")
//         // Refresh the leaderboard data
//         fetchLeaderboard(selectedQuiz)
//       } else if (response && response.message) {
//         showAlertMessage(response.message, "warning")
//       } else {
//         throw new Error("Failed to credit reward points")
//       }
//     } catch (error) {
//       console.error("Error crediting reward points:", error)
//       showAlertMessage(error.message || "Failed to credit reward points", "error")
//     } finally {
//       setProcessingCredit(false)
//     }
//   }

//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message)
//     setAlertType(type)
//     setShowAlert(true)
//     setTimeout(() => setShowAlert(false), 5000)
//   }

//   // Get percentage based on rank
//   const getRankPercentage = (rank) => {
//     switch (rank) {
//       case 1:
//         return 1.0 // 100%
//       case 2:
//         return 0.85 // 85%
//       case 3:
//         return 0.7 // 70%
//       case 4:
//         return 0.5 // 50%
//       case 5:
//         return 0.3 // 30%
//       default:
//         return 0
//     }
//   }

//   const getRankIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="rank-icon gold" />
//       case 2:
//         return <Medal className="rank-icon silver" />
//       case 3:
//         return <Medal className="rank-icon bronze" />
//       default:
//         return <Star className="rank-icon" />
//     }
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}m ${remainingSeconds}s`
//   }

//   if (loading && quizzes.length === 0) {
//     return <Loader fullscreen />
//   }

//   return (
//     <div className="credit-rewards-container">
//       {showAlert && (
//         <div className={`alert-message ${alertType}`}>
//           <AlertCircle className="alert-icon" size={20} />
//           <span>{alertMessage}</span>
//         </div>
//       )}

//       <div className="header">
//         <Button variant="ghost" onClick={() => navigate("/admin-dashboard")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Dashboard
//         </Button>
//         <h1>Credit Reward Points</h1>
//         <Button variant="outline" onClick={fetchQuizzes} className="refresh-btn">
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>

//       <Card className="quiz-selector-card">
//         <CardHeader>
//           <CardTitle>Select Quiz</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="info-text">
//             Select a quiz to view its leaderboard and credit reward points to top-performing students.
//           </p>
//           <div className="quiz-grid">
//             {quizzes.length === 0 ? (
//               <p className="no-quizzes">No quizzes available</p>
//             ) : (
//               quizzes.map((quiz) => (
//                 <div
//                   key={quiz._id}
//                   className={`quiz-item ${selectedQuiz === quiz._id ? "selected" : ""}`}
//                   onClick={() => fetchLeaderboard(quiz._id)}
//                 >
//                   <div className="quiz-info">
//                     <h3>{quiz.topic}</h3>
//                     <p>Date: {formatDate(quiz.startAt)}</p>
//                   </div>
//                   {selectedQuiz === quiz._id && <Check className="selected-icon" size={20} />}
//                 </div>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {selectedQuiz && (
//         <>
//           <div className="leaderboard-header">
//             <h2>Leaderboard</h2>
//             <Button
//               onClick={creditRewardPoints}
//               disabled={processingCredit || leaderboardData.length === 0}
//               className="credit-btn"
//             >
//               {processingCredit ? "Processing..." : "Credit Reward Points"}
//             </Button>
//           </div>

//           {leaderboardData.length === 0 ? (
//             <div className="no-data-message">
//               <p>No leaderboard data available for this quiz</p>
//             </div>
//           ) : (
//             <div className="leaderboard-list">
//               {leaderboardData.map((user) => (
//                 <div key={user.id} className={`leaderboard-card rank-${user.rank}`}>
//                   <div className="rank-section">
//                     {getRankIcon(user.rank)}
//                     <span className="rank-number">#{user.rank}</span>
//                   </div>

//                   <div className="user-info">
//                     <img src={user.photo || "/placeholder.svg"} alt={user.name} className="user-photo" />
//                     <div className="user-details">
//                       <h3>{user.name}</h3>
//                       <p className="user-email">{user.email}</p>
//                       <div className="user-stats">
//                         <span>Quiz score: {user.quizScore}%</span>
//                         <span>•</span>
//                         <span>Time: {formatTime(user.timeTaken)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="points-section">
//                     <div className="total-points">
//                       <span className="points-label">Reward Points</span>
//                       <span className="points-value">{user.rewardPoints}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

// export default CreditRewardPoints

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trophy, Medal, Star, Check, AlertCircle, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import Loader from "../../components/Loader"
import api from "../../utils/api"
import "../../assets/styles/admin/CreditRewardPoints.css"

const CreditRewardPoints = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [processingCredit, setProcessingCredit] = useState(false)
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("success")
  const [creditedQuizzes, setCreditedQuizzes] = useState([])

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const response = await api.get("/leaderboard/available/quiz")

      if (response && response.quizzes && Array.isArray(response.quizzes)) {
        // Check which quizzes already have rewards credited
        const quizzesWithCreditStatus = response.quizzes.map((quiz) => ({
          ...quiz,
          rewardPointsCredited: quiz.rewardPointsCredited || false,
        }))
        setQuizzes(quizzesWithCreditStatus)

        // Create a list of quiz IDs that already have rewards credited
        const creditedIds = quizzesWithCreditStatus.filter((quiz) => quiz.rewardPointsCredited).map((quiz) => quiz._id)

        setCreditedQuizzes(creditedIds)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      showAlertMessage("Failed to load quizzes", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async (quizId) => {
    try {
      setLoading(true)
      setSelectedQuiz(quizId)

      const response = await api.get(`/leaderboard/${quizId}`)
      console.log("Leaderboard data:", response)

      if (response && response.success && response.leaderboard && Array.isArray(response.leaderboard.topStudents)) {
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
            email: student.studentId.email || "",
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
      console.error("Error fetching leaderboard:", error)
      showAlertMessage("Failed to load leaderboard data", "error")
      setLeaderboardData([])
    } finally {
      setLoading(false)
    }
  }

  const creditRewardPoints = async () => {
    if (!selectedQuiz) {
      showAlertMessage("Please select a quiz first", "error")
      return
    }

    try {
      setProcessingCredit(true)
      const response = await api.get(`/admin/quiz/leaderboard/credit-reward/${selectedQuiz}`)

      if (response && response.success) {
        showAlertMessage("Reward points credited successfully!", "success")

        // Update the credited quizzes list
        setCreditedQuizzes((prev) => [...prev, selectedQuiz])

        // Update the quiz in the quizzes list to show it's been credited
        setQuizzes((prev) =>
          prev.map((quiz) => (quiz._id === selectedQuiz ? { ...quiz, rewardPointsCredited: true } : quiz)),
        )

        // Refresh the leaderboard data
        fetchLeaderboard(selectedQuiz)
      } else if (response && response.message) {
        showAlertMessage(response.message, "warning")
      } else {
        throw new Error("Failed to credit reward points")
      }
    } catch (error) {
      console.error("Error crediting reward points:", error)
      showAlertMessage(error.message || "Failed to credit reward points", "error")
    } finally {
      setProcessingCredit(false)
    }
  }

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Check if the quiz has already been credited
  const isQuizCredited = (quizId) => {
    return creditedQuizzes.includes(quizId)
  }

  if (loading && quizzes.length === 0) {
    return <Loader fullscreen />
  }

  return (
    <div className="credit-rewards-container">
      {showAlert && (
        <div className={`alert-message ${alertType}`}>
          <AlertCircle className="alert-icon" size={20} />
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="header">
        <Button variant="ghost" onClick={() => navigate("/admin-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Credit Reward Points</h1>
        <Button variant="outline" onClick={fetchQuizzes} className="refresh-btn">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="quiz-selector-card">
        <CardHeader>
          <CardTitle>Select Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="info-text">
            Select a quiz to view its leaderboard and credit reward points to top-performing students.
          </p>
          <div className="quiz-grid">
            {quizzes.length === 0 ? (
              <p className="no-quizzes">No quizzes available</p>
            ) : (
              quizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className={`quiz-item ${selectedQuiz === quiz._id ? "selected" : ""} ${
                    quiz.rewardPointsCredited ? "credited" : ""
                  }`}
                  onClick={() => fetchLeaderboard(quiz._id)}
                >
                  <div className="quiz-info">
                    <h3>{quiz.topic}</h3>
                    <p>Date: {formatDate(quiz.startAt)}</p>
                    {quiz.rewardPointsCredited && (
                      <span className="credited-badge">
                        <Check size={12} /> Rewards Credited
                      </span>
                    )}
                  </div>
                  {selectedQuiz === quiz._id && <Check className="selected-icon" size={20} />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedQuiz && (
        <>
          <div className="leaderboard-header">
            <h2>Leaderboard</h2>
            <Button
              onClick={creditRewardPoints}
              disabled={processingCredit || leaderboardData.length === 0 || isQuizCredited(selectedQuiz)}
              className="credit-btn"
            >
              {processingCredit
                ? "Processing..."
                : isQuizCredited(selectedQuiz)
                  ? "Already Credited"
                  : "Credit Reward Points"}
            </Button>
          </div>

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
                      <p className="user-email">{user.email}</p>
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
                    {isQuizCredited(selectedQuiz) && (
                      <span className="credited-status">
                        <Check size={14} className="check-icon" /> Credited
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CreditRewardPoints
