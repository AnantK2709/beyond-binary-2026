import React, { useState } from 'react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIMES = [
  { value: 'morning', label: 'Morning', emoji: '🌅', time: '6am-11am' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '12pm-5pm' },
  { value: 'evening', label: 'Evening', emoji: '🌆', time: '6pm-9pm' },
];

export default function Step2AvailabilityForm({ data, updateData, onNext, onBack }) {
  const [preferredDays, setPreferredDays] = useState(
    data.timePreferences?.preferredDays || []
  );
  const [preferredTimes, setPreferredTimes] = useState(
    data.timePreferences?.preferredTimes || []
  );
  const [frequency, setFrequency] = useState(
    data.timePreferences?.frequency || '1-2 times a week'
  );
  const [preferredModes, setPreferredModes] = useState(data.preferredModes || []);

  const toggleDay = (day) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter((d) => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const toggleTime = (time) => {
    if (preferredTimes.includes(time)) {
      setPreferredTimes(preferredTimes.filter((t) => t !== time));
    } else {
      setPreferredTimes([...preferredTimes, time]);
    }
  };

  const toggleMode = (mode) => {
    if (preferredModes.includes(mode)) {
      setPreferredModes(preferredModes.filter((m) => m !== mode));
    } else {
      setPreferredModes([...preferredModes, mode]);
    }
  };

  const handleNext = () => {
    updateData({
      timePreferences: {
        preferredDays,
        preferredTimes,
        frequency,
      },
      preferredModes,
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          When do you prefer to meet? ⏰
        </h2>
        <p className="text-gray-600 mb-6">
          Help us schedule circles at times that work for you
        </p>

        {/* Days of Week */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Days of Week
          </h3>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                  preferredDays.includes(day)
                    ? 'bg-sage-600 text-white shadow-md'
                    : 'bg-white/50 backdrop-blur-sm border-2 border-gray-200 text-gray-900 hover:border-sage-300'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Time of Day
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIMES.map((time) => (
              <button
                key={time.value}
                onClick={() => toggleTime(time.value)}
                className={`p-4 rounded-xl transition-all text-left ${
                  preferredTimes.includes(time.value)
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: preferredTimes.includes(time.value)
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: preferredTimes.includes(time.value)
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="text-3xl mb-2">{time.emoji}</div>
                <div className="font-semibold text-gray-900">{time.label}</div>
                <div className="text-sm text-gray-600">{time.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How often would you like to attend?
          </h3>
          <div className="space-y-2">
            {['once a week', '1-2 times a week', '2+ times a week', 'flexible'].map((freq) => (
              <label
                key={freq}
                className="flex items-center p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={frequency === freq}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-5 h-5 text-sage-600 focus:ring-sage-500"
                />
                <span className="ml-3 font-medium text-gray-900 capitalize">
                  {freq}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Modes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preferred Circle Modes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'virtual', label: 'Virtual', icon: '💻', desc: 'Video calls' },
              { value: 'in-person', label: 'In-Person', icon: '📍', desc: 'Meet-ups' },
              { value: 'walk-talk', label: 'Walk & Talk', icon: '🚶', desc: 'Active meetings' },
              { value: 'async', label: 'Async', icon: '💬', desc: 'Message-based' },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => toggleMode(mode.value)}
                className={`p-4 rounded-xl transition-all text-left ${
                  preferredModes.includes(mode.value)
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: preferredModes.includes(mode.value)
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: preferredModes.includes(mode.value)
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="text-2xl mb-2">{mode.icon}</div>
                <div className="font-semibold text-gray-900">{mode.label}</div>
                <div className="text-sm text-gray-600">{mode.desc}</div>
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
          disabled={preferredDays.length === 0 || preferredTimes.length === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Mood Check-In
        </button>
      </div>
    </div>
  );
}