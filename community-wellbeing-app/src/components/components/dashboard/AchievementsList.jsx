import React from 'react';

export default function AchievementsList({ user }) {
  const achievements = [
    {
      id: 1,
      icon: '🔥',
      title: '7-Day Streak',
      description: 'Checked in for 7 consecutive days',
      unlocked: user?.currentStreak >= 7,
      date: user?.currentStreak >= 7 ? new Date().toLocaleDateString() : null,
    },
    {
      id: 2,
      icon: '👥',
      title: 'Social Butterfly',
      description: 'Joined 3 different circles',
      unlocked: (user?.joinedCircles?.length || 0) >= 3,
      date: (user?.joinedCircles?.length || 0) >= 3 ? new Date().toLocaleDateString() : null,
    },
    {
      id: 3,
      icon: '🎯',
      title: 'Century Club',
      description: 'Earned 100 points',
      unlocked: (user?.totalPoints || 0) >= 100,
      date: (user?.totalPoints || 0) >= 100 ? new Date().toLocaleDateString() : null,
    },
    {
      id: 4,
      icon: '📈',
      title: 'Level Up',
      description: 'Reached Level 3',
      unlocked: (user?.level || 1) >= 3,
      date: (user?.level || 1) >= 3 ? new Date().toLocaleDateString() : null,
    },
  ];

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`card flex items-center gap-4 transition-all ${
            achievement.unlocked
              ? 'opacity-100'
              : 'opacity-50 grayscale'
          }`}
        >
          {/* <div className={`text-4xl ${achievement.unlocked ? 'animate-bounce-gentle' : ''}`}>
            {achievement.icon}
          </div> */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900">{achievement.title}</h4>
              {achievement.unlocked && (
                <span className="badge-verified text-xs">Unlocked</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{achievement.description}</p>
            {achievement.date && (
              <p className="text-xs text-gray-500 mt-1">
                Unlocked on {achievement.date}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}