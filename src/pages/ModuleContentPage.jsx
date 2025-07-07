


// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { BookOpen, Video, FileText, Code, CheckCircle, ArrowLeft, LoaderIcon, LinkIcon } from "lucide-react"
// import { Button } from "../components/ui/button"
// import api from "../utils/api"
// import Loader from "../components/Loader"
// import "../assets/styles/ModuleContentPage.css"

// const ModuleContentPage = () => {
//   const { moduleId } = useParams()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [moduleContent, setModuleContent] = useState(null)
//   const [completingModule, setCompletingModule] = useState(false)

//   useEffect(() => {
//     const fetchModuleContent = async () => {
//       try {
//         setLoading(true)

       

//         console.log("Fetching module content for ID:", moduleId)

//         // Fetch module details
//         const moduleData = await api.get(`/module/${moduleId}`)
//         console.log("Module data:", moduleData.content)

//         if (!moduleData) {
//           throw new Error("Module not found")
//         }

//         const contentPromises = moduleData.content.map((content) =>
//           api.get(`/content/${content._id}`).catch((err) => {
//             console.error(`Error fetching content ${content._id}:`, err);
//             return null;
//           })
//         );

      

//         const contentResponses = await Promise.all(contentPromises)
//         console.log("Content responses:", contentResponses)

//         // Filter out null responses and map to sections
//         const sections = contentResponses
//           .filter((content) => content !== null)
//           .map((content, index) => {
//             // Extract content data based on the schema
//             const contentData = content.content || content

//             return {
//               id: index + 1,
//               title: contentData.header || `Section ${index + 1}`,
//               type: contentData.type || "text",
//               // Handle different content types according to schema
//               content:
//                 contentData.type === "text"
//                   ? contentData.text
//                   : contentData.type === "link"
//                     ? contentData.link
//                     : contentData.type === "image" || contentData.type === "video"
//                       ? contentData.mediaUrl
//                       : "",
//             }
//           })

//         setModuleContent({
//           id: moduleData._id,
//           name: moduleData.title || "Module Content",
//           prerequisites: moduleData.prerequisites || "No description available",
//           sections:
//             sections.length > 0
//               ? sections
//               : [
//                   // Fallback content if no sections are found
//                   {
//                     id: 1,
//                     title: "No content available",
//                     type: "text",
//                     content: "This module doesn't have any content yet. Please check back later.",
//                   },
//                 ],
//         })
//       } catch (error) {
//         console.error("Error fetching module content:", error)
//         setError("Failed to load module content. Please try again later.")

//         // Fallback to mock data
//         setModuleContent({
//           id: moduleId,
//           name: "Introduction to React Basics",
//           description: "Learn the fundamental concepts of React",
//           sections: [
//             {
//               id: 1,
//               title: "What is React?",
//               type: "text",
//               content: `React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Facebook and a community of individual developers and companies. React allows developers to create large web applications that can change data, without reloading the page. The main purpose of React is to be fast, scalable, and simple.

//               Key features of React include:
              
//               1. Virtual DOM for efficient updating of the user interface
//               2. JSX, a syntax extension that allows you to write HTML in your JavaScript
//               3. Component-based architecture for building encapsulated, reusable UI elements
//               4. Unidirectional data flow for more predictable state management`,
//             },
//             {
//               id: 2,
//               title: "Setting up your development environment",
//               type: "video",
//               content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//             },
//             {
//               id: 3,
//               title: "Creating your first React component",
//               type: "code",
//               content: `
//           import React from 'react';

//           function Welcome(props) {
//             return <h1>Hello, {props.name}</h1>;
//           }

//           export default Welcome;
//                   `,
//             },
//             {
//               id: 4,
//               title: "React Components Explained",
//               type: "image",
//               content: "https://miro.medium.com/max/1400/1*3s2LhxaWEL-K6Jq_CrLJbw.png",
//             },
//           ],
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchModuleContent()
//   }, [moduleId, navigate])

//   const handleCompleteModule = async () => {
//     try {
//       setCompletingModule(true)

//       // Call API to mark module as complete
//       // await api.post("/student/complete-module", {
//       //   moduleId,
//       // })

//       alert("Module marked as complete!congratulations!!!")

//       // Navigate back to course modules
//       navigate(-1)
//     } catch (error) {
//       console.error("Error completing module:", error)
//       alert("Failed to mark module as complete. Please try again.")
//     } finally {
//       setCompletingModule(false)
//     }
//   }

