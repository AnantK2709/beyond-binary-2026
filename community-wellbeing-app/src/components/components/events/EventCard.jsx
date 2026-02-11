import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Sparkles, ThumbsUp, Calendar, Monitor, MapPin, Users } from 'lucide-react';

export default function EventCard({ circle, index }) {
  const navigate = useNavigate();

  const getMatchBadge = (score) => {
    if (score >= 80) return { label: 'Excellent Match', icon: Flame, color: 'badge-new' };
    if (score >= 60) return { label: 'Good Match', icon: Sparkles, color: 'badge-verified' };
    return { label: 'Worth Checking', icon: ThumbsUp, color: 'badge-primary' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const matchBadge = getMatchBadge(circle.matchScore || 50);
  const MatchIcon = matchBadge.icon;

  return (
    <div
      className="card-hover cursor-pointer animate-slide-up-fade"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/events/${circle.id}`)}
    >
      {/* Match Badge */}
      {circle.matchScore && (
        <div className={`${matchBadge.color} mb-3 inline-flex items-center gap-1`}>
          <MatchIcon size={14} /> {matchBadge.label}
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {circle.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {circle.description}
          </p>
        </div>
        {circle.isVerified && (
          <div className="ml-3">
            <div className="badge-verified text-xs">
              Verified
            </div>
          </div>
        )}
      </div>

      {/* Circle Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} className="text-gray-400" />
          <span className="font-medium">
            {formatDate(circle.scheduledTime)} • {formatTime(circle.scheduledTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {circle.mode === 'virtual' ? <Monitor size={14} className="text-gray-400" /> : <MapPin size={14} className="text-gray-400" />}
          <span>{circle.mode === 'virtual' ? 'Virtual' : circle.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={14} className="text-gray-400" />
          <span>
            {circle.currentParticipants}/{circle.maxParticipants} joined
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {circle.tags.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              background: 'rgba(168, 213, 186, 0.2)',
              color: '#3A6659',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <button
        className="btn-primary w-full"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/events/${circle.id}`);
        }}
      >
        Join Circle
      </button>
    </div>
  );
}
