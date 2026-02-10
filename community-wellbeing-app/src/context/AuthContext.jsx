import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_USERS } from '../utils/mockData';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = (email, password) => {
    // Find user in MOCK_USERS
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signUp = (userData) => {
    // Create new user with proper structure
    const newUser = {
      id: `u${String(MOCK_USERS.length + 1).padStart(3, '0')}`, // e.g., u004
      email: userData.email,
      name: userData.name,
      age: userData.age,
      ageRange: userData.ageRange,
      location: userData.location || 'Singapore',
      pronouns: userData.pronouns || 'they/them',
      personalityType: userData.personalityType || 'ambivert',
      bio: userData.bio || '',
      interests: userData.interests || [],
      activityPreferences: userData.activityPreferences || {},
      interactionPreferences: userData.interactionPreferences || {},
      preferredModes: userData.preferredModes || [],
      timePreferences: userData.timePreferences || {},
      goals: userData.goals || [],
      currentStreak: 0,
      totalPoints: 0,
      level: 1,
      joinedCircles: [],
      attendedEvents: [],
      moodHistory: userData.initialMood ? [
        {
          date: new Date().toISOString().split('T')[0],
          score: userData.initialMood.score,
          state: userData.initialMood.state,
        }
      ] : [],
      created_at: new Date().toISOString(),
    };

    // Remove password before storing
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Also export AuthContext for compatibility
export { AuthContext };