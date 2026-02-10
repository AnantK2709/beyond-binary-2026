import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import MonthlyReportPage from './pages/MonthlyReportPage';
import RecommendationsPage from './pages/RecommendationsPage';
import OrganizationPage from './pages/OrganizationPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

// Public Route Component (redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-gentle">🌸</div>
          <div className="text-xl font-semibold text-sage-600">Loading...</div>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
}

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      <Route 
        path="/signin" 
        element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        } 
      />
      
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/events" 
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/events/:id" 
        element={
          <ProtectedRoute>
            <EventDetailPage />
          </ProtectedRoute>
        } 
      />

      <Route path="/my-events" element={
        <ProtectedRoute>
          <MyEventsPage />
        </ProtectedRoute>
      } />
      <Route path="/events/:id/post-event" element={
        <ProtectedRoute>
          <PostEventPage />
        </ProtectedRoute>
      } />

      <Route path="/communities" element={
        <ProtectedRoute>
          <CommunitiesPage />
        </ProtectedRoute>
      } />

      <Route 
        path="/communities/:id" 
        element={
          <ProtectedRoute>
            <CommunityDetailPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/journal" 
        element={
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/reports/:month" 
        element={
          <ProtectedRoute>
            <MonthlyReportPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/recommendations" 
        element={
          <ProtectedRoute>
            <RecommendationsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/organizations/:id" 
        element={
          <ProtectedRoute>
            <OrganizationPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } 
      />

      {/* Redirect old routes */}
      <Route path="/circles" element={<Navigate to="/events" />} />
      <Route path="/circles/:id" element={<Navigate to="/events/:id" />} />
      <Route path="/community" element={<Navigate to="/communities" />} />
      <Route path="/analytics" element={<Navigate to="/profile" />} />
      <Route path="/settings" element={<Navigate to="/profile" />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;