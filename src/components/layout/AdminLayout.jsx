import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Tag,
  CreditCard,
  ClipboardList,
  DollarSign,
  User,
  Search,
  Bell,
} from "lucide-react"
import LogoutButton from "../LogoutButton"
import "./AdminLayout.css"

const AdminLayout = ({ children }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Link to="/admin" className="logo-link">
            <span className="logo-text">EduNest</span>
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/admin" className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/teachers" className={`nav-item ${isActive("/admin/teachers") ? "active" : ""}`}>
            <Users className="nav-icon" />
            <span>Teachers</span>
          </Link>

          <Link to="/admin/students" className={`nav-item ${isActive("/admin/students") ? "active" : ""}`}>
            <Users className="nav-icon" />
            <span>Students</span>
          </Link>

          <Link to="/admin/courses" className={`nav-item ${isActive("/admin/courses") ? "active" : ""}`}>
            <BookOpen className="nav-icon" />
            <span>Courses</span>
          </Link>

          <Link to="/admin/offers" className={`nav-item ${isActive("/admin/offers") ? "active" : ""}`}>
            <Tag className="nav-icon" />
            <span>Offers</span>
          </Link>

          <Link to="/admin/payments" className={`nav-item ${isActive("/admin/payments") ? "active" : ""}`}>
            <CreditCard className="nav-icon" />
            <span>Payments</span>
          </Link>

          <Link to="/admin/quizzes" className={`nav-item ${isActive("/admin/quizzes") ? "active" : ""}`}>
            <ClipboardList className="nav-icon" />
            <span>Quizzes</span>
          </Link>

          <Link to="/admin/teacher-salary" className={`nav-item ${isActive("/admin/teacher-salary") ? "active" : ""}`}>
            <DollarSign className="nav-icon" />
            <span>Teacher Salary</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/admin/profile" className={`nav-item ${isActive("/admin/profile") ? "active" : ""}`}>
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
              <span className="notification-badge">5</span>
            </button>
            <Link to="/admin/profile" className="profile-button">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60"
                alt="Profile"
                className="profile-photo"
              />
              <span>Admin</span>
            </Link>
          </div>
        </nav>

        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout

