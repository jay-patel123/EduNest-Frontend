// "use client"

// import { useState, useEffect } from "react"
// import { Search, Plus, ArrowLeft, AlertCircle, RefreshCw, DollarSign, Users, History } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// import Loader from "../../components/Loader"
// import api from "../../utils/api"
// import "../../assets/styles/admin/PaymentManagement.css"

// // IMPORTANT: Replace this with your actual Razorpay test key
// const RAZORPAY_KEY = "rzp_test_2M1Oq7xyz12345" // Replace with your actual key

// const PaymentManagement = () => {
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab] = useState("teachers")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [dateFilter, setDateFilter] = useState("all")
//   const [loading, setLoading] = useState(true)
//   const [teachers, setTeachers] = useState([])
//   const [selectedTeachers, setSelectedTeachers] = useState([])
//   const [paymentHistory, setPaymentHistory] = useState([])
//   const [totalPendingSalary, setTotalPendingSalary] = useState(0)
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false)
//   const [showAlert, setShowAlert] = useState(false)
//   const [alertMessage, setAlertMessage] = useState("")
//   const [alertType, setAlertType] = useState("success")
//   const [paymentInProgress, setPaymentInProgress] = useState(false)
//   const [mockData, setMockData] = useState(false) // Set to false to use real API endpoints

//   // Mock data for teachers (only used if API fails)
//   const mockTeachers = [
//     {
//       _id: "1",
//       name: "Dr. Sarah Wilson",
//       email: "sarah.wilson@example.com",
//       balance: 3500,
//       accountNo: "123456789012",
//       ifscCode: "ABCD0001234",
//     },
//     {
//       _id: "2",
//       name: "Prof. Michael Chen",
//       email: "michael.chen@example.com",
//       balance: 3200,
//       accountNo: "987654321098",
//       ifscCode: "EFGH0005678",
//     },
//     {
//       _id: "3",
//       name: "Dr. Emily Johnson",
//       email: "emily.johnson@example.com",
//       balance: 2800,
//       accountNo: null,
//       ifscCode: null,
//     },
//     {
//       _id: "4",
//       name: "Prof. David Smith",
//       email: "david.smith@example.com",
//       balance: 4100,
//       accountNo: "456789012345",
//       ifscCode: "IJKL0009012",
//     },
//     {
//       _id: "5",
//       name: "Dr. Jessica Brown",
//       email: "jessica.brown@example.com",
//       balance: 3800,
//       accountNo: "789012345678",
//       ifscCode: "MNOP0003456",
//     },
//   ]

//   // Mock data for payment history (only used if API fails)
//   const mockPaymentHistory = [
//     {
//       date: new Date("2024-04-01"),
//       amount: 10500,
//       teachersPaid: [
//         {
//           _id: "1",
//           name: "Dr. Sarah Wilson",
//           email: "sarah.wilson@example.com",
//           paidAmount: 3500,
//         },
//         {
//           _id: "2",
//           name: "Prof. Michael Chen",
//           email: "michael.chen@example.com",
//           paidAmount: 3200,
//         },
//         {
//           _id: "4",
//           name: "Prof. David Smith",
//           email: "david.smith@example.com",
//           paidAmount: 3800,
//         },
//       ],
//     },
//     {
//       date: new Date("2024-03-01"),
//       amount: 7900,
//       teachersPaid: [
//         {
//           _id: "1",
//           name: "Dr. Sarah Wilson",
//           email: "sarah.wilson@example.com",
//           paidAmount: 3500,
//         },
//         {
//           _id: "5",
//           name: "Dr. Jessica Brown",
//           email: "jessica.brown@example.com",
//           paidAmount: 4400,
//         },
//       ],
//     },
//   ]

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)

//         // Try to fetch real data from API
//         try {
          

//           // Fetch total pending salary
//           const pendingSalaryResponse = await api.get("/salary-payment/total-pending-salary")
//           if (pendingSalaryResponse.success) {
//             setTotalPendingSalary(pendingSalaryResponse.totalPendingSalary || 0)
//           } else {
//             throw new Error("Failed to fetch pending salary")
//           }

//           // Fetch payment history
//           const historyResponse = await api.get("/salary-payment/admin-payment-history")
//           if (historyResponse.success && historyResponse.history && historyResponse.history.payments) {
//             setPaymentHistory(historyResponse.history.payments)
//           } else {
//             throw new Error("Failed to fetch payment history")
//           }