//   if (loading) {
//     return <Loader fullScreen />
//   }

//   if (error || !moduleContent) {
//     return (
//       <div className="error-container">
//         <h2>Error Loading Module</h2>
//         <p>{error || "Module not found"}</p>
//         <Button onClick={() => navigate(-1)}>Go Back</Button>
//       </div>
//     )
//   }

//   return (
//     <div className="module-content-container">
//       <Button variant="ghost" className="back-button" onClick={() => navigate(-1)}>
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back to Modules
//       </Button>

//       <h1 className="module-title">{moduleContent.name}</h1>
//       <p className="module-description"><b>Prerequisites : </b>{moduleContent.prerequisites}</p>

//       <div className="module-sections">
//         {moduleContent.sections.map((section) => (
//           <div key={section.id} className="section-card">
//             <h2 className="section-title">
//               {section.type === "text" && <BookOpen className="section-icon" />}
//               {section.type === "video" && <Video className="section-icon" />}
//               {section.type === "code" && <Code className="section-icon" />}
//               {section.type === "image" && <FileText className="section-icon" />}
//               {section.type === "link" && <LinkIcon className="section-icon" />}
//               {section.title}
//             </h2>
//             <div className="section-content">
//               {section.type === "text" && <p>{section.content}</p>}

//               {section.type === "video" && (
//                 <div className="video-container">
//                   {section.content && section.content.includes("youtube.com") ? (
//                     <iframe
//                       width="560"
//                       height="315"
//                       src={section.content}
//                       title={section.title}
//                       frameBorder="0"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                     ></iframe>
//                   ) : (
//                     <video
//                       controls
//                       className="video-player"
//                       src={section.content}
//                       poster="/placeholder.svg?height=400&width=600"
//                     >
//                       Your browser does not support the video tag.
//                     </video>
//                   )}
//                 </div>
//               )}

//               {section.type === "code" && (
//                 <pre className="code-block">
//                   <code>{section.content}</code>
//                 </pre>
//               )}

//               {section.type === "image" && (
//                 <img
//                   src={section.content || "/placeholder.svg?height=400&width=600"}
//                   alt={section.title}
//                   className="section-image"
//                   onError={(e) => {
//                     e.target.onerror = null
//                     e.target.src = "/placeholder.svg?height=400&width=600"
//                   }}
//                 />
//               )}

//               {section.type === "link" && (
//                 <div className="link-container">
//                   <a href={section.content} target="_blank" rel="noopener noreferrer" className="content-link">
//                     <LinkIcon className="link-icon" size={16} />
//                     {section.content}
//                   </a>
//                   <p className="link-description">Click the link above to access the resource</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="module-completion">
//         <button className="complete-button" onClick={handleCompleteModule} disabled={completingModule}>
//           {completingModule ? (
//             <>
//               <LoaderIcon className="animate-spin mr-2" size={16} />
//               Completing...
//             </>
//           ) : (
//             <>
//               <CheckCircle className="complete-icon" />
//               Mark as Complete
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ModuleContentPage



"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { BookOpen, Video, FileText, Code, CheckCircle, ArrowLeft, LoaderIcon, LinkIcon, Star } from "lucide-react"
import { Button } from "../components/ui/button"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/ModuleContentPage.css"

