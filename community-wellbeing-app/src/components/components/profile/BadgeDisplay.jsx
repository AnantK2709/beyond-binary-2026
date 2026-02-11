import React, { useContext } from 'react';
import { GamificationContext } from '../../../context/GamificationContext';
import { ACHIEVEMENTS } from '../../../utils/gamification';

export default function BadgeDisplay() {
  const { badges, achievements, points, level } = useContext(GamificationContext);

  const colorMap = {
    sage: 'from-sage-400 to-sage-600',
    ocean: 'from-ocean-400 to-ocean-600',
    gold: 'from-yellow-400 to-orange-500',
    orange: 'from-orange-400 to-orange-600',
    purple: 'from-purple-400 to-purple-600',
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  // Feature the most recently unlocked badge
  const featuredBadge = badges.length > 0 ? badges[badges.length - 1] : null;

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

  const gradientClass = colorMap[featuredBadge.color] || colorMap.sage;

  return (
    <div className="text-center">
      {/* Featured Badge */}
      <div className="inline-block mb-4">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-6xl shadow-2xl`}
        >
          {featuredBadge.icon}
        </div>
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">
        {featuredBadge.name}
      </h4>
      <p className="text-gray-600 mb-2">
        Most recent badge
      </p>
      <div className="flex items-center justify-center gap-4 text-sm">
        <span className="text-sage-600 font-semibold">
          {unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-sage-600 font-semibold">
          Level {level} ({points} pts)
        </span>
      </div>
    </div>
  );
}
