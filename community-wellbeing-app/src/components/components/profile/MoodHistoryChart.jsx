import React from 'react';

export default function MoodHistoryChart({ user }) {
  const moodHistory = (user?.moodHistory || []).slice(0, 30).reverse(); // Last 30 days

  if (moodHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">😊</div>
        <h4 className="font-bold text-gray-900 mb-2">No mood history yet</h4>
        <p className="text-gray-600">
          Start tracking your mood to see your progress!
        </p>
      </div>
    );
  }

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];
  const moodColors = [
    'from-red-400 to-red-600',
    'from-orange-400 to-orange-600',
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-emerald-400 to-emerald-600',
  ];

  const avgMood = (moodHistory.reduce((sum, m) => sum + m.score, 0) / moodHistory.length).toFixed(1);
  const maxScore = 5;

  return (
    <div>
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-sage-50 to-sage-100">
          <div className="text-3xl font-bold text-sage-600">{avgMood}</div>
          <div className="text-xs text-gray-600 mt-1">Average</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl font-bold text-blue-600">{moodHistory.length}</div>
          <div className="text-xs text-gray-600 mt-1">Check-ins</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-3xl">{moodEmojis[Math.round(avgMood) - 1]}</div>
          <div className="text-xs text-gray-600 mt-1">Mood</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Last {moodHistory.length} Days
        </h4>
        <div className="flex items-end justify-between gap-1 h-40">
          {moodHistory.map((mood, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end group"
            >
              <div
                className={`w-full rounded-t-lg bg-gradient-to-t ${moodColors[mood.score - 1]} transition-all hover:opacity-80 cursor-pointer relative`}
                style={{ height: `${(mood.score / maxScore) * 100}%` }}
                title={`${mood.date}: ${moodLabels[mood.score - 1]}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                  {moodEmojis[mood.score - 1]}
                </div>
              </div>
              {idx % 5 === 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(mood.date).getDate()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Recent Check-ins
        </h4>
        <div className="space-y-2">
          {moodHistory.slice(-5).reverse().map((mood, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: 'rgba(168, 213, 186, 0.1)',
                border: '1px solid rgba(168, 213, 186, 0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{moodEmojis[mood.score - 1]}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm capitalize">
                    {mood.state || moodLabels[mood.score - 1]}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(mood.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-sage-600">
                {mood.score}/5
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}