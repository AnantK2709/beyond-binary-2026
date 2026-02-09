import { useState } from 'react'
import { eventService } from '../../services/eventService'
import StarRating from '../common/StarRating'
import LevelUpModal from './LevelUpModal'

function PostEventModal({ event, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (wouldRecommend === null) {
      setError('Please indicate if you would recommend this event')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const reviewData = {
        rating,
        text: reviewText.trim(),
        wouldRecommend,
        attended: true
      }

      const result = await eventService.submitReview(event.id, reviewData)

      // Show success animation
      setShowSuccess(true)

      // Check if user leveled up
      if (result.levelUp) {
        setLevelUpData(result.levelUpData)
        setTimeout(() => {
          setShowLevelUp(true)
        }, 1500) // Show level up modal after success animation
      } else {
        // Close modal after success animation if no level up
        setTimeout(() => {
          if (onSubmit) onSubmit(result)
          onClose()
        }, 1500)
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setError(err.message || 'Failed to submit review. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  const handleLevelUpClose = () => {
    setShowLevelUp(false)
    if (onSubmit) onSubmit()
    onClose()
  }

  if (showLevelUp && levelUpData) {
    return (
      <LevelUpModal
        levelUpData={levelUpData}
        onClose={handleLevelUpClose}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg card p-8 animate-scale-up max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⭐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How was your experience?
              </h2>
              <p className="text-gray-600">
                Share your feedback about "{event.title}"
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 text-center">
                  Rate this event <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center">
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    size="lg"
                    showLabel={true}
                  />
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label htmlFor="review-text" className="block text-sm font-semibold text-gray-700">
                  Tell us more (optional)
                </label>
                <textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you enjoy? Any suggestions for improvement?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Your feedback helps improve future events</span>
                  <span>{reviewText.length}/500</span>
                </div>
              </div>

              {/* Would Recommend */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Would you recommend this event? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(true)}
                    className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      wouldRecommend === true
                        ? 'bg-gradient-to-r from-sage-500 to-sage-600 text-white border-2 border-sage-600 shadow-lg scale-105'
                        : 'bg-white/50 border-2 border-gray-300 text-gray-700 hover:border-sage-400 hover:bg-sage-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">👍</div>
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setWouldRecommend(false)}
                    className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      wouldRecommend === false
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-2 border-gray-600 shadow-lg scale-105'
                        : 'bg-white/50 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">👎</div>
                    No
                  </button>
                </div>
              </div>

              {/* Points Reward Info */}
              <div className="bg-gradient-to-r from-sage-400/20 to-ocean-400/20 rounded-2xl p-4 border border-sage-300/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎁</span>
                    <span className="font-semibold text-gray-800">Bonus Reward</span>
                  </div>
                  <span className="text-2xl font-bold text-sage-700">+50 pts</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
                  <span className="text-red-600 text-xl">⚠️</span>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold bg-white/50 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="flex-1 btn-primary py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Success Animation
          <div className="text-center py-12 animate-scale-up">
            <div className="relative inline-block mb-6">
              <div className="text-8xl animate-bounce-gentle">✓</div>
              <div className="absolute inset-0 bg-sage-400/30 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Thank You!
            </h3>
            <p className="text-lg text-gray-600 mb-2">
              Your review has been submitted
            </p>
            <p className="text-sage-700 font-semibold text-xl">
              +50 points earned!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostEventModal
