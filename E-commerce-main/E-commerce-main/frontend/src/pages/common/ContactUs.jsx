import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <span>123, E-Commerce Street, Tech Park, Mumbai - 400001</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✉️</span>
              <span>support@multivendor.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">⏰</span>
              <span>Mon - Sat, 10 AM - 7 PM</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            <input type="text" name="subject" placeholder="Subject" required value={formData.subject} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            <textarea name="message" rows="4" placeholder="Your Message" required value={formData.message} onChange={handleChange} className="w-full border rounded px-3 py-2"></textarea>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;