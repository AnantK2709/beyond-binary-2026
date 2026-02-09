import { mockApiCall } from './api'
import { MOCK_EVENTS } from '../utils/mockData'

export const eventService = {
  getEvents: async (filters = {}) => {
    let events = [...MOCK_EVENTS]

    // Apply filters
    if (filters.category) {
      events = events.filter(e => e.category === filters.category)
    }
    if (filters.timeOfDay) {
      events = events.filter(e => {
        const hour = parseInt(e.time.split(':')[0])
        if (filters.timeOfDay === 'morning') return hour < 12
        if (filters.timeOfDay === 'afternoon') return hour >= 12 && hour < 17
        if (filters.timeOfDay === 'evening') return hour >= 17
        return true
      })
    }

    return mockApiCall({ events, total: events.length })
  },

  getEventById: async (id) => {
    const event = MOCK_EVENTS.find(e => e.id === id)
    return mockApiCall(event)
  },

  rsvpEvent: async (eventId) => {
    // Store in localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
    if (!rsvps.includes(eventId)) {
      rsvps.push(eventId)
      localStorage.setItem('rsvp_events', JSON.stringify(rsvps))
    }
    return mockApiCall({ success: true, eventId })
  },

  submitReview: async (eventId, review) => {
    const reviews = JSON.parse(localStorage.getItem('event_reviews') || '{}')
    reviews[eventId] = review
    localStorage.setItem('event_reviews', JSON.stringify(reviews))

    return mockApiCall({
      success: true,
      pointsEarned: 50,
      levelUp: false,
      aiInsight: "Great to see you enjoyed the event!"
    })
  }
}
