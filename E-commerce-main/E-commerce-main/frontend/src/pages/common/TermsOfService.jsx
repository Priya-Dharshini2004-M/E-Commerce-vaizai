import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
      <div className="bg-white rounded-lg shadow p-8 space-y-4 text-gray-700">
        <p>Welcome to MultiVendor. By using our platform, you agree to these terms.</p>
        <h2 className="text-xl font-semibold mt-4">1. Eligibility</h2>
        <p>You must be at least 18 years old to use this platform.</p>
        <h2 className="text-xl font-semibold mt-4">2. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use.</p>
        <h2 className="text-xl font-semibold mt-4">3. Orders and Payments</h2>
        <p>All orders are subject to availability. Prices are as listed, and payments are processed securely. We reserve the right to cancel orders due to pricing errors or fraud suspicion.</p>
        <h2 className="text-xl font-semibold mt-4">4. Returns and Refunds</h2>
        <p>Return policy varies by vendor. Please refer to individual product listings or contact vendor.</p>
        <h2 className="text-xl font-semibold mt-4">5. Vendor Terms</h2>
        <p>Vendors must provide accurate product information and fulfill orders promptly. MultiVendor is not liable for vendor disputes.</p>
        <h2 className="text-xl font-semibold mt-4">6. Prohibited Activities</h2>
        <p>You may not use the platform for illegal activities, fraud, or to distribute malware.</p>
        <h2 className="text-xl font-semibold mt-4">7. Changes to Terms</h2>
        <p>We may update these terms. Continued use constitutes acceptance.</p>
      </div>
    </div>
  );
};

export default TermsOfService;