//           setMockData(false)
//         } catch (apiError) {
//           console.error("API Error, using mock data:", apiError)
//           // Fallback to mock data
//           setTeachers(mockTeachers)
//           setPaymentHistory(mockPaymentHistory)
//           setTotalPendingSalary(mockTeachers.reduce((sum, teacher) => sum + teacher.balance, 0))
//           setMockData(true)
//           showAlertMessage("API endpoints not available. Using mock data for demonstration.", "warning")
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         showAlertMessage("Failed to load data. Please try again.", "error")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()

//     // Load Razorpay script
//     const loadRazorpayScript = () => {
//       // Check if Razorpay is already loaded
//       if (window.Razorpay) {
//         return
//       }

//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.async = true
//       script.setAttribute("crossorigin", "anonymous")
//       script.setAttribute("referrerpolicy", "origin")

//       script.onload = () => {
//         console.log("Razorpay script loaded successfully")
//       }

//       script.onerror = (error) => {
//         console.error("Failed to load Razorpay script:", error)
//         showAlertMessage("Failed to load payment gateway. Please try again later.", "error")
//       }

//       document.body.appendChild(script)
//     }

//     loadRazorpayScript()
//   }, [])

//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message)
//     setAlertType(type)
//     setShowAlert(true)
//     setTimeout(() => setShowAlert(false), 5000)
//   }

//   const handleRefresh = async () => {
//     try {
//       setLoading(true)

//       if (mockData) {
//         // Refresh mock data (simulate API call)
//         setTimeout(() => {
//           setTeachers(mockTeachers)
//           setTotalPendingSalary(mockTeachers.reduce((sum, teacher) => sum + teacher.balance, 0))
//           setLoading(false)
//           showAlertMessage("Data refreshed successfully")
//         }, 1000)
//         return
//       }

//       // Try to fetch real data from API
//       try {
//         // Fetch teachers with pending balances
//         const teachersResponse = await api.get("/salary/teachers-balance")
//         if (teachersResponse.success && teachersResponse.teachers) {
//           setTeachers(teachersResponse.teachers)
//         } else {
//           throw new Error("Failed to fetch teachers")
//         }

//         // Fetch total pending salary
//         const pendingSalaryResponse = await api.get("/salary/total-pending-salary")
//         if (pendingSalaryResponse.success) {
//           setTotalPendingSalary(pendingSalaryResponse.totalPendingSalary || 0)
//         } else {
//           throw new Error("Failed to fetch pending salary")
//         }

//         showAlertMessage("Data refreshed successfully")
//       } catch (apiError) {
//         console.error("API Error during refresh, using mock data:", apiError)
//         // Fallback to mock data
//         setTeachers(mockTeachers)
//         setTotalPendingSalary(mockTeachers.reduce((sum, teacher) => sum + teacher.balance, 0))
//         setMockData(true)
//         showAlertMessage("Using mock data for demonstration", "warning")
//       }
//     } catch (error) {
//       console.error("Error refreshing data:", error)
//       showAlertMessage("Failed to refresh data. Please try again.", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSelectTeacher = (teacherId) => {
//     setSelectedTeachers((prev) => {
//       if (prev.includes(teacherId)) {
//         return prev.filter((id) => id !== teacherId)
//       } else {
//         return [...prev, teacherId]
//       }
//     })
//   }

//   const handleSelectAllTeachers = (e) => {
//     if (e.target.checked) {
//       setSelectedTeachers(filteredTeachers.map((teacher) => teacher._id))
//     } else {
//       setSelectedTeachers([])
//     }
//   }

//   const initiatePayment = async () => {
//     if (!window.Razorpay) {
//       showAlertMessage("Payment gateway is not loaded yet. Please try again.", "error")
//       return
//     }

//     if (selectedTeachers.length === 0) {
//       showAlertMessage("Please select at least one teacher to pay", "error")
//       return
//     }

//     try {
//       setPaymentInProgress(true)

//       // Calculate total amount to pay
//       const teachersToPay = teachers.filter((teacher) => selectedTeachers.includes(teacher._id))
//       const totalAmount = teachersToPay.reduce((sum, teacher) => sum + teacher.balance, 0)

//       if (totalAmount <= 0) {
//         showAlertMessage("No pending balance to pay", "error")
//         setPaymentInProgress(false)
//         return
//       }

//       if (mockData) {
//         // Simulate payment process with mock data
//         setTimeout(() => {
//           // Show success message
//           showAlertMessage(`Successfully paid salaries to ${selectedTeachers.length} teachers!`, "success")

//           // Update mock data to reflect payment
//           const updatedTeachers = teachers.map((teacher) => {
//             if (selectedTeachers.includes(teacher._id)) {
//               return { ...teacher, balance: 0 }
//             }
//             return teacher
//           })

