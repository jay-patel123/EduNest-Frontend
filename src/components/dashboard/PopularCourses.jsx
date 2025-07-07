import React, { useEffect, useState } from "react";
import { ChevronRight, Users } from "lucide-react";
import api from "../../utils/api";
import './PopularCourses.css';
import { Button } from "../ui/button"
import { Link, useNavigate } from "react-router-dom"

const PopularCourses = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching trending courses...");
        
        const response = await api.get("/student/trending-course"); // Ensure correct route
        console.log("API Response:", response);

        if (response.courses) {
          const formattedCourses = response.courses.map((course) => ({
            name: course.title,
            students: course.totalSell,
            lastMonthSell: course.lastMonthSell,
          }));

          setCourses(formattedCourses);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Popular Courses</h3>
        <Button variant="ghost" onClick={() => navigate("/view-courses")}>
            View All Course
          </Button>
      </div>
      <div className="courses-list">
        {loading ? (
          <p>Loading popular courses...</p>
        ) : courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className="popular-course-item">
              <div className="popular-course-info">
                <h4>{course.name}</h4>
                <div className="student-count">
                  <Users size={14} />
                  <span>{course.students} students</span>
                </div>
              </div>
              <button className="course-arrow">
                <ChevronRight size={20} />
              </button>
            </div>
          ))
        ) : (
          <p>No popular courses found.</p>
        )}
      </div>
    </div>
  );
};

export default PopularCourses;

