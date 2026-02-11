import React from 'react';
import { Link } from 'react-router-dom';

export default function ConnectionsList({ user }) {
  // Get connections from joined circles
  const connections = user?.joinedCircles || [];

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">👥</div>
        <h4 className="font-bold text-gray-900 mb-2">No connections yet</h4>
        <p className="text-gray-600 text-sm mb-4">
          Join circles to connect with like-minded people!
        </p>
        <Link to="/communities" className="btn-primary inline-block">
          Find Circles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {connections.slice(0, 5).map((circle, idx) => (
        <Link
          key={idx}
          to={`/communities/${circle.id}`}
          className="block p-3 rounded-xl hover:scale-[1.02] transition-transform"
          style={{
            background: 'rgba(168, 213, 186, 0.1)',
            border: '1px solid rgba(168, 213, 186, 0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {circle.name?.charAt(0).toUpperCase() || '👥'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {circle.name}
              </div>
              <div className="text-xs text-gray-600">
                {circle.role === 'organizer' ? 'Organizer' : 'Member'}
              </div>
            </div>
            <div className="text-sage-600">→</div>
          </div>
        </Link>
      ))}

      {connections.length > 5 && (
        <Link
          to="/communities"
          className="block text-center text-sage-600 font-semibold hover:text-sage-700 transition-colors pt-2"
        >
          View All ({connections.length}) →
        </Link>
      )}
    </div>
  );
}