//           // Add to payment history
//           const newPayment = {
//             date: new Date(),
//             amount: totalAmount,
//             teachersPaid: teachersToPay.map((teacher) => ({
//               _id: teacher._id,
//               name: teacher.name,
//               email: teacher.email,
//               paidAmount: teacher.balance,
//             })),
//           }

//           setPaymentHistory([newPayment, ...paymentHistory])
//           setTeachers(updatedTeachers)
//           setTotalPendingSalary((prev) => prev - totalAmount)
//           setSelectedTeachers([])
//           setShowPaymentDialog(false)
//           setPaymentInProgress(false)
//         }, 2000)
//         return
//       }

//       // Create salary payment order
//       const orderResponse = await api.post("/salary/pay-salary", {
//         selectedTeachers,
//       })

//       if (!orderResponse.success || !orderResponse.order) {
//         throw new Error(orderResponse.message || "Failed to create payment order")
//       }

//       console.log("Salary payment order created:", orderResponse)

//       // If there are ineligible teachers (without bank details), show alert
//       if (orderResponse.ineligibleTeachers && orderResponse.ineligibleTeachers.length > 0) {
//         showAlertMessage(
//           `${orderResponse.ineligibleTeachers.length} teachers skipped due to missing bank details. Emails sent to update their information.`,
//           "warning",
//         )
//       }

//       // Configure Razorpay options
//       const options = {
//         key: RAZORPAY_KEY,
//         amount: orderResponse.order.amount,
//         currency: "INR",
//         name: "EduNest",
//         description: `Salary Payment for ${orderResponse.eligibleTeachers.length} Teachers`,
//         order_id: orderResponse.order.id,
//         handler: (response) => {
//           verifyPayment(
//             response,
//             orderResponse.eligibleTeachers.map((teacher) => teacher._id),
//           )
//         },
//         prefill: {
//           name: "Admin",
//           email: "admin@edunest.com",
//         },
//         notes: {
//           purpose: "Teacher Salary Payment",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//         modal: {
//           ondismiss: () => {
//             console.log("Payment dismissed")
//             setPaymentInProgress(false)
//           },
//           confirm_close: true,
//           escape: false,
//           backdropclose: false,
//         },
//       }

//       // Open Razorpay payment form
//       const razorpayInstance = new window.Razorpay(options)
//       razorpayInstance.on("payment.failed", (response) => {
//         console.error("Payment failed:", response.error)
//         showAlertMessage(`Payment failed: ${response.error.description}`, "error")
//         setPaymentInProgress(false)
//       })

//       razorpayInstance.open()
//     } catch (error) {
//       console.error("Error initiating payment:", error)
//       showAlertMessage(error.message || "Failed to initiate payment. Please try again.", "error")
//       setPaymentInProgress(false)
//     }
//   }

//   const verifyPayment = async (paymentResponse, teacherIds) => {
//     try {
//       setPaymentInProgress(true)
//       console.log("Verifying salary payment:", paymentResponse)

//       if (mockData) {
//         // Simulate payment verification with mock data
//         setTimeout(() => {
//           // Show success message
//           showAlertMessage(`Successfully paid salaries to ${teacherIds.length} teachers!`, "success")

//           // Update mock data to reflect payment
//           const updatedTeachers = teachers.map((teacher) => {
//             if (teacherIds.includes(teacher._id)) {
//               return { ...teacher, balance: 0 }
//             }
//             return teacher
//           })

//           setTeachers(updatedTeachers)
//           setTotalPendingSalary(
//             (prev) =>
//               prev -
//               teacherIds.reduce((sum, id) => {
//                 const teacher = teachers.find((t) => t._id === id)
//                 return sum + (teacher ? teacher.balance : 0)
//               }, 0),
//           )

//           setSelectedTeachers([])
//           setShowPaymentDialog(false)
//           setPaymentInProgress(false)
//         }, 1500)
//         return
//       }

//       // Verify payment on backend
//       const verificationResponse = await api.post("/salary/verify-payment", {
//         order_id: paymentResponse.razorpay_order_id,
//         payment_id: paymentResponse.razorpay_payment_id,
//         signature: paymentResponse.razorpay_signature,
//         teachers: teacherIds,
//       })

//       if (verificationResponse.success) {
//         console.log("Salary payment verification successful:", verificationResponse)

//         // Refresh data
//         await handleRefresh()

//         // Reset selected teachers
//         setSelectedTeachers([])

//         // Close payment dialog
//         setShowPaymentDialog(false)

