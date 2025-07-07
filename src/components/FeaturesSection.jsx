import React from "react"
import "../assets/styles/FeaturesSection.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faBed, faChartLine } from "@fortawesome/free-solid-svg-icons"

const FeaturesSection = () => {
  const features = [
    {
      icon: faMagnifyingGlass,
      title: "Find your perfect course",
      description: "Unlock inner happiness and embrace a positive state of mind.",
    },
    {
      icon: faBed,
      title: "Better Sleep for Better Grades",
      description: "Drift into deep, rejuvenating sleep and wake up ready to learn.",
    },
    {
      icon: faChartLine,
      title: "Less Stress, More Success",
      description: "Achieve your full potential with CourseHub's stress management tools.",
    },
  ]

  return (
    <section className="features-section">
      <div className="features-list">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection

