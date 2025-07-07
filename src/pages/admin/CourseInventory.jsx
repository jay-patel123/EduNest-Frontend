

"use client"

import { useState, useEffect } from "react"
import { Search, Users, DollarSign, Clock, Star, BookOpen, ArrowLeft, AlertCircle } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Select, SelectOption } from "../../components/ui/select"
import { Button } from "../../components/ui/button"
import "../../assets/styles/admin/CourseInventory.css"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api"
import Loader from "../../components/Loader"

const CourseInventory = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await api.get("/admin/courses")

        if (response && Array.isArray(response.courses)) {
          setCourses(response.courses)

          // Extract unique categories for filter
          const uniqueCategories = [...new Set(response.courses.map((course) => course.category).filter(Boolean))]
          setCategories(uniqueCategories)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load courses. Please try again.")
        // Fallback to mock data
        setCourses([
          {
            _id: 1,
            title: "Introduction to React",
            teacherId: {
              name: "Dr. Sarah Wilson",
            },
            category: "Web Development",
            sell_price: 49.99,
            duration: "6 weeks",
            totalSell: 1234,
            avgRating: 4.8,
            isActivate: true,
            thumbnail:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-14%20231018-3xvkonShQnU6QsQcjF5dbb9Mw3Dzgq.png",
          },
          {
            _id: 2,
            title: "Advanced JavaScript Concepts",
            teacherId: {
              name: "Prof. Michael Chen",
            },
            category: "Programming",
            sell_price: 79.99,
            duration: "8 weeks",
            totalSell: 987,
            avgRating: 4.9,
            isActivate: true,
            thumbnail:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-14%20231018-3xvkonShQnU6QsQcjF5dbb9Mw3Dzgq.png",
          },
          {
            _id: 3,
            title: "Python for Data Science",
            teacherId: {
              name: "Emily Rodriguez",
            },
            category: "Data Science",
            sell_price: 69.99,
            duration: "10 weeks",
            totalSell: 756,
            avgRating: 4.7,
            isActivate: false,
            thumbnail:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-14%20231018-3xvkonShQnU6QsQcjF5dbb9Mw3Dzgq.png",
          },
        ])

        setCategories(["Web Development", "Programming", "Data Science"])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.teacherId &&
        course.teacherId.name &&
        course.teacherId.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || (course.category && course.category === filterCategory)

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && course.isActivate) ||
      (filterStatus === "inactive" && !course.isActivate)

    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading && courses.length === 0) {
    return <Loader fullScreen />
  }

  return (
    <div className="course-management-container">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Course Management</h1>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
            <SelectOption value="all">All Categories</SelectOption>
            {categories.map((category) => (
              <SelectOption key={category} value={category}>
                {category}
              </SelectOption>
            ))}
          </Select>

          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <SelectOption value="all">All Status</SelectOption>
            <SelectOption value="active">Active</SelectOption>
            <SelectOption value="inactive">Inactive</SelectOption>
          </Select>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.length === 0 ? (
          <div className="no-results">
            <p>No courses found matching your criteria</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course._id} className="course-card">
              <div className="course-image">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.courseTitle}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <span className={`status-badge ${course.isActivate ? "active" : "inactive"}`}>
                  {course.isActivate ? "Active" : "Inactive"}
                </span>
              </div>
              <CardContent>
                <div className="course-header">
                  <h3>{course.courseTitle}</h3>
                  <span className="instructor">
                    By {course.teacherName ? course.teacherName : "Unknown Instructor"}
                  </span>
                  <span className="category">{course.level || "Uncategorized"}</span>
                </div>

                <div className="course-stats">
                  <div className="stat-item">
                    <BookOpen className="icon" size={16} />
                    <span>{course.totalModules || 0}</span>
                  </div>
                  <div className="stat-item">
                    <DollarSign className="icon" size={16} />
                    <span>${course.sellPrice || 0}</span>
                  </div>
                  <div className="stat-item">
                    <Users className="icon" size={16} />
                    <span>{course. last6MonthSales || 0}</span>
                  </div>
                  <div className="stat-item">
                    <Star className="icon" size={16} />
                    <span>{course. averageRating || 0}</span>
                  </div>
                </div>

               
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default CourseInventory

