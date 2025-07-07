import { Link } from "react-router-dom"

import CourseCard from "../components/CourseCard"
import "../assets/styles/ViewCourses.css"
import Reactpic from "../assets/images/React-pic.jpg";
import UiuxPic from "../assets/images/uiux-pic.jpg";
import VuePic from "../assets/images/viu-pic.jpg";
import PythonPic from "../assets/images/python-pic.jpg";
import NodePic from "../assets/images/node-pic.jpg";
import JavaScriptPic from "../assets/images/javascript-pic.jpg";


const courses = [ ]

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

