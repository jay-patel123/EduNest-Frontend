"use client"

import { useState, useEffect } from "react"
import { getAuthToken } from "../utils/api"
import "../assets/styles/CoursePayment.css"
import { Button } from "../components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CoursePayment = () => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [razorpayReady, setRazorpayReady] = useState(false)

  const navigate = useNavigate()

  // Load Razorpay script when component mounts
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => setRazorpayReady(true)
    script.onerror = () => alert("Failed to load Razorpay script")
    document.body.appendChild(script)
  }, [])

  const handlePayment = async () => {
    if (!amount) {
      alert("Please enter both token and amount")
      return
    }

    if (!razorpayReady) {
      alert("Razorpay is not loaded yet")
      return
    }

    setLoading(true)
    const token = getAuthToken()
    console.log("Tokkennn:" + token)
    try {
      const orderRes = await fetch("https://edunest-backend-pc16.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ amount }),
      })
      setAmount("")
      console.log(orderRes.status)

      if (!orderRes.ok) throw new Error("Failed to create order")

      const orderData = await orderRes.json()
      const order = orderData.order

      const options = {
        key: "rzp_test_6m9Mth3tcPW2vy" ,
        amount: order.amount,
        currency: "INR",
        name: "EduNest",
        description: "Buy Reward Points",
        order_id: order.id,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response

          const verifyRes = await fetch("https://edunest-backend-pc16.onrender.com/api/payment/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
            }),
          })

          if (!verifyRes.ok) throw new Error("Payment verification failed")

          alert("✅ Payment successful! Reward points will be added.")

        },
        theme: {
          color: "#28a745",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("❌ Error:", err.message)
      alert("Payment failed or server error.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate("/student-dashboard")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back To Dashboard
      </Button>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="payment-container">
          <h1 className="text-2xl font-bold mb-6">Buy Reward Points</h1>

          <input
            className="border p-2 mb-3 w-full max-w-md"
            type="number"
            placeholder="Enter Amount (in ₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handlePayment}
            disabled={loading || !razorpayReady}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoursePayment
