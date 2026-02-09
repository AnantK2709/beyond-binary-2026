import { mockApiCall } from './api'

export const moodService = {
  logMood: async (userId, mood) => {
    const moodHistory = JSON.parse(localStorage.getItem(`mood_${userId}`) || '[]')
    const entry = {
      id: `mood${Date.now()}`,
      mood,
      timestamp: new Date().toISOString()
    }
    moodHistory.push(entry)
    localStorage.setItem(`mood_${userId}`, JSON.stringify(moodHistory))
    return mockApiCall({ success: true, entry })
  },

  getMoodHistory: async (userId, days = 30) => {
    const moodHistory = JSON.parse(localStorage.getItem(`mood_${userId}`) || '[]')
    return mockApiCall({ history: moodHistory })
  },

  getMoodInsights: async (userId) => {
    return mockApiCall({
      insights: [
        "Your mood tends to be higher after outdoor events",
        "You've been consistently positive this week!"
      ],
      trend: 'improving',
      averageMood: 'happy'
    })
  }
}
