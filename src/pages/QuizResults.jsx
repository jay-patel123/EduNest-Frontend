

// "use client"
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Award, Clock, Calendar, BarChart,ArrowLeft } from "lucide-react"
// import "../assets/styles/QuizResults.css"
// import { Button } from "../components/ui/button"

// const QuizResults = () => {
//   const navigate = useNavigate()
//   const [quizResults] = useState([
//     {
//       id: 1,
//       courseName: "Introduction to React",
//       quizName: "React Basics Assessment",
//       score: 85,
//       totalQuestions: 20,
//       correctAnswers: 17,
//       timeTaken: "25 minutes",
//       date: "2024-02-01",
//       status: "Passed",
//     },
//     {
//       id: 2,
//       courseName: "Advanced JavaScript Concepts",
//       quizName: "JavaScript Advanced Topics",
//       score: 92,
//       totalQuestions: 25,
//       correctAnswers: 23,
//       timeTaken: "35 minutes",
//       date: "2024-01-15",
//       status: "Passed",
//     },
//     {
//       id: 3,
//       courseName: "React Native Fundamentals",
//       quizName: "Mobile Development Basics",
//       score: 65,
//       totalQuestions: 15,
//       correctAnswers: 10,
//       timeTaken: "20 minutes",
//       date: "2024-01-01",
//       status: "Failed",
//     },
//   ])

//   const handleReviewAnswers = (quizId) => {
//     navigate(`/quiz-review/${quizId}`)
//   }

//   return (
//     <div className="quiz-results-container">
//       <div className="results-header">
//       <Button variant="ghost" onClick={() => navigate('/student-dashboard')}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Dashboard
//         </Button>
//         <br/>
//         <br/>
//         <h1>Quiz Results</h1>
//         <div className="results-filters">
//           <select className="filter-select">
//             <option>All Courses</option>
//             <option>Introduction to React</option>
//             <option>Advanced JavaScript</option>
//           </select>
//           <select className="filter-select">
//             <option>All Status</option>
//             <option>Passed</option>
//             <option>Failed</option>
//           </select>
//         </div>
//       </div>

//       <div className="results-list">
//         {quizResults.map((result) => (
//           <div key={result.id} className="result-card">
//             <div className="result-header">
//               <div className="course-info">
//                 <h3>{result.courseName}</h3>
//                 <p>{result.quizName}</p>
//               </div>
//               <span className={`result-status ${result.status.toLowerCase()}`}>{result.status}</span>
//             </div>

//             <div className="result-stats">
//               <div className="stat-item">
//                 <Award size={16} />
//                 <div className="stat-info">
//                   <span>Score</span>
//                   <span className="stat-value">{result.score}%</span>
//                 </div>
//               </div>
//               <div className="stat-item">
//                 <BarChart size={16} />
//                 <div className="stat-info">
//                   <span>Correct Answers</span>
//                   <span className="stat-value">
//                     {result.correctAnswers}/{result.totalQuestions}
//                   </span>
//                 </div>
//               </div>
//               <div className="stat-item">
//                 <Clock size={16} />
//                 <div className="stat-info">
//                   <span>Time Taken</span>
//                   <span className="stat-value">{result.timeTaken}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="result-footer">
//               <div className="date-taken">
//                 <Calendar size={16} />
//                 <span>{new Date(result.date).toLocaleDateString()}</span>
//               </div>
//               <button className="review-button" onClick={() => handleReviewAnswers(result.id)}>
//                 Review Answers
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default QuizResults


"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Award, Clock, Calendar, BarChart, ArrowLeft } from "lucide-react"
import api from "../utils/api"
import Loader from "../components/Loader"
import { Button } from "../components/ui/button"
import "../assets/styles/QuizResults.css"

const QuizResults = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizResults, setQuizResults] = useState([])
  const [filterCourse, setFilterCourse] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        setLoading(true)
        // Fetch quiz results for the current student
        const response = await api.get("/attemptedquiz/all")
        console.log("Quiz results:", response.attemptedQuizzes)

        if (response && Array.isArray(response.attemptedQuizzes)) {
          setQuizResults(response.attemptedQuizzes)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error)
        setError("Failed to load quiz results")

        // Fallback to mock data
        setQuizResults([
          {
            id: 1,
            quizId: "q1",
            courseName: "Introduction to React",
            quizName: "React Basics Assessment",
            score: 85,
            totalQuestions: 20,
            correctAnswers: 17,
            timeTaken: "25 minutes",
            date: "2024-02-01",
            status: "Passed",
          },
          {
            id: 2,
            quizId: "q2",
            courseName: "Advanced JavaScript Concepts",
            quizName: "JavaScript Advanced Topics",
            score: 92,
            totalQuestions: 25,
            correctAnswers: 23,
            timeTaken: "35 minutes",
            date: "2024-01-15",
            status: "Passed",
          },
          {
            id: 3,
            quizId: "q3",
            courseName: "React Native Fundamentals",
            quizName: "Mobile Development Basics",
            score: 65,
            totalQuestions: 15,
            correctAnswers: 10,
            timeTaken: "20 minutes",
            date: "2024-01-01",
            status: "Failed",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchQuizResults()
  }, [])

  const handleReviewAnswers = (quizId) => {
    navigate(`/quiz-review/${quizId}`)
  }

  const filteredResults = quizResults.filter((result) => {
    const matchesCourse = filterCourse === "all" || result.courseName === filterCourse
    const matchesStatus = filterStatus === "all" || result.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesCourse && matchesStatus
  })

  if (loading) {
    return <Loader fullscreen />
  }

  if (error) {
    return (
      <div className="quiz-results-container">
        <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <div className="error-message">
          <h2>Error Loading Results</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-results-container">
      <div className="results-header">
        <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <br />
        <br />
        <h1>Quiz Results</h1>
        <div className="results-filters">
          {/* <select className="filter-select" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="all">All Courses</option>
            {Array.from(new Set(quizResults.map((r) => r.courseName))).map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select> */}
          {/* <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select> */}
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="no-results">
          <p>No quiz results match your filters</p>
        </div>
      ) : (
        <div className="results-list">
          {filteredResults.map((result) => (
            <div key={result.quizId} className="result-card">
              <div className="result-header">
                <div className="course-info">
                   <p>{result.topic}</p>
                </div>
                {/* <span className={`result-status ${result.status.toLowerCase()}`}>{result.status}</span> */}
              </div>

              <div className="result-stats">
                <div className="stat-item">
                  <Award size={16} />
                  <div className="stat-info">
                    <span>Score</span>
                    <span className="stat-value">{((result.marksObtained / result.totalMarks) * 100).toFixed(1)}%</span>

                  </div>
                </div>
                <div className="stat-item">
                  <BarChart size={16} />
                  <div className="stat-info">
                    <span>Correct Answers</span>
                    <span className="stat-value">
                      {result.marksObtained}/{result.totalMarks}
                    </span>
                  </div>
                </div>
                <div className="stat-item">
                  <Clock size={16} />
                  <div className="stat-info">
                    <span>Time Taken</span>
                    <span className="stat-value">{result.timeTaken}</span>
                  </div>
                </div>
              </div>

              <div className="result-footer">
                <div className="date-taken">
                  <Calendar size={16} />
                  <span>{new Date(result.startAt).toLocaleDateString()}</span>
                </div>
                <button className="review-button" onClick={() => handleReviewAnswers(result.quizId)}>
                  Review Answers
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizResults



