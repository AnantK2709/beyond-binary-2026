import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import MyEventsPage from './pages/MyEventsPage'
import CommunitiesPage from './pages/CommunitiesPage'
import CommunityDetailPage from './pages/CommunityDetailPage'
import JournalPage from './pages/JournalPage'
import ProfilePage from './pages/ProfilePage'
import MonthlyReportPage from './pages/MonthlyReportPage'
import RecommendationsPage from './pages/RecommendationsPage'
import OrganizationPage from './pages/OrganizationPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/events" element={
        <ProtectedRoute>
          <EventsPage />
        </ProtectedRoute>
      } />

      <Route path="/events/:id" element={
        <ProtectedRoute>
          <EventDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/my-events" element={
        <ProtectedRoute>
          <MyEventsPage />
        </ProtectedRoute>
      } />

      <Route path="/communities" element={
        <ProtectedRoute>
          <CommunitiesPage />
        </ProtectedRoute>
      } />

      <Route path="/communities/:id" element={
        <ProtectedRoute>
          <CommunityDetailPage />
        </ProtectedRoute>
      } />

      <Route path="/journal" element={
        <ProtectedRoute>
          <JournalPage />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/reports/:month" element={
        <ProtectedRoute>
          <MonthlyReportPage />
        </ProtectedRoute>
      } />

      <Route path="/recommendations" element={
        <ProtectedRoute>
          <RecommendationsPage />
        </ProtectedRoute>
      } />

      <Route path="/organizations/:id" element={
        <ProtectedRoute>
          <OrganizationPage />
        </ProtectedRoute>
      } />

      <Route path="/search" element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