//         showAlertMessage(`Successfully paid salaries to ${teacherIds.length} teachers!`, "success")
//       } else {
//         throw new Error("Payment verification failed")
//       }
//     } catch (error) {
//       console.error("Error verifying payment:", error)
//       showAlertMessage("Payment verification failed. Please contact support.", "error")
//     } finally {
//       setPaymentInProgress(false)
//     }
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }

//   // Filter teachers based on search query
//   const filteredTeachers = teachers.filter(
//     (teacher) =>
//       (teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       teacher.balance > 0,
//   )

//   // Filter payment history based on search query and date filter
//   const filteredHistory = paymentHistory.filter((payment) => {
//     const paymentDate = new Date(payment.date)
//     const now = new Date()

//     // Date filtering
//     if (dateFilter === "month") {
//       const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
//       if (paymentDate < oneMonthAgo) return false
//     } else if (dateFilter === "week") {
//       const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//       if (paymentDate < oneWeekAgo) return false
//     }

//     // Search filtering (check if any teacher in the payment matches the search)
//     if (searchQuery) {
//       return payment.teachersPaid.some(
//         (teacher) =>
//           teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     }

//     return true
//   })

//   if (loading) {
//     return <Loader fullscreen />
//   }

//   return (
//     <div className="payment-management-container">
//       {showAlert && (
//         <div className={`alert-message ${alertType}`}>
//           <AlertCircle className="alert-icon" size={20} />
//           <span>{alertMessage}</span>
//         </div>
//       )}

//       <div className="header">
//         <Button variant="ghost" onClick={() => navigate("/admin-dashboard")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Dashboard
//         </Button>
//         <h1>Payment Management</h1>
//         <div className="header-actions">
//           <Button variant="outline" onClick={handleRefresh} className="refresh-btn">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Button
//             className="make-payment-btn"
//             disabled={selectedTeachers.length === 0}
//             onClick={() => setShowPaymentDialog(true)}
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Pay Selected ({selectedTeachers.length})
//           </Button>
//         </div>
//       </div>

//       <div className="dashboard-summary">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Pending Salary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="amount-container">
//               <DollarSign className="amount-icon" />
//               <div className="amount">{formatCurrency(totalPendingSalary)}</div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Teachers with Pending Salary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="amount-container">
//               <Users className="amount-icon" />
//               <div className="amount">{teachers.filter((t) => t.balance > 0).length}</div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Total Payments Made</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="amount-container">
//               <History className="amount-icon" />
//               <div className="amount">{paymentHistory.length}</div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Custom Tabs */}
//       <div className="custom-tabs">
//         <div className="tabs-header">
//           <button
//             className={`tab-button ${activeTab === "teachers" ? "active" : ""}`}
//             onClick={() => setActiveTab("teachers")}
//           >
//             Teacher Salaries
//           </button>
//           <button
//             className={`tab-button ${activeTab === "history" ? "active" : ""}`}
//             onClick={() => setActiveTab("history")}
//           >
//             Payment History
//           </button>
//         </div>

