import { mockApiCall } from './api'
import { MOCK_CHAT_MESSAGES } from '../utils/mockData'

export const chatService = {
  getMessages: async (communityId) => {
    const messages = MOCK_CHAT_MESSAGES.filter(m => m.communityId === communityId)
    return mockApiCall({ messages })
  },

  sendMessage: async (communityId, messageText) => {
    const newMessage = {
      id: `msg${Date.now()}`,
      communityId,
      userId: 'u123',
      userName: 'You',
      text: messageText,
      timestamp: new Date().toISOString()
    }
    return mockApiCall(newMessage)
  }
}
