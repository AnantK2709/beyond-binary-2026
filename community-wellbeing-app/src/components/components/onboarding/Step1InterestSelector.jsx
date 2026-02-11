import React, { useState } from 'react';
import { INTEREST_OPTIONS, ACTIVITY_TYPES } from '../../../utils/mockData';

export default function Step1InterestSelector({ data, updateData, onNext }) {
  const [selectedInterests, setSelectedInterests] = useState(data.interests || []);
  const [selectedActivities, setSelectedActivities] = useState(data.activityPreferences || {});

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleActivity = (activity) => {
    setSelectedActivities({
      ...selectedActivities,
      [activity]: !selectedActivities[activity],
    });
  };

  const handleNext = () => {
    updateData({
      interests: selectedInterests,
      activityPreferences: selectedActivities,
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What interests you?
        </h2>
        <p className="text-gray-600 mb-6">
          Select all that apply. This helps us match you with the right circles.
        </p>

        {/* Activity Types */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACTIVITY_TYPES.map((activity) => (
              <button
                key={activity.value}
                onClick={() => toggleActivity(activity.value)}
                className={`p-4 rounded-xl transition-all duration-200 text-left ${
                  selectedActivities[activity.value]
                    ? 'shadow-md'
                    : ''
                }`}
                style={{
                  background: selectedActivities[activity.value]
                    ? 'rgba(168, 213, 186, 0.15)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: selectedActivities[activity.value]
                    ? '2px solid rgba(95, 156, 141, 0.5)'
                    : '2px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="text-3xl mb-2">{activity.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">
                  {activity.label}
                </div>
                <div className="text-xs text-gray-600">
                  {activity.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interest Tags */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Interest Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest.value}
                onClick={() => toggleInterest(interest.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedInterests.includes(interest.value)
                    ? 'bg-sage-600 text-white shadow-md'
                    : 'bg-white/50 backdrop-blur-sm border-2 border-gray-200 text-gray-900 hover:border-sage-300'
                }`}
              >
                <span className="mr-2">{interest.icon}</span>
                {interest.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200/50">
        <button
          onClick={handleNext}
          disabled={selectedInterests.length === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Availability
        </button>
      </div>
    </div>
  );
}