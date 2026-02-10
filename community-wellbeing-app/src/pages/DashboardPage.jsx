import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



// ADD extra "components/" to ALL these imports
import Navbar from '../components/components/common/Navbar';
import WelcomeCard from '../components/components/dashboard/WelcomeCard';
import PointsProgress from '../components/components/dashboard/PointsProgress';
import AIInsightBanner from '../components/components/dashboard/AIInsightBanner';
import QuickMoodWidget from '../components/components/dashboard/QuickMoodWidget';
import RecommendedEvents from '../components/components/dashboard/RecommendedEvents';
import UpcomingEvents from '../components/components/dashboard/UpcomingEvents';
import StatsCard from '../components/components/dashboard/StatsCard';



export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMoodWidget, setShowMoodWidget] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Check if user checked in today
  useEffect(() => {
    if (user) {
      const lastCheckin = user?.moodHistory?.[0];
      const today = new Date().toISOString().split('T')[0];
      
      if (!lastCheckin || lastCheckin.date !== today) {
        setShowMoodWidget(true);
      }
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <WelcomeCard user={user} />
          </div>
          <div>
            <PointsProgress user={user} />
          </div>
        </div>

        {/* AI Insight Banner */}
        <AIInsightBanner user={user} />

        {/* Quick Mood Check-in */}
        {showMoodWidget && (
          <QuickMoodWidget 
            user={user} 
            onComplete={() => setShowMoodWidget(false)}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon="👥"
            label="Circles Joined"
            value={user?.joinedCircles?.length || 0}
            color="from-sage-400 to-sage-600"
          />
          <StatsCard
            icon="📅"
            label="Sessions Attended"
            value={user?.attendedEvents?.length || 0}
            color="from-ocean-400 to-ocean-600"
          />
          <StatsCard
            icon="😊"
            label="Avg Mood"
            value={user?.moodHistory?.length > 0
              ? (user.moodHistory.reduce((sum, m) => sum + m.score, 0) / user.moodHistory.length).toFixed(1)
              : '0'}
            color="from-orange-400 to-orange-600"
          />
          <StatsCard
            icon="🎯"
            label="Total Points"
            value={user?.totalPoints || 0}
            color="from-purple-400 to-purple-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Recommended Events */}
          <div className="lg:col-span-2">
            <RecommendedEvents user={user} />
          </div>

          {/* Right Column - Upcoming Events */}
          <div>
            <UpcomingEvents user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}