//         <div className="tab-content">
//           {activeTab === "teachers" && (
//             <div className="teachers-tab">
//               <div className="filters-section">
//                 <div className="search-container">
//                   <Search className="search-icon" />
//                   <Input
//                     type="text"
//                     placeholder="Search teachers..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="teachers-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>
//                         <input
//                           type="checkbox"
//                           checked={filteredTeachers.length > 0 && selectedTeachers.length === filteredTeachers.length}
//                           onChange={handleSelectAllTeachers}
//                           aria-label="Select all teachers"
//                         />
//                       </th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Account Details</th>
//                       <th>Pending Salary</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredTeachers.length === 0 ? (
//                       <tr>
//                         <td colSpan="6" className="empty-state">
//                           No teachers with pending salary found
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredTeachers.map((teacher) => (
//                         <tr key={teacher._id}>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={selectedTeachers.includes(teacher._id)}
//                               onChange={() => handleSelectTeacher(teacher._id)}
//                               aria-label={`Select ${teacher.name}`}
//                             />
//                           </td>
//                           <td>{teacher.name}</td>
//                           <td>{teacher.email}</td>
//                           <td>
//                             {teacher.accountNo && teacher.ifscCode ? (
//                               <span className="account-info">
//                                 A/C: ******{teacher.accountNo.toString().slice(-3)} | IFSC: {teacher.ifscCode}
//                               </span>
//                             ) : (
//                               <span className="missing-info">Bank details not provided</span>
//                             )}
//                           </td>
//                           <td className="salary-amount">{formatCurrency(teacher.balance)}</td>
//                           <td>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 setSelectedTeachers([teacher._id])
//                                 setShowPaymentDialog(true)
//                               }}
//                               disabled={!teacher.accountNo || !teacher.ifscCode}
//                             >
//                               Pay Now
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {activeTab === "history" && (
//             <div className="history-tab">
//               <div className="filters-section">
//                 <div className="search-container">
//                   <Search className="search-icon" />
//                   <Input
//                     type="text"
//                     placeholder="Search payments..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="filter-container">
//                   <select
//                     className="date-filter-select"
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                   >
//                     <option value="all">All Time</option>
//                     <option value="month">Last Month</option>
//                     <option value="week">Last Week</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="payment-history">
//                 {filteredHistory.length === 0 ? (
//                   <div className="empty-state">No payment history found</div>
//                 ) : (
//                   filteredHistory.map((payment, index) => (
//                     <Card key={index} className="payment-card">
//                       <CardHeader>
//                         <div className="payment-header">
//                           <CardTitle>Payment on {formatDate(payment.date)}</CardTitle>
//                           <div className="payment-amount">{formatCurrency(payment.amount)}</div>
//                         </div>
//                       </CardHeader>
//                       <CardContent>
//                         <h3>Teachers Paid ({payment.teachersPaid.length})</h3>
//                         <div className="teachers-paid-list">
//                           {payment.teachersPaid.map((teacher, idx) => (
//                             <div key={idx} className="teacher-paid-item">
//                               <div className="teacher-info">
//                                 <span className="teacher-name">{teacher.name}</span>
//                                 <span className="teacher-email">{teacher.email}</span>
//                               </div>
//                               <span className="amount-paid">{formatCurrency(teacher.paidAmount)}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Custom Modal */}
//       {showPaymentDialog && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h2>Confirm Salary Payment</h2>
//               <button className="close-button" onClick={() => setShowPaymentDialog(false)}>
//                 &times;
//               </button>
//             </div>
//             <div className="modal-body">
//               <p>You are about to pay salaries to {selectedTeachers.length} teachers.</p>

//               <div className="payment-summary">
//                 <h3>Payment Summary</h3>
//                 <div className="summary-item">
//                   <span>Teachers Selected:</span>
//                   <span>{selectedTeachers.length}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span>Total Amount:</span>
//                   <span>
//                     {formatCurrency(
//                       teachers
//                         .filter((teacher) => selectedTeachers.includes(teacher._id))
//                         .reduce((sum, teacher) => sum + teacher.balance, 0),
//                     )}
//                   </span>
//                 </div>
//               </div>

//               <div className="selected-teachers-list">
//                 <h3>Selected Teachers</h3>
//                 <div className="teachers-list">
//                   {teachers
//                     .filter((teacher) => selectedTeachers.includes(teacher._id))
//                     .map((teacher) => (
//                       <div key={teacher._id} className="teacher-item">
//                         <span>{teacher.name}</span>
//                         <span>{formatCurrency(teacher.balance)}</span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={initiatePayment} disabled={paymentInProgress}>
//                 {paymentInProgress ? "Processing..." : "Confirm Payment"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {mockData && (
//         <div className="mock-data-notice">
//           <AlertCircle className="mock-icon" size={16} />
//           <span>Using mock data for demonstration. API endpoints not available.</span>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PaymentManagement


// "use client"

// import { useState, useEffect } from "react"
// import { Search, Plus, ArrowLeft, AlertCircle, RefreshCw, DollarSign, Users, History } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// import Loader from "../../components/Loader"
// import "../../assets/styles/admin/PaymentManagement.css"
// import api from "../../utils/api"

// const PaymentManagement = () => {
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab] = useState("teachers")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [dateFilter, setDateFilter] = useState("all")
//   const [loading, setLoading] = useState(true)
//   const [teachers, setTeachers] = useState([])
//   const [selectedTeachers, setSelectedTeachers] = useState([])
//   const [paymentHistory, setPaymentHistory] = useState([])
//   const [totalPendingSalary, setTotalPendingSalary] = useState(0)
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false)
//   const [showAlert, setShowAlert] = useState(false)
//   const [alertMessage, setAlertMessage] = useState("")
//   const [alertType, setAlertType] = useState("success")
//   const [paymentInProgress, setPaymentInProgress] = useState(false)
//   const [adminToken, setAdminToken] = useState("")

//   const BACKEND_URL = "https://edunest-backend-pc16.onrender.com/api/salary-payment"

//   useEffect(() => {
//     // Get admin token from localStorage
//     const token = localStorage.getItem("adminToken")
//     if (token) {
//       setAdminToken(token)
//     }

//     fetchData()
//     loadRazorpayScript()
//   }, [])

//   const loadRazorpayScript = () => {
//     // Check if Razorpay is already loaded
//     if (window.Razorpay) {
//       return
//     }

//     const script = document.createElement("script")
//     script.src = "https://checkout.razorpay.com/v1/checkout.js"
//     script.async = true
//     script.setAttribute("crossorigin", "anonymous")
//     script.setAttribute("referrerpolicy", "origin")

//     script.onload = () => {
//       console.log("Razorpay script loaded successfully")
//     }

//     script.onerror = (error) => {
//       console.error("Failed to load Razorpay script:", error)
//       showAlertMessage("Failed to load payment gateway. Please try again later.", "error")
//     }

//     document.body.appendChild(script)
//   }

//   const fetchData = async () => {
//     try {
//       setLoading(true)

//       // Fetch total pending salary and teachers data
//       const pendingSalaryResponse = await fetchPendingSalaries()

//       if (pendingSalaryResponse && pendingSalaryResponse.success) {
//         setTotalPendingSalary(pendingSalaryResponse.totalPendingSalary || 0)

//         // Transform teacher data to match our component's expected format
//         const teachersData = pendingSalaryResponse.teachers.map((teacher) => ({
//           _id: teacher._id || `temp-${Math.random().toString(36).substr(2, 9)}`,
//           name: teacher.name,
//           email: teacher.email,
//           balance: teacher.pendingSalary,
//           accountNo: teacher.accountNo || null,
//           ifscCode: teacher.ifscCode || null,
//         }))

//         setTeachers(teachersData)
//       } else {
//         throw new Error("Failed to fetch pending salary")
//       }

//       // Fetch payment history
//       try {
//         const historyResponse = await api.get("salary-payment/admin-payment-history")

//         const historyData = await historyResponse.json()

//         if (historyData.success && historyData.history && historyData.history.payments) {
//           setPaymentHistory(historyData.history.payments)
//         }
//       } catch (historyError) {
//         console.error("Error fetching payment history:", historyError)
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       showAlertMessage("Failed to load data. Please try again.", "error")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchPendingSalaries = async () => {
//     try {
//       const res = await api.get("/salary-payment/total-pending-salary")

//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`)
//       }

//       const data = await res.json()
//       return data
//     } catch (err) {
//       console.error("Error fetching pending salaries:", err)
//       throw err
//     }
//   }

//   const showAlertMessage = (message, type = "success") => {
//     setAlertMessage(message)
//     setAlertType(type)
//     setShowAlert(true)
//     setTimeout(() => setShowAlert(false), 5000)
//   }

//   const handleRefresh = async () => {
//     try {
//       await fetchData()
//       showAlertMessage("Data refreshed successfully")
//     } catch (error) {
//       console.error("Error refreshing data:", error)
//       showAlertMessage("Failed to refresh data. Please try again.", "error")
//     }
//   }

//   const handleSelectTeacher = (teacherId) => {
//     setSelectedTeachers((prev) => {
//       if (prev.includes(teacherId)) {
//         return prev.filter((id) => id !== teacherId)
//       } else {
//         return [...prev, teacherId]
//       }
//     })
//   }

//   const handleSelectAllTeachers = (e) => {
//     if (e.target.checked) {
//       setSelectedTeachers(filteredTeachers.map((teacher) => teacher._id))
//     } else {
//       setSelectedTeachers([])
//     }
//   }

//   const initiateSalaryPayment = async () => {
//     if (!window.Razorpay) {
//       showAlertMessage("Payment gateway is not loaded yet. Please try again.", "error")
//       return
//     }

//     if (selectedTeachers.length === 0) {
//       showAlertMessage("Please select at least one teacher to pay", "error")
//       return
//     }

//     try {
//       setPaymentInProgress(true)

//       const res = await fetch(`${BACKEND_URL}/pay-salary`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${adminToken}`,
//         },
//         body: JSON.stringify({
//           selectedTeachers: selectedTeachers,
//         }),
//       })

//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`)
//       }

//       const data = await res.json()

//       if (data.success) {
//         showAlertMessage("Payment initiated. Proceeding to Razorpay...", "success")

//         // If there are ineligible teachers (without bank details), show alert
//         if (data.ineligibleTeachers && data.ineligibleTeachers.length > 0) {
//           showAlertMessage(
//             `${data.ineligibleTeachers.length} teachers skipped due to missing bank details. Emails sent to update their information.`,
//             "warning",
//           )
//         }

//         openRazorpay(data.order, data.eligibleTeachers)
//       } else {
//         throw new Error(data.message || "Failed to initiate payment")
//       }
//     } catch (error) {
//       console.error("Error initiating payment:", error)
//       showAlertMessage(error.message || "Failed to initiate payment. Please try again.", "error")
//     } finally {
//       setPaymentInProgress(false)
//     }
//   }

//   const openRazorpay = (order, eligibleTeachers) => {
//     if (!window.Razorpay) {
//       showAlertMessage("Razorpay SDK not loaded. Please refresh and try again.", "error")
//       return
//     }

//     const options = {
//       key: "rzp_test_6m9Mth3tcPW2vy", // Use your Razorpay test key
//       amount: order.amount,
//       currency: "INR",
//       name: "EduNest Salary",
//       description: `Salary payout for ${eligibleTeachers.length} teacher(s)`,
//       order_id: order.id,
//       handler: async (response) => {
//         try {
//           const res = await fetch(`${BACKEND_URL}/verify-payment`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${adminToken}`,
//             },
//             body: JSON.stringify({
//               order_id: response.razorpay_order_id,
//               payment_id: response.razorpay_payment_id,
//               signature: response.razorpay_signature,
//               teachers: eligibleTeachers.map((t) => t._id),
//             }),
//           })

//           if (!res.ok) {
//             throw new Error(`HTTP error! Status: ${res.status}`)
//           }

//           const result = await res.json()

//           if (result.success) {
//             showAlertMessage("Salaries paid successfully!", "success")

//             // Refresh data
//             fetchData()

//             // Reset selected teachers
//             setSelectedTeachers([])

//             // Close payment dialog
//             setShowPaymentDialog(false)
//           } else {
//             showAlertMessage(result.message || "Payment verification failed", "error")
//           }
//         } catch (err) {
//           console.error("Verification error:", err)
//           showAlertMessage("Payment verification failed. Please contact support.", "error")
//         } finally {
//           setPaymentInProgress(false)
//         }
//       },
//       theme: {
//         color: "#007bff",
//       },
//       modal: {
//         ondismiss: () => {
//           console.log("Payment dismissed")
//           setPaymentInProgress(false)
//         },
//         confirm_close: true,
//         escape: false,
//         backdropclose: false,
//       },
//     }

//     const rzp = new window.Razorpay(options)
//     rzp.on("payment.failed", (response) => {
//       console.error("Payment failed:", response.error)
//       showAlertMessage(`Payment failed: ${response.error.description}`, "error")
//       setPaymentInProgress(false)
//     })

//     rzp.open()
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     })
//   }

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount)
//   }

