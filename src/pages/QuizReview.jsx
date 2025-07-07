"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/QuizReview.css"

const QuizReview = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuizReview = async () => {
      try {
        setLoading(true)
        // Fetch quiz review data
        const response = await api.get(`/attemptedquiz/quiz/${quizId}`)
        console.log("Quiz review data:", response)

        if (response && response.quizId) {
          setQuizData(response)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching quiz review:", error)
        setError("Failed to load quiz review")

        // Fallback to mock data
        setQuizData({
          success: true,
          quizId: quizId,
          topic: "React Fundamentals Quiz",
          description: "Test your React knowledge",
          totalMarks: 100,
          marksObtained: 75,
          timeTaken: 900, // in seconds
          submittedAnswers: [
            { questionId: "q1", selectedAnswerIndex: 0 },
            { questionId: "q2", selectedAnswerIndex: 0 },
            { questionId: "q3", selectedAnswerIndex: 0 },
          ],
          questions: [
            {
              questionId: "q1",
              question: "What is React?",
              options: [
                "A JavaScript library for building user interfaces",
                "A programming language",
                "A database management system",
                "A web server",
              ],
              correctAnswerIndex: 0,
              correctAnswer: "A JavaScript library for building user interfaces",
              marks: 10,
            },
            {
              questionId: "q2",
              question: "What is JSX?",
              options: [
                "A syntax extension for JavaScript",
                "A new programming language",
                "A database query language",
                "A styling framework",
              ],
              correctAnswerIndex: 0,
              correctAnswer: "A syntax extension for JavaScript",
              marks: 15,
            },
            {
              questionId: "q3",
              question: "What is a component in React?",
              options: ["A reusable piece of UI", "A database table", "A styling class", "A JavaScript variable"],
              correctAnswerIndex: 0,
              correctAnswer: "A reusable piece of UI",
              marks: 20,
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuizReview()
  }, [quizId])

  if (loading) {
    return <Loader fullscreen />
  }

  if (error || !quizData) {
    return (
      <div className="quiz-review-container">
        <Button variant="outline" className="back-button" onClick={() => navigate("/quiz-results")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <div className="error-message">
          <h2>Error Loading Quiz Review</h2>
          <p>{error || "Quiz review not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-review-container">
      <div className="review-header">
        <Button variant="outline" className="back-button" onClick={() => navigate("/attempted-quiz")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <h1>{quizData.topic} - Review</h1>
      </div>

      <Card className="quiz-summary-card">
        <CardHeader>
          <CardTitle>Quiz Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Topic</span>
              <span className="stat-value">{quizData.topic}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">
                {quizData.marksObtained} / {quizData.totalMarks}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time Taken</span>
              <span className="stat-value">
                {Math.floor(quizData.timeTaken / 60)}m {quizData.timeTaken % 60}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="questions-list">
        {quizData.questions &&
          quizData.questions.map((question, index) => {
            const userAnswer = quizData.submittedAnswers.find((a) => a.questionId === question.questionId)
            const userAnswerIndex = userAnswer ? userAnswer.selectedAnswerIndex : null
            const isCorrect = userAnswerIndex === question.correctAnswerIndex

            return (
              <Card key={question.questionId} className="question-card">
                <CardHeader>
                  <CardTitle>
                    Question {index + 1} <span className="question-marks">({question.marks} marks)</span>
                    {isCorrect ? (
                      <CheckCircle className="result-icon correct" />
                    ) : (
                      <XCircle className="result-icon incorrect" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="question-text">{question.question}</p>
                  <div className="options-list">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`option-item ${
                          optionIndex === userAnswerIndex && optionIndex === question.correctAnswerIndex
                            ? "correct-answer"
                            : optionIndex === userAnswerIndex
                              ? "incorrect-answer"
                              : optionIndex === question.correctAnswerIndex
                                ? "correct-option"
                                : ""
                        }`}
                      >
                        <span className="option-text">{option}</span>
                        {optionIndex === userAnswerIndex && optionIndex === question.correctAnswerIndex && (
                          <CheckCircle className="option-icon" />
                        )}
                        {optionIndex === userAnswerIndex && optionIndex !== question.correctAnswerIndex && (
                          <XCircle className="option-icon" />
                        )}
                        {optionIndex !== userAnswerIndex && optionIndex === question.correctAnswerIndex && (
                          <CheckCircle className="option-icon" />
                        )}
                      </div>
                    ))}
                  </div>

                  {userAnswerIndex !== question.correctAnswerIndex && (
                    <div className="explanation">
                      <AlertTriangle className="explanation-icon" />
                      <p>The correct answer is: {question.correctAnswer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}

export default QuizReview


