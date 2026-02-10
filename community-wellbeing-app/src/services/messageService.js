import { mockApiCall } from './api'

export const messageService = {
  // Get all conversations for a user
  getConversations: async (userId) => {
    const conversations = JSON.parse(localStorage.getItem(`conversations_${userId}`) || '[]')
    return mockApiCall({ conversations })
  },

  // Get messages between two users
  getMessages: async (userId1, userId2) => {
    const conversationId = [userId1, userId2].sort().join('_')
    const messages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || '[]')
    
    // Sort by timestamp
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    return mockApiCall({ messages })
  },

  // Send a message
  sendMessage: async (fromUserId, toUserId, text) => {
    const conversationId = [fromUserId, toUserId].sort().join('_')
    const messages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || '[]')
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      fromUserId,
      toUserId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    }

    messages.push(newMessage)
    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages))

    // Update conversation list for both users
    const conversations1 = JSON.parse(localStorage.getItem(`conversations_${fromUserId}`) || '[]')
    const conversations2 = JSON.parse(localStorage.getItem(`conversations_${toUserId}`) || '[]')

    const updateConversation = (conversations, otherUserId, message) => {
      const existing = conversations.find(c => c.userId === otherUserId)
      if (existing) {
        existing.lastMessage = message.text
        existing.lastMessageTime = message.timestamp
        existing.unreadCount = (existing.unreadCount || 0) + (message.fromUserId === otherUserId ? 0 : 1)
      } else {
        conversations.push({
          userId: otherUserId,
          lastMessage: message.text,
          lastMessageTime: message.timestamp,
          unreadCount: 0
        })
      }
    }

    updateConversation(conversations1, toUserId, newMessage)
    updateConversation(conversations2, fromUserId, newMessage)

    localStorage.setItem(`conversations_${fromUserId}`, JSON.stringify(conversations1))
    localStorage.setItem(`conversations_${toUserId}`, JSON.stringify(conversations2))

    return mockApiCall(newMessage)
  },

  // Mark messages as read
  markAsRead: async (userId1, userId2) => {
    const conversationId = [userId1, userId2].sort().join('_')
    const messages = JSON.parse(localStorage.getItem(`messages_${conversationId}`) || '[]')
    
    messages.forEach(msg => {
      if (msg.toUserId === userId1) {
        msg.read = true
      }
    })

    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages))

    // Reset unread count
    const conversations = JSON.parse(localStorage.getItem(`conversations_${userId1}`) || '[]')
    const conversation = conversations.find(c => c.userId === userId2)
    if (conversation) {
      conversation.unreadCount = 0
      localStorage.setItem(`conversations_${userId1}`, JSON.stringify(conversations))
    }

    return mockApiCall({ success: true })
  }
}
