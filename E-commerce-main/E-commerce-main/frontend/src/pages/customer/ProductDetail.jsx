import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ProductCard from '../../components/customer/ProductCard';
import styles from './ProductDetail.module.css';

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
    fullName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: prod } = await axios.get(`/api/products/${id}`);
        setProduct(prod);
        // Recommended: same category, exclude current, limit 8 (enough for scroll)
        const { data: recs } = await axios.get(`/api/products?category=${prod.category}&limit=8`);
        setRecommended(recs.filter(p => p._id !== prod._id).slice(0, 8));

        if (token) {
          const { data: addrs } = await axios.get('/api/addresses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAddresses(addrs);
          const defaultAddr = addrs.find(a => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr._id);
          else if (addrs.length) setSelectedAddressId(addrs[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleAddToCart = () => addToCart(product._id, quantity);

  const handleBuyNow = async () => {
    if (!selectedAddressId && addresses.length === 0 && !showAddressForm) {
      toast.error('Please select or add a delivery address');
      return;
    }
    if (showAddressForm) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine || !newAddress.city || !newAddress.state || !newAddress.pincode) {
        toast.error('Please fill all address fields');
        return;
      }
      try {
        const { data: createdAddr } = await axios.post('/api/addresses', newAddress, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedAddressId(createdAddr._id);
        setAddresses([...addresses, createdAddr]);
        setShowAddressForm(false);
        setNewAddress({
          fullName: user?.name || '',
          phone: '',
          addressLine: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false,
        });
      } catch (err) {
        toast.error('Failed to save address');
        return;
      }
    }
    await addToCart(product._id, quantity);
    navigate('/checkout', { state: { addressId: selectedAddressId } });
  };

  const handleAddressChange = (e) => {
    setSelectedAddressId(e.target.value);
    setShowAddressForm(false);
  };

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const discountPercent = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className={styles.productContainer}>
      <div className={styles.productGrid}>
        <div className={styles.imageSection}>
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className={styles.mainImage}
          />
        </div>
        <div className={styles.infoSection}>
          <h1 className={styles.productTitle}>{product.name}</h1>
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>₹{product.price.toLocaleString()}</span>
            {product.compareAtPrice > product.price && (
              <>
                <span className={styles.oldPrice}>₹{product.compareAtPrice.toLocaleString()}</span>
                <span className={styles.discountBadge}>{discountPercent}% OFF</span>
              </>
            )}
          </div>
          <div className={styles.quantityBox}>
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              className={styles.quantityInput}
            />
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>Add to Cart</button>
            <button onClick={handleBuyNow} className={styles.buyNowBtn}>Buy Now</button>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>🎁 Offers</div>
            <ul className={styles.offerList}>
              <li>✅ Bank Offer: 10% off on SBI Credit Cards</li>
              <li>✅ No Cost EMI available on orders above ₹5,000</li>
              <li>✅ Free Shipping on this product</li>
            </ul>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>📋 Specifications</div>
            <div className={styles.specGrid}>
              <span className={styles.specLabel}>Brand</span><span>Generic</span>
              <span className={styles.specLabel}>Category</span><span>{product.category}</span>
              <span className={styles.specLabel}>Model</span><span>{product.name}</span>
              <span className={styles.specLabel}>Warranty</span><span>1 Year Manufacturer</span>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionTitle}>📝 Description</div>
            <p>{product.description}</p>
          </div>

          {/* Address section (unchanged) */}
          <div className={styles.addressSection}>
            <div className={styles.sectionTitle}>📍 Delivery Address</div>
            {!showAddressForm ? (
              <>
                {addresses.length > 0 && (
                  <select
                    value={selectedAddressId}
                    onChange={handleAddressChange}
                    className={styles.addressSelect}
                  >
                    <option value="">Select an address</option>
                    {addresses.map(addr => (
                      <option key={addr._id} value={addr._id}>
                        {addr.fullName}, {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </option>
                    ))}
                  </select>
                )}
                <div className={styles.addAddressBtn} onClick={() => setShowAddressForm(true)}>
                  + Add New Address
                </div>
              </>
            ) : (
              <div className="space-y-2 mt-2">
                <input type="text" name="fullName" placeholder="Full Name" value={newAddress.fullName} onChange={handleNewAddressChange} className="w-full border rounded px-3 py-2 text-sm" />
                <input type="tel" name="phone" placeholder="Phone" value={newAddress.phone} onChange={handleNewAddressChange} className="w-full border rounded px-3 py-2 text-sm" />
                <input type="text" name="addressLine" placeholder="Address Line" value={newAddress.addressLine} onChange={handleNewAddressChange} className="w-full border rounded px-3 py-2 text-sm" />
                <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleNewAddressChange} className="w-full border rounded px-3 py-2 text-sm" />
                <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleNewAddressChange} className="w-full border rounded px-3 py-2 text-sm" />
                <input type="text" name="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleNewAddressChange} className="w-full border rounded px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddressForm(false)} className="bg-gray-300 px-3 py-1 rounded text-sm">Cancel</button>
                  <button onClick={handleBuyNow} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Save & Buy Now</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products – horizontally scrollable */}
      {recommended.length > 0 && (
        <div className={styles.recommendedSection}>
          <h2 className={styles.recommendedTitle}>You May Also Like</h2>
          <div className={styles.scrollContainer}>
            <div className={styles.scrollRow}>
              {recommended.map(prod => (
                <div key={prod._id} className={styles.scrollItem}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;