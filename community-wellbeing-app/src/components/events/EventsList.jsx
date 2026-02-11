import { Search, Target, Calendar, PartyPopper } from 'lucide-react'
import EventCard from './EventCard'

function EventsList({ events, loading }) {
  // Loading skeleton component
  const SkeletonCard = () => (
    <div className="card p-0 overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-12 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="card p-12 text-center max-w-lg mx-auto">
        <div className="mb-6 animate-float"><Search size={80} className="text-gray-300 mx-auto" /></div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
        </p>
        <div className="opacity-20"><Target size={56} className="text-gray-400 mx-auto" /></div>
      </div>
    </div>
  )

  // No upcoming events state
  const NoUpcomingEvents = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="card p-12 text-center max-w-lg mx-auto">
        <div className="mb-6 animate-float"><Calendar size={80} className="text-gray-300 mx-auto" /></div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Events</h3>
        <p className="text-gray-600 mb-6">
          There are no upcoming events at the moment. Check back soon for new activities and experiences!
        </p>
        <button className="btn-primary">
          Browse Past Events
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {/* Events Count Header */}
      <div className="mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PartyPopper size={24} className="text-sage-600" />
              <div>
                <h3 className="font-bold text-gray-900">
                  {events.length} {events.length === 1 ? 'Event' : 'Events'} Found
                </h3>
                <p className="text-sm text-gray-600">
                  Discover amazing experiences in your community
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="badge badge-primary text-xs px-3 py-1.5">
                {events.filter(e => new Date(e.date) > new Date()).length} Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="animate-slide-up-fade"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* Load More Placeholder (for future pagination) */}
      {events.length >= 12 && (
        <div className="flex justify-center mt-8 mb-12">
          <button className="btn-secondary px-8 py-3">
            Load More Events
          </button>
        </div>
      )}
    </>
  )
}

export default EventsList
