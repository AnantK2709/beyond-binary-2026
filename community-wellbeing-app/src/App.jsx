import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { EventProvider } from './context/EventContext'
import { ChatProvider } from './context/ChatContext'
import { NotificationProvider } from './context/NotificationContext'
import AppRouter from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <EventProvider>
            <ChatProvider>
              <NotificationProvider>
                <AppRouter />
              </NotificationProvider>
            </ChatProvider>
          </EventProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
