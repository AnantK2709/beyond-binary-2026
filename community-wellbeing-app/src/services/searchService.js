import { apiClient } from './api'

export const searchService = {
  searchUsers: async (query) => {
    if (!query || query.trim().length < 2) {
      return { users: [] }
    }

    const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  }
}
