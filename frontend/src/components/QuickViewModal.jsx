import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function QuickViewModal({ product, isOpen, onClose }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('XS');
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const productId = product._id || product.id;
    const productImage = product.images?.[0] || product.image;

    // Parse sizes from product.size field (can be "XS,S,M,L,XL" or "XS S M L XL")
    const availableSizes = product.size
        ? product.size.split(/[,\s]+/).filter(s => s.trim())
        : [];

    const isInStock = product.stock > 0;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = (e) => {
        e?.stopPropagation();
        console.log('🛒 handleAddToCart called in QuickViewModal');
        addToCart(product, selectedSize, 1);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                    <X size={24} className="text-gray-700" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {/* Left Side - Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                            {productImage ? (
                                <img
                                    src={productImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                    <ShoppingBag size={80} className="text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-3">
                            {(product.images || [productImage]).slice(0, 3).map((img, idx) => (
                                <div
                                    key={idx}
                                    className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                                >
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <ShoppingBag size={32} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="flex flex-col">
                        {/* Product Title */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h2>

                        {/* Brand and Status */}
                        <div className="flex items-center gap-4 mb-4 text-sm">
                            <span className="text-gray-600">
                                Brand: <span className="text-blue-600 font-medium">FPT®</span>
                            </span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gray-600">
                                Status: <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {isInStock ? `In stock (${product.stock})` : 'Out stock'}
                                </span>
                            </span>
                        </div>

                        {/* Rating */}
                        {product.averageRating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-5 h-5 ${index < Math.floor(product.averageRating)
                                                ? 'text-yellow-400 fill-current'
                                                : index < product.averageRating
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-300 fill-current'
                                                }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-600 text-sm">
                                    {product.averageRating.toFixed(1)} / 5.0
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="text-3xl font-bold text-gray-900 mb-6">
                            {formatPrice(product.price)}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        <button
                            onClick={() => {
                                navigate(`/product/${productId}`);
                                onClose();
                            }}
                            className="text-red-600 hover:text-red-700 font-medium mb-6 text-left"
                        >
                            View Detail →
                        </button>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Size</h3>
                            <div className="flex gap-2 flex-wrap">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-6 py-2 border-2 font-medium transition-all ${selectedSize === size
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center border-2 border-gray-300 rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-16 text-center py-2 border-x-2 border-gray-300 outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className={`flex-1 font-bold py-3 px-6 transition-colors ${isInStock
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isInStock ? 'ADD TO CART' : 'HẾT HÀNG'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
