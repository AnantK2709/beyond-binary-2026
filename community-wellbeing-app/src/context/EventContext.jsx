import { createContext, useState, useEffect } from 'react'
import { eventService } from '../services/eventService'

export const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadEvents()
  }, [filters])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const data = await eventService.getEvents(filters)
      setEvents(data.events)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const rsvpEvent = async (eventId) => {
    try {
      await eventService.rsvpEvent(eventId)
      // Update local state
      const rsvps = JSON.parse(localStorage.getItem('rsvp_events') || '[]')
      if (!rsvps.includes(eventId)) {
        rsvps.push(eventId)
        localStorage.setItem('rsvp_events', JSON.stringify(rsvps))
      }
      return true
    } catch (error) {
      console.error('Error RSVPing to event:', error)
      return false
    }
  }

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  return (
    <EventContext.Provider value={{ events, loading, filters, updateFilters, rsvpEvent, loadEvents }}>
      {children}
    </EventContext.Provider>
  )
}
