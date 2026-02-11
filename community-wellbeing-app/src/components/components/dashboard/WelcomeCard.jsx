import React from 'react';

export default function WelcomeCard({ user }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "You're building meaningful connections!",
      "Every step counts towards wellness ",
      "Your community is growing stronger! ",
      "Keep showing up for yourself! ",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="card text-white animate-scale-in"
      style={{
        background: 'linear-gradient(135deg, rgba(95, 156, 141, 0.9), rgba(74, 128, 112, 0.9))',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-white/90 text-lg">
            {getMotivationalMessage()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/80 mb-1">Current Streak</div>
          <div className="text-4xl font-bold">
            {user?.currentStreak || 0}
          </div>
        </div>
      </div>
    </div>
  );
}