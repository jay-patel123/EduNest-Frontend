// src/pages/admin/MakePayment.jsx
"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select } from "../../components/ui/select"
import { Dialog } from "../../components/ui/dialog"
import "../../assets/styles/admin/MakePayment.css"

const MakePayment = () => {
  const navigate = useNavigate()
  const [paymentData, setPaymentData] = useState({
    teacherId: "",
    amount: "",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const teachers = [
    { id: 1, name: "Dr. Sarah Wilson", salary: 3500 },
    { id: 2, name: "Prof. Michael Chen", salary: 3200 },
    { id: 3, name: "Emily Rodriguez", salary: 2800 },
  ]

  const handleInputChange = (field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    // Here you would integrate with Razorpay
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate("/admin/payment-management")
    } catch (error) {
      console.error("Payment failed:", error)
    }
  }

  return (
    <div className="make-payment-container">
      <div className="header">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1>Make Payment</h1>
      </div>

      <div className="payment-form-container">
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Select Teacher</label>
            <Select
              value={paymentData.teacherId}
              onValueChange={(value) => handleInputChange("teacherId", value)}
              options={teachers.map((teacher) => ({
                value: teacher.id.toString(),
                label: teacher.name,
              }))}
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <Input
              type="number"
              value={paymentData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="card-details">
              <div className="form-group">
                <label>Card Number</label>
                <Input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <Input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <Input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="submit-btn">
            <CreditCard className="w-4 h-4 mr-2" />
            Process Payment
          </Button>
        </form>
      </div>

      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Payment"
        description={`Are you sure you want to process payment of $${paymentData.amount}?`}
        actions={
          <>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>Confirm</Button>
          </>
        }
      />
    </div>
  )
}

export default MakePayment