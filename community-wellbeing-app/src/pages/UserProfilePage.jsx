import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/components/common/Navbar';
import { searchService } from '../services/searchService';
import { connectionService } from '../services/connectionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

// Import profile components (same as ProfilePage)
import ProfileHeader from '../components/components/profile/ProfileHeader';
import ProfileStats from '../components/components/profile/ProfileStats';
import ProfileInterests from '../components/components/profile/ProfileInterests';
import ProfileActivity from '../components/components/profile/ProfileActivity';
import BadgeDisplay from '../components/components/profile/BadgeDisplay';
import BadgeGrid from '../components/components/profile/BadgeGrid';
import ConnectionsList from '../components/components/profile/ConnectionsList';
import MoodHistoryChart from '../components/components/profile/MoodHistoryChart';
import AttendedEventsList from '../components/components/profile/AttendedEventsList';

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, connected
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const connectionStatusRef = useRef('none'); // Keep ref in sync with state
  
  // Check if accessed from search (show connection button only from search)
  const isFromSearch = location.state?.fromSearch || false;

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
        if (currentUser?.id && user.id) {
          try {
            console.log('[UserProfilePage] Loading initial connection status:', { currentUserId: currentUser.id, profileUserId: user.id })
            const status = await connectionService.getConnectionStatus(currentUser.id, user.id);
            console.log('[UserProfilePage] Initial connection status:', status)
            setConnectionStatus(status.status || 'none');
          } catch (error) {
            console.error('[UserProfilePage] Error loading connection status:', error);
            setConnectionStatus('none');
          }
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

  // Keep ref in sync with state
  useEffect(() => {
    connectionStatusRef.current = connectionStatus;
  }, [connectionStatus]);

  // Poll for connection status updates (for auto-acceptance)
  useEffect(() => {
    if (!currentUser?.id || !profileUser?.id) {
      console.log('[UserProfilePage] Skipping status check - missing user data:', { currentUser: currentUser?.id, profileUser: profileUser?.id })
      return;
    }

    console.log('[UserProfilePage] Setting up status polling for:', { currentUserId: currentUser.id, profileUserId: profileUser.id, currentStatus: connectionStatus })

    const checkStatus = async () => {
      try {
        console.log('[UserProfilePage] Checking connection status...')
        const statusResult = await connectionService.getConnectionStatus(currentUser.id, profileUser.id);
        console.log('[UserProfilePage] Status check result:', statusResult)
        
        const currentStatus = connectionStatusRef.current;
        if (statusResult.status !== currentStatus) {
          const wasPending = currentStatus === 'pending';
          console.log('[UserProfilePage] Status changed:', { from: currentStatus, to: statusResult.status })
          setConnectionStatus(statusResult.status);
          
          if (wasPending && statusResult.status === 'connected') {
            console.log('[UserProfilePage] Connection accepted!')
            showToast('Connection request accepted! You can now message each other. 🤝', 'success');
          }
        } else {
          console.log('[UserProfilePage] Status unchanged:', statusResult.status)
        }
      } catch (error) {
        console.error('[UserProfilePage] Error checking status:', error)
      }
    };

    // Check immediately
    checkStatus();

    // Set up interval to check every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    console.log('[UserProfilePage] Set up polling interval (every 2s)')

    // Also listen for storage events (for cross-tab updates)
    const handleStorageChange = () => {
      console.log('[UserProfilePage] Storage event detected, checking status')
      checkStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      console.log('[UserProfilePage] Cleaning up status polling')
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser?.id, profileUser?.id, showToast]); // Only depend on IDs and showToast

  const handleReachOut = async () => {
    if (!currentUser?.id) {
      showToast('Please sign in to send connection requests', 'error');
      return;
    }

    console.log('[UserProfilePage] handleReachOut called:', { currentUserId: currentUser.id, profileUserId: profileUser.id })
    setIsSendingRequest(true);
    try {
      const result = await connectionService.sendConnectionRequest(currentUser.id, profileUser.id);
      console.log('[UserProfilePage] sendConnectionRequest result:', result)
      if (result.success) {
        console.log('[UserProfilePage] Setting status to pending')
        setConnectionStatus('pending');
        showToast('Connection request sent! They will receive it shortly.', 'success');
      } else {
        console.log('[UserProfilePage] Request failed:', result.message)
        showToast(result.message || 'Failed to send request', 'error');
      }
    } catch (error) {
      console.error('[UserProfilePage] Error sending connection request:', error);
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

  // Calculate stats (same as ProfilePage)
  const totalCircles = profileUser?.joinedCircles?.length || 0;
  const totalEvents = profileUser?.attendedEvents?.length || 0;
  const avgMood = profileUser?.moodHistory?.length > 0
    ? (profileUser.moodHistory.reduce((sum, m) => sum + m.score, 0) / profileUser.moodHistory.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {profileUser.name}'s Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Member since {new Date(profileUser.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          
          {/* Connection & Message Actions - Only show if accessed from search */}
          {isFromSearch && (
            <div className="flex gap-2">
              {connectionStatus === 'connected' ? (
                <button
                  onClick={handleMessage}
                  className="px-6 py-3 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors font-medium flex items-center gap-2 shadow-md"
                >
                  <span>💬</span>
                  <span>Message</span>
                </button>
              ) : connectionStatus === 'pending' ? (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed"
                >
                  <span>⏳</span>
                  <span>Request Pending...</span>
                </button>
              ) : (
                <button
                  onClick={handleReachOut}
                  disabled={isSendingRequest}
                  className="px-6 py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-lg hover:from-sage-600 hover:to-sage-700 transition-all font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span>🤝</span>
                  <span>{isSendingRequest ? 'Sending...' : 'Reach Out'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-sage-600">{profileUser.totalPoints || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Total Points</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-orange-600">{profileUser.currentStreak || 0}</div>
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
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-sage-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            📅 Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileHeader user={profileUser} />
              
              {/* Interests */}
              <ProfileInterests user={profileUser} />
              
              {/* Badges */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  🏆 Achievements & Badges
                </h3>
                <BadgeDisplay user={profileUser} />
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    All Badges
                  </h4>
                  <BadgeGrid user={profileUser} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <ProfileStats user={profileUser} />
              
              {/* Connections */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  👥 Communities
                </h3>
                <ConnectionsList user={profileUser} />
              </div>

              {/* Recent Activity */}
              <ProfileActivity user={profileUser} />
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
              <MoodHistoryChart user={profileUser} />
            </div>

            {/* Attended Events */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                📅 Attended Events
              </h3>
              <AttendedEventsList user={profileUser} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
