import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../src/context/CartContext';
import { toast } from 'sonner';

export default function Payment() {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('vietqr');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        note: '',
    });

    const shippingFee = 0; // Free shipping

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleApplyCoupon = () => {
        if (couponCode) {
            // Mock coupon validation
            toast.success('Mã giảm giá đã được áp dụng!');
            setDiscount(50000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.email || !formData.fullName || !formData.phone || !formData.address) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Process order
        console.log('Order data:', {
            formData,
            cartItems,
            paymentMethod,
            total: getCartTotal() - discount + shippingFee,
        });

        toast.success('Đặt hàng thành công!');
        clearCart();
        navigate('/');
    };

    const subtotal = getCartTotal();
    const total = subtotal - discount + shippingFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-6">Giỏ hàng của bạn đang trống</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-8 py-3 font-bold hover:bg-blue-700 transition-colors"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="mb-8">
                    <div
                        onClick={() => navigate('/')}
                        className="w-16 h-16 bg-red-600 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
                    >
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Customer Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Info Section */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Thông tin nhận hàng</h2>
                                    <button type="button" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                                        <span className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                        </span>
                                        Đăng nhập
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Họ và tên"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="flex gap-2">
                                        <div className="w-20 flex items-center justify-center border border-gray-300 px-3">
                                            <span className="text-2xl">🇻🇳</span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Số điện thoại"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Địa chỉ"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* City/Province */}
                                    <div>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Tỉnh thành</option>
                                            <option value="hcm">Hồ Chí Minh</option>
                                            <option value="hn">Hà Nội</option>
                                            <option value="dn">Đà Nẵng</option>
                                        </select>
                                    </div>

                                    {/* District */}
                                    <div>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Quận huyện</option>
                                            <option value="q1">Quận 1</option>
                                            <option value="q2">Quận 2</option>
                                            <option value="q3">Quận 3</option>
                                        </select>
                                    </div>

                                    {/* Ward */}
                                    <div>
                                        <select
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Phường xã</option>
                                            <option value="p1">Phường 1</option>
                                            <option value="p2">Phường 2</option>
                                            <option value="p3">Phường 3</option>
                                        </select>
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <textarea
                                            name="note"
                                            placeholder="Ghi chú (tùy chọn)"
                                            value={formData.note}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Section */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Vận chuyển</h2>
                                <div className="bg-blue-50 border border-blue-200 px-4 py-3 text-blue-800 text-sm">
                                    Vui lòng nhập thông tin giao hàng
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Thanh toán</h2>
                                <div className="space-y-3">
                                    {/* VietQR */}
                                    <label className="flex items-center justify-between p-4 border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="vietqr"
                                                checked={paymentMethod === 'vietqr'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <span className="font-medium text-gray-900">Thanh toán qua VietQR</span>
                                        </div>
                                        <img
                                            src="https://vietqr.io/img/vietqr-logo.svg"
                                            alt="VietQR"
                                            className="h-6"
                                        />
                                    </label>

                                    {/* COD */}
                                    <label className="flex items-center justify-between p-4 border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-blue-600"
                                            />
                                            <span className="font-medium text-gray-900">Thanh toán khi giao hàng (COD)</span>
                                        </div>
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    Đơn hàng ({cartItems.length} sản phẩm)
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                    {item.product.image ? (
                                                        <img
                                                            src={item.product.image}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 rounded"></div>
                                                    )}
                                                </div>
                                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-xs text-gray-600">{item.size}</p>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Code */}
                                <div className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Nhập mã giảm giá"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="bg-blue-600 text-white px-6 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="space-y-3 py-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tạm tính</span>
                                        <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Phí vận chuyển</span>
                                        <span className="font-medium text-gray-900">
                                            {shippingFee === 0 ? '-' : formatPrice(shippingFee)}
                                        </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Giảm giá</span>
                                            <span className="font-medium text-red-600">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
                                    <span className="text-lg font-medium text-gray-900">Tổng cộng</span>
                                    <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                                </div>

                                {/* Back to Cart Link */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/cart')}
                                    className="text-blue-600 hover:underline text-sm mb-4 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    Quay về giỏ hàng
                                </button>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-4 px-6 font-bold text-lg hover:bg-blue-700 transition-colors"
                                >
                                    ĐẶT HÀNG
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
