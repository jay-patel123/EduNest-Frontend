"use client"

import { useState } from "react"
import { Upload, Plus, Minus, Type, ImageIcon, Video, LinkIcon, ArrowLeft, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { useNavigate } from "react-router-dom"
import api, { uploadFile } from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/CourseCreation.css"

const CourseCreation = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
    modules: [
      {
        title: "",
        price: "",
        prerequisites: [],
        content: [],
        savedContent: [], // To store content that has been saved to the API
      },
    ],
  })

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

  const addContent = async () => {
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
        contentData.append("mediaFile", contentFormData.file)
      } else {
        alert("Please fill in all required fields for this content type")
        setLoading(false)
        return
      }

      // Create content via API using the uploadFile function
      const contentResponse = await uploadFile("/content/create", contentData)
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

  const handleSubmit = async () => {
    try {
      if (!courseData.title || !courseData.description) {
        alert("Please enter a title and description for the course")
        return
      }

      // Validate modules
      for (const module of courseData.modules) {
        if (!module.title || !module.price) {
          alert("Please enter a title and price for all modules")
          return
        }
        if (module.content.length === 0) {
          alert("Please add at least one content item to each module")
          return
        }
      }

      setSubmitting(true)
      setError(null)

      // First, create all modules
      const moduleIds = []
      for (const module of courseData.modules) {
        const moduleData = {
          title: module.title,
          price: Number(module.price),
          prerequisites: module.prerequisites,
          content: module.content,
        }

        try {
          console.log("Creating module:", moduleData)
          const moduleResponse = await api.post("/module/create", moduleData)
          console.log("Module created:", moduleResponse)
          moduleIds.push(moduleResponse.module._id)
        } catch (error) {
          console.error("Error creating module:", error)
          throw new Error(`Failed to create module "${module.title}": ${error.message}`)
        }
      }

      // Then create the course with the module IDs
      const courseFormData = {
        title: courseData.title,
        description: courseData.description,
        modules: moduleIds,
        level: courseData.level,
      }

      // If there's a thumbnail, upload it separately
      if (courseData.thumbnail) {
        const thumbnailFormData = new FormData()
        thumbnailFormData.append("thumbnail", courseData.thumbnail)

        try {
          // This endpoint might need to be adjusted based on your API
          const thumbnailResponse = await uploadFile("/course/upload-thumbnail", thumbnailFormData)
          courseFormData.thumbnail = thumbnailResponse.thumbnailUrl
        } catch (error) {
          console.error("Error uploading thumbnail:", error)
          // Continue with course creation even if thumbnail upload fails
        }
      }

      console.log("Creating course:", courseFormData)
      const courseResponse = await api.post("/course/create", courseFormData)
      console.log("Course created:", courseResponse)

      alert("Course created successfully!")
      navigate(-1)
    } catch (error) {
      console.error("Error creating course:", error)
      setError(`Failed to create course: ${error.message}`)
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
          <h1>Create New Course</h1>
          <Button className="save-course-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating Course..." : "Create Course"}
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
            <Card key={moduleIndex} className="module-card">
              <CardContent>
                <div className="module-header">
                  <h3>Module {moduleIndex + 1}</h3>
                  {courseData.modules.length > 1 && (
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
                <Button onClick={addContent}>Add Content</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}

export default CourseCreation

