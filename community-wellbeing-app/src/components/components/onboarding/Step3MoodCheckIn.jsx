import React, { useState } from 'react';
import { MOCK_MOOD_STATES } from '../../../utils/mockData';

export default function Step3MoodCheckIn({ data, updateData, onNext, onBack }) {
  const [moodScore, setMoodScore] = useState(data.initialMood?.score || 3);
  const [emotionalState, setEmotionalState] = useState(
    data.initialMood?.state || ''
  );
  const [interactionPref, setInteractionPref] = useState(
    data.initialMood?.interactionPref || ''
  );

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const interactionOptions = [
    { value: 'low-key', label: 'Low-key conversation', icon: '😌' },
    { value: 'deep', label: 'Deep conversation', icon: '💭' },
    { value: 'fun', label: 'Fun & lighthearted', icon: '🎉' },
  ];

  const handleNext = () => {
    updateData({
      initialMood: {
        score: moodScore,
        state: emotionalState,
        interactionPref,
        timestamp: new Date().toISOString(),
      },
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How are you feeling today? 💙
        </h2>
        <p className="text-gray-600 mb-8">
          This helps us understand your current state and recommend the right circles
        </p>

        {/* Mood Scale */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mood Scale
          </h3>
          <div className="p-6 rounded-2xl"
            style={{
              background: 'rgba(168, 213, 186, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex justify-between mb-4">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setMoodScore(index + 1)}
                  className={`text-5xl transition-all ${
                    moodScore === index + 1
                      ? 'transform scale-125'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="relative pt-1">
              <input
                type="range"
                min="1"
                max="5"
                value={moodScore}
                onChange={(e) => setMoodScore(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #5F9C8D 0%, #5F9C8D ${
                    ((moodScore - 1) / 4) * 100
                  }%, #e5e7eb ${((moodScore - 1) / 4) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
            <div className="text-center mt-4">
              <span className="text-2xl font-bold text-sage-600">
                {moodScore}/5
              </span>
              <span className="text-gray-600 ml-2">
                ({moodLabels[moodScore - 1]})
              </span>
            </div>
          </div>
        </div>

        {/* Emotional State */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What describes you best right now?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MOCK_MOOD_STATES.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setEmotionalState(mood.value)}
                className={`p-4 rounded-xl transition-all ${
                  emotionalState === mood.value
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: emotionalState === mood.value
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: emotionalState === mood.value
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="font-medium text-gray-900 text-sm">
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interaction Preference */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What kind of interaction sounds good?
          </h3>
          <div className="space-y-3">
            {interactionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setInteractionPref(option.value)}
                className={`w-full p-4 rounded-xl transition-all text-left flex items-center gap-3 ${
                  interactionPref === option.value
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: interactionPref === option.value
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: interactionPref === option.value
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <span className="text-3xl">{option.icon}</span>
                <span className="font-medium text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200/50">
        <button onClick={onBack} className="btn-ghost">
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!emotionalState || !interactionPref}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Preferences
        </button>
      </div>
    </div>
  );
}