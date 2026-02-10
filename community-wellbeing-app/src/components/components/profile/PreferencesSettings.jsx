import React from 'react';

export default function PreferencesSettings({ user }) {
  const personalityTypes = {
    introvert: { emoji: '🤫', label: 'Introvert', desc: 'Recharges alone, prefers deep one-on-one' },
    ambivert: { emoji: '⚖️', label: 'Ambivert', desc: 'Flexible, enjoys both alone time and socializing' },
    extrovert: { emoji: '🎉', label: 'Extrovert', desc: 'Energized by social interaction' },
  };

  const personality = personalityTypes[user.personalityType] || null;
  const timePrefs = user.timePreferences || {};
  const interactionPrefs = user.interactionPreferences || {};

  return (
    <div className="space-y-6">
      {/* Personality */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🧠 Personality Type
        </h3>
        {personality ? (
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{personality.emoji}</div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {personality.label}
                </h4>
                <p className="text-gray-600">{personality.desc}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Not set</p>
        )}
      </div>

      {/* Goals */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🎯 Goals
        </h3>
        {user.goals?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.goals.map((goal, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 font-medium text-gray-900 capitalize flex items-center gap-2"
              >
                <span className="text-xl">✓</span>
                {goal.replace(/-/g, ' ')}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No goals set</p>
        )}
      </div>

      {/* Availability */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          📅 Availability
        </h3>
        <div className="space-y-4">
          {/* Days */}
          {timePrefs.preferredDays?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Preferred Days
              </h4>
              <div className="flex flex-wrap gap-2">
                {timePrefs.preferredDays.map((day) => (
                  <span
                    key={day}
                    className="px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium capitalize"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Times */}
          {timePrefs.preferredTimes?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Preferred Times
              </h4>
              <div className="flex flex-wrap gap-2">
                {timePrefs.preferredTimes.map((time) => (
                  <span
                    key={time}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize"
                  >
                    {time === 'morning' && '🌅'}
                    {time === 'afternoon' && '☀️'}
                    {time === 'evening' && '🌆'}
                    {' '}
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Frequency */}
          {timePrefs.frequency && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Frequency
              </h4>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 font-medium">
                📊 {timePrefs.frequency}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preferred Modes */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          💬 Preferred Modes
        </h3>
        {user.preferredModes?.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {user.preferredModes.map((mode) => (
              <div
                key={mode}
                className="p-4 rounded-xl bg-white border-2 border-sage-200 text-center font-medium text-gray-900"
              >
                <div className="text-3xl mb-2">
                  {mode === 'virtual' && '💻'}
                  {mode === 'in-person' && '📍'}
                  {mode === 'walk-talk' && '🚶'}
                  {mode === 'async' && '💬'}
                </div>
                <div className="capitalize text-sm">
                  {mode.replace('-', ' & ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No preferences set</p>
        )}
      </div>

      {/* Interaction Preferences */}
      {Object.keys(interactionPrefs).length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            ✨ Ideal Vibe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interactionPrefs.energyLevel && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 text-center">
                <div className="text-sm text-gray-600 mb-1">Energy Level</div>
                <div className="text-lg font-bold text-gray-900 capitalize">
                  {interactionPrefs.energyLevel.replace('-', ' ')}
                </div>
              </div>
            )}
            {interactionPrefs.groupSize && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-center">
                <div className="text-sm text-gray-600 mb-1">Group Size</div>
                <div className="text-lg font-bold text-gray-900 capitalize">
                  {interactionPrefs.groupSize}
                </div>
              </div>
            )}
            {interactionPrefs.conversationDepth && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 text-center">
                <div className="text-sm text-gray-600 mb-1">Conversation</div>
                <div className="text-lg font-bold text-gray-900 capitalize">
                  {interactionPrefs.conversationDepth}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}