// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
// import { Search, Plus, ArrowLeft, Trash2 } from "lucide-react"
// import api from "../../utils/api"
// import Loader from "../../components/Loader"
// import "../../assets/styles/admin/QuizManagement.css"

// const QuizManagement = () => {
//   const navigate = useNavigate()
//   const [isCreateOpen, setIsCreateOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterCourse, setFilterCourse] = useState("all")
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [quizzes, setQuizzes] = useState([])
//   const [courses, setCourses] = useState([])
//   const [quizFormData, setQuizFormData] = useState({
//     title: "",
//     duration: 30,
//     rewardPoints: 50,
//     questions: [
//       {
//         text: "",
//         marks: 10,
//         options: ["", "", "", ""],
//         correctOption: 0,
//       },
//     ],
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)

//         // Fetch quizzes
//         const quizzesResponse = await api.get("/quiz")
//         console.log("Quiz API Response:"+quizzesResponse[0].topic)
//         setQuizzes(quizzesResponse || [])

//             } catch (error) {
//         console.error("Error fetching quiz data:", error)
//         setError("Failed to load quizzes")

//         // Fallback to mock data
//         setQuizzes([
//           {
//             id: 1,
//             title: "React Fundamentals Quiz",
            
//             duration: "30 min",
//             questions: 10,
//             totalMarks: 100,
//             attempts: 156,
//             avgScore: "85%",
//             status: "active",
//           },
//           {
//             id: 2,
//             title: "JavaScript Advanced Concepts",
            
