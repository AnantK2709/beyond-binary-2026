import { mockApiCall } from './api'
import { MOCK_COMMUNITIES } from '../utils/mockData'

export const communityService = {
  getCommunities: async () => {
    return mockApiCall({ communities: MOCK_COMMUNITIES, total: MOCK_COMMUNITIES.length })
  },

  getCommunityById: async (id) => {
    const community = MOCK_COMMUNITIES.find(c => c.id === id)
    return mockApiCall(community)
  },

  joinCommunity: async (communityId) => {
    // Update localStorage
    const myCommunities = JSON.parse(localStorage.getItem('my_communities') || '[]')
    if (!myCommunities.includes(communityId)) {
      myCommunities.push(communityId)
      localStorage.setItem('my_communities', JSON.stringify(myCommunities))
    }
    
    // Update user's joinedCircles in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.id) {
      const joinedCircles = currentUser.joinedCircles || []
      const community = MOCK_COMMUNITIES.find(c => c.id === communityId)
      
      // Check if already joined (handle both array of IDs and array of objects)
      const isAlreadyJoined = joinedCircles.some(c => 
        (typeof c === 'string' ? c : c.id) === communityId
      )
      
      if (!isAlreadyJoined && community) {
        // Add as object with id, name, and role
        currentUser.joinedCircles = [
          ...joinedCircles,
          { id: communityId, name: community.name, role: 'member' }
        ]
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    }
    
    return mockApiCall({ success: true, pointsEarned: 25 })
  },

  leaveCommunity: async (communityId) => {
    const myCommunities = JSON.parse(localStorage.getItem('my_communities') || '[]')
    const updated = myCommunities.filter(id => id !== communityId)
    localStorage.setItem('my_communities', JSON.stringify(updated))
    
    // Update user's joinedCircles in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.id) {
      currentUser.joinedCircles = (currentUser.joinedCircles || []).filter(c => 
        (typeof c === 'string' ? c : c.id) !== communityId
      )
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
    
    return mockApiCall({ success: true })
  }
}
