import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_USERS } from '../utils/mockData';
import { apiClient } from '../services/api';

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
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Sync user to backend on load (in case they're not there yet)
        if (parsedUser.id) {
          // Get full user data including password from MOCK_USERS if available
          const mockUser = MOCK_USERS.find(u => u.id === parsedUser.id);
          const userToSync = mockUser || parsedUser;
          
          apiClient.post('/users', userToSync).catch(error => {
            console.error('Error syncing user to backend on load:', error);
          });
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    } else {
      // Auto-login for testing (bypass auth) - Remove in production
      const mockUser = MOCK_USERS[0]; // Use first mock user
      if (mockUser) {
        const { password: _, ...userWithoutPassword } = mockUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        // Sync to backend
        apiClient.post('/users', mockUser).catch(error => {
          console.error('Error syncing mock user to backend:', error);
        });
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    // Find user in MOCK_USERS
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      try {
        // Sync user to backend (create or update)
        await apiClient.post('/users', foundUser);
        console.log(`✅ User ${foundUser.id} synced to backend`);
      } catch (error) {
        console.error('Error syncing user to backend:', error);
        // Continue anyway - user can still use the app
      }
      
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signUp = async (userData) => {
    // Create new user with proper structure
    const newUser = {
      id: `u${String(MOCK_USERS.length + 1).padStart(3, '0')}`, // e.g., u004
      email: userData.email,
      name: userData.name,
      password: userData.password || 'password123', // Include password for backend
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

    try {
      // Save user to backend
      const response = await apiClient.post('/users', newUser);
      const savedUser = response.data;
      
      // Remove password before storing in localStorage
      const { password: _, ...userWithoutPassword } = savedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      console.log(`✅ User ${newUser.id} saved to backend`);
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Error saving user to backend:', error);
      // Still save locally even if backend fails
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword, warning: 'User saved locally but not synced to backend' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = async (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    try {
      // Sync updates to backend
      await apiClient.post('/users', updatedUser);
      console.log(`✅ User ${user.id} updated in backend`);
    } catch (error) {
      console.error('Error updating user in backend:', error);
      // Continue anyway - updates are saved locally
    }
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