import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { productAPI } from '../../services/api';
import Header from '../header/Header';
import Footer from '../footer/Footer';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const [relatedProducts, setRelatedProducts] = useState([]);

    const fetchRelatedProducts = async () => {
        try {
            const data = await productAPI.getAll({ limit: 6 });
            setRelatedProducts(data.data || data);
        } catch (err) {
            console.error('Error fetching related products:', err);
            setRelatedProducts([]);
        }
    };

    useEffect(() => {
        fetchRelatedProducts();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleCheckout = () => {
        // Navigate to checkout page
        navigate('/checkout');
    };

    return (
        <div className="bg-white min-h-screen">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Cart Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">CART</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg mb-6">Your cart is currently empty</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Table */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                {/* Table Header */}
                                <div className="bg-gray-50 border-b border-gray-200">
                                    <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
                                        <div className="col-span-6">Product</div>
                                        <div className="col-span-2 text-center">Quantity</div>
                                        <div className="col-span-2 text-center">Total Price</div>
                                        <div className="col-span-2 text-center">Remove</div>
                                    </div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => {
                                        const productId = item.product._id || item.product.id;
                                        const productImage = item.product.images?.[0] || item.product.image;
                                        return (
                                            <div key={`${productId}-${item.size}`} className="px-6 py-6">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    {/* Product Info */}
                                                    <div className="col-span-6 flex gap-4">
                                                        <div
                                                            onClick={() => navigate(`/product/${productId}`)}
                                                            className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                                                        >
                                                            {productImage ? (
                                                                <img
                                                                    src={productImage}
                                                                    alt={item.product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3
                                                                onClick={() => navigate(`/product/${productId}`)}
                                                                className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                                                            >
                                                                {item.product.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">{item.size}</p>
                                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                                {formatPrice(item.product.price)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(productId, item.size, item.quantity - 1)
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <ChevronLeft size={16} />
                                                        </button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(productId, item.size, item.quantity + 1)
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <ChevronRight size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Total Price */}
                                                    <div className="col-span-2 text-center font-semibold text-gray-900">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </div>

                                                    {/* Delete Button */}
                                                    <div className="col-span-2 flex justify-center">
                                                        <button
                                                            onClick={() => removeFromCart(productId, item.size)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                                        <span className="font-medium text-gray-700">Tổng tiền:</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {formatPrice(getCartTotal())}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-black text-white py-4 px-6 font-bold hover:bg-gray-800 transition-colors rounded-lg"
                                    >
                                        THANH TOÁN
                                    </button>

                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 font-medium hover:bg-gray-100 transition-colors rounded-lg"
                                    >
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            CÁC SẢN PHẨM KHÁC
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                            {relatedProducts.map((product) => {
                                const productId = product._id || product.id;
                                const productImage = product.images?.[0] || product.image;
                                return (
                                    <div
                                        key={productId}
                                        onClick={() => navigate(`/product/${productId}`)}
                                        className="group cursor-pointer"
                                    >
                                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square">
                                            {productImage ? (
                                                <img
                                                    src={productImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200"></div>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
