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
    const myCommunities = JSON.parse(localStorage.getItem('my_communities') || '[]')
    if (!myCommunities.includes(communityId)) {
      myCommunities.push(communityId)
      localStorage.setItem('my_communities', JSON.stringify(myCommunities))
    }
    return mockApiCall({ success: true, pointsEarned: 25 })
  },

  leaveCommunity: async (communityId) => {
    const myCommunities = JSON.parse(localStorage.getItem('my_communities') || '[]')
    const updated = myCommunities.filter(id => id !== communityId)
    localStorage.setItem('my_communities', JSON.stringify(updated))
    return mockApiCall({ success: true })
  }
}
