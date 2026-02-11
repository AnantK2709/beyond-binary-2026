import React, { useContext } from 'react';
import { GamificationContext } from '../../../context/GamificationContext';
import { ACHIEVEMENTS } from '../../../utils/gamification';

export default function BadgeGrid() {
  const { badges, achievements } = useContext(GamificationContext);

  // Combine level-based badges and activity-based achievements into one grid
  const allItems = [
    // Level-based badges earned
    ...badges.map(b => ({
      id: b.id || `badge-${b.name}`,
      icon: b.icon,
      name: b.name,
      description: b.description || `Level ${b.level} badge`,
      unlocked: true,
      color: {
        sage: 'from-sage-400 to-sage-600',
        ocean: 'from-ocean-400 to-ocean-600',
        gold: 'from-yellow-400 to-orange-500',
        orange: 'from-orange-400 to-orange-600',
        purple: 'from-purple-400 to-purple-600',
      }[b.color] || 'from-sage-400 to-sage-600',
    })),
    // Activity-based achievements
    ...achievements.map(a => ({
      id: a.id,
      icon: a.icon,
      name: a.name,
      description: a.description,
      unlocked: a.unlocked,
      color: {
        sage: 'from-sage-400 to-sage-600',
        ocean: 'from-ocean-400 to-ocean-600',
        gold: 'from-yellow-400 to-orange-500',
        orange: 'from-orange-400 to-orange-600',
        purple: 'from-purple-400 to-purple-600',
      }[a.color] || 'from-sage-400 to-sage-600',
    })),
  ];

  // Remove duplicates (badges that are also achievements)
  const seen = new Set();
  const uniqueItems = allItems.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {uniqueItems.map((badge) => (
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