//             duration: "45 min",
//             questions: 15,
//             totalMarks: 150,
//             attempts: 98,
//             avgScore: "78%",
//             status: "completed",
//           },
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleQuizFormChange = (e) => {
//     const { name, value } = e.target
//     setQuizFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleQuestionChange = (index, field, value) => {
//     const updatedQuestions = [...quizFormData.questions]
//     updatedQuestions[index] = {
//       ...updatedQuestions[index],
//       [field]: value,
//     }

//     setQuizFormData((prev) => ({
//       ...prev,
//       questions: updatedQuestions,
//     }))
//   }

//   const handleOptionChange = (questionIndex, optionIndex, value) => {
//     const updatedQuestions = [...quizFormData.questions]
//     const options = [...updatedQuestions[questionIndex].options]
//     options[optionIndex] = value

//     updatedQuestions[questionIndex] = {
//       ...updatedQuestions[questionIndex],
//       options,
//     }

//     setQuizFormData((prev) => ({
//       ...prev,
//       questions: updatedQuestions,
//     }))
//   }

//   const handleCorrectOptionChange = (questionIndex, optionIndex) => {
//     const updatedQuestions = [...quizFormData.questions]
//     updatedQuestions[questionIndex].correctOption = optionIndex

//     setQuizFormData((prev) => ({
//       ...prev,
//       questions: updatedQuestions,
//     }))
//   }

//   const addQuestion = () => {
//     setQuizFormData((prev) => ({
//       ...prev,
//       questions: [
//         ...prev.questions,
//         {
//           text: "",
//           marks: 10,
//           options: ["", "", "", ""],
//           correctOption: 0,
//         },
//       ],
//     }))
//   }

//   const removeQuestion = (index) => {
//     if (quizFormData.questions.length <= 1) {
//       alert("Quiz must have at least one question")
//       return
//     }

//     const updatedQuestions = quizFormData.questions.filter((_, i) => i !== index)
//     setQuizFormData((prev) => ({
//       ...prev,
//       questions: updatedQuestions,
//     }))
//   }

//   const handleCreateQuiz = async (e) => {
//     e.preventDefault()

//     if (!quizFormData.title) {
//       alert("Please enter a title and select a course")
//       return
//     }

//     // Validate questions
//     const invalidQuestions = quizFormData.questions.filter((q) => !q.text || q.options.some((opt) => !opt))

//     if (invalidQuestions.length > 0) {
//       alert("Please fill in all question fields and options")
//       return
//     }

//     try {
//       setLoading(true)

//       const quizData = {
//         title: quizFormData.title,
//         duration: Number.parseInt(quizFormData.duration),
//         rewardPoints: Number.parseInt(quizFormData.rewardPoints),
//         questions: quizFormData.questions.map((q) => ({
//           text: q.text,
//           marks: Number.parseInt(q.marks),
//           options: q.options,
//           correctOption: q.correctOption,
//         })),
//       }

//       await api.post("/quiz/create", quizData)

//       alert("Quiz created successfully!")
//       setIsCreateOpen(false)

//       // Reset form
//       setQuizFormData({
//         title: "",
        
//         duration: 30,
//         rewardPoints: 50,
//         questions: [
//           {
//             text: "",
//             marks: 10,
//             options: ["", "", "", ""],
//             correctOption: 0,
//           },
//         ],
//       })

//       // Refresh quiz list
//       const response = await api.get("/quiz")
//       setQuizzes(response.data || [])
//     } catch (error) {
//       console.error("Error creating quiz:", error)
//       alert("Failed to create quiz. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredQuizzes = quizzes.filter((quiz) => {
//     const matchesSearch =
//       quiz.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
//     // const matchesCourse = filterCourse === "all" || quiz.course === filterCourse
//     // const matchesStatus = activeTab === "all" || quiz.status === activeTab
//     // return matchesSearch && matchesCourse && matchesStatus
//     return matchesSearch
//   })

//   if (loading) {
//     return <Loader fullscreen/>
//   }

//   return (
//     <div className="quiz-management-container">
//       <div className="header-section">
//         <Button variant="ghost" onClick={() => navigate("/admin")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Dashboard
//         </Button>
//         <h1>Quiz Management</h1>
//         <Button onClick={() => setIsCreateOpen(true)} className="create-button">
//           <Plus className="w-4 h-4 mr-2" />
//           Create Quiz
//         </Button>
//       </div>

      

      
//         <div className="search-container">
//           <Search className="search-icon" />
//           <Input
//             type="text"
//             placeholder="Search quizzes..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

        

//       {error && <div className="error-message">{error}</div>}

//       <br/>
//       <br/>
     

//       <div className="quiz-table">
//       <h3>Active Quizzes</h3>
//       <br/>
      
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Course</th>
//               <th>Duration</th>
//               <th>Questions</th>
//               <th>Total Marks</th>
//               <th>Attempts</th>
              
//             </tr>
//           </thead>
//           <tbody>
//             {filteredQuizzes.map((quiz) => (
//               <tr key={quiz.id}>
//                 <td>{quiz.topic}</td>
//                 <td>{quiz.description}</td>
//                 <td>{quiz.duration}</td>
//                 <td>{quiz.questions.length}</td>
//                 <td>{quiz.totalMarks}</td>
//                  <td>{quiz.attempts}</td>
                
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent className="create-quiz-dialog">
//           <DialogHeader>
//             <DialogTitle>Create New Quiz</DialogTitle>
//           </DialogHeader>
//           <form className="create-quiz-form" onSubmit={handleCreateQuiz}>
//             <div className="form-group">
//               <label>Quiz Title</label>
//               <Input
//                 name="title"
//                 value={quizFormData.title}
//                 onChange={handleQuizFormChange}
//                 placeholder="Enter quiz title"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Duration (minutes)</label>
//                 <Input
//                   type="number"
//                   name="duration"
//                   value={quizFormData.duration}
//                   onChange={handleQuizFormChange}
//                   placeholder="30"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Reward Points</label>
//                 <Input
//                   type="number"
//                   name="rewardPoints"
//                   value={quizFormData.rewardPoints}
//                   onChange={handleQuizFormChange}
//                   placeholder="50"
//                 />
//               </div>
//             </div>

//             <div className="questions-section">
//               <h3>Questions</h3>

//               {quizFormData.questions.map((question, questionIndex) => (
//                 <div key={questionIndex} className="question-form">
//                   <div className="question-header">
//                     <h4>Question {questionIndex + 1}</h4>
//                     <Button type="button" variant="destructive" size="sm" onClick={() => removeQuestion(questionIndex)}>
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>

//                   <div className="form-group">
//                     <label>Question Text</label>
//                     <Input
//                       value={question.text}
//                       onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
//                       placeholder="Enter question"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Marks</label>
//                     <Input
//                       type="number"
//                       value={question.marks}
//                       onChange={(e) => handleQuestionChange(questionIndex, "marks", e.target.value)}
//                       placeholder="10"
//                     />
//                   </div>

//                   <div className="options-group">
//                     <label>Options</label>
//                     <div className="option-inputs">
//                       {question.options.map((option, optionIndex) => (
//                         <div key={optionIndex} className="option-input">
//                           <input
//                             type="radio"
//                             name={`correct-answer-${questionIndex}`}
//                             checked={question.correctOption === optionIndex}
//                             onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
//                           />
//                           <Input
//                             value={option}
//                             onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
//                             placeholder={`Option ${optionIndex + 1}`}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <Button type="button" variant="outline" className="add-question-btn" onClick={addQuestion}>
//                 Add Question
//               </Button>
//             </div>

//             <div className="dialog-footer">
//               <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">Create Quiz</Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default QuizManagement


"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Search, Plus, ArrowLeft, Trash2 } from "lucide-react"
import api from "../../utils/api"
import Loader from "../../components/Loader"
import "../../assets/styles/admin/QuizManagement.css"

const QuizManagement = () => {
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCourse, setFilterCourse] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [courses, setCourses] = useState([])
  const [quizFormData, setQuizFormData] = useState({
    topic: "",
    description: "",
    duration: 30,
    rewardPoints: 50,
    startAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Default to tomorrow
    questions: [
      {
        question: "",
        marks: 10,
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch quizzes
        const quizzesResponse = await api.get("/quiz")
        console.log("Quiz API Response:", quizzesResponse)
        setQuizzes(quizzesResponse || [])

        
      } catch (error) {
        console.error("Error fetching quiz data:", error)
        setError("Failed to load quizzes")

        // Fallback to mock data
        setQuizzes([
          {
            id: 1,
            topic: "React Fundamentals Quiz",
            description: "Test your knowledge of React basics",
            duration: 30,
            questions: 10,
            totalMarks: 100,
            attempts: 156,
            avgScore: "85%",
          },
          {
            id: 2,
            topic: "JavaScript Advanced Concepts",
            description: "Challenge yourself with advanced JavaScript topics",
            duration: 45,
            questions: 15,
            totalMarks: 150,
            attempts: 98,
            avgScore: "78%",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleQuizFormChange = (e) => {
    const { name, value } = e.target
    setQuizFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizFormData.questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    }

    setQuizFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }))
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizFormData.questions]
    const options = [...updatedQuestions[questionIndex].options]
    options[optionIndex] = value

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    }

    setQuizFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }))
  }

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizFormData.questions]
    updatedQuestions[questionIndex].correctAnswerIndex = optionIndex

    setQuizFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }))
  }

  const addQuestion = () => {
    setQuizFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          marks: 10,
          options: ["", "", "", ""],
          correctAnswerIndex: 0,
        },
      ],
    }))
  }

  const removeQuestion = (index) => {
    if (quizFormData.questions.length <= 1) {
      alert("Quiz must have at least one question")
      return
    }

    const updatedQuestions = quizFormData.questions.filter((_, i) => i !== index)
    setQuizFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }))
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault()

    if (!quizFormData.topic || !quizFormData.startAt) {
      alert("Please enter a title and start date")
      return
    }

    // Validate questions
    const invalidQuestions = quizFormData.questions.filter((q) => !q.question || q.options.some((opt) => !opt))

    if (invalidQuestions.length > 0) {
      alert("Please fill in all question fields and options")
      return
    }

    try {
      setLoading(true)

      // First, create all questions
      const createdQuestions = []

      for (const question of quizFormData.questions) {
        try {
          const questionData = {
            question: question.question,
            options: question.options,
            correctAnswerIndex: question.correctAnswerIndex,
            marks: Number.parseInt(question.marks),
          }

          const response = await api.post("/question/create", questionData)
          if (response && response.question._id) {
            createdQuestions.push(response.question._id)
          } else {
            throw new Error("Failed to create question")
          }
        } catch (error) {
          console.error("Error creating question:", error)
          throw error
        }
      }

      // Then create the quiz with question IDs
      const quizData = {
        topic: quizFormData.topic,
        description: quizFormData.description || `Quiz about ${quizFormData.topic}`,
        duration: Number.parseInt(quizFormData.duration),
        rewardPoints: Number.parseInt(quizFormData.rewardPoints),
        startAt: new Date(quizFormData.startAt).toISOString(),
        questions: createdQuestions, // Array of question IDs
      }

      await api.post("/quiz/create", quizData)

      alert("Quiz created successfully!")
      setIsCreateOpen(false)

      // Reset form
      setQuizFormData({
        topic: "",
        description: "",
        duration: 30,
        rewardPoints: 50,
        startAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        questions: [
          {
            question: "",
            marks: 10,
            options: ["", "", "", ""],
            correctAnswerIndex: 0,
          },
        ],
      })

      // Refresh quiz list
      const response = await api.get("/quiz")
      setQuizzes(response || [])
    } catch (error) {
      console.error("Error creating quiz:", error)
      alert("Failed to create quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return <Loader fullscreen />
  }

  return (
    <div className="quiz-management-container">
      <div className="header-section">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Quiz Management</h1>
        <Button onClick={() => setIsCreateOpen(true)} className="create-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="quiz-table">
        <h3>Active Quizzes</h3>
        <br />

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Duration (min)</th>
              <th>Questions</th>
              <th>Total Marks</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz) => (
              <tr key={quiz._id || quiz.id}>
                <td>{quiz.topic}</td>
                <td>{quiz.description || "-"}</td>
                <td>{quiz.duration}</td>
                <td>{quiz.questions?.length || 0}</td>
                <td>{quiz.totalMarks || 0}</td>
                <td>{quiz.attempts || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="create-quiz-dialog">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>
          <form className="create-quiz-form" onSubmit={handleCreateQuiz}>
            <div className="form-group">
              <label>Quiz Title</label>
              <Input
                name="topic"
                value={quizFormData.topic}
                onChange={handleQuizFormChange}
                placeholder="Enter quiz title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <Input
                name="description"
                value={quizFormData.description}
                onChange={handleQuizFormChange}
                placeholder="Enter quiz description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <Input
                  type="number"
                  name="duration"
                  value={quizFormData.duration}
                  onChange={handleQuizFormChange}
                  placeholder="30"
                />
              </div>
              <div className="form-group">
                <label>Reward Points</label>
                <Input
                  type="number"
                  name="rewardPoints"
                  value={quizFormData.rewardPoints}
                  onChange={handleQuizFormChange}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Start Date & Time</label>
              <Input
                type="datetime-local"
                name="startAt"
                value={quizFormData.startAt}
                onChange={handleQuizFormChange}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="questions-section">
              <h3>Questions</h3>

              {quizFormData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="question-form">
                  <div className="question-header">
                    <h4>Question {questionIndex + 1}</h4>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeQuestion(questionIndex)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="form-group">
                    <label>Question Text</label>
                    <Input
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="form-group">
                    <label>Marks</label>
                    <Input
                      type="number"
                      value={question.marks}
                      onChange={(e) => handleQuestionChange(questionIndex, "marks", e.target.value)}
                      placeholder="10"
                    />
                  </div>

                  <div className="options-group">
                    <label>Options</label>
                    <div className="option-inputs">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-input">
                          <input
                            type="radio"
                            name={`correct-answer-${questionIndex}`}
                            checked={question.correctAnswerIndex === optionIndex}
                            onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                          />
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" className="add-question-btn" onClick={addQuestion}>
                Add Question
              </Button>
            </div>

            <div className="dialog-footer">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Quiz</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuizManagement

