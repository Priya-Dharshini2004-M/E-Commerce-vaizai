import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/orders/create', { address });

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.razorpayOrder.amount,
        currency: 'INR',
        name: 'Multi-Vendor Platform',
        description: `Order ${data.order._id}`,
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          const verifyData = await axios.post('/api/orders/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (verifyData.data.message === 'Payment verified') {
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/orders');
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: '#3b82f6' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                value={address.fullName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={address.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="addressLine"
                placeholder="Address Line"
                required
                value={address.addressLine}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={address.city}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                required
                value={address.state}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                required
                value={address.pincode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.items?.map((item) => (
            <div key={item.productId._id} className="flex justify-between mb-2">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{cart.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;