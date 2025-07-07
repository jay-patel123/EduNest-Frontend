import React from "react"
import "./card.css"

export const Card = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card ${className}`} {...props} />
})

export const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card-header ${className}`} {...props} />
})

export const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => {
  return <h3 ref={ref} className={`card-title ${className}`} {...props} />
})

export const CardContent = React.forwardRef(({ className = "", ...props }, ref) => {
  return <div ref={ref} className={`card-content ${className}`} {...props} />
})

