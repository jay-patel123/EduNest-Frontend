"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Trophy, Clock, AlertCircle, ArrowLeft, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/QuizList.css"

const QuizList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        // Fetch active quizzes
        const response = await api.get("/quizattempt/availablequiz/all")
        console.log("Active quizzes:", response.quizzes)
       
        if (response && Array.isArray(response.quizzes)) {
          setQuizzes(response.quizzes)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error)
        setError("Failed to load quizzes")

        // Fallback to mock data
        setQuizzes([
          {
            _id: 1,
            topic: "React Fundamentals Quiz",
            description: "Test your knowledge of React basics",
            duration: 30,
            questions: new Array(10),
            totalMarks: 100,
            rewardPoints: 100,
            startAt: new Date().toISOString(),
          },
          {
            _id: 2,
            topic: "JavaScript Advanced Concepts",
            description: "Challenge yourself with advanced JavaScript topics",
            duration: 45,
            questions: new Array(15),
            totalMarks: 150,
            rewardPoints: 150,
            startAt: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  if (loading) {
    return <Loader fullscreen />
  }

  if (error) {
    return (
      <div className="quiz-list-container">
        <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <div className="error-message">
          <AlertCircle className="icon-lg" />
          <h2>Error Loading Quizzes</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="quiz-list-container">
        <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <div className="no-quiz-message">
          <AlertCircle className="icon-lg" />
          <h2>No Active Quizzes</h2>
          <p>There are no quizzes available at the moment. Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-list-container">
      <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back To Dashboard
      </Button>
      <br />
      <br />
      <h1>Available Quizzes</h1>
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <Card key={quiz._id} className="quiz-card">
            <CardHeader>
              <CardTitle>{quiz.topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="quiz-description">{quiz.description}</p>
              <div className="quiz-details">
                <div className="detail-item">
                  <Clock className="icon-sm" />
                  <span>{quiz.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <Trophy className="icon-sm" />
                  <span>{quiz.rewardPoints} points</span>
                </div>
                <div className="detail-item">
                  <Calendar className="icon-sm" />
                  <span>{new Date(quiz.startAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="questions-count">{quiz.totalQuestions} Questions</div>
              <Button className="take-quiz-btn" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default QuizList

