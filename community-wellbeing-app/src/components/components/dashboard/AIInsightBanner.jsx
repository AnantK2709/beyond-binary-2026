import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { MOCK_CIRCLES } from '../../../utils/mockData';
export default function AIInsightBanner({ user }) {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    // Generate AI insight based on user data
    const generateInsight = () => {
      const insights = [];

      // Based on mood trends
      const recentMoods = user?.moodHistory?.slice(0, 7) || [];
      if (recentMoods.length > 0) {
        const avgMood = recentMoods.reduce((sum, m) => sum + m.score, 0) / recentMoods.length;
        
        if (avgMood >= 4) {
          insights.push({
            type: 'positive',
            icon: '✨',
            message: `Your mood has been consistently positive this week! Keep attending circles to maintain this momentum.`,
            action: 'View Analytics',
            actionLink: '/profile',
          });
        } else if (avgMood < 3) {
          insights.push({
            type: 'supportive',
            icon: '💙',
            message: `We've noticed you've been feeling low lately. Would you like to join a support circle?`,
            action: 'Find Support',
            actionLink: '/events',
          });
        }
      }

      // Based on interests
      if (user?.interests?.includes('fitness') && user?.joinedCircles?.length < 2) {
        insights.push({
          type: 'recommendation',
          icon: '🏃',
          message: `You love fitness! We found ${MOCK_CIRCLES.filter(c => c.tags.includes('fitness') || c.tags.includes('active')).length} new active circles that match your schedule.`,
          action: 'Explore Circles',
          actionLink: '/events',
        });
      }

      // Based on streak
      if (user?.currentStreak >= 7) {
        insights.push({
          type: 'celebration',
          icon: '🎉',
          message: `Amazing! You've maintained a ${user.currentStreak}-day streak. You're in the top 20% of our community!`,
          action: 'Share Achievement',
          actionLink: '/communities',
        });
      }

      // Default insight if no specific conditions met
      if (insights.length === 0) {
        insights.push({
          type: 'general',
          icon: '🌸',
          message: `Based on your profile, we've curated ${MOCK_CIRCLES.length} circles perfect for you.`,
          action: 'Explore Circles',
          actionLink: '/events',
        });
      }

      // Return random insight
      return insights[Math.floor(Math.random() * insights.length)];
    };

    setInsight(generateInsight());
  }, [user]);

  if (!insight) return null;

  const bgGradients = {
    positive: 'from-green-50/80 to-emerald-50/80',
    supportive: 'from-blue-50/80 to-sky-50/80',
    recommendation: 'from-purple-50/80 to-purple-100/80',
    celebration: 'from-yellow-50/80 to-orange-50/80',
    general: 'from-sage-50/80 to-sage-100/80',
  };

  const borderColors = {
    positive: 'border-green-200',
    supportive: 'border-blue-200',
    recommendation: 'border-purple-200',
    celebration: 'border-orange-200',
    general: 'border-sage-300',
  };

  return (
    <div 
      className={`rounded-2xl border-2 p-6 mb-8 bg-gradient-to-r ${bgGradients[insight.type]} ${borderColors[insight.type]} animate-slide-up-fade`}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl animate-float">{insight.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-verified text-xs">
              AI Insight
            </span>
            <span className="text-xs text-gray-600">Powered by your activity</span>
          </div>
          <p className="text-gray-900 font-medium mb-3">{insight.message}</p>
          {insight.action && (
            <Link
              to={insight.actionLink}
              className="inline-flex items-center gap-2 text-sage-700 font-semibold hover:text-sage-800 transition-colors"
            >
              {insight.action} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}