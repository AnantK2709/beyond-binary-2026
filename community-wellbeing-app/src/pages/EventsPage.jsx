import { useContext, useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { EventContext } from '../context/EventContext'
import EventFilters from '../components/events/EventFilters'
import EventsList from '../components/events/EventsList'
import Navbar from '../components/components/common/Navbar'
import { Calendar, Search, PartyPopper, ArrowUp } from 'lucide-react'

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 font-heading">Discover Events</h1>
            <p className="text-gray-600">Join activities, connect with your community, and boost your wellbeing</p>
          </div>
          <button
            onClick={() => navigate('/my-events')}
            className="px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors font-semibold flex items-center gap-2 shadow-md"
          >
            <Calendar size={18} />
            <span>My Events</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="text-3xl font-bold text-sage-600 mb-1 font-heading">{events.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-bold text-ocean-500 mb-1 font-heading">
              {events.filter(e => new Date(e.date) > new Date()).length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-bold text-sage-500 mb-1 font-heading">
              {events.filter(e => e.organizer?.verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="card p-5">
            <div className="text-3xl font-bold text-sage-400 mb-1 font-heading">
              {new Set(events.map(e => e.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={toggleSidebar}
            className="w-full px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <Search size={18} />
            <span>Filters & Search</span>
            {Object.values(localFilters).filter(v => v && v !== 'all' && v !== false).length > 0 && (
              <span className="ml-2 bg-white/30 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {Object.values(localFilters).filter(v => v && v !== 'all' && v !== false).length}
              </span>
            )}
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
                  className="w-full px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-semibold"
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
                  className="w-full px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors font-semibold"
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
      </div>
    </div>
  )
}

export default EventsPage
