// Event Service - Complete event management functionality
import { mockApiCall } from './api'
import { MOCK_EVENTS } from '../utils/mockData'

// API Base URL - reads from environment variable or defaults to localhost
// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

/**
 * Get all events with optional filters
 * @param {Object} filters - Filter criteria (category, timeOfDay, date, search)
 * @returns {Promise<Object>} Events list and metadata
 */
const getEvents = async (filters = {}) => {
  try {
    // Build query parameters from filters
    const queryParams = new URLSearchParams()

    if (filters.category && filters.category !== 'all') {
      queryParams.append('category', filters.category)
    }
    if (filters.timeOfDay && filters.timeOfDay !== 'all') {
      queryParams.append('timeOfDay', filters.timeOfDay)
    }
    if (filters.date) {
      queryParams.append('date', filters.date)
    }
    if (filters.search) {
      queryParams.append('search', filters.search)
    }
    if (filters.status) {
      queryParams.append('status', filters.status)
    }
    // Pass user interests for personalized matching
    if (filters.userInterests && filters.userInterests.length > 0) {
      queryParams.append('userInterests', filters.userInterests.join(','))
      console.log('[EventService] Using interests for matching:', filters.userInterests.join(','))
    }

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/events${queryString ? `?${queryString}` : ''}`

    console.log('[EventService] Fetching events from API:', url)

    // Make API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[EventService] API response:', data)

    // Check RSVP status for each event from localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
    const eventsWithRsvp = data.events.map(event => ({
      ...event,
      isRsvped: rsvps.includes(event.id)
    }))

    return {
      events: eventsWithRsvp,
      total: data.total,
      filters: filters
    }

  } catch (error) {
    console.warn('[EventService] API call failed, falling back to MOCK_EVENTS:', error.message)

    // Fallback to mock data with client-side filtering
    let events = [...MOCK_EVENTS]

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      events = events.filter(e => e.category === filters.category)
    }

    // Apply time of day filter
    if (filters.timeOfDay && filters.timeOfDay !== 'all') {
      events = events.filter(e => {
        const hour = parseInt(e.time.split(':')[0])
        if (filters.timeOfDay === 'morning') return hour < 12
        if (filters.timeOfDay === 'afternoon') return hour >= 12 && hour < 17
        if (filters.timeOfDay === 'evening') return hour >= 17
        return true
      })
    }

    // Apply date filter
    if (filters.date) {
      events = events.filter(e => e.date === filters.date)
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      events = events.filter(e =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower) ||
        e.organization?.toLowerCase().includes(searchLower)
      )
    }

    // Apply upcoming/past filter
    if (filters.status === 'upcoming') {
      const now = new Date()
      events = events.filter(e => new Date(e.date) >= now)
    } else if (filters.status === 'past') {
      const now = new Date()
      events = events.filter(e => new Date(e.date) < now)
    }

    // Check RSVP status from localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
    const eventsWithRsvp = events.map(event => ({
      ...event,
      isRsvped: rsvps.includes(event.id)
    }))

    return mockApiCall({
      events: eventsWithRsvp,
      total: eventsWithRsvp.length,
      filters: filters
    })
  }
}

/**
 * Get a specific event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} Event details
 */
const getEventById = async (id) => {
  try {
    const url = `${API_BASE_URL}/api/events/${id}`
    console.log('[EventService] Fetching event by ID from API:', url)

    // Make API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[EventService] API response for event:', data)

    // Backend returns { event, similarEvents } structure
    const event = data.event || data

    // Get RSVP status from localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
    const isRsvped = rsvps.includes(id)

    return {
      ...event,
      isRsvped,
      attendeeCount: event.attendees || event.attendeeCount || event.participants || Math.floor(Math.random() * (event.maxAttendees || event.maxParticipants || 50))
    }

  } catch (error) {
    console.warn('[EventService] API call failed for event ID, falling back to MOCK_EVENTS:', error.message)

    // Fallback to mock data
    const event = MOCK_EVENTS.find(e => e.id === id)

    if (!event) {
      throw new Error('Event not found')
    }

    // Get RSVP status from localStorage
    const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
    const isRsvped = rsvps.includes(id)

    return mockApiCall({
      ...event,
      isRsvped,
      attendeeCount: event.attendees || event.participants || Math.floor(Math.random() * (event.maxAttendees || event.maxParticipants || 50))
    })
  }
}

/**
 * RSVP to an event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} RSVP confirmation
 */
const rsvpEvent = async (eventId, userId = 'current-user') => {
  const event = MOCK_EVENTS.find(e => e.id === eventId)

  if (!event) {
    throw new Error('Event not found')
  }

  // Get current RSVPs
  const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')

  // Check if already RSVP'd
  if (rsvps.includes(eventId)) {
    throw new Error('Already RSVP\'d to this event')
  }

  // Check if event is full
  const currentAttendees = event.attendees || 0
  if (currentAttendees >= event.maxAttendees) {
    throw new Error('Event is full')
  }

  // Add RSVP
  rsvps.push(eventId)
  localStorage.setItem('rsvp_events', JSON.stringify(rsvps))

  // Store RSVP timestamp
  const rsvpTimestamps = JSON.parse(localStorage.getItem('rsvp_timestamps') || '{}')
  rsvpTimestamps[eventId] = new Date().toISOString()
  localStorage.setItem('rsvp_timestamps', JSON.stringify(rsvpTimestamps))

  return mockApiCall({
    success: true,
    eventId,
    message: `Successfully RSVP'd to ${event.title}`,
    pointsEarned: 10
  })
}

/**
 * Cancel RSVP to an event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Cancellation confirmation
 */
const cancelRsvp = async (eventId, userId = 'current-user') => {
  const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')

  if (!rsvps.includes(eventId)) {
    throw new Error('No RSVP found for this event')
  }

  // Remove RSVP
  const updatedRsvps = rsvps.filter(id => id !== eventId)
  localStorage.setItem('rsvp_events', JSON.stringify(updatedRsvps))

  // Remove timestamp
  const rsvpTimestamps = JSON.parse(localStorage.getItem('rsvp_timestamps') || '{}')
  delete rsvpTimestamps[eventId]
  localStorage.setItem('rsvp_timestamps', JSON.stringify(rsvpTimestamps))

  return mockApiCall({
    success: true,
    eventId,
    message: 'RSVP cancelled successfully'
  })
}

/**
 * Get all events the user has RSVP'd to
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of RSVP'd events
 */
const getRsvpEvents = async (userId = 'current-user') => {
  const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
  const rsvpTimestamps = JSON.parse(localStorage.getItem('rsvp_timestamps') || '{}')

  const events = MOCK_EVENTS
    .filter(event => rsvps.includes(event.id))
    .map(event => ({
      ...event,
      rsvpDate: rsvpTimestamps[event.id]
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return mockApiCall(events)
}

/**
 * Check if user has RSVP'd to an event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} RSVP status
 */
const isRsvpd = async (eventId, userId = 'current-user') => {
  const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
  return mockApiCall(rsvps.includes(eventId))
}

/**
 * Submit a review for an attended event
 * @param {string} eventId - Event ID
 * @param {Object} review - Review data (rating, mood, text, attended)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Review submission result with points and insights
 */
const submitReview = async (eventId, review, userId = 'current-user') => {
  const event = MOCK_EVENTS.find(e => e.id === eventId)

  if (!event) {
    throw new Error('Event not found')
  }

  // Validate review data
  if (!review.rating || review.rating < 1 || review.rating > 5) {
    throw new Error('Invalid rating')
  }

  // Store review
  const reviews = JSON.parse(localStorage.getItem('event_reviews') || '{}')
  reviews[eventId] = {
    ...review,
    eventId,
    userId,
    timestamp: new Date().toISOString(),
    eventTitle: event.title,
    eventCategory: event.category
  }
  localStorage.setItem('event_reviews', JSON.stringify(reviews))

  // Mark as attended if review submitted
  if (review.attended !== false) {
    const attended = JSON.parse(localStorage.getItem('attended_events') || '[]')
    if (!attended.includes(eventId)) {
      attended.push(eventId)
      localStorage.setItem('attended_events', JSON.stringify(attended))
    }
  }

  // Generate AI insight based on review
  let aiInsight = ''
  if (review.rating >= 4) {
    aiInsight = `Great to see you enjoyed ${event.title}! Your positive experience helps us recommend similar events.`
  } else if (review.rating === 3) {
    aiInsight = `Thanks for your feedback on ${event.title}. We'll work to suggest better matches for you.`
  } else {
    aiInsight = `We appreciate your honest feedback about ${event.title}. Let us help you find events that better fit your interests.`
  }

  return mockApiCall({
    success: true,
    eventId,
    pointsEarned: 50,
    levelUp: false,
    aiInsight,
    review: reviews[eventId]
  })
}

/**
 * Get a user's review for a specific event
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Event review or null if not found
 */
const getEventReview = async (eventId, userId = 'current-user') => {
  const reviews = JSON.parse(localStorage.getItem('event_reviews') || '{}')
  return mockApiCall(reviews[eventId] || null)
}

/**
 * Mark an event as attended (without review)
 * @param {string} eventId - Event ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Attendance confirmation
 */
const markAsAttended = async (eventId, userId = 'current-user') => {
  const event = MOCK_EVENTS.find(e => e.id === eventId)

  if (!event) {
    throw new Error('Event not found')
  }

  const attended = JSON.parse(localStorage.getItem('attended_events') || '[]')

  if (!attended.includes(eventId)) {
    attended.push(eventId)
    localStorage.setItem('attended_events', JSON.stringify(attended))
  }

  return mockApiCall({
    success: true,
    eventId,
    message: 'Event marked as attended',
    pointsEarned: 25
  })
}

/**
 * Get all events the user has attended
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of attended events
 */
const getAttendedEvents = async (userId = 'current-user') => {
  const attended = JSON.parse(localStorage.getItem('attended_events') || '[]')
  const reviews = JSON.parse(localStorage.getItem('event_reviews') || '{}')

  const events = MOCK_EVENTS
    .filter(event => attended.includes(event.id))
    .map(event => ({
      ...event,
      review: reviews[event.id] || null,
      attendedDate: reviews[event.id]?.timestamp || null
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return mockApiCall(events)
}

/**
 * Get events by category
 * @param {string} category - Event category
 * @returns {Promise<Array>} Filtered events
 */
const getEventsByCategory = async (category) => {
  const events = MOCK_EVENTS.filter(e => e.category === category)
  return mockApiCall(events)
}

/**
 * Get upcoming events (next 30 days)
 * @returns {Promise<Array>} Upcoming events
 */
const getUpcomingEvents = async () => {
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const events = MOCK_EVENTS.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= now && eventDate <= thirtyDaysFromNow
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  return mockApiCall(events)
}

export const eventService = {
  getEvents,
  getEventById,
  rsvpEvent,
  cancelRsvp,
  getRsvpEvents,
  isRsvpd,
  submitReview,
  getEventReview,
  markAsAttended,
  getAttendedEvents,
  getEventsByCategory,
  getUpcomingEvents
}
