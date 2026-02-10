import { mockApiCall } from './api'

export const connectionService = {
  // Send a connection request
  sendConnectionRequest: async (fromUserId, toUserId) => {
    const requests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
    
    // Check if request already exists
    const existingRequest = requests.find(
      r => r.fromUserId === fromUserId && r.toUserId === toUserId
    )
    
    if (existingRequest) {
      return mockApiCall({ success: false, message: 'Request already sent' })
    }

    const newRequest = {
      id: `req_${Date.now()}`,
      fromUserId,
      toUserId,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString(),
      acceptedAt: null
    }

    requests.push(newRequest)
    localStorage.setItem('connection_requests', JSON.stringify(requests))

    // Simulate random acceptance after 2-10 seconds (for demo)
    const acceptDelay = Math.random() * 8000 + 2000 // 2-10 seconds
    setTimeout(async () => {
      await connectionService.acceptConnectionRequest(newRequest.id)
      // Trigger storage event to notify other tabs/components
      window.dispatchEvent(new Event('storage'))
    }, acceptDelay)

    return mockApiCall({ success: true, request: newRequest })
  },

  // Accept a connection request (can be called automatically)
  acceptConnectionRequest: async (requestId) => {
    const requests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
    const request = requests.find(r => r.id === requestId)
    
    if (!request || request.status !== 'pending') {
      return mockApiCall({ success: false })
    }

    request.status = 'accepted'
    request.acceptedAt = new Date().toISOString()
    localStorage.setItem('connection_requests', JSON.stringify(requests))

    // Add to connections for both users
    const connections1 = JSON.parse(localStorage.getItem(`connections_${request.fromUserId}`) || '[]')
    const connections2 = JSON.parse(localStorage.getItem(`connections_${request.toUserId}`) || '[]')

    if (!connections1.includes(request.toUserId)) {
      connections1.push(request.toUserId)
      localStorage.setItem(`connections_${request.fromUserId}`, JSON.stringify(connections1))
    }

    if (!connections2.includes(request.fromUserId)) {
      connections2.push(request.fromUserId)
      localStorage.setItem(`connections_${request.toUserId}`, JSON.stringify(connections2))
    }

    return mockApiCall({ success: true, request })
  },

  // Get connection status between two users
  getConnectionStatus: async (userId1, userId2) => {
    const requests = JSON.parse(localStorage.getItem('connection_requests') || '[]')
    
    // Check for existing request
    const request = requests.find(
      r => 
        (r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1)
    )

    if (!request) {
      // Check if already connected
      const connections1 = JSON.parse(localStorage.getItem(`connections_${userId1}`) || '[]')
      const isConnected = connections1.includes(userId2)
      
      return mockApiCall({ 
        status: isConnected ? 'connected' : 'none',
        request: null
      })
    }

    return mockApiCall({
      status: request.status,
      request,
      isFromMe: request.fromUserId === userId1
    })
  },

  // Get all connections for a user
  getConnections: async (userId) => {
    const connections = JSON.parse(localStorage.getItem(`connections_${userId}`) || '[]')
    return mockApiCall({ connections })
  }
}
