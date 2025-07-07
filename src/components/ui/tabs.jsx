// src/components/ui/tabs.jsx
import { createContext, useContext, useState } from "react"
import "./tabs.css"

const TabsContext = createContext(null)

export const Tabs = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children }) => {
  return <div className="tabs-list">{children}</div>
}

export const TabsTrigger = ({ value, children }) => {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  
  return (
    <button
      className={`tabs-trigger ${value === selectedValue ? "active" : ""}`}
      onClick={() => onValueChange(value)}
      type="button"
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children }) => {
  const { value: selectedValue } = useContext(TabsContext)
  
  if (value !== selectedValue) return null
  
  return <div className="tabs-content">{children}</div>
}