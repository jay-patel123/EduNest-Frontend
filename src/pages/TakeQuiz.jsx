// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
// import { Button } from "../components/ui/button"
// import { Clock, AlertTriangle, ArrowLeft } from "lucide-react"
// import api from "../utils/api"
// import Loader from "../components/Loader"
// import "../assets/styles/TakeQuiz.css"

// const TakeQuiz = () => {
//   const { quizId } = useParams()
//   const navigate = useNavigate()
//   const [quiz, setQuiz] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [answers, setAnswers] = useState({})
//   const [timeLeft, setTimeLeft] = useState(0)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [startTime, setStartTime] = useState(null)

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         setLoading(true)
//         // Fetch quiz details
//         const response = await api.get(`/quizattempt/${quizId}`)
//         console.log("Quiz details:", response)

//         if (response ) {
//           setQuiz(response)
//           setTimeLeft(response.duration * 60) // Convert minutes to seconds
//           setStartTime(Date.now())
//         } else {
//           throw new Error("Invalid quiz data")
//         }
//       } catch (error) {
//         console.error("Error fetching quiz:", error)
//         setError("Failed to load quiz")

//         // Fallback to mock data
//         const mockQuiz = {
//           _id: quizId,
//           topic: "React Fundamentals Quiz",
//           duration: 30,
//           questions: [
//             {
//               _id: "q1",
//               question: "What is React?",
//               options: [
//                 "A JavaScript library for building user interfaces",
//                 "A programming language",
//                 "A database management system",
//                 "A web server",
//               ],
//               marks: 10,
//             },
//             {
//               _id: "q2",
//               question: "What is JSX?",
//               options: [
//                 "A syntax extension for JavaScript",
//                 "A new programming language",
//                 "A database query language",
//                 "A styling framework",
//               ],
//               marks: 15,
//             },
//             {
//               _id: "q3",
//               question: "What is a component in React?",
//               options: ["A reusable piece of UI", "A database table", "A styling class", "A JavaScript variable"],
//               marks: 20,
//             },
//           ],
//           totalMarks: 45,
//           rewardPoints: 100,
//         }

//         setQuiz(mockQuiz)
//         setTimeLeft(mockQuiz.duration * 60)
//         setStartTime(Date.now())
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchQuiz()
//   }, [quizId])

//   useEffect(() => {
//     if (timeLeft > 0 && !isSubmitted) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1)
//       }, 1000)
//       return () => clearInterval(timer)
//     } else if (timeLeft === 0 && !isSubmitted && quiz) {
//       handleSubmit()
//     }
//   }, [timeLeft, isSubmitted, quiz])

//   const handleAnswerSelect = (questionId, optionIndex) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: optionIndex,
//     }))
//   }

//   const handleSubmit = async () => {
//     if (isSubmitted) return

//     setIsSubmitted(true)
//     const timeTaken = Math.floor((Date.now() - startTime) / 1000) // Time taken in seconds

//     try {
//       // Prepare submission data
//       const submissionData = {
//         quizId: quiz.id,
//         timeTaken,
//         answers: Object.entries(answers).map(([questionId, selectedAnswerIndex]) => ({
//           questionId,
//           selectedAnswerIndex,
//         })),
//       }

//       // Submit quiz
//       console.log("submitted data:"+submissionData.answers.questionId)
//       const result = await api.post("/quizattempt/submit", submissionData)
      
//       console.log("Quiz submission result:", result)

//       // Navigate to results page
//       navigate(`/quiz-results/${quiz.id}`, {
//         state: {
//           result,
//           quizTitle: quiz.topic,
//           timeTaken,
//         },
//       })
//     } catch (error) {
//       console.error("Error submitting quiz:", error)
//       alert("There was an error submitting your quiz. Please try again.")

//       // For demo purposes, navigate anyway
//       navigate("/quiz-results")
//     }
//   }

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60)
//     const remainingSeconds = seconds % 60
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
//   }

//   if (loading) {
//     return <Loader fullscreen />
//   }

//   if (error || !quiz) {
//     return (
//       <div className="take-quiz-container">
//         <Button variant="ghost" onClick={() => navigate("/quizzes")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Quizzes
//         </Button>
//         <div className="error-message">
//           <AlertTriangle className="icon-lg" />
//           <h2>Error Loading Quiz</h2>
//           <p>{error || "Quiz not found"}</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="take-quiz-container">
//       <div className="quiz-header">
//         <Button variant="ghost" onClick={() => navigate("/quizzes")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Quizzes
//         </Button>
//         <br />
//         <br />
//         <h1>{quiz.topic}</h1>
//         <div className="timer">
//           <Clock className="icon-sm" />
//           <span className={timeLeft < 60 ? "time-warning" : ""}>{formatTime(timeLeft)}</span>
//         </div>
//       </div>

