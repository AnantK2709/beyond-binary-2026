import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { EventContext } from '../context/EventContext'
import { eventService } from '../services/eventService'
import EventDetailSidebar from '../components/events/EventDetailSidebar'
import PostEventModal from '../components/events/PostEventModal'

function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isRsvped } = useContext(EventContext)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [similarEvents, setSimilarEvents] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const hasRsvped = event ? isRsvped(event.id) : false

  useEffect(() => {
    loadEventDetails()
  }, [id])

  const loadEventDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load event details
      const eventData = await eventService.getEventById(id)
      setEvent(eventData)

      // Load similar events (same category, different event)
      const allEvents = await eventService.getEventsByCategory(eventData.category)
      const similar = allEvents.filter(e => e.id !== id).slice(0, 3)
      setSimilarEvents(similar)

      // Check if user has reviewed this event
      const review = await eventService.getEventReview(id)
      setUserReview(review)
    } catch (err) {
      console.error('Error loading event:', err)
      setError(err.message || 'Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleBackClick = () => {
    navigate('/events')
  }

  const handleLeaveReview = () => {
    setShowReviewModal(true)
  }

  const handleReviewSubmit = async () => {
    // Reload event details to update review status
    await loadEventDetails()
    setShowReviewModal(false)
  }

const isEventPast = () => {
  if (!event) return false
  const eventDateTime = new Date(`${event.date}T${event.time || '00:00'}:00`)
  return eventDateTime < new Date()
}


  const shouldShowReviewButton = () => {
    return isEventPast() && hasRsvped && !userReview
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={handleBackClick}
            className="btn-primary px-6 py-3"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/events" className="hover:text-sage-600 transition-colors">
            Events
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{event.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image Section */}
            <div className="card overflow-hidden p-0">
              <div className="relative h-96 bg-gradient-to-br from-sage-300/40 to-ocean-400/40">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-9xl">
                    {getCategoryIcon(event.category)}
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Event Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="badge badge-primary px-3 py-1.5 text-sm capitalize">
                      {event.category}
                    </span>
                    {event.organizer?.verified && (
                      <span className="badge badge-success px-3 py-1.5 text-sm">
                        ✓ Verified
                      </span>
                    )}
                    {isEventPast() && (
                      <span className="badge bg-gray-500/80 text-white px-3 py-1.5 text-sm">
                        Past Event
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                    {event.title}
                  </h1>
                  <p className="text-lg text-white/90 drop-shadow">
                    {formatDate(event.date)} at {formatTime(event.time)}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Button (if applicable) */}
            {shouldShowReviewButton() && (
              <div className="card p-6 bg-gradient-to-r from-sage-400/20 to-ocean-400/20 border-2 border-sage-400/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      How was your experience?
                    </h3>
                    <p className="text-gray-600">
                      Share your feedback and earn bonus points!
                    </p>
                  </div>
                  <Link
                    to={`/events/${event.id}/post-event`}
                    className="btn-primary px-6 py-3 whitespace-nowrap inline-block text-center"
                  >
                    Post-Event Feedback
                  </Link>
                </div>
              </div>
            )}

            {/* User Review Display (if exists) */}
            {userReview && (
              <div className="card p-6 border-2 border-sage-400/40">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✓</span>
                  Your Review
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill={star <= userReview.rating ? '#F59E0B' : 'none'}
                        stroke={star <= userReview.rating ? '#F59E0B' : '#D1D5DB'}
                        strokeWidth="1.5"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({userReview.rating}/5)
                    </span>
                  </div>
                  {userReview.text && (
                    <p className="text-gray-700">{userReview.text}</p>
                  )}
                  {userReview.wouldRecommend !== undefined && (
                    <p className="text-sm text-gray-600">
                      {userReview.wouldRecommend ? '✓ Would recommend' : '✗ Would not recommend'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose prose-sage max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {event.description || event.fullDescription || 'No description available for this event.'}
                </p>
                {event.fullDescription && event.fullDescription !== event.description && (
                  <p className="text-gray-700 leading-relaxed mt-4">
                    {event.fullDescription}
                  </p>
                )}
              </div>
            </div>

            {/* What to Bring Section */}
            {event.whatToBring && event.whatToBring.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🎒</span>
                  What to Bring
                </h2>
                <ul className="space-y-3">
                  {event.whatToBring.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <svg
                        className="w-6 h-6 text-sage-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags Section */}
            {event.tags && event.tags.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-sage-100 text-sage-700 px-4 py-2 text-sm font-medium hover:bg-sage-200 transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Events Section */}
            {similarEvents.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Events You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarEvents.map((similarEvent) => (
                    <div
                      key={similarEvent.id}
                      onClick={() => navigate(`/events/${similarEvent.id}`)}
                      className="card card-hover p-4 cursor-pointer group"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-sage-300/40 to-ocean-400/40 flex items-center justify-center text-3xl flex-shrink-0">
                          {getCategoryIcon(similarEvent.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-sage-600 transition-colors line-clamp-2 mb-1">
                            {similarEvent.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {formatDate(similarEvent.date)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="badge badge-primary px-2 py-1 text-xs capitalize">
                              {similarEvent.category}
                            </span>
                            <span>+{similarEvent.pointsReward} pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <EventDetailSidebar event={event} />
          </div>
        </div>
      </div>

      {/* Post Event Review Modal */}
      {showReviewModal && (
        <PostEventModal
          event={event}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  )
}

export default EventDetailPage
