import { useState, useContext } from 'react'
import { FileText, CalendarPlus } from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { chatService } from '../../../services/chatService'
import { useToast } from '../../../hooks/useToast'

function EventProposal({ proposal, messageId, userName, timestamp }) {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [eventData, setEventData] = useState({
    title: proposal.title || '',
    description: proposal.description || '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 20
  })

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const result = await chatService.createEventFromProposal(messageId, {
        ...eventData,
        communityId: proposal.communityId,
        organizerId: user.id,
        organizerName: user.name
      })

      showToast('Event created successfully!', 'success')
      setShowCreateForm(false)
      // In a real app, you'd navigate to the event or refresh the events list
    } catch (error) {
      console.error('Error creating event:', error)
      showToast('Failed to create event. Please try again.', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-sage-200">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={18} className="text-gray-600" />
        <span className="font-semibold text-gray-800">{userName}</span>
        <span className="text-xs text-gray-500">{formatTime(timestamp)}</span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Event Proposal:</span> {proposal.title || 'Untitled Event'}
        </p>
        {proposal.description && (
          <p className="text-sm text-gray-600">{proposal.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Status: <span className="font-medium">{proposal.status}</span>
        </p>
      </div>

      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full mt-3 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm font-medium"
        >
          <span className="flex items-center justify-center gap-2"><CalendarPlus size={14} /> Create Event from Discussion</span>
        </button>
      ) : (
        <form onSubmit={handleCreateEvent} className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows="2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EventProposal
