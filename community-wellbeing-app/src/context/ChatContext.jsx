import { createContext, useState, useEffect } from 'react'
import { chatService } from '../services/chatService'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(false)

  const loadMessages = async (communityId) => {
    if (messages[communityId]) return // Already loaded

    setLoading(true)
    try {
      const data = await chatService.getMessages(communityId)
      setMessages(prev => ({
        ...prev,
        [communityId]: data.messages || []
      }))
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages(prev => ({
        ...prev,
        [communityId]: []
      }))
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <ChatContext.Provider value={{ messages, loading, loadMessages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  )
}
