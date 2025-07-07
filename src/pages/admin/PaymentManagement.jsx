 

"use client"

import { useState, useEffect } from "react"
import { Search, Plus, ArrowLeft, AlertCircle, RefreshCw, DollarSign, Users, History } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import Loader from "../../components/Loader"
import "../../assets/styles/admin/PaymentManagement.css"
import {getAuthToken} from "../../utils/api"

const PaymentManagement = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("teachers")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [teachers, setTeachers] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [totalPendingSalary, setTotalPendingSalary] = useState(0)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("success")
  const [paymentInProgress, setPaymentInProgress] = useState(false)
  const [adminToken, setAdminToken] = useState("")


  const BACKEND_URL = "https://edunest-backend-pc16.onrender.com/api/salary-payment"

  useEffect(() => {
    // Get admin token from localStorage
    const token = getAuthToken();
    console.log("Locall storeageee:"+token)
    if (token) {
      setAdminToken(token)
      console.log("admin token:"+adminToken)
    }

    fetchData()
    loadRazorpayScript()
  }, [])

  const loadRazorpayScript = () => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("referrerpolicy", "origin")

    script.onload = () => {
      console.log("Razorpay script loaded successfully")
    }

    script.onerror = (error) => {
      console.error("Failed to load Razorpay script:", error)
      showAlertMessage("Failed to load payment gateway. Please try again later.", "error")
    }

    document.body.appendChild(script)
  }

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch total pending salary and teachers data
      const pendingSalaryResponse = await fetchPendingSalaries()

      if (pendingSalaryResponse && pendingSalaryResponse.success) {
        setTotalPendingSalary(pendingSalaryResponse.totalPendingSalary || 0)

        // Transform teacher data to match our component's expected format
        const teachersData = pendingSalaryResponse.teachers.map((teacher) => ({
          _id: teacher._id ,
          name: teacher.name,
          email: teacher.email,
          balance: teacher.pendingSalary,
          accountNo: teacher.accountNo || null,
          ifscCode: teacher.ifscCode || null,
        }))

        setTeachers(teachersData)
      } else {
        throw new Error("Failed to fetch pending salary")
      }

      // Fetch payment history
      try {
        const historyResponse = await fetch("https://edunest-backend-pc16.onrender.com/api/salary-payment/admin-payment-history", {
          headers: {
            Authorization: `${getAuthToken()}`,
          },
        })

        const historyData = await historyResponse.json()

        if (historyData.success && historyData.history && historyData.history.payments) {
          setPaymentHistory(historyData.history.payments)
        }
      } catch (historyError) {
        console.error("Error fetching payment history:", historyError)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      showAlertMessage("Failed to load data. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingSalaries = async () => {
    try {
      const res = await fetch("https://edunest-backend-pc16.onrender.com/api/salary-payment/total-pending-salary", {
        headers: {
          Authorization: `${getAuthToken()}`,
        },
      })

      if (!res.ok) {

        console.log("erooooorr:"+getAuthToken())
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      const data = await res.json()
      return data
    } catch (err) {
      console.error("Error fetching pending salaries:", err)
      throw err
    }
  }

  const showAlertMessage = (message, type = "success") => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const handleRefresh = async () => {
    try {
      await fetchData()
      showAlertMessage("Data refreshed successfully")
    } catch (error) {
      console.error("Error refreshing data:", error)
      showAlertMessage("Failed to refresh data. Please try again.", "error")
    }
  }

  const handleSelectTeacher = (teacherId) => {
    setSelectedTeachers((prev) => {
      if (prev.includes(teacherId)) {
        return prev.filter((id) => id !== teacherId)
      } else {
        return [...prev, teacherId]
      }
    })
  }

  const handleSelectAllTeachers = (e) => {
    if (e.target.checked) {
      setSelectedTeachers(filteredTeachers.map((teacher) => teacher._id))
    } else {
      setSelectedTeachers([])
    }
  }

  const initiateSalaryPayment = async () => {
    if (!window.Razorpay) {
      showAlertMessage("Payment gateway is not loaded yet. Please try again.", "error")
      return
    }

    if (selectedTeachers.length === 0) {
      showAlertMessage("Please select at least one teacher to pay", "error")
      return
    }

    try {
      setPaymentInProgress(true)

      const res = await fetch("https://edunest-backend-pc16.onrender.com/api/salary-payment/pay-salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${getAuthToken()}`,
        },
        body: JSON.stringify({
          selectedTeachers: selectedTeachers,
        }),
      })

      if (!res.ok) {
        console.log(res.json())
        console.log("eERrror:"+res.details)
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      const data = await res.json()

      if (data.success) {
        showAlertMessage("Payment initiated. Proceeding to Razorpay...", "success")

        // If there are ineligible teachers (without bank details), show alert
        if (data.ineligibleTeachers && data.ineligibleTeachers.length > 0) {
          showAlertMessage(
            `${data.ineligibleTeachers.length} teachers skipped due to missing bank details. Emails sent to update their information.`,
            "warning",
          )
        }

        openRazorpay(data.order, data.eligibleTeachers)
      } else {
        throw new Error(data.message || "Failed to initiate payment")
      }
    } catch (error) {
      console.error("Error initiating payment:", error)
      showAlertMessage(error.message || "Failed to initiate payment. Please try again.", "error")
    } finally {
      setPaymentInProgress(false)
    }
  }

  const openRazorpay = (order, eligibleTeachers) => {
    if (!window.Razorpay) {
      showAlertMessage("Razorpay SDK not loaded. Please refresh and try again.", "error")
      return
    }

    const options = {
      key: "rzp_test_6m9Mth3tcPW2vy", // Use your Razorpay test key
      amount: order.amount,
      currency: "INR",
      name: "EduNest Salary",
      description: `Salary payout for ${eligibleTeachers.length} teacher(s)`,
      order_id: order.id,
      handler: async (response) => {
        try {
          const res = await fetch("https://edunest-backend-pc16.onrender.com/api/salary-payment/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${getAuthToken()}`,
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              teachers: eligibleTeachers.map((t) => t._id),
            }),
          })

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`)
          }

          const result = await res.json()

          if (result.success) {
            showAlertMessage("Salaries paid successfully!", "success")

            // Refresh data
            fetchData()

            // Reset selected teachers
            setSelectedTeachers([])

            // Close payment dialog
            setShowPaymentDialog(false)
          } else {
            showAlertMessage(result.message || "Payment verification failed", "error")
          }
        } catch (err) {
          console.error("Verification error:", err)
          showAlertMessage("Payment verification failed. Please contact support.", "error")
        } finally {
          setPaymentInProgress(false)
        }
      },
      theme: {
        color: "#007bff",
      },
      modal: {
        ondismiss: () => {
          console.log("Payment dismissed")
          setPaymentInProgress(false)
        },
        confirm_close: true,
        escape: false,
        backdropclose: false,
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", (response) => {
      console.error("Payment failed:", response.error)
      showAlertMessage(`Payment failed: ${response.error.description}`, "error")
      setPaymentInProgress(false)
    })

    rzp.open()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      (teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      teacher.balance > 0,
  )

  // Filter payment history based on search query and date filter
  const filteredHistory = paymentHistory.filter((payment) => {
    const paymentDate = new Date(payment.date)
    const now = new Date()

    // Date filtering
    if (dateFilter === "month") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      if (paymentDate < oneMonthAgo) return false
    } else if (dateFilter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (paymentDate < oneWeekAgo) return false
    }

    // Search filtering (check if any teacher in the payment matches the search)
    if (searchQuery) {
      return payment.teachersPaid.some(
        (teacher) =>
          teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return true
  })

  if (loading) {
    return <Loader fullscreen />
  }

  return (
    <div className="payment-management-container">
      {showAlert && (
        <div className={`alert-message ${alertType}`}>
          <AlertCircle className="alert-icon" size={20} />
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="header">
        <Button variant="ghost" onClick={() => navigate("/admin-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Payment Management</h1>
        <div className="header-actions">
          <Button variant="outline" onClick={handleRefresh} className="refresh-btn">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            className="make-payment-btn"
            disabled={selectedTeachers.length === 0}
            onClick={() => setShowPaymentDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Pay Selected ({selectedTeachers.length})
          </Button>
        </div>
      </div>

      <div className="dashboard-summary">
        <Card>
          <CardHeader>
            <CardTitle>Total Pending Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="amount-container">
              <DollarSign className="amount-icon" />
              <div className="amount">{formatCurrency(totalPendingSalary)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teachers with Pending Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="amount-container">
              <Users className="amount-icon" />
              <div className="amount">{teachers.filter((t) => t.balance > 0).length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Payments Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="amount-container">
              <History className="amount-icon" />
              <div className="amount">{paymentHistory.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Tabs */}
      <div className="custom-tabs">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "teachers" ? "active" : ""}`}
            onClick={() => setActiveTab("teachers")}
          >
            Teacher Salaries
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Payment History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "teachers" && (
            <div className="teachers-tab">
              <div className="filters-section">
                <div className="search-container">
                  <Search className="search-icon" />
                  <Input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="teachers-table">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={filteredTeachers.length > 0 && selectedTeachers.length === filteredTeachers.length}
                          onChange={handleSelectAllTeachers}
                          aria-label="Select all teachers"
                        />
                      </th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Pending Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          No teachers with pending salary found
                        </td>
                      </tr>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedTeachers.includes(teacher._id)}
                              onChange={() => handleSelectTeacher(teacher._id)}
                              aria-label={`Select ${teacher.name}`}
                            />
                          </td>
                          <td>{teacher.name}</td>
                          <td>{teacher.email}</td>
                          <td className="salary-amount">{formatCurrency(teacher.balance)}</td>
                          <td>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTeachers([teacher._id])
                                setShowPaymentDialog(true)
                              }}
                            >
                              Pay Now
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="history-tab">
              <div className="filters-section">
                <div className="search-container">
                  <Search className="search-icon" />
                  <Input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-container">
                  <select
                    className="date-filter-select"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="month">Last Month</option>
                    <option value="week">Last Week</option>
                  </select>
                </div>
              </div>

              <div className="payment-history">
                {filteredHistory.length === 0 ? (
                  <div className="empty-state">No payment history found</div>
                ) : (
                  filteredHistory.map((payment, index) => (
                    <Card key={index} className="payment-card">
                      <CardHeader>
                        <div className="payment-header">
                          <CardTitle>Payment on {formatDate(payment.date)}</CardTitle>
                          <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3>Teachers Paid ({payment.teachersPaid.length})</h3>
                        <div className="teachers-paid-list">
                          {payment.teachersPaid.map((teacher, idx) => (
                            <div key={idx} className="teacher-paid-item">
                              <div className="teacher-info">
                                <span className="teacher-name">{teacher.name}</span>
                                <span className="teacher-email">{teacher.email}</span>
                              </div>
                              <span className="amount-paid">{formatCurrency(teacher.paidAmount)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentDialog && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Confirm Salary Payment</h2>
              <button className="close-button" onClick={() => setShowPaymentDialog(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>You are about to pay salaries to {selectedTeachers.length} teacher(s).</p>

              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="summary-item">
                  <span>Teachers Selected:</span>
                  <span>{selectedTeachers.length}</span>
                </div>
                <div className="summary-item">
                  <span>Total Amount:</span>
                  <span>
                    {formatCurrency(
                      teachers
                        .filter((teacher) => selectedTeachers.includes(teacher._id))
                        .reduce((sum, teacher) => sum + teacher.balance, 0),
                    )}
                  </span>
                </div>
              </div>

              <div className="selected-teachers-list">
                <h3>Selected Teachers</h3>
                <div className="teachers-list">
                  {teachers
                    .filter((teacher) => selectedTeachers.includes(teacher._id))
                    .map((teacher) => (
                      <div key={teacher._id} className="teacher-item">
                        <span>{teacher.name}</span>
                        <span>{formatCurrency(teacher.balance)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={initiateSalaryPayment} disabled={paymentInProgress}>
                {paymentInProgress ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement


