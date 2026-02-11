import React, { useState } from 'react';

export default function Step4Preferences({ data, updateData, onComplete, onBack, isCompleting = false }) {
  const [personalityType, setPersonalityType] = useState(data.personalityType || '');
  const [goals, setGoals] = useState(data.goals || []);
  const [bio, setBio] = useState(data.bio || '');
  const [energyLevel, setEnergyLevel] = useState(
    data.interactionPreferences?.energyLevel || 'moderate'
  );
  const [groupSize, setGroupSize] = useState(
    data.interactionPreferences?.groupSize || 'small'
  );
  const [conversationDepth, setConversationDepth] = useState(
    data.interactionPreferences?.conversationDepth || 'meaningful'
  );

  const goalOptions = [
    { value: 'make friends', label: 'Make new friends', icon: '👥' },
    { value: 'build support network', label: 'Build support network', icon: '💙' },
    { value: 'manage stress', label: 'Manage stress/anxiety', icon: '🧘' },
    { value: 'combat loneliness', label: 'Combat loneliness', icon: '🤗' },
    { value: 'find activity partners', label: 'Find activity partners', icon: '🏃' },
    { value: 'professional networking', label: 'Professional networking', icon: '💼' },
  ];

  const toggleGoal = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleComplete = () => {
    updateData({
      personalityType,
      goals,
      bio,
      interactionPreferences: {
        energyLevel,
        groupSize,
        conversationDepth,
      },
    });
    onComplete();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us a bit more about you 💭
        </h2>
        <p className="text-gray-600 mb-8">
          These final details help us create the perfect matches
        </p>

        {/* Personality Type */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personality Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'introvert', label: 'Introvert', desc: 'I recharge alone' },
              { value: 'ambivert', label: 'Ambivert', desc: 'Bit of both' },
              { value: 'extrovert', label: 'Extrovert', desc: 'I gain energy from others' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setPersonalityType(type.value)}
                className={`p-4 rounded-xl transition-all text-center ${
                  personalityType === type.value
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: personalityType === type.value
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: personalityType === type.value
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="font-semibold text-gray-900 mb-1">
                  {type.label}
                </div>
                <div className="text-sm text-gray-600">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What brings you here? (Select all that apply)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <button
                key={goal.value}
                onClick={() => toggleGoal(goal.value)}
                className={`p-4 rounded-xl transition-all text-left flex items-center gap-3 ${
                  goals.includes(goal.value)
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: goals.includes(goal.value)
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: goals.includes(goal.value)
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <span className="text-2xl">{goal.icon}</span>
                <span className="font-medium text-gray-900">{goal.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interaction Preferences */}
        <div className="mb-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Ideal Vibe
          </h3>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Energy Level
            </label>
            <div className="flex gap-2">
              {[
                { value: 'low-key', label: 'Low-key' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'high-energy', label: 'High-energy' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setEnergyLevel(level.value)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    energyLevel === level.value
                      ? 'bg-sage-600 text-white shadow-md'
                      : 'bg-white/50 backdrop-blur-sm border-2 border-gray-200 text-gray-900 hover:border-sage-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Preferred Group Size
            </label>
            <div className="space-y-2">
              {[
                { value: 'intimate', label: 'Intimate (3-4 people)' },
                { value: 'small', label: 'Small (5-6 people)' },
                { value: 'medium', label: 'Medium (7-10 people)' },
              ].map((size) => (
                <label
                  key={size.value}
                  className="flex items-center p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(168, 213, 186, 0.2)',
                  }}
                >
                  <input
                    type="radio"
                    name="groupSize"
                    value={size.value}
                    checked={groupSize === size.value}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    {size.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Conversation Depth */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Conversation Depth
            </label>
            <div className="space-y-2">
              {[
                { value: 'casual', label: 'Casual chat' },
                { value: 'meaningful', label: 'Meaningful conversation' },
                { value: 'deep', label: 'Deep sharing' },
              ].map((depth) => (
                <label
                  key={depth.value}
                  className="flex items-center p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(168, 213, 186, 0.2)',
                  }}
                >
                  <input
                    type="radio"
                    name="conversationDepth"
                    value={depth.value}
                    checked={conversationDepth === depth.value}
                    onChange={(e) => setConversationDepth(e.target.value)}
                    className="w-4 h-4 text-sage-600 focus:ring-sage-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    {depth.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Share a bit about yourself (Optional)
          </label>
          <p className="text-sm text-gray-600 mb-3">
            This will be shown to your circle members
          </p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="I'm passionate about wellness and looking to connect with like-minded people..."
            maxLength={200}
          />
          <div className="text-right text-sm text-gray-600 mt-1">
            {bio.length}/200
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200/50">
        <button onClick={onBack} className="btn-ghost">
          ← Back
        </button>
        <button
          onClick={handleComplete}
          disabled={!personalityType || goals.length === 0 || isCompleting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleting ? 'Completing...' : 'Complete Setup →'}
        </button>
      </div>
    </div>
  );
}