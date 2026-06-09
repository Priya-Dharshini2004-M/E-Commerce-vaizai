// frontend/src/pages/customer/ProductDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ProductCard from '../../components/customer/ProductCard';
import { FiMinus, FiPlus, FiShoppingBag, FiCreditCard, FiMapPin, FiCheck, FiTruck, FiStar } from 'react-icons/fi';

const TOKEN = {
  white: '#fff', slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0',
  slate400: '#94a3b8', slate600: '#475569', slate800: '#1e293b', slate900: '#0f172a',
  indigo: '#4f46e5', indigoDark: '#3730a3', indigoLight: '#eef2ff', emerald: '#10b981', rose: '#f43f5e'
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [recommended, setRecommended] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '', phone: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: prod } = await axios.get(`/api/products/${id}`);
        setProduct(prod);
        const { data: recs } = await axios.get(`/api/products?category=${prod.category}&limit=8`);
        setRecommended(recs.filter(p => p._id !== prod._id).slice(0, 8));
        if (token) {
          const { data: addrs } = await axios.get('/api/addresses', { headers: { Authorization: `Bearer ${token}` } });
          setAddresses(addrs);
          const defaultAddr = addrs.find(a => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr._id);
          else if (addrs.length) setSelectedAddressId(addrs[0]._id);
        }
      } catch (err) { toast.error('Failed to load product'); } finally { setLoading(false); }
    };
    fetchData();
  }, [id, token]);

  const handleAddToCart = () => addToCart(product._id, quantity);
  const handleBuyNow = async () => {
    if (!selectedAddressId && addresses.length === 0 && !showAddressForm) return toast.error('Please select or add a delivery address');
    if (showAddressForm) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine || !newAddress.city || !newAddress.state || !newAddress.pincode)
        return toast.error('Please fill all address fields');
      try {
        const { data: createdAddr } = await axios.post('/api/addresses', newAddress, { headers: { Authorization: `Bearer ${token}` } });
        setSelectedAddressId(createdAddr._id);
        setAddresses([...addresses, createdAddr]);
        setShowAddressForm(false);
      } catch (err) { return toast.error('Failed to save address'); }
    }
    await addToCart(product._id, quantity);
    navigate('/checkout', { state: { addressId: selectedAddressId } });
  };
  const incrementQty = () => { if (quantity < product.stock) setQuantity(prev => prev + 1); };
  const decrementQty = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

  if (loading) return <div style={{ background: TOKEN.slate50, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div style={{ width: 40, height: 40, border: `4px solid ${TOKEN.slate200}`, borderTopColor: TOKEN.indigo, borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 100 }}>Product not found</div>;

  const discountPercent = product.compareAtPrice > product.price ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: TOKEN.white, borderRadius: 28, border: `1px solid ${TOKEN.slate100}`, padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Image */}
          <div style={{ background: TOKEN.slate50, borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} alt={product.name} style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }} />
          </div>
          {/* Details */}
          <div>
            <span style={{ background: TOKEN.indigoLight, color: TOKEN.indigoDark, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 30, textTransform: 'uppercase' }}>{product.category}</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: TOKEN.slate900, marginTop: 16 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: TOKEN.indigo }}>₹{product.price.toLocaleString()}</span>
              {product.compareAtPrice > product.price && <span style={{ fontSize: 16, color: TOKEN.slate400, textDecoration: 'line-through' }}>₹{product.compareAtPrice.toLocaleString()}</span>}
              {discountPercent > 0 && <span style={{ background: TOKEN.rose, color: TOKEN.white, padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{discountPercent}% OFF</span>}
            </div>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontWeight: 600 }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${TOKEN.slate200}`, borderRadius: 40, background: TOKEN.slate50 }}>
                <button onClick={decrementQty} disabled={quantity <= 1} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}><FiMinus /></button>
                <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                <button onClick={incrementQty} disabled={quantity >= product.stock} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}><FiPlus /></button>
              </div>
              <span style={{ fontSize: 12, color: TOKEN.slate400 }}>{product.stock} in stock</span>
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
              <button onClick={handleAddToCart} style={{ flex: 1, background: TOKEN.indigoLight, color: TOKEN.indigoDark, border: 'none', padding: '14px 0', borderRadius: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = TOKEN.indigo; e.currentTarget.style.color = TOKEN.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = TOKEN.indigoLight; e.currentTarget.style.color = TOKEN.indigoDark; }}>
                <FiShoppingBag /> Add to Cart
              </button>
              <button onClick={handleBuyNow} style={{ flex: 1, background: TOKEN.indigo, color: TOKEN.white, border: 'none', padding: '14px 0', borderRadius: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = TOKEN.indigoDark}
                onMouseLeave={e => e.currentTarget.style.background = TOKEN.indigo}>
                <FiCreditCard /> Buy Now
              </button>
            </div>
            {/* Offers */}
            <div style={{ background: TOKEN.slate50, borderRadius: 16, padding: 16, marginTop: 32 }}>
              <h3 style={{ fontWeight: 800, marginBottom: 12 }}>🎁 Hot Offers</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li style={{ display: 'flex', gap: 8 }}><FiCheck color={TOKEN.emerald} /> 10% instant discount on SBI credit cards</li>
                <li style={{ display: 'flex', gap: 8 }}><FiCheck color={TOKEN.emerald} /> No Cost EMI on orders above ₹5000</li>
                <li style={{ display: 'flex', gap: 8 }}><FiCheck color={TOKEN.emerald} /> Free standard shipping</li>
              </ul>
            </div>
            {/* Address Picker */}
            <div style={{ marginTop: 32, borderTop: `1px solid ${TOKEN.slate100}`, paddingTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}><FiMapPin /> Delivery Address</h3>
                {!showAddressForm && <button onClick={() => setShowAddressForm(true)} style={{ background: 'none', border: 'none', color: TOKEN.indigo, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Add New</button>}
              </div>
              {!showAddressForm ? (
                addresses.length === 0 ? <p style={{ color: TOKEN.slate400 }}>No saved addresses. Add one.</p> :
                addresses.map(addr => (
                  <div key={addr._id} onClick={() => setSelectedAddressId(addr._id)} style={{ padding: 12, border: `1px solid ${selectedAddressId === addr._id ? TOKEN.indigo : TOKEN.slate200}`, borderRadius: 14, marginBottom: 8, cursor: 'pointer', background: selectedAddressId === addr._id ? TOKEN.indigoLight : TOKEN.white }}>
                    <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>{addr.fullName} {selectedAddressId === addr._id && <FiCheck color={TOKEN.indigo} />}</div>
                    <div style={{ fontSize: 12, color: TOKEN.slate600 }}>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</div>
                  </div>
                ))
              ) : (
                <div style={{ background: TOKEN.white, borderRadius: 16, padding: 16, border: `1px solid ${TOKEN.slate200}` }}>
                  <input placeholder="Full Name" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 12, border: `1px solid ${TOKEN.slate200}` }} />
                  <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 12 }} />
                  <input placeholder="Address" value={newAddress.addressLine} onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 12 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} style={{ padding: 10, borderRadius: 12 }} />
                    <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} style={{ padding: 10, borderRadius: 12 }} />
                  </div>
                  <input placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} style={{ width: '100%', marginBottom: 16, padding: 10, borderRadius: 12 }} />
                  <button onClick={handleBuyNow} style={{ width: '100%', background: TOKEN.indigo, color: TOKEN.white, padding: 12, borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Save & Buy Now</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {recommended.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}><FiTruck /> You may also like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {recommended.map(prod => <ProductCard key={prod._id} product={prod} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProductDetail;