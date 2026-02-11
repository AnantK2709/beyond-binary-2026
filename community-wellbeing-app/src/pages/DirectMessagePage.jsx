import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/components/common/Navbar';
import { messageService } from '../services/messageService';
import { searchService } from '../services/searchService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export default function DirectMessagePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load other user's profile
        const user = await searchService.getUserById(userId);
        if (!user) {
          showToast('User not found', 'error');
          navigate('/dashboard');
          return;
        }
        setOtherUser(user);

        // Load messages
        if (currentUser?.id) {
          const data = await messageService.getMessages(currentUser.id, userId);
          setMessages(data.messages || []);
          
          // Mark as read
          await messageService.markAsRead(currentUser.id, userId);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        showToast('Failed to load messages', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (userId && currentUser?.id) {
      loadData();
    }
  }, [userId, currentUser, navigate, showToast]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    if (!currentUser?.id || !userId) return;

    const interval = setInterval(async () => {
      const data = await messageService.getMessages(currentUser.id, userId);
      setMessages(data.messages || []);
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [currentUser, userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || sending || !currentUser?.id) return;

    setSending(true);
    try {
      const newMessage = await messageService.sendMessage(
        currentUser.id,
        userId,
        messageText.trim()
      );
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Loading conversation...</div>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-sage-200 p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center text-white font-bold text-lg">
              {otherUser.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{otherUser.name}</h2>
              <p className="text-sm text-gray-500">Direct Message</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/users/${userId}`)}
            className="px-4 py-2 text-sage-600 hover:text-sage-700 transition-colors text-sm font-medium"
          >
            View Profile
          </button>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-xl shadow-lg border border-sage-200 mb-6" style={{ height: '600px' }}>
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="mb-2"><MessageCircle size={24} strokeWidth={1.5} className="mx-auto" /></p>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.fromUserId === currentUser?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="text-xs text-gray-600 mb-1 px-2">
                          {otherUser.name}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-sage-500 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            isOwnMessage ? 'text-sage-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="bg-white rounded-xl shadow-lg border border-sage-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
            <button
              type="submit"
              disabled={!messageText.trim() || sending}
              className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
