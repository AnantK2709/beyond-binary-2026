import React from 'react';
import { INTEREST_OPTIONS, ACTIVITY_TYPES } from '../../../utils/mockData';

export default function ProfileInterests({ user }) {
  const selectedActivities = Object.entries(user.activityPreferences || {})
    .filter(([_, isSelected]) => isSelected)
    .map(([activityValue]) => 
      ACTIVITY_TYPES.find(a => a.value === activityValue)
    )
    .filter(Boolean);

  const selectedInterestTags = (user.interests || [])
    .map(interestValue => 
      INTEREST_OPTIONS.find(i => i.value === interestValue)
    )
    .filter(Boolean);

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        ✨ Interests & Activities
      </h3>

      {/* Activity Types */}
      {selectedActivities.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Activity Types
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedActivities.map((activity) => (
              <div
                key={activity.value}
                className="p-4 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                style={{
                  background: 'rgba(168, 213, 186, 0.15)',
                  border: '2px solid rgba(168, 213, 186, 0.3)',
                }}
              >
                <div className="text-3xl mb-2">{activity.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {activity.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interest Tags */}
      {selectedInterestTags.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Interest Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedInterestTags.map((interest) => (
              <span
                key={interest.value}
                className="px-4 py-2 bg-sage-600 text-white rounded-full text-sm font-medium hover:bg-sage-700 transition-colors cursor-pointer"
              >
                {interest.icon} {interest.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedActivities.length === 0 && selectedInterestTags.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-gray-500">No interests selected yet</p>
        </div>
      )}
    </div>
  );
}