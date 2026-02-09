import { mockApiCall } from './api'
import { MOCK_MONTHLY_REPORTS } from '../utils/mockData'

export const reportService = {
  getMonthlyReport: async (userId, month) => {
    const report = MOCK_MONTHLY_REPORTS.find(r => r.month === month)
    return mockApiCall(report || MOCK_MONTHLY_REPORTS[0])
  },

  getAvailableReports: async (userId) => {
    return mockApiCall({
      reports: MOCK_MONTHLY_REPORTS.map(r => ({
        month: r.month,
        year: r.year,
        available: true
      }))
    })
  }
}
