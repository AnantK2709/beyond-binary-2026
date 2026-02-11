import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Home, Calendar, TrendingUp, Users, BookOpen, User, Sparkles, LogOut, Flower2 } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/momentum', label: 'Momentum', icon: TrendingUp },
    { path: '/communities', label: 'Communities', icon: Users },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-md">
                <Flower2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:inline font-heading">
                MindfulCircles
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md relative z-50">
              <SearchBar onExpandChange={setSearchExpanded} />
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center flex-shrink-0 transition-all duration-300 ${searchExpanded ? 'gap-2' : 'gap-6'}`}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.label}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${
                      location.pathname === item.path
                        ? 'text-sage-700 bg-sage-500/10 shadow-sm'
                        : 'text-gray-600 hover:text-sage-700 hover:bg-sage-500/5'
                    }`}
                  >
                    <IconComponent size={18} strokeWidth={2.5} />
                    {!searchExpanded && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(168, 213, 186, 0.15)',
                  backdropFilter: 'blur(10px)',
                  width: '200px'
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    Level {user?.level || 1}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl py-2 z-50 animate-slide-up-fade"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(168, 213, 186, 0.3)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                      width: '224px',
                    }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:bg-sage-500/10 transition-colors rounded-xl mx-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} strokeWidth={2.5} />
                      Profile
                    </Link>
                    {/* <Link
                      to="/recommendations"
                      className="flex items-center gap-2 px-4 py-2 text-gray-900 hover:bg-sage-500/10 transition-colors rounded-xl mx-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Sparkles size={16} strokeWidth={2.5} />
                      Recommendations
                    </Link> */}
                    <div className="border-t border-gray-200/50 my-2 mx-2" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-2"
                    >
                      <LogOut size={16} strokeWidth={2.5} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(168, 213, 186, 0.3)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? 'text-sage-700'
                    : 'text-gray-500'
                }`}
              >
                <IconComponent size={20} strokeWidth={2.5} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
