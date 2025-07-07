import React from "react"
import { ChevronDown } from "lucide-react"
import "./select.css"

export const Select = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div className={`select-wrapper ${className}`}>
      <select ref={ref} className="select-input" {...props}>
        {children}
      </select>
      <ChevronDown className="select-icon" />
    </div>
  )
})

export const SelectOption = ({ children, ...props }) => {
  return <option {...props}>{children}</option>
}

// Add missing exports for shadcn/ui style components
export const SelectTrigger = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={`select-trigger ${className}`} {...props}>
    {children}
    <ChevronDown className="select-trigger-icon" />
  </div>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <span ref={ref} className={`select-value ${className}`} {...props}>
    {children}
  </span>
))
SelectValue.displayName = "SelectValue"

export const SelectContent = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={`select-content ${className}`} {...props}>
    {children}
  </div>
))
SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div ref={ref} className={`select-item ${className}`} {...props}>
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

