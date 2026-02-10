import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useRef } from 'react'

function LandingPage() {
  const navigate = useNavigate()
  const { user, signin } = useAuth()
  const scrollContainerRef = useRef(null)

  if (user) {
    navigate('/dashboard')
    return null
  }

  const handleSignIn = async () => {
    // Quick sign-in with any email/password for testing
    await signin('test@example.com', 'password')
  }

  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY
      const parallaxElements = document.querySelectorAll('.parallax')
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.5
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: '🎯',
      title: 'Discover Events',
      description: 'Find wellness events, workshops, and activities that match your interests',
      color: 'from-sage-400/20 to-sage-600/20',
      delay: '0s'
    },
    {
      icon: '👥',
      title: 'Build Connections',
      description: 'Join communities of like-minded individuals on similar wellness journeys',
      color: 'from-ocean-400/20 to-ocean-600/20',
      delay: '0.2s'
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'Monitor your wellbeing journey with insights, achievements, and monthly reports',
      color: 'from-calm-400/20 to-calm-600/20',
      delay: '0.4s'
    },
    {
      icon: '🌟',
      title: 'Earn Rewards',
      description: 'Get recognized for your participation and growth in the community',
      color: 'from-sage-500/20 to-ocean-500/20',
      delay: '0.6s'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Floating Elements */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax absolute top-20 left-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-sage-300/30 to-sage-500/30 blur-2xl animate-float"></div>
          <div className="parallax absolute top-40 right-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-ocean-300/30 to-ocean-500/30 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="parallax absolute bottom-32 left-[20%] w-36 h-36 rounded-full bg-gradient-to-br from-calm-300/30 to-calm-500/30 blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Animated Icon Cluster */}
          <div className="mb-12 relative h-32 flex items-center justify-center">
            <span className="absolute text-7xl animate-float inline-block" style={{ animationDelay: '0s' }}>🌿</span>
            <span className="absolute text-5xl animate-float inline-block opacity-60" style={{ left: '-60px', top: '20px', animationDelay: '0.5s' }}>✨</span>
            <span className="absolute text-5xl animate-float inline-block opacity-60" style={{ right: '-60px', top: '20px', animationDelay: '1s' }}>💚</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-scale-in">
            <span className="text-gradient block">Community</span>
            <span className="text-gradient block mt-2">Wellbeing</span>
          </h1>

          <p className="text-2xl md:text-3xl mb-16 animate-slide-up-fade font-light" style={{ animationDelay: '0.2s', color: 'rgba(60, 102, 89, 0.8)' }}>
            Connect, grow, and thrive through
            <br />
            <span className="text-gradient font-semibold">meaningful community experiences</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-fade items-center" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => navigate('/onboarding')}
              className="btn-primary text-xl px-12 py-5 group"
            >
              <span className="flex items-center gap-3">
                Get Started
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
            <button
              onClick={handleSignIn}
              className="btn-secondary text-xl px-12 py-5"
            >
              Sign In
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2 opacity-50">
              <span className="text-sm text-gray-600">Discover more</span>
              <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Features Section */}
      <div className="py-24 px-4 relative">
        <div className="text-center mb-16 animate-slide-up-fade">
          <h2 className="text-5xl font-bold mb-4 text-gradient">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600">Scroll to explore features →</p>
        </div>

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-8 px-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[350px] md:w-[420px] snap-center group"
              style={{ animationDelay: feature.delay }}
            >
              {/* Unique Feature Display - Not a Card! */}
              <div className="relative h-[500px] perspective-1000">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Main Content Container */}
                <div className="relative h-full p-12 rounded-[3rem] overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {/* Animated Top Border */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>

                  {/* Icon with animated ring */}
                  <div className="relative mb-8 flex justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-full blur-2xl animate-glow-pulse`}></div>
                      <div className="relative text-8xl animate-float transform transition-transform duration-500 group-hover:scale-110">
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  {/* Title with gradient */}
                  <h3 className="text-3xl font-bold mb-6 text-gray-900 transform transition-all duration-500 group-hover:scale-105">
                    {feature.title}
                  </h3>

                  {/* Description with fade-in effect */}
                  <p className="text-lg leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: 'rgba(60, 102, 89, 0.9)' }}
                  >
                    {feature.description}
                  </p>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-8 right-8 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${feature.color} animate-spin-slow`}></div>
                  </div>

                  {/* Interactive particles */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float"></div>
                    <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Hint */}
        <div className="flex justify-center gap-3 mt-12">
          {features.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: 'rgba(95, 156, 141, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="py-32 px-4 text-center relative">
        <div className="max-w-4xl mx-auto animate-slide-up-fade">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="text-gradient">Ready to Begin?</span>
          </h2>
          <p className="text-2xl mb-12 text-gray-600">
            Join thousands thriving in their wellness journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="btn-primary text-xl px-16 py-6 animate-glow-pulse"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => navigate('/communities/c001')}
              className="btn-secondary text-xl px-16 py-6"
            >
              🚀 Go to Chat (Test)
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

export default LandingPage
