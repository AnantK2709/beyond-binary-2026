import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/components/common/Navbar';
import CommunityCard from '../components/components/communities/CommunityCard';
import CreateCommunityModal from '../components/components/communities/CreateCommunityModal';
import { communityService } from '../services/communityService';
import { useToast } from '../hooks/useToast';
import { Plus, Users, Sparkle, Sparkles, PartyPopper } from 'lucide-react';

export default function CommunitiesPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'all'
  const hasLoadedRef = useRef(false);
  const componentIdRef = useRef(Math.random().toString(36).substr(2, 9));

  console.log(`[CommunitiesPage-${componentIdRef.current}] Component render`, {
    hasLoaded: hasLoadedRef.current,
    loading,
    communitiesCount: allCommunities.length
  });

  useEffect(() => {
    console.log(`[CommunitiesPage-${componentIdRef.current}] useEffect triggered`, {
      hasLoaded: hasLoadedRef.current,
      timestamp: new Date().toISOString()
    });

    // Prevent duplicate calls (React StrictMode causes double renders in dev)
    // Set flag immediately to prevent race conditions
    if (hasLoadedRef.current) {
      console.log(`[CommunitiesPage-${componentIdRef.current}] Already loaded, skipping duplicate call`);
      return;
    }
    
    console.log(`[CommunitiesPage-${componentIdRef.current}] Setting hasLoadedRef to true`);
    hasLoadedRef.current = true; // Set immediately before async call

    const loadCommunities = async () => {
      try {
        console.log(`[CommunitiesPage-${componentIdRef.current}] Calling API: getCommunities()`);
        const data = await communityService.getCommunities();
        console.log(`[CommunitiesPage-${componentIdRef.current}] Received ${data.communities?.length || 0} communities`);
        setAllCommunities(data.communities || []);
      } catch (error) {
        console.error(`[CommunitiesPage-${componentIdRef.current}] Error loading communities:`, error);
        showToast('Failed to load communities', 'error');
        hasLoadedRef.current = false; // Reset on error so it can retry
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();

    return () => {
      console.log(`[CommunitiesPage-${componentIdRef.current}] Cleanup function called`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Separate joined and available communities
  // Handle both array of IDs and array of objects with id property
  const joinedCommunityIds = (user?.joinedCircles || []).map(c => 
    typeof c === 'string' ? c : c.id
  );
  const joinedCommunities = allCommunities.filter(c => joinedCommunityIds.includes(c.id));
  const availableCommunities = allCommunities.filter(c => !joinedCommunityIds.includes(c.id));

  // Recommend communities based on user interests
  const getRecommendedCommunities = () => {
    // Normalize user interests - handle both array of strings and activity preferences
    const userInterestsArray = user?.interests || [];
    const activityPreferences = user?.activityPreferences || {};
    
    // Combine interests and activity preferences into a single array
    const allUserInterests = [
      ...userInterestsArray.map(i => i.toLowerCase().trim()),
      ...Object.keys(activityPreferences).filter(key => activityPreferences[key]).map(k => k.toLowerCase().trim())
    ];

    const joinedIds = (user?.joinedCircles || []).map(c => typeof c === 'string' ? c : c.id);

    console.log('[CommunitiesPage] User interests for matching:', {
      userInterestsArray,
      activityPreferences,
      allUserInterests,
      user: user?.name,
      availableCommunitiesCount: availableCommunities.length,
      totalCommunitiesCount: allCommunities.length,
      joinedCommunityIds: joinedIds,
      availableCommunityIds: availableCommunities.map(c => c.id)
    });

    if (allUserInterests.length === 0) {
      console.log('[CommunitiesPage] No interests found, returning all communities');
      return []; // Return empty if no interests - show all in "All Communities"
    }

    // Score communities based on matching interests
    const scoredCommunities = availableCommunities.map(community => {
      const communityInterests = (community.interests || []).map(i => i.toLowerCase().trim());
      
      // Find ALL matches (both exact and partial)
      const matchedInterests = [];
      
      communityInterests.forEach(communityInterest => {
        // Check for exact match first
        if (allUserInterests.includes(communityInterest)) {
          if (!matchedInterests.includes(communityInterest)) {
            matchedInterests.push(communityInterest);
          }
        } else {
          // Check for partial match - check if any user interest is contained in community interest or vice versa
          const hasPartialMatch = allUserInterests.some(userInterest => {
            // Direct substring match
            if (communityInterest.includes(userInterest) || userInterest.includes(communityInterest)) {
              return true;
            }
            // Word-by-word match (e.g., "mental health" matches "mental health support")
            const communityWords = communityInterest.split(/\s+/);
            const userWords = userInterest.split(/\s+/);
            return communityWords.some(word => userWords.includes(word)) ||
                   userWords.some(word => communityWords.includes(word));
          });
          
          if (hasPartialMatch && !matchedInterests.includes(communityInterest)) {
            matchedInterests.push(communityInterest);
          }
        }
      });

      const matchCount = matchedInterests.length;

      // Only log if there's a match (to reduce console noise)
      if (matchCount > 0) {
        console.log(`[CommunitiesPage] "${community.name}" matched:`, {
          matchedInterests,
          matchCount,
          communityInterests
        });
      }

      return {
        ...community,
        matchScore: matchCount,
        matchPercentage: communityInterests.length > 0 
          ? (matchCount / communityInterests.length) * 100 
          : 0,
        matchedInterests: matchedInterests
      };
    });

    // Sort by match score (highest first) and return top matches
    const recommended = scoredCommunities
      .sort((a, b) => {
        // First sort by match score (higher is better)
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        // Then by match percentage (higher is better)
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        // Finally by number of members (more popular first)
        return (b.members || 0) - (a.members || 0);
      })
      .filter(c => c.matchScore > 0) // Only show communities with at least one matching interest
      .slice(0, 6); // Limit to top 6 recommended communities

    console.log('[CommunitiesPage] Recommended communities:', recommended.map(c => ({
      id: c.id,
      name: c.name,
      matchScore: c.matchScore,
      matchPercentage: c.matchPercentage.toFixed(1) + '%',
      matchedInterests: c.matchedInterests,
      communityInterests: c.interests
    })));

    return recommended;
  };

  const recommendedCommunities = getRecommendedCommunities();
  const otherCommunities = availableCommunities.filter(c => 
    !recommendedCommunities.some(rc => rc.id === c.id)
  );

  const handleJoinCommunity = async (communityId) => {
    if (!user?.id) {
      showToast('Please sign in to join communities', 'error');
      return;
    }

    try {
      await communityService.joinCommunity(communityId, user.id);
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Communities</h1>
            <p className="text-gray-600">Connect with like-minded people and join conversations</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors font-semibold flex items-center gap-2 shadow-md"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Community</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-sage-200">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'my'
                  ? 'text-sage-700 border-sage-600'
                  : 'text-gray-500 border-transparent hover:text-sage-600'
              }`}
            >
              My Communities
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'text-sage-700 border-sage-600'
                  : 'text-gray-500 border-transparent hover:text-sage-600'
              }`}
            >
              All Communities
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'my' && (
          <div>
            {/* Your Joined Communities */}
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

            {/* Recommended Communities Based on Your Interests */}
            {recommendedCommunities.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkle size={24} strokeWidth={2} />
                  <span>Recommended for You</span>
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Based on your interests: {user?.interests?.slice(0, 5).join(', ') || 'none'}
                  {user?.activityPreferences && Object.keys(user.activityPreferences).filter(k => user.activityPreferences[k]).length > 0 && (
                    <span className="ml-2">
                      ({Object.keys(user.activityPreferences).filter(k => user.activityPreferences[k]).join(', ')})
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCommunities.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      isJoined={false}
                      onChatClick={() => handleChatClick(community.id)}
                      onJoinClick={() => handleJoinCommunity(community.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State for My Communities */}
            {joinedCommunities.length === 0 && recommendedCommunities.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-sage-200">
                <p className="text-gray-500 mb-4">You haven't joined any communities yet.</p>
                <p className="text-gray-400 text-sm">Check out "All Communities" to discover new ones!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>✨</span>
              <span>All Communities</span>
            </h2>
            {allCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCommunities.map((community) => {
                  const isJoined = joinedCommunityIds.includes(community.id);
                  return (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      isJoined={isJoined}
                      onChatClick={() => handleChatClick(community.id)}
                      onJoinClick={() => handleJoinCommunity(community.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-sage-200">
                <p className="text-gray-500">No communities available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCommunityCreated={async () => {
          // Get the newly created community data
          const newCommunity = window.newCommunityData;
          
          // Reload communities after creation
          const data = await communityService.getCommunities();
          setAllCommunities(data.communities || []);
          
          // Update user's joinedCircles in localStorage and AuthContext
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (currentUser.id === user?.id && newCommunity) {
            const joinedCircles = currentUser.joinedCircles || [];
            const isAlreadyJoined = joinedCircles.some(c => 
              (typeof c === 'string' ? c : c.id) === newCommunity.id
            );
            
            if (!isAlreadyJoined) {
              currentUser.joinedCircles = [
                ...joinedCircles,
                { id: newCommunity.id, name: newCommunity.name, role: 'admin' }
              ];
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
              
              // Update AuthContext to trigger re-render
              if (updateUser) {
                updateUser({ joinedCircles: currentUser.joinedCircles });
              }
            }
          }
          
          // Clean up
          window.newCommunityId = null;
          window.newCommunityData = null;
          
          showToast('Community created successfully!', 'success');
        }}
      />
    </div>
  );
}
