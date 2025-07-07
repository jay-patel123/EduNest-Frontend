import React from "react"
import "./label.css"

export const Label = React.forwardRef(({ className = "", ...props }, ref) => {
  return <label ref={ref} className={`label ${className}`} {...props} />
})

