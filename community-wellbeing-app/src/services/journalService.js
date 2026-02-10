import { mockApiCall } from './api'

const STORAGE_KEY = 'journal_entries'

const loadAll = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

const saveAll = (data) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

export const journalService = {
  getEntries: async (userId) => {
    const allEntries = loadAll();
    const rawEntries = allEntries[userId] || [];

    const entries = rawEntries.map(e => {
      const d = new Date(e.createdAt);

      return {
        id: e.id,
        date: d.toLocaleDateString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        time: d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit"
        }),
        text: e.content
      };
    });

    return mockApiCall({ entries });
  },


  addEntry: async (userId, entry) => {
    console.log("entry called")
    const allEntries = loadAll()

    const newEntry = {
      id: `je${Date.now()}`,
      ...entry,
      userId,
      createdAt: new Date().toISOString()
    }

    const userEntries = allEntries[userId] || []
    allEntries[userId] = [newEntry, ...userEntries]

    saveAll(allEntries)
    return mockApiCall(newEntry)
  },

  deleteEntry: async (userId, entryId) => {
    const allEntries = loadAll()
    const userEntries = allEntries[userId] || []

    allEntries[userId] = userEntries.filter(e => e.id !== entryId)
    saveAll(allEntries)

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

