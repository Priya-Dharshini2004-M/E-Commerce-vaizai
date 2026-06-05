import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const ChatInterface = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('/api/chat');
        setMessages(data);
      } catch (error) {
        console.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // Listen for new messages
    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      sender: user._id,
      senderName: user.name,
      timestamp: new Date(),
    };

    try {
      await axios.post('/api/chat/send', messageData);
      socket.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  if (loading) return <div className="text-center py-20">Loading chat...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Customer Support</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === user._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="text-sm font-semibold">{msg.senderName}</p>
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; // <-- Ensure default export