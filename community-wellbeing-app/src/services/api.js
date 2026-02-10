// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export const apiClient = {
  get: async (url) => {
    try {
      const fullUrl = `${API_BASE_URL}${url}`
      console.log('API GET request:', fullUrl)
      const response = await fetch(fullUrl)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API GET error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        })
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }
      
      const data = await response.json()
      console.log('API GET response:', data)
      return { data }
    } catch (error) {
      console.error('API GET error:', {
        url: `${API_BASE_URL}${url}`,
        message: error.message,
        type: error.name
      })
      
      // If it's a network error, provide helpful message
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Make sure the server is running.`)
      }
      
      throw error
    }
  },

  post: async (url, body) => {
    try {
      const fullUrl = `${API_BASE_URL}${url}`
      console.log('API POST request:', fullUrl)
      console.log('API POST body:', JSON.stringify(body, null, 2))
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API POST error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        })
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`)
      }
      
      const data = await response.json()
      console.log('API POST response:', JSON.stringify(data, null, 2))
      return { data }
    } catch (error) {
      console.error('API POST error:', error)
      throw error
    }
  },

  put: async (url, body) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API PUT error:', error)
      throw error
    }
  },

  delete: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      console.error('API DELETE error:', error)
      throw error
    }
  }
}

// Legacy mockApiCall for backward compatibility (can be removed later)
export const mockApiCall = async (data) => {
  return data
}
