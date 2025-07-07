"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BookOpen, ClipboardList, Trophy, CreditCard, GraduationCap, FileText, Search, TrendingUp,ArrowLeft } from "lucide-react"
import CourseCard from "../components/CourseCard"
import "../assets/styles/ViewCourses.css"
import LogoutButton from "../components/LogoutButton"
import api from "../utils/api"
import Loader from "../components/Loader"
import { Button } from "../components/ui/button"

const ViewCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        console.log("Fetching courses...")

        // Fetch courses
        const response = await api.get("/course/")
        console.log("Courses response:", response)

        let coursesData = []

        if (Array.isArray(response)) {
          coursesData = response
        } else if (response && Array.isArray(response.courses)) {
          coursesData = response.courses
        } else if (response && typeof response === "object") {
          coursesData = Object.values(response).find((item) => Array.isArray(item)) || []
        }

        // Fetch teacher details for each course
        const processedCourses = await Promise.all(
          coursesData.map(async (course) => {
            let teacherName = "Unknown Teacher"
            let teacherPhoto = "/placeholder.svg?height=50&width=50"

            if (course.teacherId) {
              try {
                console.log("Before request:")
                // You might need to create a new endpoint to fetch public teacher info
                const TResponse = await api.get(`/teacher/teacherinfo/${course.teacherId}`)
              const  teacherResponse=TResponse;
                if (teacherResponse && teacherResponse.name) {
                  teacherName = teacherResponse.name
                  teacherPhoto = teacherResponse.profilepicURL || teacherPhoto
                  console.log("teacherinfo fetch response:"+teacherResponse)
                }

              } catch (error) {
                console.warn(`Could not fetch teacher info for course ${course._id}:`, error)
              }
            }

            return {
              id: course._id || `temp-${Math.random()}`,
              name: course.title || "Untitled Course",
              description: course.description || "No description available",
              teacherName,
              teacherPhoto,
              courseImage: course.thumbnail || "/placeholder.svg?height=200&width=300",
              rating: course.avgRating || 4.5,
              price: course.sell_price || 0,
              students: course.totalSell || 0,
              duration: "6h 30m", // Default duration
              level: course.level || "Beginner",
              category: course.category || "Web Development",
            }
          }),
        )

        setCourses(processedCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load courses. Please try again later.")
        setCourses([
          {
            id: 1,
            name: "Introduction to React",
            description: "Learn the basics of React, including components, state, props, and hooks.",
            teacherName: "Sarah Wilson",
            teacherPhoto:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
            courseImage: "/placeholder.svg?height=200&width=300",
            rating: 4.5,
            price: 49.99,
            students: 1234,
            duration: "6h 30m",
            level: "Beginner",
            category: "Web Development",
          },
          {
            id: 2,
            name: "Advanced JavaScript Concepts",
            description: "Deep dive into advanced JavaScript topics like closures, prototypes, async programming.",
            teacherName: "Michael Chen",
            teacherPhoto:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop",
            courseImage: "/placeholder.svg?height=200&width=300",
            rating: 4.8,
            price: 79.99,
            students: 892,
            duration: "8h 15m",
            level: "Advanced",
            category: "Web Development",
          },
          // More mock courses...
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      // Search filter
      if (searchQuery && !course.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Level filter
      if (levelFilter !== "all" && course.level.toLowerCase() !== levelFilter.toLowerCase()) {
        return false
      }

      // Category filter
      if (categoryFilter !== "all" && course.category !== categoryFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort courses
      switch (sortBy) {
        case "popular":
          return b.students - a.students
        case "priceLow":
          return a.price - b.price
        case "priceHigh":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  // Function to handle course selection - navigate to module selection page
  const handleCourseSelect = async (courseId) => {
    try {
      // Check if user is authenticated
      // if (!api.isAuthenticated()) {
      //   navigate("/login")
      //   return
      // }

      // Navigate to module selection page
      navigate(`/course/${courseId}/modules/`)
    } catch (error) {
      console.error("Error selecting course:", error)
      if (error.response?.status === 401) {
        navigate("/login")
      } else {
        alert("Failed to access course. Please try again.")
      }
    }
  }

  if (loading) {
    return <Loader screen />
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      {/* <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">EduNest</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/student-dashboard" className="nav-item">
            <TrendingUp size={20} />
            Dashboard
          </Link>
          <Link to="/my-courses" className="nav-item">
            <BookOpen size={20} /> My Courses
          </Link>
          <Link to="/quizzes" className="nav-item">
            <ClipboardList size={20} /> Take Quiz
          </Link>
          <Link to="/my-points" className="nav-item">
            <Trophy size={20} /> My Points
          </Link>
          <Link to="/payment-history" className="nav-item">
            <CreditCard size={20} /> Payment History
          </Link>
          <Link to="/view-courses" className="nav-item active">
            <GraduationCap size={20} /> View Courses
          </Link>
          <Link to="/quiz-results" className="nav-item">
            <FileText size={20} /> Quiz Results
          </Link>
        </nav>
        <div className="sidebar-footer">
          <LogoutButton className="nav-item" variant="ghost" />
        </div>
      </aside> */}

      {/* Main Content */}
      <main className="main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-left">
          <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Dashboard
          </Button>
          </div>
          <div className="nav-right">
          <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search courses..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </nav>

        {/* Courses Content */}
        <div className="view-courses-container">
          <div className="courses-header">
            <h1>Available Courses</h1>
            <div className="courses-filters">
              <select className="filter-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
              </select>
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Sort by: Popular</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {filteredCourses.length === 0 ? (
            <div className="no-courses">
              <h2>No courses found matching your criteria</h2>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setLevelFilter("all")
                  setCategoryFilter("all")
                }}
                className="reset-filters-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} onEnroll={() => handleCourseSelect(course.id)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ViewCourses




