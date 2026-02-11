import { useState, useContext } from 'react'
import { BarChart3, CalendarPlus } from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { ChatContext } from '../../../context/ChatContext'
import { chatService } from '../../../services/chatService'
import { useToast } from '../../../hooks/useToast'

function ChatInput({ communityId, isMember = false, onCreatePoll, onCreateEventProposal, onMessageSent }) {
  const { user } = useContext(AuthContext)
  const { sendMessage } = useContext(ChatContext)
  const { showToast } = useToast()
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()

    if (!messageText.trim() || isSending || !user) return

    // Check if user is a member
    if (!isMember) {
      showToast('You must be a member of this community to send messages', 'error')
      return
    }

    setIsSending(true)
    try {
      const newMessage = await chatService.sendMessage(
        communityId,
        messageText.trim(),
        user.id,
        user.name || 'You'
      )

      // Call onMessageSent callback if provided (for triggering conversation flows)
      // This callback handles adding to displayedMessages, updating context, and triggering flows
      if (newMessage && onMessageSent) {
        await onMessageSent(newMessage)
      } else if (newMessage) {
        // Fallback: if no callback, just send through context
        await sendMessage(communityId, newMessage)
      }
      setMessageText('')
      setShowOptions(false)
    } catch (error) {
      console.error('Error sending message:', error)
      // Check if error is due to membership
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to send message'
      if (errorMessage.includes('member') || errorMessage.includes('must be a member') || error?.response?.status === 403) {
        showToast('You must be a member of this community to send messages. Please join first.', 'error')
      } else {
        showToast(errorMessage || 'Failed to send message. Please try again.', 'error')
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  const handleCreatePoll = () => {
    if (onCreatePoll) {
      onCreatePoll()
      setShowOptions(false)
    }
  }

  const handleCreateEventProposal = () => {
    if (onCreateEventProposal) {
      onCreateEventProposal()
      setShowOptions(false)
    }
  }

  return (
    <div className="border-t border-sage-200 bg-white p-4">
      {/* Options Menu */}
      {showOptions && (
        <div className="mb-3 p-3 bg-sage-50 rounded-lg border border-sage-200">
          <div className="flex gap-2">
            <button
              onClick={handleCreatePoll}
              className="flex-1 px-4 py-2 bg-white border border-sage-300 rounded-lg hover:bg-sage-100 transition-colors text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
            >
              <BarChart3 size={14} /> Create Poll
            </button>
            <button
              onClick={handleCreateEventProposal}
              className="flex-1 px-4 py-2 bg-white border border-sage-300 rounded-lg hover:bg-sage-100 transition-colors text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
            >
              <CalendarPlus size={14} /> Propose Event
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="px-3 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors text-lg"
          title="More options"
        >
          +
        </button>
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isMember ? "Type a message..." : "Join this community to send messages..."}
          disabled={!isMember}
          className={`flex-1 px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none ${
            !isMember ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          rows="1"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={!messageText.trim() || isSending || !isMember}
          className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default ChatInput
