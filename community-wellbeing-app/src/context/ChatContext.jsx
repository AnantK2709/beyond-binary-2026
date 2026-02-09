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
        [communityId]: data.messages
      }))
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (communityId, message) => {
    try {
      const newMessage = await chatService.sendMessage(communityId, message)
      setMessages(prev => ({
        ...prev,
        [communityId]: [...(prev[communityId] || []), newMessage]
      }))
      return newMessage
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
