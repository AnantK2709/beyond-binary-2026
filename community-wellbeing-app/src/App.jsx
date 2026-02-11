import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { EventProvider } from './context/EventContext'
import { ChatProvider } from './context/ChatContext'
import { NotificationProvider } from './context/NotificationContext'
import { GamificationProvider } from './context/GamificationContext'
import GamificationOverlay from './components/components/gamification/GamificationOverlay'
import AppRouter from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
          <UserProvider>
            <EventProvider>
              <ChatProvider>
                <NotificationProvider>
                  <GamificationOverlay />
                  <AppRouter />
                </NotificationProvider>
              </ChatProvider>
            </EventProvider>
          </UserProvider>
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
