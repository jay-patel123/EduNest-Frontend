"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Search, Plus, Edit, Trash2, Calendar, Percent, Tag, Filter,ArrowLeft } from "lucide-react"
import "../../assets/styles/admin/OffersManagement.css"
import { useNavigate } from "react-router-dom"

const OffersManagement = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [offers] = useState([
    {
      id: 1,
      title: "Summer Special",
      description: "Get 30% off on all courses",
      discountPercentage: 30,
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      status: "active",
    },
    {
      id: 2,
      title: "New Year Bundle",
      description: "Buy 2 courses, get 1 free",
      discountPercentage: null,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "scheduled",
    },
    // Add more offers as needed
  ])

  const [filters, setFilters] = useState({
    status: "all",
  })

  const handleAddOffer = () => {
    // Implement add offer functionality
    console.log("Add offer")
  }

  const handleEditOffer = (offerId) => {
    // Implement edit offer functionality
    console.log("Edit offer:", offerId)
  }

  const handleDeleteOffer = (offerId) => {
    // Implement delete offer functionality
    console.log("Delete offer:", offerId)
  }

  return (
    <div className="offers-management-container">
      <div className="page-header">
      <Button variant="ghost" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back To Dashboard
        </Button>
        <h1>Offers Management</h1>
        <Button onClick={handleAddOffer} className="add-offer-btn">
          <Plus size={20} />
          Add New Offer
        </Button>
      </div>

     {/* <div className="filters-section">
                 <div className="search-container">
                   <Search className="search-icon" />
                   <Input
                     type="text"
                     placeholder="Search payments..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                 </div>
               </div> */}

      <div className="offers-grid">
        {offers.map((offer) => (
          <Card key={offer.id} className="offer-card">
            <CardHeader>
              <CardTitle>{offer.title}</CardTitle>
              <p className="offer-description">{offer.description}</p>
            </CardHeader>
            <CardContent>
              <div className="offer-details">
                {offer.discountPercentage && (
                  <div className="detail-item">
                    <Percent size={16} />
                    <span className="detail-value">{offer.discountPercentage}% Off</span>
                  </div>
                )}
                <div className="detail-item">
                  <Calendar size={16} />
                  <span className="detail-value">
                    {offer.startDate} - {offer.endDate}
                  </span>
                </div>
                <div className="detail-item">
                  <Tag size={16} />
                  <span className={`offer-status ${offer.status}`}>{offer.status}</span>
                </div>
              </div>

              <div className="offer-actions">
                <Button variant="outline" onClick={() => handleEditOffer(offer.id)}>
                  <Edit size={16} />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteOffer(offer.id)}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OffersManagement

