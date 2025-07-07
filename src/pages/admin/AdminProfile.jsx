"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Phone, MapPin, Calendar, Edit, Shield, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import api, { getAuthToken } from "../../utils/api"
import Loader from "../../components/Loader"
import "../../assets/styles/admin/AdminProfile.css"

const AdminProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
    role: "",
    bio: "",
    permissions: [],
    recentActivities: [],
  })

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true)

        const AuthToken=getAuthToken();
        console.log("AuthToken is:  "+AuthToken)
        const response = await api.get("/admin/me", {
          headers: {
            Authorization: AuthToken,
          },
        });

        // Process the response data
        const adminData = response.admin

        console.log("response dattttttta:"+response.admin )

        setAdminInfo({
          name: adminData.name || "Admin User",
          email: adminData.email || "",
          phone: adminData.contactNumber || "",
          location: adminData.city || "Not specified",
          joinDate: adminData.createdAt
            ? new Date(adminData.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            : "January 2023",
          role: adminData.role || "Administrator",
          bio: adminData.bio || "No bio available",
          permissions: adminData.permissions || [
            "User Management",
            "Course Management",
            "Payment Management",
            "System Settings",
            "Reports & Analytics",
          ],
          recentActivities: adminData.recentActivities || [
            { action: "Updated system settings", time: "2 hours ago" },
            { action: "Approved new teacher account", time: "Yesterday" },
            { action: "Generated monthly report", time: "3 days ago" },
          ],
        })
      } catch (error) {
        console.error("Error fetching admin profile:", error)
        setError("Failed to load admin profile")

        // Fallback to default data if API fails
        setAdminInfo({
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "New York, NY",
          joinDate: "January 2022",
          role: "Super Admin",
          bio: "Experienced administrator with a passion for educational technology and improving learning experiences.",
          permissions: [
            "User Management",
            "Course Management",
            "Payment Management",
            "System Settings",
            "Reports & Analytics",
          ],
          recentActivities: [
            { action: "Updated system settings", time: "2 hours ago" },
            { action: "Approved new teacher account", time: "Yesterday" },
            { action: "Generated monthly report", time: "3 days ago" },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAdminProfile()
  }, [])

  if (loading) {
    return <Loader fullscreen/>
  }

  return (
    <div className="admin-profile-container">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Admin Profile</h1>
        <Link to="/admin/edit-profile">
          <Button className="edit-profile-btn">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-grid">
        <Card className="profile-card">
          <CardContent>
            <div className="profile-header">
              <div className="avatar-container">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&auto=format&fit=crop"
                  alt={adminInfo.name}
                  className="profile-avatar"
                />
              </div>
              <div className="profile-info">
                <h2>{adminInfo.name}</h2>
                <span className="role-badge">
                  <Shield className="w-4 h-4 mr-1" />
                  {adminInfo.role}
                </span>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <Mail className="icon" size={16} />
                <span>{adminInfo.email}</span>
              </div>
              <div className="contact-item">
                <Phone className="icon" size={16} />
                <span>{adminInfo.phone}</span>
              </div>
              <div className="contact-item">
                <MapPin className="icon" size={16} />
                <span>{adminInfo.location}</span>
              </div>
              <div className="contact-item">
                <Calendar className="icon" size={16} />
                <span>Joined {adminInfo.joinDate}</span>
              </div>
            </div>

            <div className="bio-section">
              <h3>Bio</h3>
              <p>{adminInfo.bio}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="permissions-card">
          <CardHeader>
            <CardTitle>
              <Shield className="w-5 h-5 mr-2" />
              Permissions & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="permissions-list">
              {adminInfo.permissions.map((permission, index) => (
                <li key={index} className="permission-item">
                  <span>{permission}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="activities-card">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="activities-list">
              {adminInfo.recentActivities.map((activity, index) => (
                <li key={index} className="activity-item">
                  <div className="activity-content">
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminProfile

