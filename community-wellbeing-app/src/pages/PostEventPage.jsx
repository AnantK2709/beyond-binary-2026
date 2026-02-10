import { useEffect, useMemo, useState, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EventContext } from '../context/EventContext'
import { eventService } from '../services/eventService'
import { aiService } from '../services/aiService'

import StarRating from '../components/common/StarRating'
import Toast from '../components/common/Toast'

const MOODS = [
  { value: 'happy', label: '😊 Happy' },
  { value: 'energized', label: '⚡ Energized' },
  { value: 'calm', label: '🧘 Calm' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'stressed', label: '😰 Stressed' },
  { value: 'anxious', label: '😟 Anxious' },
  { value: 'lonely', label: '🥺 Lonely' },
  { value: 'sad', label: '😔 Sad' }
]

function PostEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isRsvped } = useContext(EventContext)

  const [event, setEvent] = useState(null)
  const [userReview, setUserReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form state
  const [rating, setRating] = useState(0)
  const [mood, setMood] = useState('neutral')
  const [reviewText, setReviewText] = useState('')
  const [recommend, setRecommend] = useState(null) // true/false
  const [submitting, setSubmitting] = useState(false)

  // AI outputs
  const [aiInsight, setAiInsight] = useState(null) // { insight, sentiment, recommendations, confidence }
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' })

  const showToast = (type, message) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }

  const hasRsvp = useMemo(() => (event ? isRsvped(event.id) : false), [event, isRsvped])

  const isEventPast = useMemo(() => {
    if (!event) return false
    const dt = new Date(`${event.date}T${event.time || '00:00'}:00`)
    return dt < new Date()
  }, [event])

  // Eligibility: RSVP + ended + not reviewed
  const eligible = useMemo(() => {
    return !!event && hasRsvp && isEventPast && !userReview
  }, [event, hasRsvp, isEventPast, userReview])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const ev = await eventService.getEventById(id)
        setEvent(ev)

        // Must exist in your repo; if not, tell me and I'll adapt.
        const review = await eventService.getEventReview(id)
        setUserReview(review)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Failed to load post-event page.')
      } finally {
        setLoading(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating < 1 || rating > 5) {
      showToast('warning', 'Please select a star rating (1–5).')
      return
    }
    if (recommend === null) {
      showToast('warning', 'Please choose Yes/No for recommendation.')
      return
    }

    setSubmitting(true)
    setAiInsight(null)

    try {
      // Save review (client side). Shape it however your eventService expects.
      // We'll include mood + reviewText because aiService needs them.
      const saved = await eventService.submitReview(event.id, {
        rating,
        mood,
        reviewText,
        recommend
      })

      showToast('success', `Submitted! +${saved?.pointsEarned ?? 50} points ✨`)

      // Generate AI insight (rule-based)
      const insightObj = await aiService.generateEventInsight(
        { rating, mood, reviewText },
        event
      )

      setAiInsight(insightObj)

      // lock out resubmission
      const updatedReview = await eventService.getEventReview(event.id)
      setUserReview(updatedReview)
    } catch (err) {
      console.error(err)
      showToast('error', err.message || 'Failed to submit feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-gray-700">Loading post-event page…</div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-red-700 mb-4">{error || 'Event not found'}</div>
        <Link to="/events" className="text-[#5F9C8D] underline">Back to Events</Link>
      </div>
    )
  }

  if (!eligible) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <button onClick={() => navigate(`/events/${event.id}`)} className="text-[#5F9C8D] underline">
            ← Back to Event
          </button>
        </div>

        <div className="rounded-2xl border border-[#7AB5A3]/40 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post-Event Feedback</h1>
          <p className="text-gray-600 mb-6">
            This form unlocks after you RSVP and the event has ended.
          </p>

          <div className="space-y-3 text-gray-700">
            <div>RSVP’d: <span className="font-semibold">{hasRsvp ? 'Yes' : 'No'}</span></div>
            <div>Event ended: <span className="font-semibold">{isEventPast ? 'Yes' : 'Not yet'}</span></div>
            <div>Already reviewed: <span className="font-semibold">{userReview ? 'Yes' : 'No'}</span></div>
          </div>

          {!hasRsvp && (
            <div className="mt-6 text-sm text-gray-600">
              RSVP first — then you can submit feedback after the event ends.
            </div>
          )}

          {userReview && (
            <div className="mt-6 text-sm text-gray-600">
              You already submitted feedback for this event ✅
            </div>
          )}
        </div>

        {toast.show && (
          <Toast
            show={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(t => ({ ...t, show: false }))}
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(`/events/${event.id}`)} className="text-[#5F9C8D] underline">
          ← Back to Event
        </button>
        <div className="text-sm text-gray-600">Earn points for feedback ✨</div>
      </div>

      <div className="rounded-2xl border border-[#7AB5A3]/40 bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">How was {event.title}?</h1>
        <p className="text-gray-600 mb-6">Quick review → smarter recommendations.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="font-semibold text-gray-800 mb-2">Rating</div>
            <StarRating value={rating} onChange={setRating} size="lg" showLabel />
          </div>

          <div>
            <div className="font-semibold text-gray-800 mb-2">How did you feel after the event?</div>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#7AB5A3]"
            >
              {MOODS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="font-semibold text-gray-800 mb-2">Feedback (optional)</div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              placeholder="What did you like? Anything we should improve?"
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[#7AB5A3]"
            />
          </div>

          <div>
            <div className="font-semibold text-gray-800 mb-2">Would you recommend this to your community?</div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRecommend(true)}
                className={`px-4 py-2 rounded-xl border ${
                  recommend === true ? 'bg-[#A8D5BA] border-[#5F9C8D]' : 'bg-white border-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setRecommend(false)}
                className={`px-4 py-2 rounded-xl border ${
                  recommend === false ? 'bg-[#FFB6A3] border-[#FFB74D]' : 'bg-white border-gray-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-xl bg-[#5F9C8D] text-white font-semibold hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
            <div className="text-sm text-gray-600">+50 points</div>
          </div>
        </form>
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div className="mt-6 rounded-2xl border border-[#7AB5A3]/40 bg-[#F7FAF9] p-6">
          <div className="font-bold text-gray-900 mb-1">AI Insight</div>
          <div className="text-gray-700 mb-4">{aiInsight.insight}</div>

          {aiInsight.recommendations?.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-gray-900">Next suggestions</div>
              <ul className="list-disc pl-5 text-gray-700">
                {aiInsight.recommendations.map((r, idx) => (
                  <li key={idx}>{r.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Confidence: <span className="font-semibold">{aiInsight.confidence}</span>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          show={toast.show}
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />
      )}
    </div>
  )
}

export default PostEventPage
