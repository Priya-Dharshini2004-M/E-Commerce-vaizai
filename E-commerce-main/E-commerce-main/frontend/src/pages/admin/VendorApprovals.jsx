import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VendorApprovals = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data } = await axios.get('/api/admin/vendors');
      setVendors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (id) => {
    try {
      await axios.put(`/api/admin/vendors/${id}/approve`);
      toast.success('Vendor approved');
      fetchVendors();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Approvals</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Email</th><th className="px-4 py-2">Store Name</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Action</th></tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor._id} className="border-t">
                <td className="px-4 py-2">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.email}</td>
                <td className="px-4 py-2">{vendor.vendorInfo?.storeName || '-'}</td>
                <td className="px-4 py-2">{vendor.vendorInfo?.isApproved ? 'Approved' : 'Pending'}</td>
                <td className="px-4 py-2">
                  {!vendor.vendorInfo?.isApproved && (
                    <button onClick={() => approveVendor(vendor._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorApprovals;