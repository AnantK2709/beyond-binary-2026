import { createContext, useState, useEffect } from 'react'
import { eventService } from '../services/eventService'
import { useAuth } from '../hooks/useAuth'

export const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [rsvpEvents, setRsvpEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadEvents()
    loadRsvpEvents()
  }, [filters, user])

  const loadEvents = async () => {
    setLoading(true)
    try {
      // Pass user interests to enable personalized matching
      const filtersWithInterests = {
        ...filters,
        userInterests: user?.interests || []
      }
      const data = await eventService.getEvents(filtersWithInterests)
      setEvents(data.events)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRsvpEvents = async () => {
    try {
      const data = await eventService.getRsvpEvents()
      setRsvpEvents(data)
    } catch (error) {
      console.error('Error loading RSVP events:', error)
    }
  }

  const rsvpEvent = async (eventId) => {
    try {
      const result = await eventService.rsvpEvent(eventId)
      // Reload RSVP events to update state
      await loadRsvpEvents()
      // Optionally reload all events to update participant counts
      await loadEvents()
      return { success: true, ...result }
    } catch (error) {
      console.error('Error RSVPing to event:', error)
      return { success: false, message: error.message }
    }
  }

  const cancelRsvp = async (eventId) => {
    try {
      const result = await eventService.cancelRsvp(eventId)
      // Reload RSVP events to update state
      await loadRsvpEvents()
      // Optionally reload all events to update participant counts
      await loadEvents()
      return { success: true, ...result }
    } catch (error) {
      console.error('Error cancelling RSVP:', error)
      return { success: false, message: error.message }
    }
  }

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  const isRsvped = (eventId) => {
    const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
    return rsvps.includes(eventId)
  }

  return (
    <EventContext.Provider value={{
      events,
      rsvpEvents,
      loading,
      filters,
      updateFilters,
      rsvpEvent,
      cancelRsvp,
      loadEvents,
      isRsvped
    }}>
      {children}
    </EventContext.Provider>
  )
}
