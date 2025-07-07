// "use client"

// import { useState } from "react"
// import { useParams } from "react-router-dom"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Label } from "../components/ui/label"
// import { CreditCard, Gift } from "lucide-react"
// import "../assets/styles/ModulePayment.css"

// const ModulePayment = () => {
//   const { moduleId } = useParams()
//   const [paymentMethod, setPaymentMethod] = useState("card")
//   const [redeemPoints, setRedeemPoints] = useState(0)

//   // Mock data - replace with actual data from your backend
//   const moduleInfo = {
//     name: "Advanced React Patterns",
//     price: 49.99,
//     pointsRequired: 500,
//   }

//   const userPoints = 750 // Mock user points - replace with actual user data

//   const handlePayment = (e) => {
//     e.preventDefault()
//     // Handle payment logic here
//     console.log("Processing payment for module:", moduleId)
//   }

//   const handleRedeemPointsChange = (e) => {
//     const points = Number.parseInt(e.target.value, 10)
//     setRedeemPoints(Math.min(points, userPoints, moduleInfo.pointsRequired))
//   }

//   const remainingPrice = Math.max(moduleInfo.price - redeemPoints / 100, 0).toFixed(2)

//   return (
//     <div className="module-payment-container">
//       <Card>
//         <CardHeader>
//           <CardTitle>Unlock Module: {moduleInfo.name}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handlePayment}>
//             <div className="price-info">
//               <h3>Price: ${moduleInfo.price}</h3>
//               <p>Points required: {moduleInfo.pointsRequired}</p>
//               <p>Your available points: {userPoints}</p>
//             </div>

//             <div className="form-group">
//               <Label htmlFor="redeemPoints">Redeem Points (100 points = $1)</Label>
//               <Input
//                 type="number"
//                 id="redeemPoints"
//                 value={redeemPoints}
//                 onChange={handleRedeemPointsChange}
//                 min="0"
//                 max={Math.min(userPoints, moduleInfo.pointsRequired)}
//               />
//             </div>

//             <div className="price-summary">
//               <p>Points to redeem: {redeemPoints}</p>
//               <p>Remaining price: ${remainingPrice}</p>
//             </div>

//             <div className="payment-methods">
//               <Button
//                 type="button"
//                 variant={paymentMethod === "card" ? "default" : "outline"}
//                 onClick={() => setPaymentMethod("card")}
//               >
//                 <CreditCard className="w-4 h-4 mr-2" />
//                 Credit Card
//               </Button>
//               <Button
//                 type="button"
//                 variant={paymentMethod === "points" ? "default" : "outline"}
//                 onClick={() => setPaymentMethod("points")}
//                 disabled={redeemPoints < moduleInfo.pointsRequired}
//               >
//                 <Gift className="w-4 h-4 mr-2" />
//                 Pay with Points
//               </Button>
//             </div>

//             {paymentMethod === "card" && remainingPrice > 0 && (
//               <div className="card-payment-form">
//                 <div className="form-group">
//                   <Label htmlFor="cardNumber">Card Number</Label>
//                   <Input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" required />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <Label htmlFor="expiryDate">Expiry Date</Label>
//                     <Input type="text" id="expiryDate" placeholder="MM/YY" required />
//                   </div>
//                   <div className="form-group">
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input type="text" id="cvv" placeholder="123" required />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <Button type="submit" className="w-full mt-4">
//               {paymentMethod === "points" && redeemPoints >= moduleInfo.pointsRequired
//                 ? "Unlock with Points"
//                 : `Pay $${remainingPrice}`}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default ModulePayment

"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { CreditCard, Gift, Wallet, Plus } from "lucide-react"
import api from "../utils/api"
import Loader from "../components/Loader"
import "../assets/styles/ModulePayment.css"