//       <div className="questions-list">
//         {quiz.questions.map((question, index) => (
//           <Card key={question._id} className="question-card">
//             <CardHeader>
//               <CardTitle>
//                 Question {index + 1} <span className="question-marks">({question.marks} marks)</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="question-text">{question.question}</p>
//               <div className="options-list">
//                 {question.options.map((option, optionIndex) => (
//                   <label key={optionIndex} className="option-label">
//                     <input
//                       type="radio"
//                       name={`question-${question._id}`}
//                       checked={answers[question._id] === optionIndex}
//                       onChange={() => handleAnswerSelect(question._id, optionIndex)}
//                       disabled={isSubmitted}
//                     />
//                     <span className="option-text">{option}</span>
//                   </label>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {timeLeft < 60 && !isSubmitted && (
//         <div className="time-warning-message">
//           <AlertTriangle className="icon-sm" />
//           <span>Less than 1 minute remaining!</span>
//         </div>
//       )}

//       <div className="quiz-footer">
//         <Button className="submit-quiz-btn" onClick={handleSubmit} disabled={isSubmitted}>
//           Submit Quiz
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default TakeQuiz

"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Clock, AlertTriangle, ArrowLeft } from "lucide-react"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/TakeQuiz.css"

const TakeQuiz = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        // Fetch quiz details
        const response = await api.get(`/quizattempt/${quizId}`)
        console.log("quizIddddddd:"+quizId)
        console.log("Quiz duration:", response.quiz.startAt)

        if (response) {
          setQuiz(response.quiz)
          const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

setTimeLeft( response.quiz.duration * 60);
// Convert minutes to seconds
          setStartTime(Date.now())
        } else {
          throw new Error("Invalid quiz data")
        }
      } catch (error) {
        console.error("Error fetching quiz:", error)
        setError("Failed to load quiz")
        // setTimeLeft(mockQuiz.duration * 60)
        setStartTime(Date.now())
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !isSubmitted && quiz) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted, quiz])

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmit = async () => {
    if (isSubmitted) return

    if (Object.keys(answers).length === 0) {
      alert("Please answer at least one question before submitting.")
      setIsSubmitted(false)
      return
    }

    setIsSubmitted(true)
    const timeTaken = Math.floor((Date.now() - startTime) / 1000) // Time taken in seconds

    try {
      // Prepare submission data
      const submissionData = {
        quizId, // Use _id instead of id to match your backend
        answers: Object.entries(answers).map(([questionId, selectedAnswerIndex]) => ({
          questionId,
          selectedAnswerIndex,
        })),
      }

      // Submit quiz
      const result = await api.post("/quizattempt/submit", submissionData)
      console.log("submitted data quizId:" + submissionData.quizId)
      console.log("Quiz submission result:", result)

      // Navigate to results page
      navigate(`/attempted-quiz`, {
        state: {
          result,
          quizTitle: quiz.topic,
          timeTaken,
        },
      })
    } catch (error) {
      console.error("Error submitting quiz:", error)
      alert("There was an error submitting your quiz. Please try again.")

      // For demo purposes, navigate anyway
      navigate("/attempted-quiz")
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return <Loader fullscreen />
  }

  if (error || !quiz) {
    return (
      <div className="take-quiz-container">
        <Button variant="ghost" onClick={() => navigate("/quizzes")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Quizzes
        </Button>
        <div className="error-message">
          <AlertTriangle className="icon-lg" />
          <h2>Error Loading Quiz</h2>
          <p>{error || "Quiz not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="take-quiz-container">
      <div className="quiz-header">
        <Button variant="ghost" onClick={() => navigate("/quizzes")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Quizzes
        </Button>
        <br />
        <br />
         <h1>{quiz.topic}</h1>
        <div className="timer">
          <Clock className="icon-sm" />
          <span className={timeLeft < 60 ? "time-warning" : ""}>{formatTime(timeLeft)}</span>
        </div>
      </div>

       <div className="questions-list">
        
        {quiz.questions.map((question, index) => (
          <Card key={question._id} className="question-card">
            <CardHeader>
              <CardTitle>
                Question {index + 1} <span className="question-marks">({question.marks} marks)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="question-text">{question.question}</p>
              <div className="options-list">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      checked={answers[question._id] === optionIndex}
                      onChange={() => handleAnswerSelect(question._id, optionIndex)}
                      disabled={isSubmitted}
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {timeLeft < 60 && !isSubmitted && (
        <div className="time-warning-message">
          <AlertTriangle className="icon-sm" />
          <span>Less than 1 minute remaining!</span>
        </div>
      )}

      <div className="quiz-footer">
        <Button className="submit-quiz-btn" onClick={handleSubmit} disabled={isSubmitted}>
          Submit Quiz
        </Button>
      </div>
    </div>
  )
}

export default TakeQuiz



