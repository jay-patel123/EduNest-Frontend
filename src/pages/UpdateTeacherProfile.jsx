"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, Save, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/UpdateTeacherProfile.css"

const UpdateTeacherProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    city: "",
    about: "",
    areas_of_expertise: [],
    profilePicFile: null,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await api.get("/teacher/profile")

        setFormData({
          name: data.name || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          city: data.city || "",
          about: data.about || "",
          areas_of_expertise: data.areas_of_expertise || [],
          profilepicURL: data.profilepicURL || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleExpertiseChange = (e) => {
    const expertise = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
    setFormData((prevData) => ({
      ...prevData,
      areas_of_expertise: expertise,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePicFile: file,
        // Create a temporary URL for preview
        profilepicURL: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      // Prepare data for API
      const updateData = {
        name: formData.name,
        contactNumber: formData.contactNumber,
        city: formData.city,
        about: formData.about,
        areas_of_expertise: formData.areas_of_expertise,
      }

      // If there's a new profile picture, handle the upload here
      if (formData.profilePicFile) {
        const formDataWithImage = new FormData()
        formDataWithImage.append("profilePic", formData.profilePicFile)

        // First upload the profile picture
        try {
          const uploadResponse = await api.uploadFile("/teacher/upload-profile-pic", formDataWithImage)
          console.log("Profile picture uploaded:", uploadResponse)
          // You might want to update the profile picture URL in updateData here
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError)
          // Continue with profile update even if image upload fails
        }
      }

      // Update profile
      await api.put("/teacher/profile", updateData)

      // Redirect to profile page after successful update
      navigate("/teacher/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      
        <Loader fullscreen/>
      
    )
  }

  return (
    
      <div className="update-profile-container">
        <div className="page-header">
          <Button variant="outline" onClick={() => navigate("/teacher/profile")} className="back-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Update Teacher Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="profile-preview">
                {formData.profilepicURL && (
                  <img
                    src={formData.profilepicURL || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="profile-image-preview"
                  />
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled // Email is typically not changeable
                />
              </div>

              <div className="form-group">
                <Label htmlFor="contactNumber">Phone</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="city">Location</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <Label htmlFor="about">Bio</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="areas_of_expertise">Areas of Expertise (comma-separated)</Label>
                <Input
                  id="areas_of_expertise"
                  name="areas_of_expertise"
                  value={formData.areas_of_expertise.join(", ")}
                  onChange={handleExpertiseChange}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <div className="file-input-wrapper">
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("profilePicture").click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Picture
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full submit-button" disabled={submitting}>
                <Save className="w-4 h-4 mr-2" />
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    
  )
}

export default UpdateTeacherProfile

