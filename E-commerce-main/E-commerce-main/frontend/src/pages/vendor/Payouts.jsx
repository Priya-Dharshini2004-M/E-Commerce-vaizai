import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const { data } = await axios.get('/api/vendor/payouts');
      setPayouts(data);
      const total = data.reduce((sum, p) => sum + p.amount, 0);
      setTotalEarnings(total);
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading payouts...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Payouts & Earnings</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
        <p className="text-gray-600">Total Earnings</p>
        <p className="text-4xl font-bold text-blue-600">₹{totalEarnings.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-2">Next payout: Monthly on 7th</p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p._id} className="border-t">
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">{p.orderId}</td>
                <td className="px-4 py-2">₹{p.amount}</td>
                <td className="px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan="4" className="text-center py-4">No payouts yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;