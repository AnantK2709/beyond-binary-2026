// Base API configuration
const API_DELAY = 300 // Simulate network delay

export const mockApiCall = async (data) => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY))
  return data
}

export const apiClient = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    // Return mock data based on URL
    console.log('GET:', url)
    return { data: {} }
  },

  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    console.log('POST:', url, data)
    return { data: { success: true, ...data } }
  },

  put: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    console.log('PUT:', url, data)
    return { data: { success: true, ...data } }
  },

  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, API_DELAY))
    console.log('DELETE:', url)
    return { data: { success: true } }
  }
}
