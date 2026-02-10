import React from 'react';
import { Link } from 'react-router-dom';

export default function AttendedEventsList({ user }) {
  const attendedEvents = user?.attendedEvents || [];

  if (attendedEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">📅</div>
        <h4 className="font-bold text-gray-900 mb-2">No events attended yet</h4>
        <p className="text-gray-600 mb-4">
          Join circles and attend events to build your history!
        </p>
        <Link to="/events" className="btn-primary inline-block">
          Explore Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attendedEvents.map((event, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl hover:scale-[1.02] transition-transform"
          style={{
            background: 'rgba(168, 213, 186, 0.1)',
            border: '1px solid rgba(168, 213, 186, 0.3)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h5 className="font-bold text-gray-900 mb-1">
                {event.name || 'Community Event'}
              </h5>
              <div className="text-sm text-gray-600 mb-2">
                {event.circleName || 'MindfulCircles Community'}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>📅 {new Date(event.attendedAt || event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
                {event.rating && (
                  <span>⭐ {event.rating}/5</span>
                )}
              </div>
            </div>
            {event.points && (
              <span className="badge-new text-xs">
                +{event.points} pts
              </span>
            )}
          </div>
        </div>
      ))}

      {attendedEvents.length > 5 && (
        <Link
          to="/events"
          className="block text-center text-sage-600 font-semibold hover:text-sage-700 transition-colors pt-2"
        >
          View All Events →
        </Link>
      )}
    </div>
  );
}