const ModuleContentPage = () => {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [moduleContent, setModuleContent] = useState(null)
  const [completingModule, setCompletingModule] = useState(false)
  const [courseId, setCourseId] = useState(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [canRate, setCanRate] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [existingRating, setExistingRating] = useState(null)
  const [existingComment, setExistingComment] = useState("")

  useEffect(() => {
    const fetchModuleContent = async () => {
      try {
        setLoading(true)

        console.log("Fetching module content for ID:", moduleId)

        // Fetch module details
        const moduleData = await api.get(`/module/${moduleId}`)
        console.log("Module data:", moduleData)

        if (!moduleData) {
          throw new Error("Module not found")
        }

        // Get the courseId from the URL or localStorage
        const urlParams = new URLSearchParams(window.location.search)
        const urlCourseId = urlParams.get("courseId")

        // Try to get courseId from URL or find it in localStorage
        let foundCourseId = urlCourseId

        if (!foundCourseId) {
          // Try to find the courseId from localStorage or other sources
          const userData = localStorage.getItem("userData")
          if (userData) {
            const parsedUserData = JSON.parse(userData)
            if (parsedUserData.courses_enrolled) {
              // Find the course that contains this module
              const enrolledCourse = parsedUserData.courses_enrolled.find(
                (course) => course.modules && course.modules.includes(moduleId),
              )
              if (enrolledCourse) {
                foundCourseId = enrolledCourse.courseId
              }
            }
          }
        }

        setCourseId(foundCourseId)

        // Check if the student can rate this module
        if (foundCourseId) {
          try {
            const ratingStatus = await api.get(`/ratings/can-rate/${moduleId}/${foundCourseId}`)
            console.log("Rating status:", ratingStatus)

            if (ratingStatus.canRate) {
              setCanRate(true)
              setHasRated(ratingStatus.hasRated)

              if (ratingStatus.hasRated && ratingStatus.rating) {
                setExistingRating(ratingStatus.rating)
                setExistingComment(ratingStatus.comment || "")
              }
            }
          } catch (ratingError) {
            console.error("Error checking rating status:", ratingError)
          }
        }

        const contentPromises = moduleData.content
          ? moduleData.content.map((content) =>
              api.get(`/content/${content._id}`).catch((err) => {
                console.error(`Error fetching content ${content._id}:`, err)
                return null
              }),
            )
          : []

        const contentResponses = await Promise.all(contentPromises)
        console.log("Content responses:", contentResponses)

        // Filter out null responses and map to sections
        const sections = contentResponses
          .filter((content) => content !== null)
          .map((content, index) => {
            // Extract content data based on the schema
            const contentData = content.content || content

            return {
              id: index + 1,
              title: contentData.header || `Section ${index + 1}`,
              type: contentData.type || "text",
              // Handle different content types according to schema
              content:
                contentData.type === "text"
                  ? contentData.text
                  : contentData.type === "link"
                    ? contentData.link
                    : contentData.type === "image" || contentData.type === "video"
                      ? contentData.mediaUrl
                      : "",
            }
          })

        setModuleContent({
          id: moduleData._id,
          name: moduleData.title || "Module Content",
          prerequisites: moduleData.prerequisites || "No description available",
          sections:
            sections.length > 0
              ? sections
              : [
                  // Fallback content if no sections are found
                  {
                    id: 1,
                    title: "No content available",
                    type: "text",
                    content: "This module doesn't have any content yet. Please check back later.",
                  },
                ],
        })
      } catch (error) {
        console.error("Error fetching module content:", error)
        setError("Failed to load module content. Please try again later.")

        // Fallback to mock data
        setModuleContent({
          id: moduleId,
          name: "Introduction to React Basics",
          description: "Learn the fundamental concepts of React",
          sections: [
            {
              id: 1,
              title: "What is React?",
              type: "text",
              content: `React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Facebook and a community of individual developers and companies. React allows developers to create large web applications that can change data, without reloading the page. The main purpose of React is to be fast, scalable, and simple.

              Key features of React include:
              
              1. Virtual DOM for efficient updating of the user interface
              2. JSX, a syntax extension that allows you to write HTML in your JavaScript
              3. Component-based architecture for building encapsulated, reusable UI elements
              4. Unidirectional data flow for more predictable state management`,
            },
            {
              id: 2,
              title: "Setting up your development environment",
              type: "video",
              content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            },
            {
              id: 3,
              title: "Creating your first React component",
              type: "code",
              content: `
          import React from 'react';

          function Welcome(props) {
            return <h1>Hello, {props.name}</h1>;
          }

          export default Welcome;
                  `,
            },
            {
              id: 4,
              title: "React Components Explained",
              type: "image",
              content: "https://miro.medium.com/max/1400/1*3s2LhxaWEL-K6Jq_CrLJbw.png",
            },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchModuleContent()
  }, [moduleId, navigate])

  const handleCompleteModule = async () => {
    try {
      setCompletingModule(true)

      // Call API to mark module as complete
      // await api.post("/student/complete-module", {
      //   moduleId,
      // })

      alert("Module marked as complete! Congratulations!!!")

      // Navigate back to course modules
      navigate(-1)
    } catch (error) {
      console.error("Error completing module:", error)
      alert("Failed to mark module as complete. Please try again.")
    } finally {
      setCompletingModule(false)
    }
  }

  const handleOpenRatingModal = () => {
    if (hasRated && existingRating) {
      setRating(existingRating)
      setComment(existingComment)
    }
    setShowRatingModal(true)
  }

  const handleCloseRatingModal = () => {
    setShowRatingModal(false)
  }

  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  const handleSubmitRating = async () => {
    if (!rating) {
      alert("Please select a rating")
      return
    }

    if (!courseId) {
      alert("Course information is missing")
      return
    }

    try {
      setCompletingModule(true)

      const response = await api.post("/ratings/rate", {
        moduleId,
        courseId,
        rating,
        comment,
      })

      console.log("Rating submitted:", response)

      setHasRated(true)
      setExistingRating(rating)
      setExistingComment(comment)
      setShowRatingModal(false)

      alert(hasRated ? "Rating updated successfully!" : "Thank you for your rating!")
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Failed to submit rating. Please try again.")
    } finally {
      setCompletingModule(false)
    }
  }

  if (loading) {
    return <Loader fullScreen />
  }

  if (error || !moduleContent) {
    return (
      <div className="error-container">
        <h2>Error Loading Module</h2>
        <p>{error || "Module not found"}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="module-content-container">
      <Button variant="ghost" className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Modules
      </Button>

      <h1 className="module-title">{moduleContent.name}</h1>
      <p className="module-description">
        <b>Prerequisites : </b>
        {moduleContent.prerequisites}
      </p>

      <div className="module-sections">
        {moduleContent.sections.map((section) => (
          <div key={section.id} className="section-card">
            <h2 className="section-title">
              {section.type === "text" && <BookOpen className="section-icon" />}
              {section.type === "video" && <Video className="section-icon" />}
              {section.type === "code" && <Code className="section-icon" />}
              {section.type === "image" && <FileText className="section-icon" />}
              {section.type === "link" && <LinkIcon className="section-icon" />}
              {section.title}
            </h2>
            <div className="section-content">
              {section.type === "text" && <p>{section.content}</p>}

              {section.type === "video" && (
                <div className="video-container">
                  {section.content && section.content.includes("youtube.com") ? (
                    <iframe
                      width="560"
                      height="315"
                      src={section.content}
                      title={section.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      controls
                      className="video-player"
                      src={section.content}
                      poster="/placeholder.svg?height=400&width=600"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {section.type === "code" && (
                <pre className="code-block">
                  <code>{section.content}</code>
                </pre>
              )}

              {section.type === "image" && (
                <img
                  src={section.content || "/placeholder.svg?height=400&width=600"}
                  alt={section.title}
                  className="section-image"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=400&width=600"
                  }}
                />
              )}

              {section.type === "link" && (
                <div className="link-container">
                  <a href={section.content} target="_blank" rel="noopener noreferrer" className="content-link">
                    <LinkIcon className="link-icon" size={16} />
                    {section.content}
                  </a>
                  <p className="link-description">Click the link above to access the resource</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="module-completion">
        {canRate ? (
          <button className="complete-button rating-button" onClick={handleOpenRatingModal} disabled={completingModule}>
            {completingModule ? (
              <>
                <LoaderIcon className="animate-spin mr-2" size={16} />
                Processing...
              </>
            ) : (
              <>
                <Star className="complete-icon" />
                {hasRated ? "Update Rating" : "Give Rating"}
              </>
            )}
          </button>
        ) : (
          <button className="complete-button" onClick={handleCompleteModule} disabled={completingModule}>
            {completingModule ? (
              <>
                <LoaderIcon className="animate-spin mr-2" size={16} />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="complete-icon" />
                Mark as Complete
              </>
            )}
          </button>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <div className="rating-modal-header">
              <h3>{hasRated ? "Update Your Rating" : "Rate This Module"}</h3>
              <button className="close-button" onClick={handleCloseRatingModal}>
                &times;
              </button>
            </div>
            <div className="rating-modal-body">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-button ${star <= rating ? "active" : ""}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    <Star className={`star-icon ${star <= rating ? "filled" : ""}`} />
                  </button>
                ))}
              </div>
              <p className="rating-text">
                {rating === 1
                  ? "Poor"
                  : rating === 2
                    ? "Fair"
                    : rating === 3
                      ? "Good"
                      : rating === 4
                        ? "Very Good"
                        : rating === 5
                          ? "Excellent"
                          : "Select a rating"}
              </p>
              <div className="comment-section">
                <label htmlFor="comment">Your feedback (optional):</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this module..."
                  maxLength={500}
                ></textarea>
                <p className="char-count">{comment.length}/500</p>
              </div>
            </div>
            <div className="rating-modal-footer">
              <button className="cancel-button" onClick={handleCloseRatingModal}>
                Cancel
              </button>
              <button className="submit-button" onClick={handleSubmitRating}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModuleContentPage


