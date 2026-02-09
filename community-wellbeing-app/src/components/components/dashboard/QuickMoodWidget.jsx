import React, { useState } from 'react';

import { useAuth } from '../../../context/AuthContext';

export default function QuickMoodWidget({ user, onComplete }) {
  const { updateUser } = useAuth();
  const [moodScore, setMoodScore] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Create new mood entry
    const today = new Date().toISOString().split('T')[0];
    const newMoodEntry = {
      date: today,
      score: moodScore,
      state: moodScore >= 4 ? 'joyful' : moodScore >= 3 ? 'calm' : 'anxious',
    };

    // Update user's mood history
    const updatedMoodHistory = [
      newMoodEntry,
      ...(user?.moodHistory || []),
    ];

    // Increment streak if checked in yesterday
    let newStreak = user?.currentStreak || 0;
    const lastCheckin = user?.moodHistory?.[0];
    
    if (lastCheckin) {
      const lastDate = new Date(lastCheckin.date);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    updateUser({
      moodHistory: updatedMoodHistory,
      currentStreak: newStreak,
      totalPoints: (user?.totalPoints || 0) + 10,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 500);
  };

  return (
    <div className="card mb-8 animate-slide-up-fade"
      style={{
        border: '2px solid rgba(95, 156, 141, 0.3)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: 'rgba(168, 213, 186, 0.15)',
          }}
        >
          💙
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Quick Mood Check-In
          </h3>
          <p className="text-sm text-gray-600">
            How are you feeling today? (+10 points)
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl mb-4"
        style={{
          background: 'rgba(168, 213, 186, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex justify-between mb-3">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => setMoodScore(index + 1)}
              className={`text-4xl transition-all ${
                moodScore === index + 1
                  ? 'transform scale-125'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={moodScore}
          onChange={(e) => setMoodScore(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #5F9C8D 0%, #5F9C8D ${
              ((moodScore - 1) / 4) * 100
            }%, #e5e7eb ${((moodScore - 1) / 4) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="text-center mt-3">
          <span className="text-lg font-bold text-sage-600">
            {moodLabels[moodScore - 1]}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? 'Saving...' : 'Submit Check-In'}
        </button>
        <button
          onClick={onComplete}
          className="btn-ghost"
        >
          Skip
        </button>
      </div>
    </div>
  );
}