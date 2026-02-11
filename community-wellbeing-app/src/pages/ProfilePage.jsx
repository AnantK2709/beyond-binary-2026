import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/components/common/Navbar';

// Import ALL profile components
import ProfileHeader from '../components/components/profile/ProfileHeader';
import ProfileStats from '../components/components/profile/ProfileStats';
import ProfileInterests from '../components/components/profile/ProfileInterests';
import ProfileActivity from '../components/components/profile/ProfileActivity';
import BadgeDisplay from '../components/components/profile/BadgeDisplay';
import BadgeGrid from '../components/components/profile/BadgeGrid';
import ConnectionsList from '../components/components/profile/ConnectionsList';
import EditProfile from '../components/components/profile/EditProfile';
import MoodHistoryChart from '../components/components/profile/MoodHistoryChart';
import PreferencesSettings from '../components/components/profile/PreferencesSettings';
import AttendedEventsList from '../components/components/profile/AttendedEventsList';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  if (!user) {
    navigate('/signin');
    return null;
  }

  // Calculate stats
  const totalCircles = user?.joinedCircles?.length || 0;
  const totalEvents = user?.attendedEvents?.length || 0;
  const avgMood = user?.moodHistory?.length > 0
    ? (user.moodHistory.reduce((sum, m) => sum + m.score, 0) / user.moodHistory.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-secondary w-full md:w-auto"
          >
            Edit Profile
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-sage-600">{user.totalPoints}</div>
            <div className="text-xs text-gray-600 mt-1">Total Points</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-600">{user.currentStreak}</div>
            <div className="text-xs text-gray-600 mt-1">Day Streak</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">{totalCircles}</div>
            <div className="text-xs text-gray-600 mt-1">Circles</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">{avgMood}</div>
            <div className="text-xs text-gray-600 mt-1">Avg Mood</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-sage-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-sage-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-sage-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileHeader user={user} />
              
              {/* Interests */}
              <ProfileInterests user={user} />
              
              {/* Badges */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  🏆 Achievements & Badges
                </h3>
                <BadgeDisplay />
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    All Badges
                  </h4>
                  <BadgeGrid />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <ProfileStats user={user} />
              
              {/* Connections */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  👥 My Circles
                </h3>
                <ConnectionsList user={user} />
              </div>

              {/* Recent Activity */}
              <ProfileActivity user={user} />
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mood History */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                😊 Mood History
              </h3>
              <MoodHistoryChart user={user} />
            </div>

            {/* Attended Events */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                📅 Attended Events
              </h3>
              <AttendedEventsList user={user} />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <PreferencesSettings user={user} />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditProfile
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}