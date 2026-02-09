import { createContext, useState, useEffect } from 'react'
import { communityService } from '../services/communityService'

export const CommunityContext = createContext()

export const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [myCommunitiesIds, setMyCommunitiesIds] = useState([])

  useEffect(() => {
    loadCommunities()
    loadMyCommunities()
  }, [])

  const loadCommunities = async () => {
    setLoading(true)
    try {
      const data = await communityService.getCommunities()
      setCommunities(data.communities)
    } catch (error) {
      console.error('Error loading communities:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMyCommunities = () => {
    const stored = JSON.parse(localStorage.getItem('my_communities') || '[]')
    setMyCommunitiesIds(stored)
  }

  const joinCommunity = async (communityId) => {
    try {
      await communityService.joinCommunity(communityId)
      const updated = [...myCommunitiesIds, communityId]
      setMyCommunitiesIds(updated)
      localStorage.setItem('my_communities', JSON.stringify(updated))
      return true
    } catch (error) {
      console.error('Error joining community:', error)
      return false
    }
  }

  const leaveCommunity = async (communityId) => {
    try {
      const updated = myCommunitiesIds.filter(id => id !== communityId)
      setMyCommunitiesIds(updated)
      localStorage.setItem('my_communities', JSON.stringify(updated))
      return true
    } catch (error) {
      console.error('Error leaving community:', error)
      return false
    }
  }

  return (
    <CommunityContext.Provider value={{
      communities,
      loading,
      myCommunitiesIds,
      joinCommunity,
      leaveCommunity,
      loadCommunities
    }}>
      {children}
    </CommunityContext.Provider>
  )
}
