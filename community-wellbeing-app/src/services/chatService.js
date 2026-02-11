import { apiClient } from './api'

const messageCallTracker = new Map();

export const chatService = {
  getMessages: async (communityId) => {
    const callId = `getMessages-${communityId}-${Date.now()}`;
    const stackTrace = new Error().stack;
    
    console.log(`[chatService] 📞 getMessages(${communityId}) called`, {
      callId,
      timestamp: new Date().toISOString(),
      stackTrace: stackTrace.split('\n').slice(1, 4).join('\n')
    });

    // Check for recent duplicate calls
    const recentCall = Array.from(messageCallTracker.values()).find(
      call => call.communityId === communityId && Date.now() - call.timestamp < 100
    );

    if (recentCall) {
      console.warn(`[chatService] ⚠️ Duplicate getMessages call detected! Previous call was ${Date.now() - recentCall.timestamp}ms ago`, {
        previousCallId: recentCall.callId,
        currentCallId: callId
      });
    }

    messageCallTracker.set(callId, {
      communityId,
      timestamp: Date.now(),
      callId
    });

    setTimeout(() => {
      messageCallTracker.delete(callId);
    }, 1000);

    const response = await apiClient.get(`/communities/${communityId}/messages`)
    
    console.log(`[chatService] ✅ getMessages(${communityId}) completed`, {
      callId,
      messagesCount: response.data?.messages?.length || 0
    });

    return response.data
  },

  sendMessage: async (communityId, messageText, userId, userName, type = 'message', extraData = {}) => {
    // Check if this is a simulated conversation message (ID starts with 'conv-msg-')
    const isSimulated = extraData.id && extraData.id.startsWith('conv-msg-')
    const response = await apiClient.post(`/communities/${communityId}/messages`, {
      userId,
      userName,
      text: messageText,
      type,
      isSimulated: isSimulated || extraData.isSimulated, // Allow simulated messages to bypass membership check
      ...extraData
    })
    return response.data
  },

  createPoll: async (communityId, question, options, userId, userName, isSimulated = false) => {
    const pollData = {
      question,
      options: options.map((opt, idx) => ({
        id: `opt${idx + 1}`,
        text: opt,
        votes: 0,
        voters: []
      })),
      totalVotes: 0
    }
    
    const response = await apiClient.post(`/communities/${communityId}/messages`, {
      userId,
      userName,
      text: `Poll: ${question}`,
      type: 'poll',
      poll: pollData,
      isSimulated: isSimulated // Allow simulated polls to bypass membership check
    })
    return response.data
  },

  voteOnPoll: async (communityId, messageId, optionId, userId) => {
    const response = await apiClient.post(
      `/communities/${communityId}/messages/${messageId}/vote`,
      { optionId, userId }
    )
    return response.data
  },

  createEventProposal: async (communityId, proposalData, userId, userName) => {
    const response = await apiClient.post(`/communities/${communityId}/messages`, {
      userId,
      userName,
      text: proposalData.title || 'Event Proposal',
      type: 'event_proposal',
      eventProposal: {
        ...proposalData,
        status: 'pending'
      }
    })
    return response.data
  },

  createEventFromProposal: async (communityId, messageId, eventDetails) => {
    // Note: This might need a separate endpoint in the backend
    // For now, we'll return success
    return { 
      success: true, 
      eventId: `e${Date.now()}`,
      ...eventDetails 
    }
  }
}
