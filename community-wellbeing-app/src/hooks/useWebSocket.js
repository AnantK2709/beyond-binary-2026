import { useEffect, useState, useRef } from 'react'

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const ws = useRef(null)

  useEffect(() => {
    // Mock WebSocket for now
    setIsConnected(true)

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const sendMessage = (message) => {
    // Mock send
    console.log('Sending message:', message)
    setMessages(prev => [...prev, message])
  }

  return {
    isConnected,
    messages,
    sendMessage
  }
}
