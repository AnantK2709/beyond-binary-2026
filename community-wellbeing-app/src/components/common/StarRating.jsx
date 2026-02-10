// Interactive 5-Star Rating Component with hover effects
import { useState } from 'react'

/**
 * StarRating component with glassmorphic design and smooth animations
 * @param {number} value - Current rating value (0-5)
 * @param {function} onChange - Callback when rating changes
 * @param {boolean} readonly - If true, rating cannot be changed
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} showLabel - Show rating label (default: false)
 */
function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showLabel = false
}) {
  const [hoverValue, setHoverValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (rating) => {
    if (readonly || !onChange) return

    setIsAnimating(true)
    onChange(rating)

    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const handleMouseEnter = (rating) => {
    if (readonly) return
    setHoverValue(rating)
  }

  const handleMouseLeave = () => {
    if (readonly) return
    setHoverValue(0)
  }

  const displayValue = hoverValue || value

  // Size configurations
  const sizeConfig = {
    sm: {
      star: 'w-6 h-6',
      gap: 'gap-1',
      text: 'text-sm'
    },
    md: {
      star: 'w-8 h-8',
      gap: 'gap-2',
      text: 'text-base'
    },
    lg: {
      star: 'w-10 h-10',
      gap: 'gap-3',
      text: 'text-lg'
    }
  }

  const config = sizeConfig[size] || sizeConfig.md

  // Rating labels
  const labels = {
    0: 'Not rated',
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* Stars */}
      <div
        className={`flex items-center ${config.gap}`}
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            disabled={readonly}
            className={`
              relative transition-all duration-200
              ${readonly ? 'cursor-default' : 'cursor-pointer'}
              ${!readonly && 'hover:scale-110 active:scale-95'}
              ${isAnimating && rating === value ? 'animate-bounce-gentle' : ''}
              focus:outline-none focus:ring-2 focus:ring-sage-400/50 rounded-full
            `}
            aria-label={`Rate ${rating} stars`}
          >
            <Star
              filled={rating <= displayValue}
              size={config.star}
              isHovering={hoverValue > 0 && rating <= hoverValue}
              readonly={readonly}
            />
          </button>
        ))}
      </div>

      {/* Label */}
      {showLabel && (
        <div
          className={`
            ${config.text} font-medium
            transition-all duration-200
            ${displayValue > 0 ? 'text-sage-700' : 'text-gray-500'}
          `}
        >
          {labels[displayValue]}
        </div>
      )}
    </div>
  )
}

/**
 * Individual star component with gradient fill
 */
function Star({ filled, size, isHovering, readonly }) {
  return (
    <svg
      className={`
        ${size}
        transition-all duration-200
        ${filled ? 'scale-100' : 'scale-90'}
      `}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="star-gradient-filled" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="star-gradient-hover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Star shape */}
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? (isHovering ? 'url(#star-gradient-hover)' : 'url(#star-gradient-filled)') : 'none'}
        stroke={filled ? (isHovering ? '#FCD34D' : '#F59E0B') : '#D1D5DB'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={filled && isHovering && !readonly ? 'url(#glow)' : 'none'}
        className="transition-all duration-200"
      />

      {/* Shine effect for filled stars */}
      {filled && (
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77V2Z"
          fill="url(#star-gradient-hover)"
          opacity="0.3"
          className={`
            transition-opacity duration-200
            ${isHovering ? 'opacity-60' : 'opacity-30'}
          `}
        />
      )}
    </svg>
  )
}

/**
 * ReadonlyStarRating - Display-only star rating
 * @param {number} value - Rating value (0-5)
 * @param {string} size - Size variant
 * @param {boolean} showLabel - Show rating text
 * @param {boolean} showCount - Show rating count
 * @param {number} count - Number of ratings
 */
export function ReadonlyStarRating({
  value = 0,
  size = 'sm',
  showLabel = false,
  showCount = false,
  count = 0
}) {
  const sizeConfig = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="inline-flex items-center gap-2">
      <StarRating value={value} readonly={true} size={size} showLabel={false} />

      {(showLabel || showCount) && (
        <div className={`${sizeConfig[size]} text-gray-600 font-medium`}>
          {showLabel && <span>{value.toFixed(1)}</span>}
          {showLabel && showCount && <span className="text-gray-400 mx-1">•</span>}
          {showCount && <span className="text-gray-500">({count})</span>}
        </div>
      )}
    </div>
  )
}

/**
 * CompactStarRating - Compact inline rating display
 * @param {number} value - Rating value (0-5)
 */
export function CompactStarRating({ value = 0 }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="#F59E0B"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
      </svg>
      <span className="text-sm font-semibold text-gray-700">
        {value.toFixed(1)}
      </span>
    </div>
  )
}

/**
 * StarRatingInput - Form-friendly rating input with label
 * @param {string} label - Input label
 * @param {number} value - Current value
 * @param {function} onChange - Change handler
 * @param {boolean} required - Required field
 * @param {string} error - Error message
 */
export function StarRatingInput({
  label,
  value,
  onChange,
  required = false,
  error
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-4">
        <StarRating
          value={value}
          onChange={onChange}
          size="md"
          showLabel={true}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default StarRating