//   // Filter teachers based on search query
//   const filteredTeachers = teachers.filter(
//     (teacher) =>
//       (teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       teacher.balance > 0,
//   )

//   // Filter payment history based on search query and date filter
//   const filteredHistory = paymentHistory.filter((payment) => {
//     const paymentDate = new Date(payment.date)
//     const now = new Date()

//     // Date filtering
//     if (dateFilter === "month") {
//       const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
//       if (paymentDate < oneMonthAgo) return false
//     } else if (dateFilter === "week") {
//       const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//       if (paymentDate < oneWeekAgo) return false
//     }

//     // Search filtering (check if any teacher in the payment matches the search)
//     if (searchQuery) {
//       return payment.teachersPaid.some(
//         (teacher) =>
//           teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     }

//     return true
//   })

//   if (loading) {
//     return <Loader fullscreen />
//   }

//   return (
//     <div className="payment-management-container">
//       {showAlert && (
//         <div className={`alert-message ${alertType}`}>
//           <AlertCircle className="alert-icon" size={20} />
//           <span>{alertMessage}</span>
//         </div>
//       )}

//       <div className="header">
//         <Button variant="ghost" onClick={() => navigate("/admin-dashboard")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back To Dashboard
//         </Button>
//         <h1>Payment Management</h1>
//         <div className="header-actions">
//           <Button variant="outline" onClick={handleRefresh} className="refresh-btn">
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Button
//             className="make-payment-btn"
//             disabled={selectedTeachers.length === 0}
//             onClick={() => setShowPaymentDialog(true)}
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Pay Selected ({selectedTeachers.length})
//           </Button>
//         </div>
//       </div>

