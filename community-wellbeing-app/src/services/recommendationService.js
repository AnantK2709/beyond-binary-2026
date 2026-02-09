import { mockApiCall } from './api'
import { MOCK_RECOMMENDATIONS } from '../utils/mockData'

export const recommendationService = {
  getRecommendations: async (userId) => {
    return mockApiCall({ recommendations: MOCK_RECOMMENDATIONS })
  },

  getEventRecommendations: async (userId) => {
    const eventRecs = MOCK_RECOMMENDATIONS.filter(r => r.type === 'event')
    return mockApiCall({ recommendations: eventRecs })
  },

  getPeopleRecommendations: async (userId) => {
    const peopleRecs = MOCK_RECOMMENDATIONS.filter(r => r.type === 'person')
    return mockApiCall({ recommendations: peopleRecs })
  }
}
