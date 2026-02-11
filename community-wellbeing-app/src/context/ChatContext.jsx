import { createContext, useState, useCallback, useRef } from 'react'
import { chatService } from '../services/chatService'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef({}) // Track which communities are currently loading
  const loadedRef = useRef(new Set()) // Track which communities have been loaded

  const loadMessages = useCallback(async (communityId) => {
    const callId = `loadMessages-${communityId}-${Date.now()}`;
    const stackTrace = new Error().stack;
    
    console.log(`[ChatContext] loadMessages(${communityId}) called`, {
      callId,
      isCurrentlyLoading: loadingRef.current[communityId],
      isAlreadyLoaded: loadedRef.current.has(communityId),
      timestamp: new Date().toISOString(),
      stackTrace: stackTrace.split('\n').slice(1, 4).join('\n')
    });

    // Prevent duplicate calls for the same community
    if (loadingRef.current[communityId]) {
      console.log(`[ChatContext] Already loading messages for ${communityId}, skipping`, { callId })
      return // Already loading
    }

    // Always reload for fresh start (clear previous loaded state)
    if (loadedRef.current.has(communityId)) {
      console.log(`[ChatContext] Clearing previous loaded state for fresh start`, { callId })
      loadedRef.current.delete(communityId)
      // Clear messages for this community
      setMessages(prev => {
        const updated = { ...prev }
        delete updated[communityId]
        return updated
      })
    }

    console.log(`[ChatContext] Proceeding to load messages for ${communityId}`, { callId });
    loadingRef.current[communityId] = true
    setLoading(true)
    
    try {
      console.log(`[ChatContext] Calling chatService.getMessages(${communityId})`, { callId })
      const data = await chatService.getMessages(communityId)
      
      // Filter out invalid poll messages on frontend as well (safety check)
      const validMessages = (data.messages || []).filter(msg => {
        if (msg.type === 'poll' && !msg.poll) {
          console.warn(`[ChatContext] Filtering out invalid poll message ${msg.id}`)
          return false
        }
        return true
      })
      
      setMessages(prev => {
        console.log(`[ChatContext] Setting messages for ${communityId}: ${validMessages.length} valid messages`, { callId })
        loadedRef.current.add(communityId) // Mark as loaded
        return {
          ...prev,
          [communityId]: validMessages
        }
      })
    } catch (error) {
      console.error(`[ChatContext] Error loading messages:`, error, { callId })
      setMessages(prev => ({
        ...prev,
        [communityId]: []
      }))
      loadedRef.current.add(communityId) // Mark as attempted even on error
    } finally {
      loadingRef.current[communityId] = false
      setLoading(false)
      console.log(`[ChatContext] loadMessages(${communityId}) completed`, { callId })
    }
  }, []) // Empty dependency array - function is stable

  const sendMessage = async (communityId, message) => {
    try {
      // If message is already a message object, use it directly
      // Otherwise, it's a new message that needs to be added
      if (message && message.id) {
        setMessages(prev => ({
          ...prev,
          [communityId]: [...(prev[communityId] || []), message]
        }))
        return message
      } else {
        // This shouldn't happen, but handle it gracefully
        console.warn('Invalid message format:', message)
        return null
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  const updateMessage = useCallback((communityId, messageId, updatedMessage) => {
    setMessages(prev => {
      const communityMessages = prev[communityId] || []
      const messageIndex = communityMessages.findIndex(m => m.id === messageId)
      
      if (messageIndex === -1) {
        console.warn(`[ChatContext] Message ${messageId} not found in community ${communityId}`)
        return prev
      }

      const updatedMessages = [...communityMessages]
      updatedMessages[messageIndex] = updatedMessage

      return {
        ...prev,
        [communityId]: updatedMessages
      }
    })
  }, [])

  return (
    <ChatContext.Provider value={{ messages, loading, loadMessages, sendMessage, updateMessage }}>
      {children}
    </ChatContext.Provider>
  )
}
