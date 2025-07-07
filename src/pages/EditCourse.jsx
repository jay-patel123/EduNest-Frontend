"use client"

import { useState, useEffect } from "react"
import { Upload, Plus, Minus, Type, ImageIcon, Video, LinkIcon, ArrowLeft, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { useNavigate, useParams } from "react-router-dom"
import api, { getAuthToken } from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/CourseCreation.css"

const EditCourse = () => {
  const navigate = useNavigate()
  const { id: courseId } = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showContentForm, setShowContentForm] = useState(false)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null)
  const [contentFormData, setContentFormData] = useState({
    type: "text",
    header: "",
    text: "",
    link: "",
    file: null,
  })

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    level: "beginner",
    thumbnail: null,
    thumbnailUrl: "",
    modules: [],
  })

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        console.log("Fetching course data for ID:", courseId)

        // Validate courseId before making the request
        if (!courseId) {
          throw new Error("Course ID is missing or invalid")
        }

        // Fetch course details
        const course = await api.get(`/course/${courseId}/`)
        console.log("Course data:", course)

        if (!course || !course._id) {
          throw new Error("Course not found or you don't have permission to edit it")
        }

        // Extract module IDs properly from the course data
        let moduleIds = []
        if (Array.isArray(course.modules)) {
          // Extract IDs from module objects or use the IDs directly if they're strings
          moduleIds = course.modules
            .map((module) => {
              // If module is an object with _id property, return the _id
              if (module && typeof module === "object" && module._id) {
                return module._id
              }
              // If module is already a string ID, return it directly
              else if (typeof module === "string") {
                return module
              }
              // Otherwise, convert to string (fallback)
              return String(module)
            })
            .filter((id) => id) // Filter out any undefined or empty values
        }

        console.log("Module IDs to fetch:", moduleIds)

        // Fetch detailed module data for each module ID
        const modulePromises = moduleIds.map((moduleId) =>
          api.get(`/module/${moduleId}`).catch((err) => {
            console.error(`Error fetching module ${moduleId}:`, err)
            // Return a minimal module object on error
            return {
              _id: moduleId,
              title: "Failed to load module",
              price: 0,
              prerequisites: [],
              content: [],
            }
          }),
        )

        const moduleResponses = await Promise.all(modulePromises)
        console.log("Module responses:", moduleResponses)

        const detailedModules = moduleResponses.map((moduleData) => {
          // For each module, prepare the content preview data
          const savedContent = Array.isArray(moduleData.content)
            ? moduleData.content.map((contentId) => ({
                id: contentId,
                // In a real app, you might want to fetch content details here
                type: "text", // Default type
                header: "Content Item", // Default header
              }))
            : []

          return {
            id: moduleData._id,
            title: moduleData.title || "",
            price: moduleData.price || 0,
            prerequisites: moduleData.prerequisites || [],
            content: moduleData.content || [],
            savedContent,
            saved: true,
          }
        })

        setCourseData({
          title: course.title || "",
          description: course.description || "",
          level: course.level || "beginner",
          thumbnail: null, // File object will be null initially
          thumbnailUrl: course.thumbnail || "", // Store the URL separately
          modules: detailedModules,
        })
      } catch (error) {
        console.error("Error fetching course:", error)
        setError("Failed to load course data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailUrl: URL.createObjectURL(file), // Update the preview URL
      }))
    }
  }

  const addModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: "",
          price: "",
          prerequisites: [],
          content: [],
          savedContent: [],
        },
      ],
    }))
  }

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...courseData.modules]
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value,
    }
    setCourseData((prev) => ({
      ...prev,
      modules: updatedModules,
    }))
  }

  const handlePrerequisitesChange = (index, value) => {
    const prerequisites = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
    const updatedModules = [...courseData.modules]
    updatedModules[index].prerequisites = prerequisites
    setCourseData((prev) => ({
      ...prev,
      modules: updatedModules,
    }))
  }

  const openContentForm = (moduleIndex) => {
    setCurrentModuleIndex(moduleIndex)
    setContentFormData({
      type: "text",
      header: "",
      text: "",
      link: "",
      file: null,
    })
    setShowContentForm(true)
  }

  const closeContentForm = () => {
    setShowContentForm(false)
    setCurrentModuleIndex(null)
  }

  const handleContentFormChange = (e) => {
    const { name, value, files } = e.target

    if (name === "file" && files && files[0]) {
      setContentFormData((prev) => ({
        ...prev,
        file: files[0],
      }))
    } else {
      setContentFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const saveContent = async () => {
    if (!contentFormData.header) {
      alert("Please enter a header for the content")
      return
    }

    try {
      setLoading(true)

      // Create content based on type
      const contentData = new FormData()
      contentData.append("type", contentFormData.type)
      contentData.append("header", contentFormData.header)

      if (contentFormData.type === "text" && contentFormData.text) {
        contentData.append("text", contentFormData.text)
      } else if (contentFormData.type === "link" && contentFormData.link) {
        contentData.append("link", contentFormData.link)
      } else if ((contentFormData.type === "image" || contentFormData.type === "video") && contentFormData.file) {
        contentData.append("file", contentFormData.file)
      } else {
        alert("Please fill in all required fields for this content type")
        setLoading(false)
        return
      }

      // Create content via API using the uploadFile function
      const contentResponse = await api.post("/content/create", contentData)
      console.log("Content created:", contentResponse)

      const newContentId = contentResponse.newContent._id
      const newContentPreview = {
        id: newContentId,
        type: contentFormData.type,
        header: contentFormData.header,
      }

      // Add content ID to module
      const updatedModules = [...courseData.modules]
      updatedModules[currentModuleIndex].content.push(newContentId)
      updatedModules[currentModuleIndex].savedContent.push(newContentPreview)

      setCourseData((prev) => ({
        ...prev,
        modules: updatedModules,
      }))

      // Close the form
      closeContentForm()
    } catch (error) {
      console.error("Error adding content:", error)
      setError("Failed to add content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const removeContent = (moduleIndex, contentIndex) => {
    const updatedModules = [...courseData.modules]
    updatedModules[moduleIndex].content.splice(contentIndex, 1)
    updatedModules[moduleIndex].savedContent.splice(contentIndex, 1)
    setCourseData((prev) => ({
      ...prev,
      modules: updatedModules,
    }))
  }

  const saveModule = async (moduleIndex) => {
    try {
      const module = courseData.modules[moduleIndex]

      if (!module.title || !module.price) {
        alert("Please enter a title and price for the module")
        return
      }

      setLoading(true)

      if (module.id) {
        // Update existing module
        const moduleData = {
          title: module.title,
          price: Number.parseFloat(module.price),
          prerequisites: module.prerequisites,
          content: module.content,
        }

        console.log("Updating module:", moduleData)
        await api.put(`/module/${module.id}`, moduleData)

        // Mark as saved
        const updatedModules = [...courseData.modules]
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          saved: true,
        }

        setCourseData((prev) => ({
          ...prev,
          modules: updatedModules,
        }))

        alert(`Module "${module.title}" updated successfully!`)
      } else {
        // Create new module
        const moduleData = {
          title: module.title,
          price: Number.parseFloat(module.price),
          prerequisites: module.prerequisites,
          content: module.content,
        }

        console.log("Creating new module:", moduleData)
        const response = await api.post("/module/create", moduleData)
        const moduleId = response.module._id

        // Update the module with the ID from the API
        const updatedModules = [...courseData.modules]
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          id: moduleId,
          saved: true,
        }

        setCourseData((prev) => ({
          ...prev,
          modules: updatedModules,
        }))

        // Add module to course
        await api.post(`/course/${courseId}/add-module`, {
          moduleId: moduleId,
        })

        alert(`Module "${module.title}" saved successfully!`)
      }
    } catch (error) {
      console.error("Error saving module:", error)
      setError("Failed to save module. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Custom function to update course with PUT method
  const updateCourseWithPut = async (formData) => {
    try {
      const token = getAuthToken()
      const url = `/course/${courseId}`
      console.log(`Updating course with PUT to ${url}`)

      console.log("Beforeeeer API call:******")
 

      // const response = await fetch(`${BASE_URL}/course/${courseId}`, {
      //   method: "PUT",
      //   headers: {
      //     Authorization: token || "",
      //     // Don't set Content-Type for FormData, the browser will handle it automatically
      //   },
      //   body: formData, // Assuming formData is a FormData object
      //   credentials: "include", // Include credentials for authentication
      //   mode: "cors", // Ensure cross-origin requests work
      // });

      const response = await api.put(`/course/${courseId}`, formData);


      console.log("AFter API call:******")
      console.log("Response:********"+response.message)
 
      if (!response.ok) {
    
        console.error(`HTTP error! status isssss: ${response.status}, body:`, response)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating course:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    try {
      if (!courseData.title || !courseData.description) {
        alert("Please enter a title and description for the course")
        return
      }

      // Check if all modules have been saved
      const unsavedModules = courseData.modules.filter((module) => !module.saved)
      if (unsavedModules.length > 0) {
        alert("Please save all modules before updating the course")
        return
      }

      setSubmitting(true)
      setError(null)

      // First update basic course info
      const formData = new FormData()
      formData.append("title", courseData.title)
      formData.append("description", courseData.description)
      formData.append("level", courseData.level)

      // Add thumbnail if a new one was selected
      if (courseData.thumbnail) {
        formData.append("thumbnail", courseData.thumbnail)
      }

      console.log("Updating course:", courseData.title)

      // Use PUT method for updating the course
      await updateCourseWithPut(formData)

      // Get current course modules
      const currentCourse = await api.get(`/course/${courseId}`)

      // Extract module IDs properly
      let currentModuleIds = []
      if (Array.isArray(currentCourse.modules)) {
        currentModuleIds = currentCourse.modules
          .map((module) => {
            if (module && typeof module === "object" && module._id) {
              return module._id
            } else if (typeof module === "string") {
              return module
            }
            return String(module)
          })
          .filter((id) => id)
      }

      // Get new module IDs
      const newModuleIds = courseData.modules.map((m) => m.id)

      // Remove modules that are no longer in the course
      for (const moduleId of currentModuleIds) {
        if (!newModuleIds.includes(moduleId)) {
          console.log("Removing module:", moduleId)
          await api.post(`/course/removemodule`, {
            courseId,
            moduleId,
          })
        }
      }

      // Add new modules
      for (const module of courseData.modules) {
        if (!currentModuleIds.includes(module.id)) {
          console.log("Adding module to course:", module.id)
          await api.post(`/course/addmodule`, {
            courseId,
            moduleId: module.id,
          })
        }
      }

      alert("Course updated successfully!")
      navigate("/teacher/courses")
    } catch (error) {
      console.error("Error updating course:", error)
      setError(`Failed to update course: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || submitting) {
    return (
      
        <Loader fullscreen/>
      
    )
  }

  return (
    
      <div className="course-creation-container">
        <div className="course-creation-header">
          <Button variant="ghost" onClick={() => navigate("/teacher-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back To Dashboard
          </Button>
          <h1>Edit Course</h1>
          <Button className="save-course-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Update Course"}
          </Button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <Card className="course-basics">
          <CardHeader>
            <CardTitle>Course Basics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Label htmlFor="title">Course Name</Label>
              <Input
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                placeholder="Enter course name"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="Describe your course"
                rows={4}
              />
            </div>

            <div className="form-group">
              <Label htmlFor="level">Course Level</Label>
              <select
                id="level"
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                className="select-input"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <Label>Course Thumbnail</Label>
              <div className="thumbnail-upload">
                {courseData.thumbnail ? (
                  <img
                    src={URL.createObjectURL(courseData.thumbnail) || "/placeholder.svg"}
                    alt="Course thumbnail"
                    className="thumbnail-preview"
                  />
                ) : courseData.thumbnailUrl ? (
                  <img
                    src={courseData.thumbnailUrl || "/placeholder.svg"}
                    alt="Course thumbnail"
                    className="thumbnail-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <Upload className="upload-icon" />
                    <span>Upload Thumbnail</span>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <Label htmlFor="thumbnail-upload" className="upload-button">
                  Choose File
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="modules-section">
          <h2>Course Modules</h2>
          {courseData.modules.map((module, moduleIndex) => (
            <Card key={moduleIndex} className={`module-card ${module.saved ? "module-saved" : ""}`}>
              <CardContent>
                <div className="module-header">
                  <h3>
                    Module {moduleIndex + 1} {module.saved && <span className="saved-badge">Saved</span>}
                  </h3>
                  {courseData.modules.length > 1 && !module.saved && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const updatedModules = courseData.modules.filter((_, i) => i !== moduleIndex)
                        setCourseData((prev) => ({
                          ...prev,
                          modules: updatedModules,
                        }))
                      }}
                    >
                      <Minus className="icon-sm" />
                      Remove Module
                    </Button>
                  )}
                </div>

                <div className="form-group">
                  <Label>Module Title</Label>
                  <Input
                    value={module.title}
                    onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
                    placeholder="Enter module title"
                  />
                </div>

                <div className="form-group">
                  <Label>Module Price ($)</Label>
                  <Input
                    type="number"
                    value={module.price}
                    onChange={(e) => handleModuleChange(moduleIndex, "price", e.target.value)}
                    placeholder="Enter module price"
                  />
                </div>

                <div className="form-group">
                  <Label>Prerequisites (comma-separated)</Label>
                  <Input
                    value={module.prerequisites.join(", ")}
                    onChange={(e) => handlePrerequisitesChange(moduleIndex, e.target.value)}
                    placeholder="E.g. Basic Programming, HTML knowledge"
                  />
                </div>

                <div className="content-section">
                  <div className="content-header">
                    <h4>Module Content</h4>
                    <Button variant="outline" size="sm" onClick={() => openContentForm(moduleIndex)}>
                      <Plus className="icon-sm" />
                      Add Content
                    </Button>
                  </div>

                  {module.savedContent && module.savedContent.length > 0 ? (
                    <div className="content-list">
                      {module.savedContent.map((content, contentIndex) => (
                        <div key={contentIndex} className="content-item">
                          <div className="content-info">
                            <div className="content-type-icon">
                              {content.type === "text" && <Type className="icon-sm" />}
                              {content.type === "image" && <ImageIcon className="icon-sm" />}
                              {content.type === "video" && <Video className="icon-sm" />}
                              {content.type === "link" && <LinkIcon className="icon-sm" />}
                            </div>
                            <span className="content-header-text">{content.header}</span>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeContent(moduleIndex, contentIndex)}
                          >
                            <Minus className="icon-sm" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-content">
                      <p>No content added yet. Click "Add Content" to add content to this module.</p>
                    </div>
                  )}
                </div>

                <Button className="save-module-btn" onClick={() => saveModule(moduleIndex)}>
                  {module.id ? "Update Module" : "Save Module"}
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button onClick={addModule} className="add-module-btn">
            <Plus className="icon-sm" />
            Add Module
          </Button>
        </div>

        {/* Content Form Modal */}
        {showContentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Content</h3>
                <Button variant="ghost" size="sm" onClick={closeContentForm} className="close-btn">
                  <X className="icon-sm" />
                </Button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <Label htmlFor="content-type">Content Type</Label>
                  <select
                    id="content-type"
                    name="type"
                    value={contentFormData.type}
                    onChange={handleContentFormChange}
                    className="select-input"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                  </select>
                </div>

                <div className="form-group">
                  <Label htmlFor="content-header">Header</Label>
                  <Input
                    id="content-header"
                    name="header"
                    value={contentFormData.header}
                    onChange={handleContentFormChange}
                    placeholder="Enter content header"
                  />
                </div>

                {contentFormData.type === "text" && (
                  <div className="form-group">
                    <Label htmlFor="content-text">Text Content</Label>
                    <Textarea
                      id="content-text"
                      name="text"
                      value={contentFormData.text}
                      onChange={handleContentFormChange}
                      placeholder="Enter text content"
                      rows={5}
                    />
                  </div>
                )}

                {contentFormData.type === "link" && (
                  <div className="form-group">
                    <Label htmlFor="content-link">Link URL</Label>
                    <Input
                      id="content-link"
                      name="link"
                      type="url"
                      value={contentFormData.link}
                      onChange={handleContentFormChange}
                      placeholder="Enter URL"
                    />
                  </div>
                )}

                {(contentFormData.type === "image" || contentFormData.type === "video") && (
                  <div className="form-group">
                    <Label htmlFor="content-file">Upload {contentFormData.type === "image" ? "Image" : "Video"}</Label>
                    <Input
                      id="content-file"
                      name="file"
                      type="file"
                      accept={contentFormData.type === "image" ? "image/*" : "video/*"}
                      onChange={handleContentFormChange}
                    />
                    {contentFormData.file && (
                      <div className="file-preview">
                        <span>{contentFormData.file.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <Button variant="outline" onClick={closeContentForm}>
                  Cancel
                </Button>
                <Button onClick={saveContent}>Save Content</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}

export default EditCourse