const ModulePayment = () => {
  const { moduleId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { courseId, price } = location.state || {}

  const [loading, setLoading] = useState(true)
  const [moduleInfo, setModuleInfo] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [pointsToConvert, setPointsToConvert] = useState(0)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [showAddBalance, setShowAddBalance] = useState(false)
  const [addBalanceAmount, setAddBalanceAmount] = useState("")
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch module details
        const moduleData = await api.get(`/module/${moduleId}`)

        // Fetch user's points and balance
        const userData = await api.get("/student/points-balance")

        setModuleInfo(moduleData)
        setUserPoints(userData.points || 0)
        setAvailableBalance(userData.balance || 0)
      } catch (error) {
        console.error("Error fetching data:", error)
        navigate("/view-courses")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [moduleId, navigate])

  const handlePointsConversion = () => {
    // Convert rupees to points (1$ = 1 point)
    const points = Math.floor(pointsToConvert)
    if (points > availableBalance) {
      alert("Insufficient balance")
      return
    }
    setUserPoints((prev) => prev + points)
    setAvailableBalance((prev) => prev - points)
  }

  const handleAddBalance = async () => {
    try {
      setLoading(true)
      // In a real app, integrate with payment gateway here
      const amount = Number(addBalanceAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount")
      }

      // Mock API call to add balance
      await api.post("/student/add-balance", { amount })

      setAvailableBalance((prev) => prev + amount)
      setShowAddBalance(false)
      setAddBalanceAmount("")
      alert("Balance added successfully!")
    } catch (error) {
      console.error("Error adding balance:", error)
      alert("Failed to add balance. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUnlockModule = async () => {
    try {
      setLoading(true)
      if (paymentMethod === "points") {
        if (userPoints < moduleInfo.price * 100) {
          alert("Insufficient points")
          return
        }
        // Unlock with points
        await api.post("/student/unlock-module", {
          moduleId,
          courseId,
          paymentMethod: "points",
          points: moduleInfo.price * 100,
        })
      } else {
        if (availableBalance < moduleInfo.price) {
          alert("Insufficient balance")
          return
        }
        // Unlock with money
        await api.post("/student/unlock-module", {
          moduleId,
          courseId,
          paymentMethod: "money",
          amount: moduleInfo.price,
        })
      }

      alert("Module unlocked successfully!")
      navigate(`/course/${courseId}/modules`)
    } catch (error) {
      console.error("Error unlocking module:", error)
      alert("Failed to unlock module. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading || !moduleInfo) {
    return (
      
        <Loader fullscreen/>
      
    )
  }

  return (
    
      <div className="module-payment-container">
        <Card>
          <CardHeader>
            <CardTitle>Unlock Module: {moduleInfo.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="module-info">
              <h3>Module Details</h3>
              <p>Price: ${moduleInfo.price}</p>
              <p>Points required: {moduleInfo.price * 100}</p>
            </div>

            <div className="balance-section">
              <div className="balance-info">
                <div className="balance-item">
                  <Wallet className="icon" />
                  <div>
                    <p>Available Balance</p>
                    <h4>${availableBalance}</h4>
                  </div>
                </div>
                <div className="balance-item">
                  <Gift className="icon" />
                  <div>
                    <p>Available Points</p>
                    <h4>{userPoints}</h4>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={() => setShowAddBalance(true)} className="add-balance-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Balance
              </Button>
            </div>

            {showAddBalance && (
              <div className="add-balance-form">
                <h3>Add Balance</h3>
                <div className="form-group">
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    value={addBalanceAmount}
                    onChange={(e) => setAddBalanceAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="payment-methods">
                  <Button variant="outline" className="payment-method-btn">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Credit Card
                  </Button>
                  <Button variant="outline" className="payment-method-btn">
                    UPI
                  </Button>
                  <Button variant="outline" className="payment-method-btn">
                    QR Code
                  </Button>
                </div>
                <div className="form-actions">
                  <Button variant="outline" onClick={() => setShowAddBalance(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBalance}>Add Balance</Button>
                </div>
              </div>
            )}

            <div className="points-conversion">
              <h3>Convert Money to Points</h3>
              <p>1$ = 1 Point</p>
              <div className="form-group">
                <Label>Amount to Convert ($)</Label>
                <Input
                  type="number"
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(e.target.value)}
                  placeholder="Enter amount"
                />
                <p className="conversion-result">You will get: {Math.floor(pointsToConvert)} points</p>
              </div>
              <Button onClick={handlePointsConversion} disabled={pointsToConvert <= 0}>
                Convert to Points
              </Button>
            </div>

            <div className="unlock-section">
              <h3>Choose Payment Method</h3>
              <div className="payment-methods">
                <Button
                  variant={paymentMethod === "money" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("money")}
                  className="payment-method-btn"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay with Money (${moduleInfo.price})
                </Button>
                <Button
                  variant={paymentMethod === "points" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("points")}
                  className="payment-method-btn"
                  disabled={userPoints < moduleInfo.price * 100}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Pay with Points ({moduleInfo.price * 100} points)
                </Button>
              </div>

              <Button
                onClick={handleUnlockModule}
                className="unlock-btn"
                disabled={
                  (paymentMethod === "points" && userPoints < moduleInfo.price * 100) ||
                  (paymentMethod === "money" && availableBalance < moduleInfo.price)
                }
              >
                Unlock Module
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    
  )
}

export default ModulePayment

