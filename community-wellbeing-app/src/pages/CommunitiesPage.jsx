import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/components/common/Navbar';
import CommunityCard from '../components/components/communities/CommunityCard';
import { communityService } from '../services/communityService';
import { useToast } from '../hooks/useToast';

export default function CommunitiesPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const data = await communityService.getCommunities();
        setAllCommunities(data.communities || []);
      } catch (error) {
        console.error('Error loading communities:', error);
        showToast('Failed to load communities', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, [showToast]);

  // Separate joined and available communities
  // Handle both array of IDs and array of objects with id property
  const joinedCommunityIds = (user?.joinedCircles || []).map(c => 
    typeof c === 'string' ? c : c.id
  );
  const joinedCommunities = allCommunities.filter(c => joinedCommunityIds.includes(c.id));
  const availableCommunities = allCommunities.filter(c => !joinedCommunityIds.includes(c.id));

  const handleJoinCommunity = async (communityId) => {
    try {
      await communityService.joinCommunity(communityId);
      showToast('Successfully joined community!', 'success');
      
      // Reload user from localStorage to get updated joinedCircles
      const updatedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (updatedUser.id && updateUser) {
        updateUser({ joinedCircles: updatedUser.joinedCircles });
      }
      
      // Reload communities
      const data = await communityService.getCommunities();
      setAllCommunities(data.communities || []);
    } catch (error) {
      console.error('Error joining community:', error);
      showToast('Failed to join community', 'error');
    }
  };

  const handleChatClick = (communityId) => {
    navigate(`/communities/${communityId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading communities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Communities</h1>
          <p className="text-gray-600">Connect with like-minded people and join conversations</p>
        </div>

        {/* Your Communities Section */}
        {joinedCommunities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>👥</span>
              <span>Your Communities</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isJoined={true}
                  onChatClick={() => handleChatClick(community.id)}
                  onJoinClick={() => handleJoinCommunity(community.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Communities Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>✨</span>
            <span>Communities You May Want to Join</span>
          </h2>
          {availableCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isJoined={false}
                  onChatClick={() => handleChatClick(community.id)}
                  onJoinClick={() => handleJoinCommunity(community.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-sage-200">
              <p className="text-gray-500">No more communities available. You've joined them all! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
