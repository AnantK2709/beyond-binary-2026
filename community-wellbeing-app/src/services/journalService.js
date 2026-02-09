import { mockApiCall } from './api'

export const journalService = {
  getEntries: async () => {
    const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    return mockApiCall({ entries })
  },

  addEntry: async (entry) => {
    const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const newEntry = {
      id: `je${Date.now()}`,
      ...entry,
      createdAt: new Date().toISOString()
    }
    entries.unshift(newEntry)
    localStorage.setItem('journal_entries', JSON.stringify(entries))
    return mockApiCall(newEntry)
  },

  deleteEntry: async (entryId) => {
    const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]')
    const updated = entries.filter(e => e.id !== entryId)
    localStorage.setItem('journal_entries', JSON.stringify(updated))
    return mockApiCall({ success: true })
  },

  getAIInsights: async (entryId) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockApiCall({
      insights: [
        "You seem more energized when you engage in outdoor activities",
        "Consider scheduling morning events as you perform best during this time"
      ],
      mood: 'positive',
      suggestions: ['Try yoga', 'Join a hiking group']
    })
  }
}
