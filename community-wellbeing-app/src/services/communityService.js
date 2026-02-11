import { apiClient } from './api'

const callTracker = new Map(); // Track API calls to prevent duplicates

export const communityService = {
  getCommunities: async () => {
    const callId = `getCommunities-${Date.now()}-${Math.random()}`;
    const stackTrace = new Error().stack;
    
    console.log(`[communityService] getCommunities() called`, {
      callId,
      timestamp: new Date().toISOString(),
      stackTrace: stackTrace.split('\n').slice(1, 4).join('\n') // Show first 3 stack frames
    });

    // Check if there's a recent call (within 100ms)
    const recentCall = Array.from(callTracker.values()).find(
      call => call.endpoint === '/communities' && Date.now() - call.timestamp < 100
    );

    if (recentCall) {
      console.warn(`[communityService] Duplicate call detected! Previous call was ${Date.now() - recentCall.timestamp}ms ago`, {
        previousCallId: recentCall.callId,
        currentCallId: callId
      });
    }

    callTracker.set(callId, {
      endpoint: '/communities',
      timestamp: Date.now(),
      callId
    });

    // Clean up old entries (older than 1 second)
    setTimeout(() => {
      callTracker.delete(callId);
    }, 1000);

    const response = await apiClient.get('/communities')
    
    console.log(`[communityService] getCommunities() completed`, {
      callId,
      communitiesCount: response.data?.communities?.length || 0
    });

    return response.data
  },

  getCommunityById: async (id) => {
    const callId = `getCommunityById-${id}-${Date.now()}`;
    console.log(`[communityService] getCommunityById(${id}) called`, {
      callId,
      timestamp: new Date().toISOString()
    });

    const response = await apiClient.get(`/communities/${id}`)
    
    console.log(`[communityService] getCommunityById(${id}) completed`, {
      callId,
      communityName: response.data?.name || 'N/A'
    });

    return response.data
  },

  joinCommunity: async (communityId, userId) => {
    // Get userId from localStorage if not provided (fallback)
    if (!userId) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      userId = currentUser.id
    }

    if (!userId) {
      throw new Error('User ID is required to join a community')
    }

    const response = await apiClient.post(`/communities/${communityId}/join`, { userId })
    
    // Update user's joinedCircles in localStorage for immediate UI update
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.id && response.data.success) {
      const joinedCircles = currentUser.joinedCircles || []
      const isAlreadyJoined = joinedCircles.some(c => 
        (typeof c === 'string' ? c : c.id) === communityId
      )
      
      if (!isAlreadyJoined) {
        // Get community name from API
        const communityResponse = await apiClient.get(`/communities/${communityId}`)
        const community = communityResponse.data
        
        currentUser.joinedCircles = [
          ...joinedCircles,
          { id: communityId, name: community.name, role: 'member' }
        ]
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    }
    
    return response.data
  },

  leaveCommunity: async (communityId, userId) => {
    // Get userId from localStorage if not provided (fallback)
    if (!userId) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      userId = currentUser.id
    }

    // Note: You may want to add a DELETE endpoint for this
    // For now, just update localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.id) {
      currentUser.joinedCircles = (currentUser.joinedCircles || []).filter(c => 
        (typeof c === 'string' ? c : c.id) !== communityId
      )
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
    
    return { success: true }
  },

  createCommunity: async (communityData) => {
    const response = await apiClient.post('/communities', communityData)
    const newCommunity = response.data
    
    // Update user's joinedCircles in localStorage immediately
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.id === communityData.creatorId) {
      const joinedCircles = currentUser.joinedCircles || []
      const isAlreadyJoined = joinedCircles.some(c => 
        (typeof c === 'string' ? c : c.id) === newCommunity.id
      )
      
      if (!isAlreadyJoined) {
        currentUser.joinedCircles = [
          ...joinedCircles,
          { id: newCommunity.id, name: newCommunity.name, role: 'admin' }
        ]
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    }
    
    return newCommunity
  },

  sendCommunityInvitations: async (communityId, userIds, inviterId) => {
    const response = await apiClient.post(`/communities/${communityId}/invite`, {
      userIds,
      inviterId
    })
    return response.data
  }
}
