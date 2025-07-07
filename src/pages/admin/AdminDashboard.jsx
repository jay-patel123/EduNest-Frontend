"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, GraduationCap, BookOpen, DollarSign, Tag, ClipboardList, TrendingUp, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import api from "../../utils/api"
import Loader from "../../components/Loader"
import LogoutButton from "../../components/LogoutButton"
import "../../assets/styles/admin/AdminDashboard.css"

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    studentsLast30Days: 0,
    teachersLast30Days: 0,
    coursesLast30Days: 0,
  })
  const [topPerformers, setTopPerformers] = useState({
    teachers: [],
    courses: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch dashboard stats
        const data = await api.get("/admin/dash-board")
        console.log("API Response:", JSON.stringify(data, null, 2))

        setAdminData(
          data.admin || {
            name: "John Smith",
            profilepicURL:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop",
          },
        )

        setStats({
          totalStudents: data.statistics?.totalStudents || 0,
          totalTeachers: data.statistics?.totalTeachers || 0,
          totalCourses: data.statistics?.totalCourses || 0,
          totalRevenue: data.statistics?.totalRevenue || 10000,
          studentsLast30Days: data.statistics?.studentsLast30Days || 0,
          teachersLast30Days: data.statistics?.teachersLast30Days || 0,
          coursesLast30Days: data.statistics?.coursesLast30Days || 0,
        })

        setTopPerformers({
          teachers: data.topTeachers || [],
          courses: data.topCourses || [],
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data")

        // Fallback to mock data if API fails
        setAdminData({
          name: "John Smith",
          profilepicURL:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop",
        })

        setStats({
          totalStudents: 1234,
          totalTeachers: 45,
          totalCourses: 78,
          totalRevenue: 45000,
          studentsLast30Days: 12,
          teachersLast30Days: 3,
          coursesLast30Days: 5,
        })

        setTopPerformers({
          teachers: [
            {
              _id: 1,
              name: "Dr. Sarah Wilson",
              totalEnrollments: 245,
              averageRating: 4.8,
              course_created: 5,
            },
            {
              _id: 2,
              name: "Prof. Michael Chen",
              totalEnrollments: 198,
              averageRating: 4.7,
              course_created: 4,
            },
          ],
          courses: [
            {
              _id: 1,
              title: "Complete React Development",
              totalEnrollments: 156,
              price: 7800,
              averageRating: 4.9,
            },
            {
              _id: 2,
              title: "Advanced JavaScript",
              totalEnrollments: 134,
              price: 6700,
              averageRating: 4.8,
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">EduNest</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item active">
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/teachers" className="nav-item">
            <GraduationCap size={20} />
            <span>Teachers</span>
          </Link>
          <Link to="/admin/students" className="nav-item">
            <Users size={20} />
            <span>Students</span>
          </Link>
          <Link to="/admin/courses" className="nav-item">
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>
          <Link to="/admin/payments" className="nav-item">
            <DollarSign size={20} />
            <span>Payments</span>
          </Link>
          <Link to="/admin/credit-points" className="nav-item">
            <Tag size={20} />
            <span>Credit RewardPoints</span>
          </Link>
          <Link to="/admin/quizzes" className="nav-item">
            <ClipboardList size={20} />
            <span>Quizzes</span>
          </Link>

          <div className="sidebar-footer">
            <LogoutButton className="nav-item" variant="ghost" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Navigation */}
        <nav className="admin-top-nav">
          <div className="search-container">
            <Search className="search-icon" />
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="nav-actions">
            <Link to="/admin/profile" className="profile-button">
              <img
                src={adminData?.profilepicURL || "/placeholder.svg?height=100&width=100"}
                alt="Profile"
                className="profile-photo"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=100&width=100"
                }}
              />
              <span>{adminData?.name || "Admin User"}</span>
            </Link>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="admin-content">
          <h1>Dashboard Overview</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Stats Grid */}
          <div className="stats-grid">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Users className="card-icon" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{stats.totalStudents}</div>
                <div className="stat-change">+{stats.studentsLast30Days} from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <GraduationCap className="card-icon" />
                  Total Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{stats.totalTeachers}</div>
                <div className="stat-change">+{stats.teachersLast30Days} in last 30 days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <BookOpen className="card-icon" />
                  Total Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{stats.totalCourses}</div>
                <div className="stat-change">+{stats.coursesLast30Days} new courses</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <DollarSign className="card-icon" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">₹{stats.totalRevenue}</div>
                <div className="stat-change">+15% this month</div>
              </CardContent>
            </Card>
          </div>

          <div className="dashboard-grid">
            {/* Top Performing Teachers */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Top Performing Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="performance-list">
                  {topPerformers.teachers.length === 0 ? (
                    <p className="no-data">No teacher data available</p>
                  ) : (
                    topPerformers.teachers.map((teacher) => (
                      <div key={teacher._id} className="performance-item">
                        <div className="performer-info">
                          <h3>{teacher.name}</h3>
                          <div className="performer-stats">
                            <span>{teacher.totalEnrollments || 0} students</span>
                            <span>Courses: {teacher.course_created || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Courses */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="performance-list">
                  {topPerformers.courses.length === 0 ? (
                    <p className="no-data">No course data available</p>
                  ) : (
                    topPerformers.courses.map((course) => (
                      <div key={course._id} className="performance-item">
                        <div className="performer-info">
                          <h3>{course.title}</h3>
                          <div className="performer-stats">
                            <span>{course.totalEnrollments || 0} enrollments</span>
                            {/* <span>★ {course.averageRating || 0}</span> */}
                            <span>Price: ₹{course.price || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard

