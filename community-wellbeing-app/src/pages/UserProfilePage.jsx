import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/components/common/Navbar';
import { searchService } from '../services/searchService';
import { connectionService } from '../services/connectionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, connected
  const [isSendingRequest, setIsSendingRequest] = useState(false);

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

        // Load connection status
        if (currentUser?.id) {
          const status = await connectionService.getConnectionStatus(currentUser.id, user.id);
          setConnectionStatus(status.status);
        }
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
  }, [id, navigate, showToast, currentUser]);

  // Poll for connection status updates (for auto-acceptance)
  useEffect(() => {
    if (!currentUser?.id || !profileUser?.id) return;

    const checkStatus = async () => {
      const status = await connectionService.getConnectionStatus(currentUser.id, profileUser.id);
      if (status.status !== connectionStatus) {
        const wasPending = connectionStatus === 'pending';
        setConnectionStatus(status.status);
        
        if (wasPending && status.status === 'connected') {
          showToast('Connection request accepted! You can now message each other. 🤝', 'success');
        }
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 2 seconds if pending
    if (connectionStatus === 'pending') {
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }

    // Also listen for storage events (for cross-tab updates)
    const handleStorageChange = () => {
      checkStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser, profileUser, connectionStatus, showToast]);

  const handleReachOut = async () => {
    if (!currentUser?.id) {
      showToast('Please sign in to send connection requests', 'error');
      return;
    }

    setIsSendingRequest(true);
    try {
      const result = await connectionService.sendConnectionRequest(currentUser.id, profileUser.id);
      if (result.success) {
        setConnectionStatus('pending');
        showToast('Connection request sent! They will receive it shortly.', 'success');
      } else {
        showToast(result.message || 'Failed to send request', 'error');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      showToast('Failed to send connection request', 'error');
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${profileUser.id}`);
  };

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
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{profileUser.name}</h1>
                
                {/* Connection & Message Actions */}
                <div className="flex gap-2 ml-4">
                  {connectionStatus === 'connected' ? (
                    <button
                      onClick={handleMessage}
                      className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors font-medium flex items-center gap-2"
                    >
                      <span>💬</span>
                      <span>Message</span>
                    </button>
                  ) : connectionStatus === 'pending' ? (
                    <button
                      disabled
                      className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed"
                    >
                      <span>⏳</span>
                      <span>Request Pending...</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReachOut}
                      disabled={isSendingRequest}
                      className="px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
                    >
                      <span>🤝</span>
                      <span>{isSendingRequest ? 'Sending...' : 'Reach Out'}</span>
                    </button>
                  )}
                </div>
              </div>
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
