import { useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { chatService } from '../../../services/chatService'
import { useToast } from '../../../hooks/useToast'

function PollWidget({ poll, messageId }) {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [localPoll, setLocalPoll] = useState(poll)

  const handleVote = async (optionId) => {
    if (hasVoted || !user) {
      showToast('You have already voted', 'info')
      return
    }

    try {
      await chatService.voteOnPoll(messageId, optionId, user.id)
      
      // Update local state optimistically
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
    } catch (error) {
      console.error('Error voting:', error)
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
