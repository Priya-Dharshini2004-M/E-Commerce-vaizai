import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">About MultiVendor</h1>
      <div className="bg-white rounded-lg shadow p-8 space-y-6">
        <p className="text-gray-700 leading-relaxed">
          MultiVendor is India's fastest growing online marketplace, connecting millions of customers with thousands of trusted vendors across the country. Founded in 2024, our mission is to provide a seamless, secure, and enjoyable shopping experience for everyone.
        </p>
        <h2 className="text-2xl font-semibold">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed">
          To empower small and medium businesses by giving them a world-class platform to reach customers nationwide, while offering shoppers unparalleled choice, convenience, and value.
        </p>
        <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Wide range of products across 7+ categories</li>
          <li>Secure payments with Razorpay & Stripe</li>
          <li>Fast delivery & easy returns</li>
          <li>Dedicated customer support</li>
          <li>100% seller verification</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;