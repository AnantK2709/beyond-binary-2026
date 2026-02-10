import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { communityService } from '../services/communityService'
import Navbar from '../components/components/common/Navbar'
import GroupChat from '../components/components/communities/GroupChat'
import CommunityDetail from '../components/components/communities/CommunityDetail'
import CommunityEvents from '../components/components/communities/CommunityEvents'
import CommunityMembers from '../components/components/communities/CommunityMembers'
import { useToast } from '../hooks/useToast'

function CommunityDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('chat') // 'chat', 'details', 'events', 'members'
  const [isMember, setIsMember] = useState(false)

  const loadedCommunityRef = useRef(null)
  const componentIdRef = useRef(Math.random().toString(36).substr(2, 9))
  
  console.log(`[CommunityDetailPage-${componentIdRef.current}] Component render`, {
    id,
    loadedId: loadedCommunityRef.current,
    hasCommunity: !!community,
    loading
  });
  
  useEffect(() => {
    console.log(`[CommunityDetailPage-${componentIdRef.current}] useEffect triggered`, {
      id,
      loadedId: loadedCommunityRef.current,
      timestamp: new Date().toISOString()
    });

    // Only load if we don't have this community loaded or if id changed
    if (id && loadedCommunityRef.current !== id) {
      console.log(`[CommunityDetailPage-${componentIdRef.current}] ✅ Loading community ${id}`, {
        previousId: loadedCommunityRef.current
      });
      loadedCommunityRef.current = id
      
      const loadCommunity = async () => {
        try {
          console.log(`[CommunityDetailPage-${componentIdRef.current}] 📡 Calling getCommunityById(${id})`)
          const data = await communityService.getCommunityById(id)
          console.log(`[CommunityDetailPage-${componentIdRef.current}] ✅ Received community data:`, {
            name: data?.name,
            id: data?.id
          })
          if (data && data.error) {
            console.error(`[CommunityDetailPage-${componentIdRef.current}] ❌ API returned error:`, data.error)
            setCommunity(null)
            setIsMember(false)
          } else {
            setCommunity(data)
            
            // Check if current user is a member
            if (user?.id) {
              const joinedCircles = user.joinedCircles || []
              const joinedIds = joinedCircles.map(c => typeof c === 'string' ? c : c.id)
              setIsMember(joinedIds.includes(id))
            } else {
              setIsMember(false)
            }
          }
        } catch (error) {
          console.error(`[CommunityDetailPage-${componentIdRef.current}] ❌ Error loading community:`, error)
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            id
          })
          showToast(`Failed to load community: ${error.message}. Make sure the backend server is running on port 5001.`, 'error')
          setCommunity(null)
        } finally {
          setLoading(false)
        }
      }

      loadCommunity()
    } else if (id && loadedCommunityRef.current === id) {
      console.log(`[CommunityDetailPage-${componentIdRef.current}] ⚠️ Community ${id} already loaded, skipping`)
    } else if (!id) {
      console.log(`[CommunityDetailPage-${componentIdRef.current}] 🧹 Resetting (no id)`)
      // Reset if no id
      loadedCommunityRef.current = null
      setCommunity(null)
      setLoading(false)
    }

    return () => {
      console.log(`[CommunityDetailPage-${componentIdRef.current}] 🧹 Cleanup function called`, { id })
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]) // Depend on id and user to check membership when user changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading community...</div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-2">Community not found</div>
            <div className="text-gray-400 text-sm">
              Make sure the backend server is running on port 5001
            </div>
            <div className="text-gray-400 text-xs mt-2">
              Check the browser console for more details
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'chat', label: '💬 Chat', icon: '💬' },
    { id: 'details', label: '📋 Details', icon: '📋' },
    { id: 'events', label: '📅 Events', icon: '📅' },
    { id: 'members', label: '👥 Members', icon: '👥' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50">
      <Navbar />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
        {/* Community Header */}
        <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{community.name}</h1>
                {community.verified && (
                  <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>👥 {community.members} members</span>
                <span>•</span>
                <span>🎯 {community.interests?.join(', ') || 'Various interests'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-sage-200 mb-6">
          <div className="flex border-b border-sage-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50'
                    : 'text-gray-600 hover:text-sage-600 hover:bg-sage-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'chat' && (
              <div className="h-[600px]">
                <GroupChat communityId={id} isMember={isMember} />
              </div>
            )}
            {activeTab === 'details' && <CommunityDetail community={community} />}
            {activeTab === 'events' && <CommunityEvents communityId={id} />}
            {activeTab === 'members' && <CommunityMembers communityId={id} />}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityDetailPage
