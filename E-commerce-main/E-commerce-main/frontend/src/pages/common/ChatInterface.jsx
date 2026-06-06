import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatInterface = () => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('/api/chat', { headers: { Authorization: `Bearer ${token}` } });
        setMessages(data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { data } = await axios.post('/api/chat', { message: newMessage }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages([...messages, data]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error) { toast.error('Failed to send'); }
  };

  if (loading) return <div className="text-center py-20">Loading chat...</div>;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Customer Support</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === user?._id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                <p className="text-sm font-semibold">{msg.senderName}</p>
                <p>{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
          <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 border rounded-lg px-4 py-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send</button>
        </form>
      </div>
    </div>
  );
};
export default ChatInterface;