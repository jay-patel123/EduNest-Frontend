import React from "react"
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom"
import "./index.css" // Global styles
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignUpPage"
import StudentDashboard from "./pages/StudentDashboard"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ViewCourses from "./pages/ViewCourses"
import ProfilePage from "./pages/ProfilePage"
import ModuleSelectionPage from "./pages/ModuleSelectionPage"
import ModuleContentPage from "./pages/ModuleContentPage"
import EditProfilePage from "./pages/EditProfilePage"
import MyCourses from "./pages/MyCourses"
import PaymentHistory from "./pages/PaymentHistory"
import QuizResults from "./pages/QuizResults"
import QuizReview from "./pages/QuizReview"
import LeaderBoard from "./pages/LeaderBoard"
import MyPoints from "./pages/MyPoints"
import TeacherDashboard from "./pages/TeacherDashboard"
import TeacherProfile from "./pages/TeacherProfile"
import EarningsHistory from "./pages/EarningsHistory"
import CourseManagement from "./pages/CourseManagement"
import CourseCreation from "./pages/CourseCreation"
import EditCourse from "./pages/EditCourse"
import StudentEnrollments from "./pages/StudentEnrollments"
import ModulePayment from "./pages/ModulePayment"
import QuizList from "./pages/QuizList"
import TakeQuiz from "./pages/TakeQuiz"
import UpdateTeacherProfile from "./pages/UpdateTeacherProfile"
import Courses from "./pages/Courses"
import OTPVerificationPage from "./pages/OTPVerificationPage"

// Admin imports
import AdminDashboard from "./pages/admin/AdminDashboard"
import TeacherManagement from "./pages/admin/TeacherManagement"
import StudentManagement from "./pages/admin/StudentManagement"
import CourseInventory from "./pages/admin/CourseInventory"
import OffersManagement from "./pages/admin/OffersManagement"
import PaymentManagement from "./pages/admin/PaymentManagement"
import QuizManagement from "./pages/admin/QuizManagement"
import TeacherSalary from "./pages/admin/TeacherSalary"
import AdminProfile from "./pages/admin/AdminProfile"
import UpdateAdminProfile from "./pages/admin/UpdateAdminProfile"

import Features from "./pages/Features"
import Benefits from "./pages/Benefits"
import Offers from "./pages/Offers"
import MakePayment from "./pages/admin/MakePayment"
import CoursePayment from "./pages/CoursePayment"
import CreditRewardPoints from "./pages/admin/CreditRewardPoints"


const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  if (!token) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}

const App = () => {
  return (
    <Router>
      <div className="app-container">
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route
          path="/student-dashboard"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
          {/* <Route path="/dashboard" element={<StudentDashboard />} /> */}
          <Route path="/view-courses" element={<PrivateRoute allowedRoles={["student"]}>
              <ViewCourses />
            </PrivateRoute>} />
          <Route path="/my-courses/:studentId" element={<MyCourses />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/course/:courseId/modules" element={<ModuleSelectionPage />} />
          <Route path="/module/:moduleId" element={<ModuleContentPage />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/attempted-quiz" element={<QuizResults />} />
          <Route path="/quiz-review/:quizId" element={<QuizReview />} /> {/* New route for quiz review */}
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/my-points" element={<MyPoints />} />
          <Route path="/module/:moduleId/payment" element={<ModulePayment />} />
          <Route path="/course-payment" element={<CoursePayment />} />
          {/* Teacher Routes */}
          <Route
          path="/teacher-dashboard"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
          {/* <Route path="/teacher" element={<TeacherDashboard />} /> */}
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/edit-profile" element={<UpdateTeacherProfile />} />
          <Route path="/teacher/earnings" element={<EarningsHistory />} />
          <Route path="/teacher/courses/:teacherId" element={<CourseManagement />} />
          <Route path="/teacher/create-course" element={<CourseCreation />} />
          <Route path="/teacher/edit-course/:id" element={<EditCourse />} />
          <Route path="/teacher/students" element={<StudentEnrollments />} />
          

           {/* Quiz Routes */}
           <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<TakeQuiz />} />

           {/* Admin Routes */}
           <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
           <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/teachers" element={<TeacherManagement />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/courses" element={<CourseInventory />} />
          <Route path="/admin/offers" element={<OffersManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/quizzes" element={<QuizManagement />} />
          <Route path="/admin/teacher-salary" element={<TeacherSalary />} />
          <Route path="/admin/make-payment" element={<MakePayment/>} />
          <Route path="/admin/profile" element={<AdminProfile/>}/>
          <Route path="/admin/update-profile" element={<UpdateAdminProfile/>} />
          <Route path="/admin/credit-points" element={<CreditRewardPoints/>} />

          <Route path="/features" element={<Features />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/offers" element={<Offers />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

