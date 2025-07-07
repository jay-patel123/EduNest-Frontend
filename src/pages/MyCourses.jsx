"use client"

import { useState, useEffect } from "react";
import { Star, Users, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/MyCourses.css";
import { Button } from "../components/ui/button";
import api, { getAuthToken } from "../utils/api";
import Loader from "../components/Loader";

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const authToken = getAuthToken();

        const response = await api.get("/student/get-enrollment", {
          headers: { Authorization: authToken },
        });

        console.log("Enrolled courses response:", response);

        if (!response || !response.courses_enrolled) {
          throw new Error("Invalid response format");
        }

        const enrolledCoursesData = response.courses_enrolled;

        const detailedCourses = enrolledCoursesData.map((enrollment) => {
          const course = enrollment.courseId; // course details are directly available

          return {
            id: course._id,
            name: course.title || "Untitled Course",
            description: course.description || "No description available",
            teacherName: "Unknown Teacher", // Adjust this if `teacherId` contains teacher details
            teacherPhoto: "/placeholder.svg?height=50&width=50", // No teacher details available
            courseImage: course.thumbnail || "/placeholder.svg?height=200&width=300",
            progress: course.progress || 0,
            rating: course.avgRating || 4.5,
            students: course.totalSell || 0,
            duration: course.duration || "6h 30m",
            level: course.level || "Beginner",
            completedModules: enrollment.modules.length,
            totalModules: course.modules?.length || 0, // Use course.modules array length
          };
        });

        console.log("Detailed Courses:", detailedCourses);


        setEnrolledCourses(detailedCourses);
        // setEnrolledCourses(detailedCourses.filter((course) => course !== null));
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setError("Failed to load your courses. Please try again later.");
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [navigate]);

  const filteredCourses = enrolledCourses.filter((course) => {
    if (filter !== "all") {
      if (filter === "inProgress" && course.progress >= 100) return false;
      if (filter === "completed" && course.progress < 100) return false;
    }
    if (categoryFilter !== "all" && course.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="my-courses-container">
      <main className="main-content">
        <div className="courses-header">
          <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back To Dashboard
          </Button>
          <h1>My Courses</h1>
          <div className="courses-filters">
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Progress</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
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
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {filteredCourses.length === 0 ? (
          <div className="no-courses">
            <h2>You haven't enrolled in any courses yet</h2>
            <Button onClick={() => navigate("/view-courses")} className="browse-courses-btn">
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="courses-list">
            {filteredCourses.map((course) => (
              <div key={course.id} className="enrolled-course-card">
                <div className="course-thumbnail">
                  <img src={course.courseImage || "/placeholder.svg"} alt={course.name} />

                </div>
                <div className="course-details">
                  <div className="course-header">
                    <h2>{course.name}</h2>
                    <span className="level-badge">{course.level}</span>
                  </div>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <div className="meta-item">
                      <Star className="star-icon" size={16} />
                      <span>{course.rating}</span>
                    </div>
                    {/* <div className="meta-item">
                      <Users size={16} />
                      <span>{course.students} students</span>
                    </div> */}
                  </div>
                  <Button variant="ghost" onClick={() => navigate(`/course/${course.id}/modules`)}>
                    View Modules <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;


