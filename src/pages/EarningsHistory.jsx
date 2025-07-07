 
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { DollarSign, Wallet, ArrowLeft } from "lucide-react"
import api from "../utils/api"
import Loader from "../components/Loader"
import { Button } from "../components/ui/button"
import "../assets/styles/EarningsHistory.css"
import { useNavigate } from "react-router-dom"

const EarningsHistory = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    currentBalance: 0,
    historyIncome: [],
    historySalary: [],
  })

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true)

        // Check authentication
        // if (!api.isAuthenticated()) {
        //   navigate("/login", {
        //     state: {
        //       from: "/teacher/profile",
        //       message: "Please log in to view your earnings",
        //     },
        //   })
        //   return
        // }

        // Fetch teacher earnings data
        console.log("Fetching teacher earnings...")
        const response = await api.get("/teacher/profile")
        console.log("Earnings response:", response)

        if (!response) {
          throw new Error("Failed to fetch earnings data")
        }

        // Process the earnings data
        setEarnings({
          totalEarnings: response.totalEarning || 0,
          currentBalance: response.balance || 0,
          historyIncome: Array.isArray(response.historyIncome)
            ? response.historyIncome.map((item) => ({
                reason: item.reason || "Course Purchase",
                date: item.date || new Date().toISOString(),
                income: item.income || 0,
              }))
            : [],
          historySalary: Array.isArray(response.historySalary)
            ? response.historySalary.map((item) => ({
                reason: item.reason || "Monthly Salary",
                date: item.date || new Date().toISOString(),
                salary: item.salary || 0,
              }))
            : [],
        })
      } catch (error) {
        console.error("Error fetching earnings:", error)
        setError("Failed to load earnings data. Please try again.")

        // Only use mock data if there's an error
        setEarnings({
          totalEarnings: 0,
          currentBalance: 0,
          historyIncome: [],
          historySalary: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [navigate])

  if (loading) {
    return (
      
        <Loader />
      
    )
  }

  return (
  
      <div className="earnings-history-container">
        <Button variant="ghost" onClick={() => navigate("/teacher-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <br />
        <br />
        <h1>Earnings History</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          <Card>
            <CardContent>
              <div className="stat-content">
                <div className="stat-icon">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Earnings</p>
                  <h3 className="stat-value">₹{earnings.totalEarnings.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="stat-content">
                <div className="stat-icon">
                  <Wallet className="h-6 w-6" />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Current Balance</p>
                  <h3 className="stat-value">₹{earnings.currentBalance.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="income" className="history-tabs">
          <TabsList>
            <TabsTrigger value="income">Income History</TabsTrigger>
            <TabsTrigger value="salary">Salary History</TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="history-list">
                  {earnings.historyIncome.length > 0 ? (
                    earnings.historyIncome.map((item, index) => (
                      <div key={index} className="history-item">
                        <div className="history-info">
                          <p className="history-reason">{item.reason}</p>
                          <span className="history-date">{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="history-amount income">+${item.income.toFixed(2)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-history">No income history available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary">
            <Card>
              <CardHeader>
                <CardTitle>Salary History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="history-list">
                  {earnings.historySalary.length > 0 ? (
                    earnings.historySalary.map((item, index) => (
                      <div key={index} className="history-item">
                        <div className="history-info">
                          <p className="history-reason">{item.reason}</p>
                          <span className="history-date">{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="history-amount salary">${item.salary.toFixed(2)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-history">No salary history available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    
  )
}

export default EarningsHistory

