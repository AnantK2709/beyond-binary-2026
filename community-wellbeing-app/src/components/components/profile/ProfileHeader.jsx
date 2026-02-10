import React from 'react';

export default function ProfileHeader({ user }) {
  const getLevelColor = (level) => {
    if (level >= 5) return 'from-purple-400 to-purple-600';
    if (level >= 3) return 'from-blue-400 to-blue-600';
    return 'from-green-400 to-green-600';
  };

  const getNextLevelPoints = (level) => level * 200;
  const currentLevelProgress = (user.totalPoints % getNextLevelPoints(user.level));
  const progressPercentage = (currentLevelProgress / getNextLevelPoints(user.level)) * 100;

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Avatar */}
        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${getLevelColor(user.level)} flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl flex-shrink-0 animate-scale-in`}>
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user.name}
            </h2>
            {user.currentStreak >= 7 && (
              <span className="badge-new text-xs animate-bounce-gentle">
                🔥 {user.currentStreak} Day Streak
              </span>
            )}
            {user.level >= 5 && (
              <span className="badge-verified text-xs">
                👑 Level {user.level}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
            <span>📧 {user.email}</span>
            <span className="hidden md:inline">•</span>
            <span>📍 {user.location}</span>
            <span className="hidden md:inline">•</span>
            <span>🎂 {user.age} years</span>
            {user.pronouns && (
              <>
                <span className="hidden md:inline">•</span>
                <span>{user.pronouns}</span>
              </>
            )}
          </div>

          {user.bio && (
            <p className="text-gray-700 mb-4 p-4 rounded-xl bg-gradient-to-br from-sage-50 to-blue-50">
              💭 {user.bio}
            </p>
          )}

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">
                Level {user.level} → Level {user.level + 1}
              </span>
              <span className="text-sm text-gray-600">
                {currentLevelProgress} / {getNextLevelPoints(user.level)} XP
              </span>
            </div>
            <div className="progress-bar h-4">
              <div 
                className="progress-fill h-4"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getNextLevelPoints(user.level) - currentLevelProgress} XP until next level
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}