import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { MOCK_CIRCLES } from '../../../utils/mockData';
import EventCard from '../events/EventCard';

export default function RecommendedEvents({ user }) {
  const [recommendedCircles, setRecommendedCircles] = useState([]);

  useEffect(() => {
    // Simple recommendation algorithm
    const getRecommendations = () => {
      const userInterests = user?.interests || [];
      const userActivityPrefs = user?.activityPreferences || {};

      return MOCK_CIRCLES
        .map((circle) => {
          let score = circle.matchScore || 50;

          // Interest matching
          const matchingTags = circle.tags.filter(tag =>
            userInterests.some(interest => tag.toLowerCase().includes(interest.toLowerCase()))
          );
          score += matchingTags.length * 10;

          // Mode matching
          const userModes = user?.preferredModes || [];
          if (userModes.includes(circle.mode)) {
            score += 15;
          }

          // Activity type matching
          if (circle.tags.includes('outdoors') && userActivityPrefs.outdoors) {
            score += 10;
          }
          if (circle.tags.includes('virtual') && userActivityPrefs.virtual) {
            score += 10;
          }

          return { ...circle, matchScore: Math.min(score, 99) };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);
    };

    setRecommendedCircles(getRecommendations());
  }, [user]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended for You
          </h2>
          <p className="text-gray-600">
            Based on your interests and preferences
          </p>
        </div>
        <Link to="/events" className="text-sage-700 font-semibold hover:text-sage-800 transition-colors">
          See All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedCircles.map((circle, index) => (
          <EventCard
            key={circle.id}
            circle={circle}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}