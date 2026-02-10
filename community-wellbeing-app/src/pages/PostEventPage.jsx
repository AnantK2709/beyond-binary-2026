import { useEffect, useMemo, useState, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EventContext } from '../context/EventContext'
import { eventService } from '../services/eventService'
import { aiService } from '../services/aiService'

import StarRating from '../components/common/StarRating'
import Toast from '../components/common/Toast'
import Navbar from '../components/components/common/Navbar'

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
      <div className="min-h-screen pb-20 md:pb-0">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="card p-12 text-center">
            <div className="w-16 h-16 border-4 border-sage-500/30 border-t-sage-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading post-event page...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The event you are looking for does not exist.'}</p>
            <Link to="/events" className="btn-primary px-6 py-3 inline-block">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!eligible) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="mb-6">
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Event
            </button>
          </div>

          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Post-Event Feedback</h1>
              <p className="text-gray-600">
                This form unlocks after you RSVP and the event has ended.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{hasRsvp ? '✅' : '❌'}</span>
                  <span className="font-medium text-gray-700">RSVP Status</span>
                </div>
                <span className={`font-semibold ${hasRsvp ? 'text-green-600' : 'text-red-600'}`}>
                  {hasRsvp ? 'Confirmed' : 'Not RSVP\'d'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isEventPast ? '✅' : '⏳'}</span>
                  <span className="font-medium text-gray-700">Event Status</span>
                </div>
                <span className={`font-semibold ${isEventPast ? 'text-green-600' : 'text-orange-600'}`}>
                  {isEventPast ? 'Ended' : 'Upcoming'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{userReview ? '✅' : '⭐'}</span>
                  <span className="font-medium text-gray-700">Review Status</span>
                </div>
                <span className={`font-semibold ${userReview ? 'text-green-600' : 'text-gray-600'}`}>
                  {userReview ? 'Already Submitted' : 'Not Submitted'}
                </span>
              </div>
            </div>

            {!hasRsvp && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Next step:</strong> RSVP to this event first, then you can submit feedback after it ends.
                </p>
              </div>
            )}

            {hasRsvp && !isEventPast && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl mb-4">
                <p className="text-sm text-orange-800">
                  <strong>Almost there!</strong> This event hasn't ended yet. Come back after the event to leave your review.
                </p>
              </div>
            )}

            {userReview && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                <p className="text-sm text-green-800">
                  <strong>Thank you!</strong> You already submitted feedback for this event. Your review helps our community grow.
                </p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className="btn-primary px-6 py-3"
              >
                Back to Event Details
              </button>
            </div>
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
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
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
    </div>
  )
}

export default PostEventPage
