import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import PollWidget from './PollWidget'
import EventProposal from './EventProposal'

function ChatMessage({ message, communityId }) {
  const { user } = useContext(AuthContext)
  const isOwnMessage = message.userId === user?.id
  const isSystem = message.type === 'system' || message.userId === 'system'
  const isAnnouncement = message.type === 'announcement'

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Render different message types
  if (message.type === 'poll') {
    // Guard against missing poll data
    if (!message.poll) {
      console.warn('[ChatMessage] Poll message missing poll data:', message)
      return (
        <div className="w-full mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-sage-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <span className="font-semibold text-gray-800">{message.userName}</span>
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-600">{message.text || 'Poll data unavailable'}</p>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-sage-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📊</span>
            <span className="font-semibold text-gray-800">{message.userName}</span>
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>
          <PollWidget poll={message.poll} messageId={message.id} communityId={communityId || message.communityId} />
        </div>
      </div>
    )
  }

  if (message.type === 'event_proposal') {
    return (
      <div className="w-full mb-4">
        <EventProposal proposal={message.proposal} messageId={message.id} userName={message.userName} timestamp={message.timestamp} />
      </div>
    )
  }

  if (isSystem || isAnnouncement) {
    return (
      <div className="w-full mb-3 flex justify-center">
        <div className={`px-4 py-2 rounded-full text-sm ${
          isAnnouncement 
            ? 'bg-orange-100 text-orange-800 border border-orange-200' 
            : 'bg-sage-100 text-sage-700 border border-sage-200'
        }`}>
          <span className="mr-2">{isAnnouncement ? '📢' : '🎉'}</span>
          <span>{message.text}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full mb-3 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {!isOwnMessage && (
          <div className="text-xs text-gray-600 mb-1 px-2">
            {message.userName}
          </div>
        )}
        <div className={`rounded-2xl px-4 py-2 ${
          isOwnMessage 
            ? 'bg-sage-500 text-white rounded-br-sm' 
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-sage-100'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          <span className={`text-xs mt-1 block ${
            isOwnMessage ? 'text-sage-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
