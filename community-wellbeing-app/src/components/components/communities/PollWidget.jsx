import { useState, useContext, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { ChatContext } from '../../../context/ChatContext'
import { chatService } from '../../../services/chatService'
import { useToast } from '../../../hooks/useToast'

function PollWidget({ poll, messageId, communityId }) {
  const { user } = useContext(AuthContext)
  const { messages, updateMessage } = useContext(ChatContext)
  const { showToast } = useToast()
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [localPoll, setLocalPoll] = useState(poll)

  // Sync poll data from context when it updates
  useEffect(() => {
    if (messages[communityId]) {
      const message = messages[communityId].find(m => m.id === messageId)
      if (message && message.poll) {
        setLocalPoll(message.poll)
        // Check if current user has voted
        const userHasVoted = message.poll.options.some(opt => opt.voters.includes(user?.id))
        if (userHasVoted) {
          setHasVoted(true)
          const votedOption = message.poll.options.find(opt => opt.voters.includes(user?.id))
          if (votedOption) {
            setSelectedOption(votedOption.id)
          }
        }
      }
    }
  }, [messages, communityId, messageId, user?.id])

  // Guard against missing poll data
  if (!poll || !poll.question || !poll.options) {
    console.warn('[PollWidget] Missing poll data:', { poll, messageId, communityId })
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 flex items-center gap-1"><AlertTriangle size={14} /> Poll data is missing or incomplete</p>
      </div>
    )
  }

  const handleVote = async (optionId) => {
    if (hasVoted || !user) {
      if (hasVoted) {
        showToast('You have already voted', 'info')
      } else {
        showToast('Please log in to vote', 'info')
      }
      return
    }

    // Check if user already voted on this option
    const option = localPoll.options.find(opt => opt.id === optionId)
    if (option && option.voters.includes(user.id)) {
      showToast('You have already voted on this option', 'info')
      return
    }

    try {
      console.log(`[PollWidget] User ${user.name} voting for option ${optionId}`)
      const updatedMessage = await chatService.voteOnPoll(communityId, messageId, optionId, user.id)
      
      // Update local state with the response from server
      if (updatedMessage && updatedMessage.poll) {
        setLocalPoll(updatedMessage.poll)
        setSelectedOption(optionId)
        setHasVoted(true)
        
        // Update ChatContext with the updated message
        if (updateMessage) {
          updateMessage(communityId, messageId, updatedMessage)
        }
        
        showToast('Vote recorded!', 'success')
        console.log(`[PollWidget] ✅ Vote recorded successfully`)
      } else {
        // Fallback: update optimistically
        const updatedOptions = localPoll.options.map(opt => {
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: opt.votes + 1,
              voters: [...opt.voters, user.id]
            }
          }
          return opt
        })

        setLocalPoll({
          ...localPoll,
          options: updatedOptions,
          totalVotes: localPoll.totalVotes + 1
        })
        
        setSelectedOption(optionId)
        setHasVoted(true)
        showToast('Vote recorded!', 'success')
      }
    } catch (error) {
      console.error('[PollWidget] Error voting:', error)
      showToast('Failed to vote. Please try again.', 'error')
    }
  }

  const getPercentage = (votes) => {
    if (localPoll.totalVotes === 0) return 0
    return Math.round((votes / localPoll.totalVotes) * 100)
  }

  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-800 mb-3">{localPoll.question}</p>
      <div className="space-y-2">
        {localPoll.options.map((option) => {
          const percentage = getPercentage(option.votes)
          const isSelected = selectedOption === option.id
          const userVoted = option.voters.includes(user?.id)

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || !user}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                isSelected || userVoted
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 bg-white hover:border-sage-300 hover:bg-sage-50'
              } ${hasVoted || !user ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">{option.text}</span>
                <span className="text-xs text-gray-600">
                  {option.votes} {option.votes === 1 ? 'vote' : 'votes'} {percentage > 0 && `(${percentage}%)`}
                </span>
              </div>
              {localPoll.totalVotes > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isSelected || userVoted ? 'bg-sage-500' : 'bg-sage-300'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {localPoll.totalVotes} {localPoll.totalVotes === 1 ? 'vote' : 'total votes'}
      </p>
    </div>
  )
}

export default PollWidget
