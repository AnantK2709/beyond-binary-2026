import { mockApiCall } from './api'
import { MOCK_USERS } from '../utils/mockData'

export const searchService = {
  searchUsers: async (query) => {
    if (!query || query.trim().length < 2) {
      return mockApiCall({ users: [] })
    }

    const searchTerm = query.toLowerCase().trim()
    
    // Filter users by name (excluding current user if needed)
    const filteredUsers = MOCK_USERS.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchTerm)
      const emailMatch = user.email.toLowerCase().includes(searchTerm)
      const bioMatch = user.bio?.toLowerCase().includes(searchTerm)
      const interestsMatch = user.interests?.some(interest => 
        interest.toLowerCase().includes(searchTerm)
      )
      
      return nameMatch || emailMatch || bioMatch || interestsMatch
    })

    // Remove password from results
    const sanitizedUsers = filteredUsers.map(({ password, ...user }) => user)

    return mockApiCall({ 
      users: sanitizedUsers,
      total: sanitizedUsers.length,
      query: searchTerm
    })
  },

  getUserById: async (userId) => {
    const user = MOCK_USERS.find(u => u.id === userId)
    if (!user) {
      return mockApiCall(null)
    }
    
    // Remove password
    const { password, ...userWithoutPassword } = user
    return mockApiCall(userWithoutPassword)
  }
}
