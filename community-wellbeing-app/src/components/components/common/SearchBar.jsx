import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchService } from '../../../services/searchService';
import { useDebounce } from '../../../hooks/useDebounce';

function SearchBar({ onExpandChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load all users when expanded
  useEffect(() => {
    if (isExpanded && allUsers.length === 0) {
      const loadAllUsers = async () => {
        setLoading(true);
        try {
          const data = await searchService.getAllUsers();
          setAllUsers(data.users || []);
        } catch (error) {
          console.error('Error loading users:', error);
        } finally {
          setLoading(false);
        }
      };
      loadAllUsers();
    }
  }, [isExpanded]);

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
    // Keep expanded state when typing, just update search results
    if (e.target.value.trim().length >= 2) {
      setIsOpen(true);
      // Keep isExpanded true so the search bar stays wide
      setIsExpanded(true);
    } else {
      setIsOpen(false);
      // Keep expanded when focused, show all users
      setIsExpanded(true);
    }
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    if (searchQuery.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`, { state: { fromSearch: true } });
    setSearchQuery('');
    setIsOpen(false);
    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsExpanded(false);
      setSearchQuery('');
    }
  };

  const displayUsers = searchQuery.trim().length >= 2 ? results : allUsers;

  return (
    <div 
      ref={searchRef} 
      className={`relative transition-all duration-300 ${
        isExpanded 
          ? 'absolute left-0 top-0 w-[380px] z-50'
          : 'w-full'
      }`}
    >
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder="Search people by name..."
          className={`w-full px-4 py-2 pl-10 pr-4 bg-white/80 backdrop-blur-sm border border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-sm transition-all duration-300 ${
            isExpanded ? 'shadow-lg' : ''
          }`}
        />
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        {loading && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-sage-500 border-t-transparent rounded-full animate-spin"></div>
          </span>
        )}
      </div>

      {/* Dropdown - Shows when expanded/clicked */}
      {isExpanded && (
        <div
          className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-sage-200 z-50 overflow-y-auto transition-all duration-300 w-[380px]"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            maxHeight: searchQuery.trim().length >= 2 ? '24rem' : '500px'
          }}
        >
          {searchQuery.trim().length >= 2 ? (
            // Search results
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                People ({loading ? '...' : results.length})
              </div>
              {loading ? (
                <div className="p-4 text-center">
                  <div className="w-6 h-6 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : results.length > 0 ? (
                results.map((user) => (
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
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm">No people found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          ) : (
            // All users grid view when no search query
            <div className="p-4">
              <div className="text-sm font-semibold text-gray-700 mb-3 px-2">
                People ({displayUsers.length})
              </div>
              {displayUsers.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {displayUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-sage-50 transition-colors group"
                      title={user.name}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-600 max-w-[60px] truncate">
                        {user.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : loading ? (
                <div className="p-4 text-center">
                  <div className="w-6 h-6 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default SearchBar;
