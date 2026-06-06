import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('/api/vendor/reviews');
        setReviews(data);
      } catch (error) { toast.error('Failed to load reviews'); } finally { setLoading(false); }
    };
    fetchReviews();
  }, []);

  if (loading) return <div className="text-center py-20">Loading reviews...</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
      {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(r => (
        <div key={r._id} className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between"><span className="font-semibold">{r.customerName}</span><span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span></div>
          <p className="text-gray-600 mt-2">{r.comment}</p>
          <p className="text-sm text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};
export default Reviews;