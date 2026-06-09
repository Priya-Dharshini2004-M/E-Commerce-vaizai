// frontend/src/pages/customer/ChatPage.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSend, FiMessageCircle, FiUser, FiSearch, FiMoreVertical } from 'react-icons/fi';

const TOKEN = {
  white: '#fff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  indigo: '#4f46e5',
  indigoDark: '#3730a3',
  indigoLight: '#eef2ff',
  emerald: '#10b981',
  rose: '#f43f5e',
};

const ChatPage = () => {
  const { token, user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(data);
      if (data.length > 0) setActiveConversation(data[0]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await axios.get(`/api/chat/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post('/api/chat/send', {
        conversationId: activeConversation.id,
        message: newMessage
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: TOKEN.slate50, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, border: `4px solid ${TOKEN.slate200}`, borderTopColor: TOKEN.indigo, borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: TOKEN.slate900, marginBottom: 8 }}>Customer Support</h1>
        <p style={{ color: TOKEN.slate400, marginBottom: 32 }}>Chat with our support team – we're here to help</p>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, background: TOKEN.white, borderRadius: 24, border: `1px solid ${TOKEN.slate100}`, overflow: 'hidden', minHeight: '65vh' }}>
          {/* Conversations Sidebar */}
          <div style={{ borderRight: `1px solid ${TOKEN.slate100}`, background: TOKEN.slate50, overflowY: 'auto' }}>
            <div style={{ padding: 20, borderBottom: `1px solid ${TOKEN.slate100}` }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: TOKEN.slate400 }} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 40, border: `1px solid ${TOKEN.slate200}`, background: TOKEN.white, fontSize: 13 }}
                />
              </div>
            </div>
            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: TOKEN.slate400 }}>
                <FiMessageCircle size={32} style={{ marginBottom: 12 }} />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    background: activeConversation?.id === conv.id ? TOKEN.indigoLight : 'transparent',
                    borderBottom: `1px solid ${TOKEN.slate100}`,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => { if (activeConversation?.id !== conv.id) e.currentTarget.style.background = TOKEN.slate100; }}
                  onMouseLeave={e => { if (activeConversation?.id !== conv.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: conv.supportAgent ? TOKEN.indigoLight : TOKEN.slate200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiUser size={18} color={conv.supportAgent ? TOKEN.indigo : TOKEN.slate600} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{conv.supportAgent || 'Support Team'}</div>
                      <div style={{ fontSize: 12, color: TOKEN.slate500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage || 'No messages yet'}</div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span style={{ background: TOKEN.rose, color: TOKEN.white, fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 20 }}>{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '65vh' }}>
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div style={{ padding: '16px 24px', borderBottom: `1px solid ${TOKEN.slate100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{activeConversation.supportAgent || 'Support Team'}</div>
                    <div style={{ fontSize: 12, color: TOKEN.slate500 }}>Online • Typically replies in minutes</div>
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <FiMoreVertical size={20} color={TOKEN.slate500} />
                  </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 40, color: TOKEN.slate400 }}>Start a conversation – we're here to help</div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '70%',
                            background: isMe ? TOKEN.indigo : TOKEN.slate100,
                            color: isMe ? TOKEN.white : TOKEN.slate800,
                            padding: '12px 16px',
                            borderRadius: 20,
                            borderBottomRightRadius: isMe ? 4 : 20,
                            borderBottomLeftRadius: isMe ? 20 : 4,
                            fontSize: 13,
                            lineHeight: 1.5,
                          }}>
                            {msg.text}
                            <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} style={{ padding: '16px 24px', borderTop: `1px solid ${TOKEN.slate100}`, display: 'flex', gap: 12 }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 40, border: `1px solid ${TOKEN.slate200}`, fontSize: 13, outline: 'none' }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    style={{
                      background: TOKEN.indigo,
                      color: TOKEN.white,
                      border: 'none',
                      borderRadius: 40,
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoDark}
                    onMouseLeave={e => e.currentTarget.style.background = TOKEN.indigo}
                  >
                    <FiSend size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: TOKEN.slate400 }}>
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ChatPage;