import { mockApiCall } from './api'
import { MOCK_CHAT_MESSAGES } from '../utils/mockData'

export const chatService = {
  getMessages: async (communityId) => {
    const messages = MOCK_CHAT_MESSAGES.filter(m => m.communityId === communityId)
    return mockApiCall({ messages })
  },

  sendMessage: async (communityId, messageText, userId, userName) => {
    const newMessage = {
      id: `msg${Date.now()}`,
      communityId,
      userId: userId || 'u123',
      userName: userName || 'You',
      text: messageText,
      timestamp: new Date().toISOString(),
      type: 'message'
    }
    return mockApiCall(newMessage)
  },

  createPoll: async (communityId, question, options, userId, userName) => {
    const pollMessage = {
      id: `msg${Date.now()}`,
      communityId,
      userId: userId || 'u123',
      userName: userName || 'You',
      text: `Poll: ${question}`,
      timestamp: new Date().toISOString(),
      type: 'poll',
      poll: {
        question,
        options: options.map((opt, idx) => ({
          id: `opt${idx + 1}`,
          text: opt,
          votes: 0,
          voters: []
        })),
        totalVotes: 0
      }
    }
    return mockApiCall(pollMessage)
  },

  voteOnPoll: async (messageId, optionId, userId) => {
    // In a real app, this would update the poll on the server
    // For now, we'll return the updated poll structure
    return mockApiCall({ success: true, messageId, optionId, userId })
  },

  createEventProposal: async (communityId, proposalData, userId, userName) => {
    const proposalMessage = {
      id: `msg${Date.now()}`,
      communityId,
      userId: userId || 'u123',
      userName: userName || 'You',
      text: proposalData.title || 'Event Proposal',
      timestamp: new Date().toISOString(),
      type: 'event_proposal',
      proposal: {
        ...proposalData,
        status: 'discussion'
      }
    }
    return mockApiCall(proposalMessage)
  },

  createEventFromProposal: async (proposalId, eventData) => {
    // Convert proposal to actual event
    return mockApiCall({ 
      success: true, 
      eventId: `e${Date.now()}`,
      ...eventData 
    })
  }
}
