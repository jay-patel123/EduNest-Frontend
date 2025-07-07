import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { logout } from "../utils/api"
import { Button } from "./ui/button"

const LogoutButton = ({ className = "", variant = "default", size = "default" }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Call the logout function to clear auth data
    logout()

    // Redirect to login page
    navigate("/login")
  }

  return (
    <Button onClick={handleLogout} className={className} variant={variant} size={size}>
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}

export default LogoutButton

