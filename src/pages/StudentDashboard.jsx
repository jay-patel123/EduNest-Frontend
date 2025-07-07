

// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import {
//   BookOpen,
//   ClipboardList,
//   Trophy,
//   CreditCard,
//   GraduationCap,
//   FileText,
//   Search,
//   Bell,
//   User,
//   TrendingUp,
// } from "lucide-react"
// import WeeklyTimetable from "../components/dashboard/WeeklyTimetable"
// import Achievements from "../components/dashboard/Achievements"
// import PopularCourses from "../components/dashboard/PopularCourses"
// import EnrolledCourses from "../components/dashboard/EnrolledCourses"
// import LogoutButton from "../components/LogoutButton"
// import api from "../utils/api"
// import Loader from "../components/Loader"
// import "../assets/styles/Dashboard.css"

// const StudentDashboard = () => {
//   const [studentData, setStudentData] = useState(null)
//   const [studentId,setStudentId] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         setLoading(true)
//         const data = await api.get("/student/profile")
//         console.log("API Response:", JSON.stringify(data, null, 2))
//         setStudentData(data)
//         setStudentId(data._id)
//       } catch (error) {
//         console.error("Error fetching student data:", error)
//         setError("Failed to load student data")

//         // Fallback to local storage data if API fails
//         const userData = localStorage.getItem("userData")
//         if (userData) {
//           setStudentData(JSON.parse(userData))
//         }
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStudentData()
//   }, [])

//   if (loading) {
//     return <Loader fullScreen />
//   }

//   return (
//     <div className="dashboard-layout">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <span className="logo-icon">🎓</span>
//           <span className="logo-text">EduNest</span>
//         </div>

//         <nav className="sidebar-nav">
//           <Link to="/student-dashboard" className="nav-item active">
//             <TrendingUp size={20} />
//             Dashboard
//           </Link>
//           <Link to = {`/my-courses/${studentId}`} className="nav-item">
//             <BookOpen className="w-5 h-5" />
//             <span>My Courses</span>
//           </Link>
//           <Link to="/quizzes" className="nav-item">
//             <ClipboardList className="w-5 h-5" />
//             <span>Take Quiz</span>
//           </Link>
//           <Link to="/my-points" className="nav-item">
//             <Trophy className="w-5 h-5" />
//             <span>My Points</span>
//           </Link>
//           <Link to="/course-payment" className="nav-item">
//             <CreditCard className="w-5 h-5" />
//             <span>Perchase Points</span>
//           </Link>
//           <Link to="/view-courses" className="nav-item">
//             <GraduationCap className="w-5 h-5" />
//             <span>View Courses</span>
//           </Link>
//           <Link to="/attempted-quiz" className="nav-item">
//             <FileText className="w-5 h-5" />
//             <span>Quiz Results</span>
//           </Link>
//         </nav>

//         <div className="sidebar-footer">
//           <Link to="/profile" className="nav-item">
//             <User className="w-5 h-5" />
//             <span>Profile</span>
//           </Link>
//           <LogoutButton className="nav-item" variant="ghost" />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Top Navigation */}
//         <nav className="top-nav">
//           <div className="search-container">
//             {/* <Search className="search-icon" />
//             <input type="text" placeholder="Search..." className="search-input" /> */}
//           </div>

//           <div className="nav-actions">
//           <Link to="/leaderboard" className="nav-button">
//               <Trophy />
//               <span>Leaderboard</span>
//             </Link>
//             <Link to="/profile" className="profile-button">
//               <img
//                 src={
//                   studentData?.profilepicURL ||
//                   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" ||
//                   "/placeholder.svg"
//                 }
//                 alt="Profile"
//                 className="profile-photo"
//               />
//               <span>{studentData?.name || "Student"}</span>
//             </Link>
//           </div>
//         </nav>

//         {/* Dashboard Content */}
//         <div className="dashboard-content">
//            {error && <div className="error-message">{error}. Some data may not be up to date.</div>}
        
