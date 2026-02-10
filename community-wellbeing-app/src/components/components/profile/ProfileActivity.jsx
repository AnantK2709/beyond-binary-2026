import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileActivity({ user }) {
  const recentActivity = [];

  // Add mood check-ins
  if (user.moodHistory?.length > 0) {
    user.moodHistory.slice(0, 3).forEach(mood => {
      recentActivity.push({
        type: 'mood',
        icon: '😊',
        title: 'Mood Check-in',
        description: `Feeling ${mood.state || 'good'}`,
        date: mood.date,
        color: 'from-blue-400 to-blue-600',
      });
    });
  }

  // Add joined circles
  if (user.joinedCircles?.length > 0) {
    user.joinedCircles.forEach(circle => {
      recentActivity.push({
        type: 'circle',
        icon: '👥',
        title: 'Joined Circle',
        description: circle.name,
        date: circle.joinedAt?.split('T')[0] || user.created_at.split('T')[0],
        color: 'from-green-400 to-green-600',
      });
    });
  }

  // Add attended events
  if (user.attendedEvents?.length > 0) {
    user.attendedEvents.forEach(event => {
      recentActivity.push({
        type: 'event',
        icon: '📅',
        title: 'Attended Event',
        description: event.name || 'Community Event',
        date: event.attendedAt?.split('T')[0] || user.created_at.split('T')[0],
        color: 'from-purple-400 to-purple-600',
      });
    });
  }

  // Sort by date
  recentActivity.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Recent Activity
        </h3>
        {recentActivity.length > 5 && (
          <Link to="/profile" className="text-sm text-sage-600 font-semibold hover:text-sage-700">
            View All →
          </Link>
        )}
      </div>

      {recentActivity.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-gray-600 text-sm">
            Start your journey by joining circles and tracking your mood!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl hover:scale-[1.02] transition-transform"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(168, 213, 186, 0.2)',
              }}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm">
                  {activity.title}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {activity.description}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}