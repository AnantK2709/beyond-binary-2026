import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { EventContext } from '../../context/EventContext'

function EventCard({ event }) {
  const navigate = useNavigate()
  const { rsvpEvent, cancelRsvp, isRsvped } = useContext(EventContext)
  const [isLoading, setIsLoading] = useState(false)
  const hasRsvped = isRsvped(event.id)

  const handleRsvp = async (e) => {
    e.stopPropagation()
    setIsLoading(true)

    try {
      if (hasRsvped) {
        const result = await cancelRsvp(event.id)
        if (result.success) {
          console.log('RSVP cancelled successfully')
        }
      } else {
        const result = await rsvpEvent(event.id)
        if (result.success) {
          console.log('RSVP successful')
        }
      }
    } catch (error) {
      console.error('RSVP error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      wellness: '🧘‍♀️',
      fitness: '💪',
      creative: '🎨',
      social: '👥',
      learning: '📚'
    }
    return icons[category] || '🎯'
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div
      className="card card-hover group cursor-pointer relative overflow-hidden animate-slide-up-fade"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      {/* Event Image/Icon */}
      <div className="h-48 bg-gradient-to-br from-sage-300/40 to-ocean-400/40 flex items-center justify-center text-7xl relative overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <span className="animate-float">{getCategoryIcon(event.category)}</span>
        )}

        {/* Verified Badge */}
        {event.organizer?.verified && (
          <div className="absolute top-3 right-3 badge badge-success px-3 py-1.5 text-xs font-semibold shadow-lg">
            ✓ Verified
          </div>
        )}

        {/* Points Badge */}
        <div className="absolute top-3 left-3 badge px-3 py-1.5 text-xs font-semibold shadow-lg bg-gradient-to-r from-sage-500/90 to-sage-600/90 text-white border-white/40">
          +{event.pointsReward} pts
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 badge badge-primary px-3 py-1.5 text-xs font-medium capitalize shadow-lg">
          {event.category}
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sage-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <span className="font-medium">{formatDate(event.date)} • {formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">📍</span>
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">👥</span>
            <span>
              {event.participants}/{event.maxParticipants} participants
              {event.participants >= event.maxParticipants * 0.8 && (
                <span className="ml-2 text-xs text-orange-600 font-medium">Almost Full!</span>
              )}
            </span>
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2">
              <span className="text-base">🏢</span>
              <span className="truncate font-medium text-sage-700">{event.organizer.name}</span>
            </div>
          )}
        </div>

        {/* RSVP Button */}
        <button
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            hasRsvped
              ? 'bg-gradient-to-r from-gray-400/30 to-gray-500/30 text-gray-700 border border-gray-400/40 hover:from-red-400/30 hover:to-red-500/30 hover:text-red-700 hover:border-red-400/40'
              : 'btn-primary'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleRsvp}
          disabled={isLoading || (!hasRsvped && event.participants >= event.maxParticipants)}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : hasRsvped ? (
            'Cancel RSVP'
          ) : event.participants >= event.maxParticipants ? (
            'Event Full'
          ) : (
            'Sign Up for Event'
          )}
        </button>
      </div>
    </div>
  )
}

export default EventCard
