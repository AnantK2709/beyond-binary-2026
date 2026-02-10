// Enhanced date utilities for Events feature with comprehensive formatting

/**
 * Formats a date string for event display (e.g., "Monday, February 10, 2026")
 * @param {string} dateString - ISO date string or date-like string
 * @returns {string} Formatted date
 */
export const formatEventDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formats a time string for event display (e.g., "2:30 PM")
 * @param {string} timeString - Time string in HH:MM format
 * @returns {string} Formatted time
 */
export const formatEventTime = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Formats a time range for event display (e.g., "2:00 PM - 4:00 PM")
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {string} Formatted time range
 */
export const formatTimeRange = (startTime, endTime) => {
  return `${formatEventTime(startTime)} - ${formatEventTime(endTime)}`
}

/**
 * Checks if an event is in the past
 * @param {string} dateString - Event date
 * @param {string} timeString - Event time in HH:MM format (optional)
 * @returns {boolean} True if event is in the past
 */
export const isEventInPast = (dateString, timeString = '23:59') => {
  const eventDate = new Date(dateString)
  const [hours, minutes] = timeString.split(':')
  eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

  return eventDate < new Date()
}

/**
 * Checks if an event is today
 * @param {string} dateString - Event date
 * @returns {boolean} True if event is today
 */
export const isEventToday = (dateString) => {
  const eventDate = new Date(dateString)
  const today = new Date()

  return eventDate.getDate() === today.getDate() &&
         eventDate.getMonth() === today.getMonth() &&
         eventDate.getFullYear() === today.getFullYear()
}

/**
 * Checks if an event is full based on current and max attendees
 * @param {number} currentAttendees - Current number of attendees
 * @param {number} maxAttendees - Maximum number of attendees
 * @returns {boolean} True if event is at capacity
 */
export const isEventFull = (currentAttendees, maxAttendees) => {
  return currentAttendees >= maxAttendees
}

/**
 * Calculates and formats event duration
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {string} Formatted duration (e.g., "2 hours", "1.5 hours")
 */
export const formatDuration = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)

  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes

  const durationMinutes = endTotalMinutes - startTotalMinutes
  const hours = durationMinutes / 60

  if (durationMinutes < 60) {
    return `${durationMinutes} minutes`
  } else if (durationMinutes % 60 === 0) {
    return `${Math.floor(hours)} ${Math.floor(hours) === 1 ? 'hour' : 'hours'}`
  } else {
    return `${hours.toFixed(1)} hours`
  }
}

// Legacy functions for backward compatibility
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const getRelativeTime = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return formatDate(isoString)
}

export const isUpcoming = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
}

export const getDaysUntil = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
