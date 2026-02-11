import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { eventService } from '../services/eventService'
import EventCard from '../components/events/EventCard'
import { formatEventDate, formatEventTime, isEventInPast } from '../utils/dateUtils'
import Navbar from '../components/components/common/Navbar'
import { Ticket, Calendar, CheckCircle, AlertTriangle, Clock, Star } from 'lucide-react'

function MyEventsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState({})

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all RSVP'd events
      const rsvpEvents = await eventService.getRsvpEvents()

      // Get event reviews to check which events have been reviewed
      const reviewsData = JSON.parse(localStorage.getItem('event_reviews') || '{}')
      setReviews(reviewsData)

      setEvents(rsvpEvents)
    } catch (err) {
      console.error('Error loading events:', err)
      setError('Failed to load your events. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter events by upcoming/past
  const getFilteredEvents = () => {
    if (!events) return []

    if (activeTab === 'upcoming') {
      return events.filter(event => !isEventInPast(event.date, event.time))
    } else {
      return events.filter(event => isEventInPast(event.date, event.time))
    }
  }

  const filteredEvents = getFilteredEvents()

  const handleLeaveReview = (eventId) => {
    navigate(`/events/${eventId}/post-event`)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="card p-8 animate-slide-up-fade">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-3">My Events</h1>
                <p className="text-gray-600 text-lg">
                  Track your event journey and stay connected with your community
                </p>
              </div>
              <div className="hidden lg:block animate-float">
                <Ticket size={56} className="text-sage-500" />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-sage-400/20 to-sage-500/20 rounded-2xl p-4 border border-sage-300/30">
                <div className="text-3xl font-bold text-sage-700">
                  {events.filter(e => !isEventInPast(e.date, e.time)).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Upcoming</div>
              </div>
              <div className="bg-gradient-to-br from-ocean-400/20 to-ocean-500/20 rounded-2xl p-4 border border-ocean-300/30">
                <div className="text-3xl font-bold text-ocean-600">
                  {events.filter(e => isEventInPast(e.date, e.time)).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Attended</div>
              </div>
              <div className="bg-gradient-to-br from-sage-300/20 to-ocean-400/20 rounded-2xl p-4 border border-sage-300/30">
                <div className="text-3xl font-bold text-sage-700">
                  {Object.keys(reviews).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="card p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar size={16} className="inline mr-2" />
                Upcoming Events
                <span className="ml-2 text-sm">
                  ({events.filter(e => !isEventInPast(e.date, e.time)).length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'past'
                    ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CheckCircle size={16} className="inline mr-2" />
                Past Events
                <span className="ml-2 text-sm">
                  ({events.filter(e => isEventInPast(e.date, e.time)).length})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card p-12 text-center animate-slide-up-fade">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-sage-500/30 border-t-sage-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 text-lg">Loading your events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="card p-8 text-center border-2 border-red-200 animate-slide-up-fade">
            <div className="flex justify-center mb-4"><AlertTriangle size={56} className="text-red-400" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadEvents}
              className="btn-primary px-6 py-3"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Events Content */}
        {!loading && !error && (
          <>
            {/* Upcoming Events Tab */}
            {activeTab === 'upcoming' && (
              <div className="animate-slide-up-fade">
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="flex justify-center mb-4"><Calendar size={56} className="text-sage-400" /></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No Upcoming Events
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't RSVP'd to any upcoming events yet. Discover exciting events to join!
                    </p>
                    <button
                      onClick={() => navigate('/events')}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      Discover Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Past Events Tab */}
            {activeTab === 'past' && (
              <div className="animate-slide-up-fade">
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
                      const hasReview = reviews[event.id]
                      const isPast = isEventInPast(event.date, event.time)

                      return (
                        <div key={event.id} className="relative">
                          {/* Past Event Card with slight opacity */}
                          <div className="opacity-90">
                            <EventCard event={event} />
                          </div>

                          {/* Attended Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <div className="badge bg-gradient-to-r from-ocean-500/90 to-ocean-600/90 text-white px-3 py-1.5 text-xs font-semibold shadow-lg border-white/40 flex items-center gap-1">
                              <CheckCircle size={12} /> Attended
                            </div>
                          </div>

                          {/* Review Section Overlay */}
                          {isPast && !hasReview && (
                            <div className="mt-4">
                              <button
                                onClick={() => handleLeaveReview(event.id)}
                                className="w-full btn-primary py-3 px-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Star size={16} />
                                <span>Leave a Review</span>
                              </button>
                            </div>
                          )}

                          {/* Review Status Badge */}
                          {hasReview && (
                            <div className="mt-4">
                              <div className="card p-4 bg-gradient-to-r from-sage-50/50 to-ocean-50/50 border border-sage-300/30">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Star size={16} className="text-sage-600" />
                                    <span className="text-sm font-semibold text-sage-700">
                                      Review Submitted
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {hasReview.rating}/5
                                  </div>
                                </div>
                                {hasReview.text && (
                                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    "{hasReview.text}"
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="flex justify-center mb-4"><Clock size={56} className="text-ocean-400" /></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No Past Events
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't attended any events yet. Start your journey today!
                    </p>
                    <button
                      onClick={() => navigate('/events')}
                      className="btn-primary px-8 py-3 text-lg"
                    >
                      Browse Events
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Back to Top Button */}
        {filteredEvents.length > 6 && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl"
              aria-label="Back to top"
            >
              <span className="text-2xl">↑</span>
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default MyEventsPage
