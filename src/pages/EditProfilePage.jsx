// "use client"

// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { Mail, Phone, MapPin, Camera, Save, X } from "lucide-react"
// import "../assets/styles/EditProfilePage.css"

// const EditProfilePage = () => {
//   const [formData, setFormData] = useState({
//     name: "Emily Johnson",
//     email: "emily.johnson@example.com",
//     phone: "+1 (555) 123-4567",
//     location: "New York, NY",
//     bio: "Passionate about web development and always eager to learn new technologies. Currently focusing on mastering React and Node.js.",
//     skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
//   })

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Handle form submission
//     console.log("Form submitted:", formData)
//   }

//   return (
//     <div className="edit-profile-container">
//       <div className="edit-profile-header">
//         <h1>Edit Profile</h1>
//         <div className="header-actions">
//           <Link to="/profile" className="cancel-btn">
//             <X size={16} />
//             Cancel
//           </Link>
//           <button type="submit" form="edit-profile-form" className="save-btn">
//             <Save size={16} />
//             Save Changes
//           </button>
//         </div>
//       </div>

//       <form id="edit-profile-form" className="edit-profile-form" onSubmit={handleSubmit}>
//         <div className="form-photo-section">
//           <div className="profile-photo-wrapper">
//             <img
//               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=60"
//               alt="Profile"
//               className="profile-photo"
//             />
//             <button type="button" className="change-photo-btn">
//               <Camera size={16} />
//             </button>
//           </div>
//           <p className="photo-hint">Click the camera icon to change your photo</p>
//         </div>

//         <div className="form-sections">
//           <section className="form-section">
//             <h3>Basic Information</h3>
//             <div className="form-group">
//               <label htmlFor="name">Full Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="bio">Bio</label>
//               <textarea
//                 id="bio"
//                 value={formData.bio}
//                 onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//                 rows={4}
//               />
//             </div>
//           </section>

//           <section className="form-section">
//             <h3>Contact Information</h3>
//             <div className="form-group">
//               <label htmlFor="email">
//                 <Mail size={16} />
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="phone">
//                 <Phone size={16} />
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="location">
//                 <MapPin size={16} />
//                 Location
//               </label>
//               <input
//                 type="text"
//                 id="location"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//               />
//             </div>
//           </section>

//           <section className="form-section">
//             <h3>Skills</h3>
//             <div className="form-group">
//               <label htmlFor="skills">Skills (comma-separated)</label>
//               <input
//                 type="text"
//                 id="skills"
//                 value={formData.skills.join(", ")}
//                 onChange={(e) =>
//                   setFormData({ ...formData, skills: e.target.value.split(",").map((skill) => skill.trim()) })
//                 }
//               />
//             </div>
//           </section>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EditProfilePage

"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Phone, MapPin, Camera, Save, X, ArrowLeft } from "lucide-react"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/EditProfilePage.css"
import { Button } from "../components/ui/button"

const EditProfilePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    location: "",
    about: "",
    skills: [],
  })
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await api.get("/student/profile")

        setFormData({
          name: data.name || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
          location: data.location || "",
          about: data.about || "",
          skills: data.skills || [],
        })

        if (data.profilepicURL) {
          setProfileImage(data.profilepicURL)
        }
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
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "")
    setFormData({
      ...formData,
      skills: skillsArray,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a local URL for preview
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)

      // You would typically store the file itself to send to the server later
      setFormData({
        ...formData,
        profilePicFile: file,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      // Prepare data for API
      const updateData = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        about: formData.about,
        skills: formData.skills,
      }

      // If there's a new profile picture, handle the upload here
      if (formData.profilePicFile) {
        const formDataWithImage = new FormData()
        formDataWithImage.append("profilePic", formData.profilePicFile)

        // First upload the profile picture
        try {
          const uploadResponse = await api.uploadFile("/student/upload-profile-pic", formDataWithImage)
          console.log("Profile picture uploaded:", uploadResponse)
          // You might want to update the profile picture URL in updateData here
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError)
          // Continue with profile update even if image upload fails
        }
      }

      // Update profile
      await api.put("/student/profile", updateData)

      // Redirect to profile page after successful update
      navigate("/profile")
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
    
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Profile
          </Button>
          <h1>Edit Profile</h1>
          <div className="header-actions">
            <Link to="/profile" className="cancel-btn">
              <X size={16} />
              Cancel
            </Link>
            <button type="submit" form="edit-profile-form" className="save-btn" disabled={submitting}>
              <Save size={16} />
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form id="edit-profile-form" className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="form-photo-section">
            <div className="profile-photo-wrapper">
              <img
                src={profileImage || "/placeholder.svg?height=400&width=400"}
                alt="Profile"
                className="profile-photo"
              />
              <label htmlFor="profile-photo-upload" className="change-photo-btn">
                <Camera size={16} />
              </label>
              <input
                type="file"
                id="profile-photo-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <p className="photo-hint">Click the camera icon to change your photo</p>
          </div>

          <div className="form-sections">
            <section className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="about">Bio</label>
                <textarea id="about" name="about" value={formData.about} onChange={handleInputChange} rows={4} />
              </div>
            </section>

            <section className="form-section">
              <h3>Contact Information</h3>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">
                  <Phone size={16} />
                  Phone
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </section>

            <section className="form-section">
              <h3>Skills</h3>
              <div className="form-group">
                <label htmlFor="skills">Skills (comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                />
              </div>
            </section>
          </div>
        </form>
      </div>
    
  )
}

export default EditProfilePage

