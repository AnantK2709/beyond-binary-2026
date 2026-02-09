import { mockApiCall } from './api'
import { MOCK_ORGANIZATIONS } from '../utils/mockData'

export const organizationService = {
  getOrganizations: async () => {
    return mockApiCall({ organizations: MOCK_ORGANIZATIONS })
  },

  getOrganizationById: async (id) => {
    const organization = MOCK_ORGANIZATIONS.find(o => o.id === id)
    return mockApiCall(organization)
  },

  getOrganizationEvents: async (orgId) => {
    return mockApiCall({ events: [] })
  }
}
