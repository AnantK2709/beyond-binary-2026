import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EventContext } from '../../../context/EventContext';

export default function RecommendedEvents({ user }) {
  const { events } = useContext(EventContext);
  const navigate = useNavigate();
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // Enhanced recommendation algorithm based on user interests
    const getRecommendations = () => {
      const userInterests = user?.interests || [];

      let filteredEvents = events.filter(event => {
        // Only show future events
        const eventDate = new Date(event.date);
        return eventDate >= new Date();
      });

      // Apply keyword search if provided
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title?.toLowerCase().includes(keyword) ||
          event.description?.toLowerCase().includes(keyword) ||
          event.category?.toLowerCase().includes(keyword) ||
          event.tags?.some(tag => tag.toLowerCase().includes(keyword))
        );
      }

      // Score and sort events by relevance
      const scored = filteredEvents.map((event) => {
        let score = 0;

        // Match with user interests (category and tags)
        userInterests.forEach(interest => {
          const interestLower = interest.toLowerCase();

          // Category match
          if (event.category?.toLowerCase().includes(interestLower)) {
            score += 20;
          }

          // Tags match
          event.tags?.forEach(tag => {
            if (tag.toLowerCase().includes(interestLower)) {
              score += 15;
            }
          });

          // Title/description match
          if (event.title?.toLowerCase().includes(interestLower)) {
            score += 10;
          }
          if (event.description?.toLowerCase().includes(interestLower)) {
            score += 5;
          }
        });

        // Boost verified events
        if (event.organizer?.verified) {
          score += 5;
        }

        // Boost events with availability
        if (event.participants < event.maxParticipants) {
          score += 5;
        }

        return { ...event, matchScore: score };
      });

      return scored
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 4); // Limit to 4 events
    };

    setRecommendedEvents(getRecommendations());
  }, [user, events, searchKeyword]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      wellness: '🧘‍♀️',
      outdoors: '🏞️',
      arts: '🎨',
      social: '👥',
      sports: '⚽',
      workshops: '🛠️'
    };
    return icons[category] || '🎯';
  };

  return (
    <div className="animate-fade-in">
      {/* Header with search */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sage-600 to-ocean-600 bg-clip-text text-transparent">
              ✨ Recommended for You
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Personalized picks based on your interests
            </p>
          </div>
          <Link
            to="/events"
            className="text-sage-700 font-semibold hover:text-sage-800 transition-colors flex items-center gap-1 text-sm"
          >
            <span>See All</span>
            <span>→</span>
          </Link>
        </div>

        {/* Keyword Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by interest keyword (e.g., yoga, hiking, art)..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-2xl border border-sage-300/40 focus:outline-none focus:ring-2 focus:ring-sage-500/50 bg-white/80 backdrop-blur-sm transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {recommendedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="card card-hover p-0 overflow-hidden h-full transition-all duration-300 group-hover:shadow-2xl">
                {/* Event Image/Icon */}
                <div className="relative h-48 bg-gradient-to-br from-sage-300/40 to-ocean-400/40 overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {getCategoryIcon(event.category)}
                    </div>
                  )}

                  {/* Match Score Badge */}
                  {event.matchScore > 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      {event.matchScore}% Match
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3 badge badge-primary px-3 py-1.5 text-xs capitalize font-semibold shadow-lg">
                    {event.category}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-sage-600 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-base">📅</span>
                      <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-base">📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-base">👥</span>
                      <span>{event.participants}/{event.maxParticipants} attending</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-lg bg-sage-100 text-sage-700 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {event.organizer?.verified && (
                        <span className="text-xs badge badge-success px-2 py-1">
                          ✓ Verified
                        </span>
                      )}
                      <span className="text-xs text-gray-500 font-medium">
                        +{event.pointsReward} pts
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-sage-600 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchKeyword ? 'No events found' : 'No recommendations yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchKeyword
              ? 'Try a different keyword or browse all events'
              : 'Complete your profile to get personalized event recommendations'}
          </p>
          <Link to="/events" className="btn-primary px-6 py-3 inline-block">
            Browse All Events
          </Link>
        </div>
      )}
    </div>
  );
}