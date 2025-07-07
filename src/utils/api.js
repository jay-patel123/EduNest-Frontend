



// Base URL for all API requests
const BASE_URL = "https://edunest-backend-pc16.onrender.com/api"

// Helper function to get the auth token
export const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("authToken")
}

// Helper function to set the auth token
export const setAuthToken = (token) => {
  if (token) {
    // Store token with consistent naming
    localStorage.setItem("token", token.startsWith("Bearer ") ? token : `Bearer ${token}`)
  } else {
    localStorage.removeItem("token")
    localStorage.removeItem("authToken") // Remove both for consistency
  }
}

// Auth state management
export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem("userData", JSON.stringify(userData))
    localStorage.setItem("role", userData.role) // Store role for routing
  }
}

export const getUserData = () => {
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

// Logout functionality
export const logout = () => {
  setAuthToken(null)
  localStorage.removeItem("userData")
  localStorage.removeItem("role")
  // Clear any other auth-related items
  localStorage.removeItem("token")
  localStorage.removeItem("authToken")
}

// Auth check
export const isAuthenticated = () => {
  const token = getAuthToken()
  return !!token
}

// Get user role
export const getUserRole = () => {
  return localStorage.getItem("role")
}

// Main fetch wrapper function
const apiFetch = async (endpoint, options = {}) => {
  try {
    // Prepare headers
    const headers = {
      ...options.headers,
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    // Get the latest token
    const token = getAuthToken()

    // Only add Authorization header if token exists and has a value
    if (token && token.trim() !== "") {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`
    }

    console.log("Header is *********** ", headers)

    // Prepare the request URL
    const url = `${BASE_URL}${endpoint}`

    // Prepare the full request options
    const fetchOptions = {
      ...options,
      headers,
      mode: "cors",
    }

    // Convert body to JSON string if it's not FormData
    if (options.body && !(options.body instanceof FormData)) {
      fetchOptions.body = JSON.stringify(options.body)
    }

    console.log(`Making ${options.method || "GET"} request to ${url}`)
    console.log("🔹 Final Headers**********:", headers)
    console.log("🔹 Authorization Header:", headers["Authorization"] || "Not provided")
    console.log(`🔹 Request Method: ${fetchOptions.method || "GET"}`)

    const response = await fetch(url, fetchOptions)
    console.log(`🔹 Response Status: ${response.status}`)

    // Handle 401 Unauthorized errors
    if (response.status === 401) {
      console.log("Authentication error: Unauthorized")
      console.log("Authentication required for this endpoint")
    }

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! for ${url} status : ${response.status}, body:`, errorText)

      let errorData = {}
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        // If the error text is not valid JSON, use it as is
        errorData = { message: errorText }
      }

      throw new Error(errorData.message || `HTTP error! status : ${response.status}`)
    }

    // Parse the response as JSON
    const data = await response.json()
    console.log("Response data:", data)
    return data
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// API methods
const api = {
  // For endpoints that don't require authentication
  public: {
    post: (endpoint, data) =>
      apiFetch(endpoint, {
        method: "POST",
        body: data,
        headers: {}, // Explicitly empty headers to avoid Authorization
      }),
  },

  get: (endpoint, options = {}) => apiFetch(endpoint, { method: "GET", ...options }),

  post: (endpoint, data) =>
    apiFetch(endpoint, {
      method: "POST",
      body: data,
    }),

  put: (endpoint, data) =>
    apiFetch(endpoint, {
      method: "PUT",
      body: data,
    }),

  delete: (endpoint) => apiFetch(endpoint, { method: "DELETE" }),
}

// Function to handle file uploads
export const uploadFile = async (url, formData) => {
  try {
    // Get the token again to ensure it's the latest
    const token = getAuthToken()

    const headers = {}

    // Only add Authorization if token exists and has a value
    if (token && token.trim() !== "") {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`
    }

    console.log(`Uploading file to ${BASE_URL}${url}`)

    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers,
      body: formData,
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`HTTP error! status: ${response.status}, body:`, errorText)

      let errorData = {}
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        // If the error text is not valid JSON, use it as is
        errorData = { message: errorText }
      }

      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.public.post("/auth/login", credentials),
  register: (userData) => api.public.post("/auth/register", userData),
  verifyOTP: (data) => api.public.post("/auth/verify-otp", data),
  resetPassword: (data) => api.public.post("/auth/reset-password", data),
}

export default api


