import React from 'react';

export default function PointsProgress({ user }) {
  const level = user?.level || 1;
  const currentPoints = user?.totalPoints || 0;
  const pointsForNextLevel = level * 200;
  const progress = (currentPoints % pointsForNextLevel) / pointsForNextLevel * 100;
  const pointsNeeded = pointsForNextLevel - (currentPoints % pointsForNextLevel);

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
          <span className="text-gray-600">{currentPoints} points</span>
          <span className="text-gray-600">{pointsForNextLevel} points</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-fill h-3"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">
        <span className="font-semibold text-sage-600">{pointsNeeded} points</span> until next level
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200/50">
        <div className="text-xs text-gray-600 mb-2">Recent Achievements</div>
        <div className="flex gap-2 flex-wrap">
          {user?.currentStreak >= 7 && (
            <div className="badge-verified text-xs">
              🔥 7-Day Streak
            </div>
          )}
          {user?.joinedCircles?.length > 0 && (
            <div className="badge-new text-xs">
              👥 First Circle
            </div>
          )}
        </div>
      </div>
    </div>
  );
}