//           <div className="welcome-section">
//             <h1>Welcome back, {studentData?.name || "Student"}!</h1>
//             <p>You have {studentData?.rewardPoints || 0}  points</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <WeeklyTimetable />
//           </div>
//           <div className="mb-6">
//             <PopularCourses />
//           </div>
//           {/* <div>
//             <EnrolledCourses enrolledCount={studentData?.courses_enrolled || 0} />
//           </div> */}
//         </div>
//       </main>
//     </div>
//   )
// }

// export default StudentDashboard

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  BookOpen,
  ClipboardList,
  Trophy,
  CreditCard,
  GraduationCap,
  FileText,
  User,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"
import WeeklyTimetable from "../components/dashboard/WeeklyTimetable"
import PopularCourses from "../components/dashboard/PopularCourses"
import LogoutButton from "../components/LogoutButton"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/Dashboard.css"

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null)
  const [studentId, setStudentId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true)
        const data = await api.get("/student/profile")
        console.log("API Response:", JSON.stringify(data, null, 2))
        setStudentData(data)
        setStudentId(data._id)
      } catch (error) {
        console.error("Error fetching student data:", error)
        setError("Failed to load student data")

        // Fallback to local storage data if API fails
        const userData = localStorage.getItem("userData")
        if (userData) {
          setStudentData(JSON.parse(userData))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Mobile Close Button */}
        <button className="mobile-close-btn" onClick={closeSidebar} aria-label="Close sidebar">
          <X size={24} />
        </button>

        <div className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">EduNest</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/student-dashboard" className="nav-item active" onClick={closeSidebar}>
            <TrendingUp size={20} />
            Dashboard
          </Link>
          <Link to={`/my-courses/${studentId}`} className="nav-item" onClick={closeSidebar}>
            <BookOpen className="w-5 h-5" />
            <span>My Courses</span>
          </Link>
          <Link to="/quizzes" className="nav-item" onClick={closeSidebar}>
            <ClipboardList className="w-5 h-5" />
            <span>Take Quiz</span>
          </Link>
          <Link to="/my-points" className="nav-item" onClick={closeSidebar}>
            <Trophy className="w-5 h-5" />
            <span>My Points</span>
          </Link>
          <Link to="/course-payment" className="nav-item" onClick={closeSidebar}>
            <CreditCard className="w-5 h-5" />
            <span>Purchase Points</span>
          </Link>
          <Link to="/view-courses" className="nav-item" onClick={closeSidebar}>
            <GraduationCap className="w-5 h-5" />
            <span>View Courses</span>
          </Link>
          <Link to="/attempted-quiz" className="nav-item" onClick={closeSidebar}>
            <FileText className="w-5 h-5" />
            <span>Quiz Results</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/profile" className="nav-item" onClick={closeSidebar}>
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <LogoutButton className="nav-item" variant="ghost" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="search-container">
            {/* <Search className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" /> */}
          </div>

          <div className="nav-actions">
            <Link to="/leaderboard" className="nav-button">
              <Trophy />
              <span>Leaderboard</span>
            </Link>
            <Link to="/profile" className="profile-button">
              <img
                src={
                  studentData?.profilepicURL ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" ||
                  "/placeholder.svg" ||
                  "/placeholder.svg"
                }
                alt="Profile"
                className="profile-photo"
              />
              <span>{studentData?.name || "Student"}</span>
            </Link>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {error && <div className="error-message">{error}. Some data may not be up to date.</div>}

          <div className="welcome-section">
            <h1>Welcome back, {studentData?.name || "Student"}!</h1>
            <p>You have {studentData?.rewardPoints || 0} points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <WeeklyTimetable />
          </div>
          <div className="mb-6">
            <PopularCourses />
          </div>
          {/* <div>
            <EnrolledCourses enrolledCount={studentData?.courses_enrolled || 0} />
          </div> */}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
