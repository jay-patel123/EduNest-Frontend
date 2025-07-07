import React from "react"
import "../assets/styles/TestimonialsSection.css"

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "EduNest helped me ace my exams.",
      author: "John D.",
      role: "Computer Science Student",
    },
    {
      quote: "EduNest is such a game-changer!",
      author: "Emily R.",
      role: "History Major",
    },
    {
      quote: "Meditation is the key to my academic learning.",
      author: "Sarah T.",
      role: "English Literature Student",
    },
    {
      quote: "Anxiety and stress no longer affect my learning.",
      author: "Alex P.",
      role: "Business Administration Student",
    },
  ]

  return (
    <section className="testimonials">
      <h3>Join EduNest community and connect with millions of learners</h3>
      <div className="testimonials-list">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <div className="quote">{testimonial.quote}</div>
            <div className="author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <div className="author-name">{testimonial.author}</div>
                <div className="author-role">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection

