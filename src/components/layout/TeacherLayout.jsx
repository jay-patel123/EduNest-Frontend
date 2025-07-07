import { Link, useLocation } from "react-router-dom"
import { BookOpen, Users, DollarSign, PlusCircle, User, Search, Bell } from "lucide-react"
import LogoutButton from "../LogoutButton"
import "./TeacherLayout.css"

const TeacherLayout = ({ children }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Link to="/teacher" className="logo-link">
            <span className="logo-text">EduNest</span>
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/teacher" className={`nav-item ${isActive("/teacher") ? "active" : ""}`}>
            <BookOpen className="nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link to="/teacher/courses" className={`nav-item ${isActive("/teacher/courses") ? "active" : ""}`}>
            <BookOpen className="nav-icon" />
            <span>My Courses</span>
          </Link>

          <Link
            to="/teacher/create-course"
            className={`nav-item ${isActive("/teacher/create-course") ? "active" : ""}`}
          >
            <PlusCircle className="nav-icon" />
            <span>Create Course</span>
          </Link>

          <Link to="/teacher/students" className={`nav-item ${isActive("/teacher/students") ? "active" : ""}`}>
            <Users className="nav-icon" />
            <span>My Students</span>
          </Link>

          <Link to="/teacher/earnings" className={`nav-item ${isActive("/teacher/earnings") ? "active" : ""}`}>
            <DollarSign className="nav-icon" />
            <span>Earnings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/teacher/profile" className={`nav-item ${isActive("/teacher/profile") ? "active" : ""}`}>
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
              <span className="notification-badge">2</span>
            </button>
            <Link to="/teacher/profile" className="profile-button">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
                alt="Profile"
                className="profile-photo"
              />
              <span>Michael Chen</span>
            </Link>
          </div>
        </nav>

        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

export default TeacherLayout

