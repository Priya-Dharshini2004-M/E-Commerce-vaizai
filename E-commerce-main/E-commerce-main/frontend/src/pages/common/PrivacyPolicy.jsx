import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      <div className="bg-white rounded-lg shadow p-8 space-y-4 text-gray-700">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>Your privacy is important to us. This policy explains how MultiVendor collects, uses, and protects your personal information.</p>
        <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as name, email, phone number, address, and payment details when you register, place an order, or contact support.</p>
        <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you, improve our services, and prevent fraud.</p>
        <h2 className="text-xl font-semibold mt-4">3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data. Payments are processed through encrypted gateways (Razorpay/Stripe).</p>
        <h2 className="text-xl font-semibold mt-4">4. Sharing Your Information</h2>
        <p>We do not sell your personal information. We may share data with vendors only to fulfill orders.</p>
        <h2 className="text-xl font-semibold mt-4">5. Your Rights</h2>
        <p>You can access, update, or delete your account information anytime from your profile page.</p>
        <h2 className="text-xl font-semibold mt-4">6. Contact Us</h2>
        <p>For privacy concerns, email privacy@multivendor.com</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;