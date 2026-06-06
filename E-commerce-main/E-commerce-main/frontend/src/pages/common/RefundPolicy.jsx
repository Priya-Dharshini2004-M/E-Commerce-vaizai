import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Refund Policy</h1>
      <div className="bg-white rounded-lg shadow p-8 space-y-4 text-gray-700">
        <p>We want you to be completely satisfied with your purchase. If not, here's our refund policy.</p>
        <h2 className="text-xl font-semibold mt-4">1. Returns</h2>
        <p>You can request a return within 7 days of delivery for most products. Items must be unused, in original packaging.</p>
        <h2 className="text-xl font-semibold mt-4">2. Refund Process</h2>
        <p>Once we receive the returned item, we will inspect it and notify you of approval or rejection. Approved refunds will be processed to your original payment method within 5-7 business days.</p>
        <h2 className="text-xl font-semibold mt-4">3. Non-Refundable Items</h2>
        <p>Perishable goods, personal care items, and digital products are non-refundable unless defective.</p>
        <h2 className="text-xl font-semibold mt-4">4. Shipping Costs</h2>
        <p>Return shipping costs are borne by the buyer unless the item was damaged or incorrect.</p>
        <h2 className="text-xl font-semibold mt-4">5. Late or Missing Refunds</h2>
        <p>If you haven’t received a refund after 7 business days, contact your bank or credit card company. Then contact us at refunds@multivendor.com.</p>
      </div>
    </div>
  );
};

export default RefundPolicy;