import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Quote } from 'lucide-react';

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

  const dailyAffirmation = useMemo(() => {
    const affirmations = [
      "You are worthy of love, peace, and all the good things life has to offer.",
      "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      "You don't have to be perfect to be amazing.",
      "Be gentle with yourself. You're doing the best you can.",
      "Small steps every day lead to big changes over time.",
      "You are enough, just as you are in this very moment.",
      "Healing is not linear. Be patient with your journey.",
      "The only person you need to be better than is who you were yesterday.",
      "Your presence in this world makes it a better place.",
      "Rest is not a reward. It is a fundamental part of living.",
      "You are allowed to take up space and use your voice.",
      "Progress, not perfection, is what matters most.",
      "Breathe. You are exactly where you need to be right now.",
      "Your feelings are valid. It's okay to not be okay sometimes.",
    ];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return affirmations[dayOfYear % affirmations.length];
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <WelcomeCard user={user} />
            {/* Thought of the Day */}
            <div className="flex-1 flex items-center rounded-2xl px-8 py-6"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.75), rgba(168,213,186,0.12))',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(168, 213, 186, 0.25)',
              }}
            >
              <Quote size={40} className="text-sage-300 flex-shrink-0 rotate-180 mr-5" strokeWidth={2} />
              <p className="flex-1 text-xl md:text-2xl font-serif italic text-gray-700 leading-relaxed">
                &ldquo;{dailyAffirmation}&rdquo;
              </p>
              <Quote size={40} className="text-sage-300 flex-shrink-0 ml-5 hidden sm:block" strokeWidth={2} />
            </div>
          </div>
          <div>
            <PointsProgress />
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
            icon="Users"
            label="Circles Joined"
            value={user?.joinedCircles?.length || 0}
            color="from-sage-400 to-sage-600"
          />
          <StatsCard
            icon="Calendar"
            label="Sessions Attended"
            value={user?.attendedEvents?.length || 0}
            color="from-ocean-400 to-ocean-600"
          />
          <StatsCard
            icon="Smile"
            label="Avg Mood"
            value={user?.moodHistory?.length > 0
              ? (user.moodHistory.reduce((sum, m) => sum + m.score, 0) / user.moodHistory.length).toFixed(1)
              : '0'}
            color="from-orange-400 to-orange-600"
          />
          <StatsCard
            icon="Target"
            label="Total Points"
            value={user?.totalPoints || 0}
            color="from-purple-400 to-purple-600"
          />
        </div>

        {/* Quick Communities Access Card */}
        <div className="mb-8">
          <div 
            onClick={() => navigate('/communities')}
            className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 font-heading flex items-center gap-2"><Users size={24} /> Explore Communities</h3>
                <p className="text-sage-100">Join communities, chat with members, create polls, and organize events</p>
              </div>
              <button className="px-6 py-3 bg-white text-sage-600 rounded-lg hover:bg-sage-50 transition-colors font-semibold">
                Browse Communities →
              </button>
            </div>
          </div>
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
