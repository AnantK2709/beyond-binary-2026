import { useContext, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { EventContext } from '../context/EventContext'
import EventFilters from '../components/events/EventFilters'
import EventsList from '../components/events/EventsList'
import Navbar from '../components/components/common/Navbar'

function EventsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { events, loading, updateFilters } = useContext(EventContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize filters from URL params
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || 'all',
    timeOfDay: searchParams.get('timeOfDay') || 'all',
    ageGroup: searchParams.get('ageGroup') || 'all',
    verified: searchParams.get('verified') === 'true',
    search: searchParams.get('search') || '',
    dateRange: {
      start: searchParams.get('startDate') || '',
      end: searchParams.get('endDate') || ''
    }
  })

  // Filter events based on local filters
  const getFilteredEvents = () => {
    let filtered = [...events]

    // Category filter
    if (localFilters.category !== 'all') {
      filtered = filtered.filter(e => e.category === localFilters.category)
    }

    // Time of day filter
    if (localFilters.timeOfDay !== 'all') {
      filtered = filtered.filter(e => {
        const hour = parseInt(e.time.split(':')[0])
        if (localFilters.timeOfDay === 'morning') return hour < 12
        if (localFilters.timeOfDay === 'afternoon') return hour >= 12 && hour < 17
        if (localFilters.timeOfDay === 'evening') return hour >= 17
        return true
      })
    }

    // Age group filter
    if (localFilters.ageGroup !== 'all') {
      filtered = filtered.filter(e => e.ageGroup === localFilters.ageGroup)
    }

    // Verified filter
    if (localFilters.verified) {
      filtered = filtered.filter(e => e.organizer?.verified === true)
    }

    // Search filter
    if (localFilters.search) {
      const searchLower = localFilters.search.toLowerCase()
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower) ||
        e.location?.toLowerCase().includes(searchLower) ||
        e.organizer?.name?.toLowerCase().includes(searchLower)
      )
    }

    // Date range filter
    if (localFilters.dateRange.start) {
      const startDate = new Date(localFilters.dateRange.start)
      filtered = filtered.filter(e => new Date(e.date) >= startDate)
    }
    if (localFilters.dateRange.end) {
      const endDate = new Date(localFilters.dateRange.end)
      filtered = filtered.filter(e => new Date(e.date) <= endDate)
    }

    // Sort events:
    // 1. Future events first (sorted by date ascending)
    // 2. Past events without reviews (sorted by date descending)
    // 3. Past events with reviews at the bottom (sorted by date descending)
    filtered.sort((a, b) => {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)
      const now = new Date()
      const aIsPast = aDate < now
      const bIsPast = bDate < now

      // Check if events have reviews (from localStorage)
      const reviews = JSON.parse(localStorage.getItem('event_reviews') || '{}')
      const aHasReview = !!reviews[a.id]
      const bHasReview = !!reviews[b.id]

      // Both future - sort by date ascending (earliest first)
      if (!aIsPast && !bIsPast) {
        return aDate - bDate
      }

      // One future, one past - future comes first
      if (!aIsPast && bIsPast) return -1
      if (aIsPast && !bIsPast) return 1

      // Both past - reviewed events go to the bottom
      if (aHasReview && !bHasReview) return 1
      if (!aHasReview && bHasReview) return -1

      // Both past with same review status - sort by date descending (most recent first)
      return bDate - aDate
    })

    return filtered
  }

  const filteredEvents = getFilteredEvents()

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (localFilters.category !== 'all') params.set('category', localFilters.category)
    if (localFilters.timeOfDay !== 'all') params.set('timeOfDay', localFilters.timeOfDay)
    if (localFilters.ageGroup !== 'all') params.set('ageGroup', localFilters.ageGroup)
    if (localFilters.verified) params.set('verified', 'true')
    if (localFilters.search) params.set('search', localFilters.search)
    if (localFilters.dateRange.start) params.set('startDate', localFilters.dateRange.start)
    if (localFilters.dateRange.end) params.set('endDate', localFilters.dateRange.end)

    setSearchParams(params, { replace: true })
  }, [localFilters, setSearchParams])

  const handleFilterChange = (newFilters) => {
    setLocalFilters(prev => ({ ...prev, ...newFilters }))
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-3">Discover Events</h1>
                <p className="text-gray-600 text-lg">
                  Join activities, connect with your community, and boost your wellbeing
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/my-events')}
                  className="btn-secondary px-6 py-3 flex items-center gap-2"
                >
                  {/* <span>📅</span> */}
                  <span className="hidden sm:inline">My Events</span>
                </button>
                <div className="hidden lg:block text-6xl animate-float">
                  🎉
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-sage-400/20 to-sage-500/20 rounded-2xl p-4 border border-sage-300/30">
                <div className="text-3xl font-bold text-sage-700">{events.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Events</div>
              </div>
              <div className="bg-gradient-to-br from-ocean-400/20 to-ocean-500/20 rounded-2xl p-4 border border-ocean-300/30">
                <div className="text-3xl font-bold text-ocean-600">
                  {events.filter(e => new Date(e.date) > new Date()).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Upcoming</div>
              </div>
              <div className="bg-gradient-to-br from-sage-300/20 to-ocean-400/20 rounded-2xl p-4 border border-sage-300/30">
                <div className="text-3xl font-bold text-sage-700">
                  {events.filter(e => e.organizer?.verified).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Verified</div>
              </div>
              <div className="bg-gradient-to-br from-sage-400/20 to-ocean-400/20 rounded-2xl p-4 border border-sage-300/30">
                <div className="text-3xl font-bold text-sage-700">
                  {new Set(events.map(e => e.category)).size}
                </div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={toggleSidebar}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            <span>Filters & Search</span>
            <span className="ml-2 badge bg-white/30 text-white px-2 py-1 text-xs">
              {Object.values(localFilters).filter(v => v && v !== 'all' && v !== false).length || '0'}
            </span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-6">
              {/* Mobile Close Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={toggleSidebar}
                  className="btn-secondary w-full py-3"
                >
                  Close Filters
                </button>
              </div>

              <EventFilters
                filters={localFilters}
                onFilterChange={handleFilterChange}
              />

              {/* Mobile Apply Button */}
              <div className="lg:hidden mt-4">
                <button
                  onClick={toggleSidebar}
                  className="btn-primary w-full py-3"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Events Grid */}
          <main className="lg:col-span-3">
            <EventsList events={filteredEvents} loading={loading} />
          </main>
        </div>

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl"
            aria-label="Back to top"
          >
            <span className="text-2xl">↑</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default EventsPage
