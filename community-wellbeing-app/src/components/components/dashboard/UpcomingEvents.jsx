import React from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Calendar, Crown, User } from 'lucide-react';

export default function UpcomingEvents({ user }) {
  const upcomingCircles = user?.joinedCircles || [];

  if (upcomingCircles.length === 0) {
    return (
      <div className="card text-center animate-fade-in">
        <div className="mb-4 animate-float">
          <Flower2 size={48} className="text-sage-400 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          No Upcoming Circles
        </h3>
        <p className="text-gray-600 mb-4">
          Join a circle to start building connections!
        </p>
        <Link to="/events" className="btn-primary">
          Explore Circles
        </Link>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Your Circles
      </h3>

      <div className="space-y-4">
        {upcomingCircles.map((circle, index) => (
          <Link
            key={index}
            to={`/communities/${circle.id}`}
            className="block p-4 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(168, 213, 186, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="font-semibold text-gray-900 mb-2">
              {circle.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Calendar size={14} className="text-gray-400" />
              <span>Next: Wed 7:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge text-xs flex items-center gap-1 ${
                circle.role === 'organizer'
                  ? 'badge-new'
                  : 'badge-verified'
              }`}>
                {circle.role === 'organizer' ? <><Crown size={12} /> Organizer</> : <><User size={12} /> Member</>}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/communities"
        className="block text-center text-sage-700 font-semibold hover:text-sage-800 transition-colors mt-4"
      >
        View All Circles →
      </Link>
    </div>
  );
}
