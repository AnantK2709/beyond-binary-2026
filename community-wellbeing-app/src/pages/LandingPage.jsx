import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import { Mic, ShieldCheck, Bot, MessageCircle, Gamepad2, BarChart3 } from 'lucide-react';

const iconMap = { Mic, ShieldCheck, Bot, MessageCircle, Gamepad2, BarChart3 };

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollContainerRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.5;
        el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: 'Mic',
      title: 'Voice Journaling',
      description: 'Express yourself naturally. Our AI analyzes your reflections and suggests personalized events.',
      color: 'from-sage-400/20 to-sage-600/20',
      delay: '0s',
      isNew: true,
    },
    {
      icon: 'ShieldCheck',
      title: 'Verified Events',
      description: 'Join activities organized by trusted partners. Every event is vetted for safety and quality.',
      color: 'from-ocean-400/20 to-ocean-600/20',
      delay: '0.2s',
      isNew: false,
    },
    {
      icon: 'Bot',
      title: 'AI Recommendations',
      description: 'Get personalized suggestions based on your interests, mood, and behavior patterns.',
      color: 'from-calm-400/20 to-calm-600/20',
      delay: '0.4s',
      isNew: true,
    },
    {
      icon: 'MessageCircle',
      title: 'Real-Time Chat',
      description: 'Connect instantly with community members. Organize events and build relationships.',
      color: 'from-sage-500/20 to-ocean-500/20',
      delay: '0.6s',
      isNew: true,
    },
    {
      icon: 'Gamepad2',
      title: 'Gamified Journey',
      description: 'Earn points, unlock badges, and level up as you attend events and build connections.',
      color: 'from-ocean-500/20 to-calm-500/20',
      delay: '0.8s',
      isNew: false,
    },
    {
      icon: 'BarChart3',
      title: 'Monthly Reports',
      description: 'Track your emotional journey and social growth with personalized insights.',
      color: 'from-calm-500/20 to-sage-500/20',
      delay: '1s',
      isNew: true,
    },
  ];

  const stats = [
    { value: '35%', label: 'Average Mood Improvement' },
    { value: '88%', label: 'Recommendation Accuracy' },
    { value: '4.8/5', label: 'User Trust Score' },
    { value: '78%', label: 'Circle Retention Rate' },
  ];

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
          {/* Animated Geometric Cluster */}
          <div className="mb-12 relative h-32 flex items-center justify-center">
            <svg className="absolute animate-float" style={{ animationDelay: '0s' }} width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#A8D5BA" strokeWidth="3" opacity="0.8" />
              <circle cx="40" cy="40" r="20" fill="#A8D5BA" opacity="0.3" />
            </svg>
            <svg className="absolute animate-float opacity-60" style={{ left: '-60px', top: '20px', animationDelay: '0.5s' }} width="56" height="56" viewBox="0 0 56 56">
              <polygon points="28,4 52,48 4,48" fill="none" stroke="#5F9C8D" strokeWidth="2.5" opacity="0.7" />
            </svg>
            <svg className="absolute animate-float opacity-60" style={{ right: '-60px', top: '20px', animationDelay: '1s' }} width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="#89CFF0" opacity="0.25" />
              <circle cx="28" cy="28" r="14" fill="none" stroke="#89CFF0" strokeWidth="2" opacity="0.6" />
            </svg>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-scale-in">
            <span className="text-gradient block">Your Journey to</span>
            <span className="text-gradient block mt-2">Meaningful Connections</span>
          </h1>

          <p className="text-2xl md:text-3xl mb-16 animate-slide-up-fade font-light" style={{ animationDelay: '0.2s', color: 'rgba(60, 102, 89, 0.8)' }}>
            Reduce isolation and foster well-being through
            <br />
            <span className="text-gradient font-semibold">mood-adaptive matching and personalized circles</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-fade items-center" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-xl px-12 py-5 group"
            >
              <span className="flex items-center gap-3">
                Get Started Free
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="btn-secondary text-xl px-12 py-5"
            >
              Sign In (Demo)
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
              {/* Unique Feature Display */}
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

                  {/* NEW Badge */}
                  {feature.isNew && (
                    <div className="absolute top-6 right-6">
                      <span className="badge-new text-xs px-3 py-1">NEW</span>
                    </div>
                  )}

                  {/* Icon with animated ring */}
                  <div className="relative mb-8 flex justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-full blur-2xl animate-glow-pulse`}></div>
                      <div className="relative w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center animate-float transform transition-transform duration-500 group-hover:scale-110">
                        {(() => {
                          const FeatureIcon = iconMap[feature.icon];
                          return FeatureIcon ? <FeatureIcon size={48} strokeWidth={2} className="text-sage-600" /> : null;
                        })()}
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

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="card p-12">
            <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="text-5xl font-extrabold text-gradient mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-lg">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <div className="py-32 px-4 text-center relative">
        <div className="max-w-4xl mx-auto animate-slide-up-fade">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            <span className="text-gradient">Ready to Begin Your Journey?</span>
          </h2>
          <p className="text-2xl mb-12 text-gray-600">
            Join thousands finding meaningful connections through MindfulCircles
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary text-xl px-16 py-6 animate-glow-pulse"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center relative">
        <div className="card py-6">
          <p className="text-gray-600">
            &copy; 2026 MindfulCircles. Building support networks, one circle at a time.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
