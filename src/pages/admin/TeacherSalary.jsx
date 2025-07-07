"use client"

import { useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Search, DollarSign, Calendar, Download } from "lucide-react"
import "../../assets/styles/admin/TeacherSalary.css"

const TeacherSalary = () => {
  const [salaries] = useState([ ])

  const [filters, setFilters] = useState({
    status: "all",
    month: "current",
  })

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  return (
    <div className="teacher-salary-container">
      <h1 className="page-title">Teacher Salary Management</h1>

      <Card className="filters-card">
        <CardContent>
          <div className="filters-container">
            <div className="search-container">
              <Search className="search-icon" />
              <Input type="text" placeholder="Search teachers..." className="search-input" />
            </div>

            <div className="filters">
              <div className="filter-item">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                </select>
              </div>

              <div className="filter-item">
                <Label htmlFor="month">Month</Label>
                <select
                  id="month"
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="current">Current Month</option>
                  <option value="previous">Previous Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="salaries-list">
        {salaries.map((salary) => (
          <Card key={salary.id} className="salary-card">
            <CardContent>
              <div className="salary-info">
                <div className="salary-header">
                  <h3 className="teacher-name">{salary.teacherName}</h3>
                  <span className={`salary-status ${salary.status}`}>{salary.status}</span>
                </div>
                <div className="salary-details">
                  <div className="detail-item">
                    <DollarSign className="icon" />
                    <span>${salary.amount.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar className="icon" />
                    <span>{salary.date}</span>
                  </div>
                </div>
              </div>
              <div className="salary-actions">
                <Button variant="outline" size="sm">
                  <Download className="icon" />
                  Download Slip
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TeacherSalary

