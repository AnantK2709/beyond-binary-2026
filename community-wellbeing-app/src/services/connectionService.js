import { apiClient } from './api'

export const connectionService = {
  // Send a connection request
  sendConnectionRequest: async (fromUserId, toUserId) => {
    console.log('[connectionService] sendConnectionRequest called:', { fromUserId, toUserId })
    const response = await apiClient.post('/connections/request', {
      fromUserId,
      toUserId
    })
    return response.data
  },

  // Accept a connection request (can be called automatically by backend)
  acceptConnectionRequest: async (requestId) => {
    // Note: Backend handles auto-acceptance, but we can keep this for manual acceptance if needed
    console.log('[connectionService] acceptConnectionRequest called:', requestId)
    // This would need a backend endpoint if manual acceptance is required
    return { success: true }
  },

  // Get connection status between two users
  getConnectionStatus: async (userId1, userId2) => {
    console.log('[connectionService] getConnectionStatus called:', { userId1, userId2 })
    const response = await apiClient.get(`/connections/status?userId1=${userId1}&userId2=${userId2}`)
    return response.data
  },

  // Get all connections for a user
  getConnections: async (userId) => {
    const response = await apiClient.get(`/connections/${userId}`)
    return response.data
  }
}
