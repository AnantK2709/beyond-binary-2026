import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/components/common/Navbar';
import { searchService } from '../services/searchService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await searchService.getUserById(id);
        if (!user) {
          showToast('User not found', 'error');
          navigate('/dashboard');
          return;
        }
        setProfileUser(user);
      } catch (error) {
        console.error('Error loading user profile:', error);
        showToast('Failed to load profile', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUserProfile();
    }
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return null;
  }

  // Don't show own profile here (redirect to /profile)
  if (profileUser.id === currentUser?.id) {
    navigate('/profile');
    return null;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {profileUser.name?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{profileUser.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span>📍 {profileUser.location || 'Singapore'}</span>
                <span>•</span>
                <span>🎯 Level {profileUser.level || 1}</span>
                <span>•</span>
                <span>⭐ {profileUser.totalPoints || 0} points</span>
                {profileUser.age && (
                  <>
                    <span>•</span>
                    <span>👤 {profileUser.age} years old</span>
                  </>
                )}
              </div>
              {profileUser.bio && (
                <p className="text-gray-700 leading-relaxed">{profileUser.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Interests */}
          {profileUser.interests && profileUser.interests.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Interests</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {profileUser.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activity Preferences */}
          {profileUser.activityPreferences && (
            <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏃</span>
                <span>Activity Preferences</span>
              </h2>
              <div className="space-y-2">
                {Object.entries(profileUser.activityPreferences).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-sage-500 rounded-full"></span>
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {profileUser.goals && profileUser.goals.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Goals</span>
              </h2>
              <ul className="space-y-2">
                {profileUser.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-sage-500">✓</span>
                    <span className="capitalize">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>Stats</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-700">
                  {profileUser.joinedCircles?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Communities</div>
              </div>
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-700">
                  {profileUser.attendedEvents?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Events</div>
              </div>
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-700">
                  {profileUser.currentStreak || 0}
                </div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-3 bg-sage-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-700">
                  {profileUser.totalPoints || 0}
                </div>
                <div className="text-xs text-gray-600">Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Joined Communities */}
        {profileUser.joinedCircles && profileUser.joinedCircles.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>👥</span>
              <span>Joined Communities</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {profileUser.joinedCircles.map((circle, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/communities/${circle.id}`)}
                  className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors text-sm font-medium"
                >
                  {circle.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
