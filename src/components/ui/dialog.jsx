import React from "react"
import { X } from "lucide-react"
import "./dialog.css"

export const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false)
    }
  }

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export const DialogTrigger = ({ children, onClick }) => {
  return (
    <div className="dialog-trigger" onClick={onClick}>
      {children}
    </div>
  )
}

export const DialogContent = React.forwardRef(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={`dialog-content-wrapper ${className}`} {...props}>
      {children}
    </div>
  )
})
DialogContent.displayName = "DialogContent"

export const DialogHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`dialog-header ${className}`} {...props}>
      {children}
    </div>
  )
}

export const DialogTitle = ({ children, className = "", ...props }) => {
  return (
    <h2 className={`dialog-title ${className}`} {...props}>
      {children}
    </h2>
  )
}

export const DialogDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`dialog-description ${className}`} {...props}>
      {children}
    </p>
  )
}

export const DialogFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`dialog-footer ${className}`} {...props}>
      {children}
    </div>
  )
}

export const DialogClose = ({ children, onClick, className = "", ...props }) => {
  return (
    <button className={`dialog-close ${className}`} onClick={onClick} {...props}>
      {children || <X className="w-4 h-4" />}
    </button>
  )
}

