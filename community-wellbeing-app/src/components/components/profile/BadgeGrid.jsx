import React from 'react';

export default function BadgeGrid({ user }) {
  const allBadges = [
    {
      id: 'first-checkin',
      icon: '🌟',
      name: 'First Steps',
      description: 'First mood check-in',
      unlocked: user?.moodHistory?.length > 0,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: '7-day-streak',
      icon: '🔥',
      name: 'Week Warrior',
      description: '7-day streak',
      unlocked: user?.currentStreak >= 7,
      color: 'from-red-400 to-orange-600',
    },
    {
      id: '30-day-streak',
      icon: '💎',
      name: 'Diamond Dedication',
      description: '30-day streak',
      unlocked: user?.currentStreak >= 30,
      color: 'from-blue-400 to-cyan-600',
    },
    {
      id: 'first-circle',
      icon: '👥',
      name: 'Circle Starter',
      description: 'Joined first circle',
      unlocked: user?.joinedCircles?.length > 0,
      color: 'from-green-400 to-emerald-600',
    },
    {
      id: 'social-butterfly',
      icon: '🦋',
      name: 'Social Butterfly',
      description: 'Joined 5+ circles',
      unlocked: user?.joinedCircles?.length >= 5,
      color: 'from-pink-400 to-rose-600',
    },
    {
      id: 'century-club',
      icon: '💯',
      name: 'Century Club',
      description: '100+ points',
      unlocked: user?.totalPoints >= 100,
      color: 'from-purple-400 to-indigo-600',
    },
    {
      id: 'level-3',
      icon: '⭐',
      name: 'Rising Star',
      description: 'Level 3',
      unlocked: user?.level >= 3,
      color: 'from-yellow-300 to-yellow-600',
    },
    {
      id: 'level-5',
      icon: '👑',
      name: 'Community Leader',
      description: 'Level 5',
      unlocked: user?.level >= 5,
      color: 'from-amber-400 to-orange-600',
    },
    {
      id: 'mood-master',
      icon: '😊',
      name: 'Mood Master',
      description: '30 mood check-ins',
      unlocked: user?.moodHistory?.length >= 30,
      color: 'from-teal-400 to-cyan-600',
    },
    {
      id: 'event-enthusiast',
      icon: '🎉',
      name: 'Event Enthusiast',
      description: '10+ events attended',
      unlocked: user?.attendedEvents?.length >= 10,
      color: 'from-indigo-400 to-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {allBadges.map((badge) => (
        <div
          key={badge.id}
          className={`p-4 rounded-xl text-center transition-all ${
            badge.unlocked
              ? 'hover:scale-105 cursor-pointer'
              : 'opacity-40 grayscale'
          }`}
          style={{
            background: badge.unlocked
              ? 'rgba(168, 213, 186, 0.1)'
              : 'rgba(200, 200, 200, 0.1)',
            border: badge.unlocked
              ? '2px solid rgba(168, 213, 186, 0.3)'
              : '2px solid rgba(200, 200, 200, 0.2)',
          }}
          title={badge.description}
        >
          <div
            className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl mb-2 shadow-md ${
              badge.unlocked ? '' : 'opacity-50'
            }`}
          >
            {badge.icon}
          </div>
          <div className="font-semibold text-xs text-gray-900 mb-1">
            {badge.name}
          </div>
          <div className="text-xs text-gray-600">
            {badge.description}
          </div>
          {badge.unlocked && (
            <div className="mt-2">
              <span className="badge-verified text-xs">Unlocked</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}