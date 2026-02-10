import { useState, useEffect, useRef, useContext } from 'react'
import { ChatContext } from '../../../context/ChatContext'
import { AuthContext } from '../../../context/AuthContext'
import { chatService } from '../../../services/chatService'
import { simulateTimedMessages, generateDemoMessages } from '../../../utils/chatSimulator'
import { useToast } from '../../../hooks/useToast'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

function GroupChat({ communityId }) {
  const { messages, loading, loadMessages, sendMessage } = useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [isSimulating, setIsSimulating] = useState(true)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Load initial messages
  useEffect(() => {
    if (communityId) {
      loadMessages(communityId)
    }
  }, [communityId, loadMessages])

  // Simulate timed message appearance on mount
  useEffect(() => {
    if (communityId && messages[communityId] && isSimulating) {
      const communityMessages = messages[communityId]
      
      // Generate demo messages if we don't have many
      const demoMessages = communityMessages.length < 3 
        ? generateDemoMessages(communityId, 8)
        : communityMessages

      // Start simulation
      const cleanup = simulateTimedMessages(
        demoMessages,
        (message) => {
          setDisplayedMessages(prev => [...prev, message])
        },
        2000 // 2 seconds between messages
      )

      // Stop simulation after all messages are shown
      setTimeout(() => {
        setIsSimulating(false)
      }, demoMessages.length * 2000 + 1000)

      return cleanup
    } else if (messages[communityId] && !isSimulating) {
      // If not simulating, show all messages immediately
      setDisplayedMessages(messages[communityId])
    }
  }, [communityId, messages, isSimulating])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayedMessages])

  // Handle new messages from ChatContext
  useEffect(() => {
    if (messages[communityId]) {
      const latestMessage = messages[communityId][messages[communityId].length - 1]
      if (latestMessage && !displayedMessages.find(m => m.id === latestMessage.id)) {
        setDisplayedMessages(prev => [...prev, latestMessage])
      }
    }
  }, [messages, communityId, displayedMessages])

  const handleSendMessage = async (newMessage) => {
    if (newMessage) {
      // Add to displayed messages immediately for instant feedback
      setDisplayedMessages(prev => [...prev, newMessage])
      // Also update context
      await sendMessage(communityId, newMessage)
    }
  }

  const handleCreatePoll = async () => {
    const question = prompt('Enter poll question:')
    if (!question) return

    const options = []
    let optionCount = 0
    while (optionCount < 2) {
      const option = prompt(`Enter option ${optionCount + 1} (or leave empty to finish):`)
      if (!option) break
      options.push(option)
      optionCount++
    }

    if (options.length < 2) {
      showToast('Please provide at least 2 options for the poll', 'error')
      return
    }

    try {
      const pollMessage = await chatService.createPoll(
        communityId,
        question,
        options,
        user.id,
        user.name
      )
      await sendMessage(communityId, pollMessage)
      handleSendMessage(pollMessage)
      showToast('Poll created!', 'success')
    } catch (error) {
      console.error('Error creating poll:', error)
      showToast('Failed to create poll. Please try again.', 'error')
    }
  }

  const handleCreateEventProposal = async () => {
    const title = prompt('Enter event title:')
    if (!title) return

    const description = prompt('Enter event description:') || ''

    try {
      const proposalMessage = await chatService.createEventProposal(
        communityId,
        { title, description, communityId },
        user.id,
        user.name
      )
      await sendMessage(communityId, proposalMessage)
      handleSendMessage(proposalMessage)
      showToast('Event proposal created!', 'success')
    } catch (error) {
      console.error('Error creating event proposal:', error)
      showToast('Failed to create event proposal. Please try again.', 'error')
    }
  }

  if (loading && displayedMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-sage-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-sage-200 bg-sage-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">💬 Community Chat</h3>
            <p className="text-xs text-gray-600">Real-time discussion</p>
          </div>
          {isSimulating && (
            <div className="flex items-center gap-2 text-xs text-sage-600">
              <div className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></div>
              <span>Simulating messages...</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ maxHeight: '600px' }}
      >
        {displayedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">💬</p>
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          displayedMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        communityId={communityId}
        onCreatePoll={handleCreatePoll}
        onCreateEventProposal={handleCreateEventProposal}
      />
    </div>
  )
}

export default GroupChat
