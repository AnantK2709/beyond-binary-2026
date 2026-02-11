import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Leaf, Target, MessageCircle } from 'lucide-react';

function CommunityCard({ community, isJoined = false, onChatClick, onJoinClick }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/communities/${community.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-sage-200">
      {/* Community Image/Icon */}
      <div
        className="h-48 bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center cursor-pointer"
        onClick={handleViewDetails}
      >
        {community.imageUrl ? (
          <img
            src={community.imageUrl}
            alt={community.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="flex items-center justify-center" style={{ display: community.imageUrl ? 'none' : 'flex' }}>
          {isJoined ? <Users size={48} className="text-white/80" /> : <Leaf size={48} className="text-white/80" />}
        </div>
      </div>

      {/* Community Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{community.name}</h3>
          {community.verified && (
            <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-semibold flex-shrink-0 ml-2">
              Verified
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Users size={14} className="text-gray-400" /> {community.members || 0} members
          </span>
          {community.interests && community.interests.length > 0 && (
            <span className="flex items-center gap-1">
              <Target size={14} className="text-gray-400" /> {community.interests.slice(0, 2).join(', ')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isJoined ? (
            <>
              <button
                onClick={onChatClick}
                className="flex-1 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Chat</span>
              </button>
              <button
                onClick={handleViewDetails}
                className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors font-medium"
              >
                View
              </button>
            </>
          ) : (
            <button
              onClick={onJoinClick}
              className="w-full px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors font-medium"
            >
              Join Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityCard;
