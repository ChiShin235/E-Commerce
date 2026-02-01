import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { productAPI, categoryAPI } from '../../src/services/api';
import { toast } from 'sonner';

export default function ProductManagement() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: '',
        size: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productAPI.getAll();
            setProducts(response.data || response);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryAPI.getAll();
            setCategories(response.data || response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images.split(',').map(url => url.trim()),
                size: formData.size.split(',').map(s => s.trim())
            };

            if (editingProduct) {
                await productAPI.update(editingProduct._id, productData);
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await productAPI.create(productData);
                toast.success('Thêm sản phẩm thành công!');
            }

            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            category: product.category?._id || product.category,
            stock: product.stock.toString(),
            images: Array.isArray(product.images) ? product.images.join(', ') : product.images || '',
            size: Array.isArray(product.size) ? product.size.join(', ') : product.size || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

        try {
            await productAPI.delete(id);
            toast.success('Xóa sản phẩm thành công!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Không thể xóa sản phẩm!');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            images: '',
            size: ''
        });
        setEditingProduct(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside className={`w-64 bg-indigo-900 text-white flex-shrink-0 flex-col ${isSidebarOpen ? 'flex' : 'hidden'} md:flex fixed md:relative h-full z-50`}>
                <div className="p-6 border-b border-indigo-800 flex items-center justify-center">
                    <img
                        src="/picture/logo.png"
                        alt="Logo"
                        className="h-16 w-16 object-cover rounded-full"
                    />
                </div>
                <nav className="flex-1 mt-4">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full flex items-center px-6 py-3 hover:bg-indigo-800 transition text-left"
                    >
                        <i className="fas fa-chart-line mr-3"></i> Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="w-full flex items-center px-6 py-3 hover:bg-indigo-800 transition text-left"
                    >
                        <i className="fas fa-users mr-3"></i> Người dùng
                    </button>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="w-full flex items-center px-6 py-3 bg-indigo-800 border-l-4 border-blue-400 text-left"
                    >
                        <i className="fas fa-box mr-3"></i> Sản phẩm
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center px-6 py-3 hover:bg-indigo-800 transition text-left"
                    >
                        <i className="fas fa-home mr-3"></i> Về trang chủ
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-6 py-3 hover:bg-indigo-800 transition text-left mt-4 border-t border-indigo-800"
                    >
                        <i className="fas fa-sign-out-alt mr-3"></i> Đăng xuất
                    </button>
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            className="md:hidden text-gray-500"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Quản lý sản phẩm</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-indigo-600">
                            <i className="fas fa-bell"></i>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-4 md:p-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Danh sách sản phẩm</h3>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Thêm sản phẩm</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hình ảnh</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tên sản phẩm</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Giá</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Kho</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Danh mục</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={product.images?.[0] || '/placeholder.png'}
                                                        alt={product.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                                                <td className="px-6 py-4 text-sm">{formatPrice(product.price)}</td>
                                                <td className="px-6 py-4 text-sm">{product.stock}</td>
                                                <td className="px-6 py-4 text-sm">{product.category?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL hình ảnh (cách nhau bằng dấu phẩy)
                                </label>
                                <input
                                    type="text"
                                    name="images"
                                    value={formData.images}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kích thước (cách nhau bằng dấu phẩy)
                                </label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    placeholder="S, M, L, XL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
