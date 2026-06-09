import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const CartPage = () => {
  const { cart, updateQuantity, removeItem } = useContext(CartContext);
  const { items, totalPrice } = cart;

  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner animate-bounce">
          🛒
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your shopping cart is empty</h2>
        <p className="text-slate-400 mt-2 max-w-sm mb-8">Before you proceed to checkout, you must add some products to your shopping cart.</p>
        <Link 
          to="/products" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 inline-flex items-center gap-2 text-sm"
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  const handleDecrease = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    } else {
      removeItem(productId);
    }
  };

  const handleIncrease = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-slate-400">Review your items before proceeding to payment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              // Safely extract product ID as string
              let productId = null;
              if (typeof item.productId === 'object' && item.productId !== null) {
                productId = item.productId._id?.toString();
              } else if (typeof item.productId === 'string') {
                productId = item.productId;
              }
              
              if (!productId) {
                console.warn('Invalid productId in cart item:', item);
                return null;
              }

              return (
                <div 
                  key={productId} 
                  className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-slate-50 rounded-xl flex-shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                    
                    {/* Item Meta */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate hover:text-indigo-600">
                        {item.name}
                      </h3>
                      <p className="text-indigo-600 font-extrabold text-sm mt-1">
                        ₹{item.price.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                        <FiCheckCircle className="text-emerald-500 w-3 h-3" /> In Stock
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Remove Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl p-1 shadow-sm">
                      <button 
                        onClick={() => handleDecrease(productId, item.quantity)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white active:bg-slate-100 transition-colors"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-800 text-xs">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrease(productId, item.quantity)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white active:bg-slate-100 transition-colors"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(productId)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-bold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Shipping Cost</span>
                  <span className="text-emerald-500 font-extrabold tracking-wide uppercase text-xs">Free Delivery</span>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between items-baseline">
                  <span className="text-base font-black text-slate-900">Total Price</span>
                  <span className="text-xl font-black text-indigo-600">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 group"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Security Tag */}
              <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>🔒 SSL SECURED CHECKOUT TRANSACTIONS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;