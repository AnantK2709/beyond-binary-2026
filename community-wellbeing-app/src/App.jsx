import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { EventProvider } from './context/EventContext'
import { NotificationProvider } from './context/NotificationContext'
import AppRouter from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <EventProvider>
            <NotificationProvider>
              <AppRouter />
            </NotificationProvider>
          </EventProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
