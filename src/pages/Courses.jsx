import { Link } from "react-router-dom"

import CourseCard from "../components/CourseCard"
import "../assets/styles/ViewCourses.css"
import Reactpic from "../assets/images/React-pic.jpg";
import UiuxPic from "../assets/images/uiux-pic.jpg";
import VuePic from "../assets/images/viu-pic.jpg";
import PythonPic from "../assets/images/python-pic.jpg";
import NodePic from "../assets/images/node-pic.jpg";
import JavaScriptPic from "../assets/images/javascript-pic.jpg";


const courses = [
  {
    id: 1,
    name: "Introduction to React",
    description: "Learn the basics of React, including components, state, props, and hooks.",
    teacherName: "Sarah Wilson",
    teacherPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
    courseImage:
      Reactpic,
    rating: 4.5,
    price: 49.99,
    students: 1234,
    level: "Beginner",
  },
  {
    id: 2,
    name: "Advanced JavaScript Concepts",
    description: "Deep dive into advanced JavaScript topics like closures, prototypes, async programming.",
    teacherName: "Michael Chen",
    teacherPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop",
    courseImage:
      JavaScriptPic,
    rating: 4.8,
    price: 79.99,
    students: 892,
    duration: "8h 15m",
    level: "Advanced",
  },
  {
    id: 3,
    name: "Node.js Fundamentals",
    description: "Build server-side applications with Node.js and Express. Learn about REST APIs.",
    teacherName: "Emily Rodriguez",
    teacherPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop",
    courseImage:
      NodePic,
    rating: 4.2,
    price: 59.99,
    students: 756,
    duration: "7h 45m",
    level: "Intermediate",
  },
  {
    id: 4,
    name: "Vue.js for Beginners",
    description: "Start your journey with Vue.js 3 and learn to build modern web applications.",
    teacherName: "David Kim",
    teacherPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop",
    courseImage:
      VuePic,
    rating: 4.6,
    price: 54.99,
    students: 645,
    duration: "6h 00m",
    level: "Beginner",
  },
  {
    id: 5,
    name: "Python Data Science",
    description: "Master data analysis, visualization, and machine learning with Python.",
    teacherName: "Lisa Wang",
    teacherPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop",
    courseImage:
      PythonPic,
    rating: 4.9,
    price: 89.99,
    students: 1567,
    duration: "10h 30m",
    level: "Advanced",
  },
  {
    id: 6,
    name: "UI/UX Design Principles",
    description: "Learn modern design principles and create beautiful user interfaces.",
    teacherName: "Alex Thompson",
    teacherPhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&auto=format&fit=crop",
    courseImage:
      UiuxPic,
    rating: 4.7,
    price: 69.99,
    students: 923,
    duration: "8h 45m",
    level: "Intermediate",
  },
]

const Courses = () => {
  return (
    <div className="dashboard-layout">
      
      {/* Main Content */}
      <main className="main-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-left">
            <div className="search-container">
              <Search className="search-icon" />
              <input type="text" placeholder="Search courses..." className="search-input" />
            </div>
          </div>
        </nav>

        {/* Courses Content */}
        <div className="view-courses-container">
          <div className="courses-header">
            <h1>Available Courses</h1>
            <div className="courses-filters">
              <select className="filter-select">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <select className="filter-select">
                <option>All Categories</option>
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Design</option>
              </select>
              <select className="filter-select">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>
          </div>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Courses

