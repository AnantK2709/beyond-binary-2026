import React from 'react';

export default function ProfileStats({ user }) {
  const stats = [
    {
      icon: '🎯',
      label: 'Total Points',
      value: user.totalPoints || 0,
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: '🔥',
      label: 'Current Streak',
      value: `${user.currentStreak || 0} days`,
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: '👥',
      label: 'Circles Joined',
      value: user.joinedCircles?.length || 0,
      color: 'from-green-400 to-green-600',
    },
    {
      icon: '📅',
      label: 'Events Attended',
      value: user.attendedEvents?.length || 0,
      color: 'from-blue-400 to-blue-600',
    },
  ];

  const avgMood = user.moodHistory?.length > 0
    ? (user.moodHistory.reduce((sum, m) => sum + m.score, 0) / user.moodHistory.length).toFixed(1)
    : 'N/A';

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card-hover"
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
              {/* {stat.icon} */}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Average Mood */}
      <div className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 213, 186, 0.2), rgba(137, 207, 240, 0.2))',
        }}
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-2">😊</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {avgMood}
          </div>
          <div className="text-sm text-gray-600">Average Mood</div>
        </div>
      </div>
    </div>
  );
}