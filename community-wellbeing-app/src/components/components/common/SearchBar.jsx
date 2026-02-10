import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../../services/searchService';
import { useDebounce } from '../../../hooks/useDebounce';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchService.searchUsers(debouncedQuery);
        setResults(data.users || []);
        setIsOpen(data.users && data.users.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`, { state: { fromSearch: true } });
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search people by name..."
          className="w-full px-4 py-2 pl-10 pr-4 bg-white/80 backdrop-blur-sm border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-sm"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
        {loading && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-sage-500 border-t-transparent rounded-full animate-spin"></div>
          </span>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-sage-200 z-50 max-h-96 overflow-y-auto"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2">
              People ({results.length})
            </div>
            {results.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sage-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.bio || `${user.interests?.slice(0, 2).join(', ') || 'Member'}`}
                  </div>
                </div>
                <div className="text-xs text-sage-600 font-medium">
                  Level {user.level || 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && !loading && debouncedQuery.trim().length >= 2 && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-sage-200 z-50 p-4 text-center"
        >
          <p className="text-gray-500 text-sm">No people found matching "{debouncedQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
