import { useContext } from 'react';
import { Lock } from 'lucide-react';
import { GamificationContext } from '../../../context/GamificationContext';
import { ACHIEVEMENTS } from '../../../utils/gamification';
import IconRenderer from '../../common/IconRenderer';

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
              : ''
          }`}
          style={{
            background: badge.unlocked
              ? 'rgba(168, 213, 186, 0.1)'
              : 'rgba(200, 200, 200, 0.06)',
            border: badge.unlocked
              ? '2px solid rgba(168, 213, 186, 0.3)'
              : '2px dashed rgba(200, 200, 200, 0.3)',
          }}
          title={badge.description}
        >
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 shadow-md ${
              badge.unlocked
                ? `bg-gradient-to-br ${badge.color}`
                : 'bg-gray-200/40'
            }`}
          >
            {badge.unlocked ? (
              <IconRenderer name={badge.icon} size={28} className="text-white" />
            ) : (
              <Lock size={20} className="text-gray-400/60" />
            )}
          </div>
          <div className={`font-semibold text-xs mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
            {badge.name}
          </div>
          <div className={`text-xs ${badge.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
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
