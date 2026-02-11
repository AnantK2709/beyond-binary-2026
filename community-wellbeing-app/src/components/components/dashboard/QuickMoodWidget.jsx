import React, { useState, useContext } from 'react';
import { Heart } from 'lucide-react';
import IconRenderer from '../../common/IconRenderer';

import { useAuth } from '../../../context/AuthContext';
import { GamificationContext } from '../../../context/GamificationContext';

const moodIcons = [
  { icon: 'Frown', label: 'Very Low' },
  { icon: 'Meh', label: 'Low' },
  { icon: 'Minus', label: 'Okay' },
  { icon: 'Smile', label: 'Good' },
  { icon: 'SmilePlus', label: 'Great' },
];

export default function QuickMoodWidget({ user, onComplete }) {
  const { updateUser } = useAuth();
  const { awardPoints } = useContext(GamificationContext);
  const [moodScore, setMoodScore] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    });

    awardPoints(10, 'mood_checkin', 'Daily mood check-in');

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
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(168, 213, 186, 0.15)',
          }}
        >
          <Heart size={24} className="text-sage-600" />
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
          {moodIcons.map((mood, index) => (
            <button
              key={index}
              onClick={() => setMoodScore(index + 1)}
              className={`p-2 rounded-full transition-all ${
                moodScore === index + 1
                  ? 'transform scale-125 bg-sage-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              <IconRenderer name={mood.icon} size={32} />
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
            {moodIcons[moodScore - 1].label}
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
