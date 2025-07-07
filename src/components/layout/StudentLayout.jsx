import { Link, useLocation } from "react-router-dom"
import { BookOpen, ClipboardList, Trophy, CreditCard, GraduationCap, FileText, Search, Bell, User } from "lucide-react"
import LogoutButton from "../LogoutButton"
import "./StudentLayout.css"

const StudentLayout = ({ children }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">EduNest</span>
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            <BookOpen className="nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link to="/my-courses" className={`nav-item ${isActive("/my-courses") ? "active" : ""}`}>
            <GraduationCap className="nav-icon" />
            <span>My Courses</span>
          </Link>

          <Link to="/take-quiz" className={`nav-item ${isActive("/take-quiz") ? "active" : ""}`}>
            <ClipboardList className="nav-icon" />
            <span>Take Quiz</span>
          </Link>

          <Link to="/my-points" className={`nav-item ${isActive("/my-points") ? "active" : ""}`}>
            <Trophy className="nav-icon" />
            <span>My Points</span>
          </Link>

          <Link to="/payment-history" className={`nav-item ${isActive("/payment-history") ? "active" : ""}`}>
            <CreditCard className="nav-icon" />
            <span>Payment History</span>
          </Link>

          <Link to="/view-courses" className={`nav-item ${isActive("/view-courses") ? "active" : ""}`}>
            <BookOpen className="nav-icon" />
            <span>View Courses</span>
          </Link>

          <Link to="/quiz-results" className={`nav-item ${isActive("/quiz-results") ? "active" : ""}`}>
            <FileText className="nav-icon" />
            <span>Quiz Results</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
            <User className="nav-icon" />
            <span>Profile</span>
          </Link>
          <LogoutButton className="nav-item" variant="ghost" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <nav className="top-nav">
          <div className="search-container">
            <Search className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="nav-actions">
            <button className="nav-button">
              <Bell className="nav-icon" />
              <span className="notification-badge">3</span>
            </button>
            <Link to="/profile" className="profile-button">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
                alt="Profile"
                className="profile-photo"
              />
              <span>Emily Johnson</span>
            </Link>
          </div>
        </nav>

        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

export default StudentLayout

