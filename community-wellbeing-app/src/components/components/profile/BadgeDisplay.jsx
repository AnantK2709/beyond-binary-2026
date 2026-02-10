import React from 'react';

export default function BadgeDisplay({ user }) {
  // Define all possible badges
  const allBadges = [
    {
      id: 'first-checkin',
      icon: '🌟',
      name: 'First Steps',
      description: 'Completed your first mood check-in',
      unlocked: user?.moodHistory?.length > 0,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: '7-day-streak',
      icon: '🔥',
      name: 'Week Warrior',
      description: '7-day check-in streak',
      unlocked: user?.currentStreak >= 7,
      color: 'from-red-400 to-orange-600',
    },
    {
      id: '30-day-streak',
      icon: '💎',
      name: 'Diamond Dedication',
      description: '30-day check-in streak',
      unlocked: user?.currentStreak >= 30,
      color: 'from-blue-400 to-cyan-600',
    },
    {
      id: 'first-circle',
      icon: '👥',
      name: 'Circle Starter',
      description: 'Joined your first circle',
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
      description: 'Earned 100+ points',
      unlocked: user?.totalPoints >= 100,
      color: 'from-purple-400 to-indigo-600',
    },
    {
      id: 'level-3',
      icon: '⭐',
      name: 'Rising Star',
      description: 'Reached Level 3',
      unlocked: user?.level >= 3,
      color: 'from-yellow-300 to-yellow-600',
    },
    {
      id: 'level-5',
      icon: '👑',
      name: 'Community Leader',
      description: 'Reached Level 5',
      unlocked: user?.level >= 5,
      color: 'from-amber-400 to-orange-600',
    },
  ];

  const unlockedBadges = allBadges.filter(b => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  // Feature the most recent unlocked badge
  const featuredBadge = unlockedBadges[0];

  if (!featuredBadge) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🏆</div>
        <h4 className="font-bold text-gray-900 mb-2">No badges yet</h4>
        <p className="text-gray-600">
          Complete actions to earn your first badge!
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Featured Badge */}
      <div className="inline-block mb-4">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${featuredBadge.color} flex items-center justify-center text-6xl shadow-2xl animate-bounce-gentle`}
        >
          {featuredBadge.icon}
        </div>
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">
        {featuredBadge.name}
      </h4>
      <p className="text-gray-600 mb-4">
        {featuredBadge.description}
      </p>
      <div className="text-sm text-sage-600 font-semibold">
        {unlockedBadges.length} of {allBadges.length} badges earned
      </div>
    </div>
  );
}