import { useContext, useState } from 'react'
import { EventContext } from '../../context/EventContext'
import { GamificationContext } from '../../context/GamificationContext'
import { eventService } from '../../services/eventService'
import Toast from '../common/Toast'

function EventDetailSidebar({ event }) {
  const { rsvpEvent, cancelRsvp, isRsvped } = useContext(EventContext)
  const { awardPoints } = useContext(GamificationContext)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' })
  const hasRsvped = isRsvped(event.id)

  const showToast = (type, message) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }

  const handleRsvp = async () => {
    setIsLoading(true)
    try {
      if (hasRsvped) {
        const result = await cancelRsvp(event.id)
        if (result.success) {
          showToast('success', 'RSVP cancelled successfully')
        }
      } else {
        const result = await rsvpEvent(event.id)
        if (result.success) {
          awardPoints(10, 'event_rsvp', 'RSVP to event')
          showToast('success', 'RSVP successful! Calendar file downloaded.')

          // Download ICS calendar file
          setTimeout(() => {
            eventService.downloadICS(event)
          }, 500)
        }
      }
    } catch (error) {
      console.error('RSVP error:', error)
      showToast('error', error.message || 'Failed to process RSVP')
    } finally {
      setIsLoading(false)
    }
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
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
    if (hours > 0) return `${hours}h`
    return `${mins}m`
  }

  const getCapacityPercentage = () => {
    return (event.participants / event.maxParticipants) * 100
  }

  const getCapacityColor = () => {
    const percentage = getCapacityPercentage()
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-orange-600'
    return 'text-sage-600'
  }

  // Mock attendees data
  const mockAttendees = [
    { id: 1, name: 'Sarah J.', avatar: '👩' },
    { id: 2, name: 'Mike T.', avatar: '👨' },
    { id: 3, name: 'Lisa K.', avatar: '👩' },
    { id: 4, name: 'David R.', avatar: '👨' },
    { id: 5, name: 'Emma W.', avatar: '👩' }
  ]

  return (
    <div className="space-y-6">
      {/* RSVP Card */}
      <div className="card p-6 sticky top-6 space-y-6">
        {/* Event Status */}
        <div className="flex items-center justify-between">
          {hasRsvped ? (
            <div className="badge badge-success px-4 py-2">
              <span className="mr-2">✓</span>
              You're Going!
            </div>
          ) : (
            <div className="badge badge-info px-4 py-2">
              Not Registered
            </div>
          )}
          {event.organizer?.verified && (
            <div className="badge badge-success px-3 py-2 text-xs">
              ✓ Verified
            </div>
          )}
        </div>

        {/* RSVP Button */}
        <button
          onClick={handleRsvp}
          disabled={isLoading || (!hasRsvped && event.participants >= event.maxParticipants)}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            hasRsvped
              ? 'bg-gradient-to-r from-gray-400/30 to-gray-500/30 text-gray-700 border border-gray-400/40 hover:from-red-400/30 hover:to-red-500/30 hover:text-red-700 hover:border-red-400/40'
              : 'btn-primary'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
            <>
              <span className="mr-2"></span>
              RSVP for Event
            </>
          )}
        </button>

        {/* Points Reward */}
        <div className="bg-gradient-to-r from-sage-400/20 to-ocean-400/20 rounded-2xl p-4 border border-sage-300/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold text-gray-800">Points Reward</span>
            </div>
            <span className="text-2xl font-bold text-sage-700">+{event.pointsReward}</span>
          </div>
        </div>

        <hr className="border-gray-200/50" />

        {/* Event Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Event Details</h3>

          <div className="flex items-start gap-3">
            {/* <span className="text-2xl">📅</span> */}
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-semibold text-gray-900">{formatDate(event.date)}</p>
              <p className="text-sage-700">{formatTime(event.time)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {/* <span className="text-2xl">⏱️</span> */}
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold text-gray-900">{formatDuration(event.duration)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {/* <span className="text-2xl">📍</span> */}
            <div className="flex-1">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-900">{event.location}</p>
              <button className="text-sm text-sage-600 hover:text-sage-700 mt-1 underline">
                Get Directions
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {/* <span className="text-2xl">🎯</span> */}
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <span className="badge badge-primary text-sm px-3 py-1.5 mt-1 capitalize">
                {event.category}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {/* <span className="text-2xl">🏷️</span> */}
            <div>
              <p className="text-sm text-gray-500">Age Group</p>
              <p className="font-semibold text-gray-900">{event.ageGroup}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200/50" />

        {/* Capacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Event Capacity</span>
            <span className={`text-sm font-bold ${getCapacityColor()}`}>
              {event.participants}/{event.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
              style={{ width: `${getCapacityPercentage()}%` }}
            ></div>
          </div>
          {getCapacityPercentage() >= 70 && (
            <p className="text-xs text-orange-600 mt-2 font-medium">
              {getCapacityPercentage() >= 90 ? 'Almost full! Reserve your spot now.' : 'Filling up fast!'}
            </p>
          )}
        </div>
      </div>

      {/* Organizer Card */}
      {event.organizer && (
        <div className="card p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span>🏢</span>
            Organizer
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-300 to-sage-400 flex items-center justify-center text-3xl">
              🏢
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{event.organizer.name}</h4>
                {event.organizer.verified && (
                  <span className="text-green-600 text-sm">✓</span>
                )}
              </div>
              {event.organizer.verificationBadge && (
                <span className="badge badge-success text-xs px-2 py-1 capitalize">
                  {event.organizer.verificationBadge} Partner
                </span>
              )}
            </div>
          </div>
          <button className="btn-secondary w-full py-3">
            View Profile
          </button>
        </div>
      )}

      {/* Attendees Preview */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span>👥</span>
          Who's Going
        </h3>
        <div className="flex items-center gap-3">
          {mockAttendees.slice(0, 5).map((attendee, index) => (
            <div
              key={attendee.id}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-300 to-ocean-400 flex items-center justify-center text-2xl border-2 border-white shadow-lg transform hover:scale-110 transition-transform"
              style={{ marginLeft: index > 0 ? '-12px' : '0', zIndex: 5 - index }}
              title={attendee.name}
            >
              {attendee.avatar}
            </div>
          ))}
          {event.participants > 5 && (
            <div className="w-12 h-12 rounded-full bg-sage-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg -ml-3">
              +{event.participants - 5}
            </div>
          )}
        </div>
        {hasRsvped && (
          <p className="text-sm text-sage-700 font-medium">
            You and {event.participants - 1} others are going
          </p>
        )}
        <button className="text-sm text-sage-600 hover:text-sage-700 font-medium underline">
          See All Attendees
        </button>
      </div>

      {/* Share Card */}
      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span>📤</span>
          Share Event
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-sage-300/50">
            <span className="text-2xl">📱</span>
            <span className="text-xs font-medium text-gray-700">Copy</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-sage-300/50">
            <span className="text-2xl">✉️</span>
            <span className="text-xs font-medium text-gray-700">Email</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-sage-300/50">
            <span className="text-2xl">💬</span>
            <span className="text-xs font-medium text-gray-700">SMS</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-sage-300/50">
            <span className="text-2xl">🔗</span>
            <span className="text-xs font-medium text-gray-700">More</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />
      )}
    </div>
  )
}

export default EventDetailSidebar
