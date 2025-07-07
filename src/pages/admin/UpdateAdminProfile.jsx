"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import "../../assets/styles/admin/UpdateAdminProfile.css"

const UpdateAdminProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Updated profile data:", formData)
    // Navigate back to the profile page
    navigate("/admin/profile")
  }

  return (
    <div className="update-admin-profile-container">
      <div className="page-header">
        <h1>Update Profile</h1>
        <Link to="/admin/profile">
          <Button variant="ghost" className="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="avatar-upload">
              <div className="current-avatar">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&auto=format&fit=crop"
                  alt="Current profile"
                />
              </div>
              <div className="upload-actions">
                <Button type="button" variant="outline" className="upload-btn">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Photo
                </Button>
                <p className="upload-hint">Recommended: Square image, at least 300x300px</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
              </div>

              <div className="form-group full-width">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
              </div>
            </div>

            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/profile")}>
                Cancel
              </Button>
              <Button type="submit" className="save-btn">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateAdminProfile

