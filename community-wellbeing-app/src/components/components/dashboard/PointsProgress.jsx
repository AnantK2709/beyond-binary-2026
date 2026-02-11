import React, { useContext } from 'react';
import { GamificationContext } from '../../../context/GamificationContext';
import IconRenderer from '../../common/IconRenderer';

export default function PointsProgress() {
  const { points, level, pointsToNextLevel, progressPercentage, badges, getRecentHistory } =
    useContext(GamificationContext);

  const recentHistory = getRecentHistory(3);

  return (
    <div className="card animate-scale-in h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Your Level</div>
          <div className="text-3xl font-bold text-sage-600">Level {level}</div>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {level}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">{points} points</span>
          <span className="text-gray-600">{points + pointsToNextLevel} points</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        <span className="font-semibold text-sage-600">{pointsToNextLevel} points</span> until Level {level + 1}
      </p>

      {/* Recent badges */}
      {badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="text-xs text-gray-600 mb-2">Badges Earned</div>
          <div className="flex gap-2 flex-wrap">
            {badges.slice(-3).map((badge) => (
              <div key={badge.id} className="badge-verified text-xs flex items-center gap-1">
                <IconRenderer name={badge.icon} size={14} /> {badge.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <div className="text-xs text-gray-600 mb-2">Recent Activity</div>
          <div className="space-y-1.5">
            {recentHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate">{entry.label}</span>
                <span className="text-sage-600 font-semibold whitespace-nowrap ml-2">+{entry.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
