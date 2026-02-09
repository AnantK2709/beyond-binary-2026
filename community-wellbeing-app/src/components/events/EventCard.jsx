import { useNavigate } from 'react-router-dom'
import Badge from '../common/Badge'
import Button from '../common/Button'

function EventCard({ event }) {
  const navigate = useNavigate()

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer card-hover"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="h-48 bg-gradient-to-br from-sage-300 to-sage-400 flex items-center justify-center text-6xl relative">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <span className="animate-float">🧘‍♀️</span>
        )}

        {event.organizer?.verified && (
          <Badge className="absolute top-3 right-3 bg-white text-sage-700 shadow-soft">
            ✓ Verified
          </Badge>
        )}

        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white shadow-soft">
          +{event.pointsReward} pts
        </Badge>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{event.participants}/{event.maxParticipants} participants</span>
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2">
              <span>🏢</span>
              <span>{event.organizer.name}</span>
            </div>
          )}
        </div>

        <Button className="w-full" onClick={(e) => {
          e.stopPropagation()
          // Handle RSVP
        }}>
          Sign Up for Event
        </Button>
      </div>
    </div>
  )
}

export default EventCard