//       <div className="dashboard-summary">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Pending Salary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="amount-container">
//               <DollarSign className="amount-icon" />
//               <div className="amount">{formatCurrency(totalPendingSalary)}</div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Teachers with Pending Salary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="amount-container">
//               <Users className="amount-icon" />
//               <div className="amount">{teachers.filter((t) => t.balance > 0).length}</div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Total Payments Made</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="amount-container">
//               <History className="amount-icon" />
//               <div className="amount">{paymentHistory.length}</div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Custom Tabs */}
//       <div className="custom-tabs">
//         <div className="tabs-header">
//           <button
//             className={`tab-button ${activeTab === "teachers" ? "active" : ""}`}
//             onClick={() => setActiveTab("teachers")}
//           >
//             Teacher Salaries
//           </button>
//           <button
//             className={`tab-button ${activeTab === "history" ? "active" : ""}`}
//             onClick={() => setActiveTab("history")}
//           >
//             Payment History
//           </button>
//         </div>

//         <div className="tab-content">
//           {activeTab === "teachers" && (
//             <div className="teachers-tab">
//               <div className="filters-section">
//                 <div className="search-container">
//                   <Search className="search-icon" />
//                   <Input
//                     type="text"
//                     placeholder="Search teachers..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="teachers-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>
//                         <input
//                           type="checkbox"
//                           checked={filteredTeachers.length > 0 && selectedTeachers.length === filteredTeachers.length}
//                           onChange={handleSelectAllTeachers}
//                           aria-label="Select all teachers"
//                         />
//                       </th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Pending Salary</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredTeachers.length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="empty-state">
//                           No teachers with pending salary found
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredTeachers.map((teacher) => (
//                         <tr key={teacher._id}>
//                           <td>
//                             <input
//                               type="checkbox"
//                               checked={selectedTeachers.includes(teacher._id)}
//                               onChange={() => handleSelectTeacher(teacher._id)}
//                               aria-label={`Select ${teacher.name}`}
//                             />
//                           </td>
//                           <td>{teacher.name}</td>
//                           <td>{teacher.email}</td>
//                           <td className="salary-amount">{formatCurrency(teacher.balance)}</td>
//                           <td>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 setSelectedTeachers([teacher._id])
//                                 setShowPaymentDialog(true)
//                               }}
//                             >
//                               Pay Now
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {activeTab === "history" && (
//             <div className="history-tab">
//               <div className="filters-section">
//                 <div className="search-container">
//                   <Search className="search-icon" />
//                   <Input
//                     type="text"
//                     placeholder="Search payments..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="filter-container">
//                   <select
//                     className="date-filter-select"
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                   >
//                     <option value="all">All Time</option>
//                     <option value="month">Last Month</option>
//                     <option value="week">Last Week</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="payment-history">
//                 {filteredHistory.length === 0 ? (
//                   <div className="empty-state">No payment history found</div>
//                 ) : (
//                   filteredHistory.map((payment, index) => (
//                     <Card key={index} className="payment-card">
//                       <CardHeader>
//                         <div className="payment-header">
//                           <CardTitle>Payment on {formatDate(payment.date)}</CardTitle>
//                           <div className="payment-amount">{formatCurrency(payment.amount)}</div>
//                         </div>
//                       </CardHeader>
//                       <CardContent>
//                         <h3>Teachers Paid ({payment.teachersPaid.length})</h3>
//                         <div className="teachers-paid-list">
//                           {payment.teachersPaid.map((teacher, idx) => (
//                             <div key={idx} className="teacher-paid-item">
//                               <div className="teacher-info">
//                                 <span className="teacher-name">{teacher.name}</span>
//                                 <span className="teacher-email">{teacher.email}</span>
//                               </div>
//                               <span className="amount-paid">{formatCurrency(teacher.paidAmount)}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payment Confirmation Modal */}
//       {showPaymentDialog && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h2>Confirm Salary Payment</h2>
//               <button className="close-button" onClick={() => setShowPaymentDialog(false)}>
//                 &times;
//               </button>
//             </div>
//             <div className="modal-body">
//               <p>You are about to pay salaries to {selectedTeachers.length} teacher(s).</p>

//               <div className="payment-summary">
//                 <h3>Payment Summary</h3>
//                 <div className="summary-item">
//                   <span>Teachers Selected:</span>
//                   <span>{selectedTeachers.length}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span>Total Amount:</span>
//                   <span>
//                     {formatCurrency(
//                       teachers
//                         .filter((teacher) => selectedTeachers.includes(teacher._id))
//                         .reduce((sum, teacher) => sum + teacher.balance, 0),
//                     )}
//                   </span>
//                 </div>
//               </div>

//               <div className="selected-teachers-list">
//                 <h3>Selected Teachers</h3>
//                 <div className="teachers-list">
//                   {teachers
//                     .filter((teacher) => selectedTeachers.includes(teacher._id))
//                     .map((teacher) => (
//                       <div key={teacher._id} className="teacher-item">
//                         <span>{teacher.name}</span>
//                         <span>{formatCurrency(teacher.balance)}</span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={initiateSalaryPayment} disabled={paymentInProgress}>
//                 {paymentInProgress ? "Processing..." : "Proceed to Payment"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default PaymentManagement


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


