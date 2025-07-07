import React from "react"
import "./button.css"

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button ref={ref} className={`button ${variant} ${size} ${className}`} {...props}>
        {children}
      </button>
    )
  },
)

