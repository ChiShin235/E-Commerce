import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { userAPI, roleAPI } from '../../src/services/api';
import { toast } from 'sonner';

const UserManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        roleIds: []
    });

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            setUsers(response.data || response);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await roleAPI.getAll();
            setRoles(response.data || response);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            roleIds: []
        });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username || '',
            name: user.name || '',
            email: user.email || '',
            password: '',
            phone: user.phone || '',
            address: user.address || '',
            roleIds: user.roles ? user.roles.map(r => r._id) : []
        });
        setShowModal(true);
    };

    const openDeleteModal = (userId) => {
        setDeleteUserId(userId);
        setShowDeleteModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.name || !formData.email) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (!editingUser && !formData.password) {
            toast.error('Vui lòng nhập mật khẩu');
            return;
        }

        try {
            const userData = {
                username: formData.username,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
            };

            if (formData.password) {
                userData.password = formData.password;
            }

            if (editingUser) {
                await userAPI.update(editingUser._id, userData);

                if (formData.roleIds.length > 0) {
                    await userAPI.assignRoles(editingUser._id, formData.roleIds);
                }

                toast.success('Cập nhật người dùng thành công!');
            } else {
                const newUser = await userAPI.create(userData);

                if (formData.roleIds.length > 0 && newUser._id) {
                    await userAPI.assignRoles(newUser._id, formData.roleIds);
                }

                toast.success('Thêm người dùng thành công!');
            }

            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.message || 'Không thể lưu người dùng');
        }
    };

    const handleDelete = async () => {
        try {
            await userAPI.delete(deleteUserId);
            toast.success('Xóa người dùng thành công!');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Không thể xóa người dùng');
        }
    };

    const handleRoleChange = (roleId) => {
        setFormData(prev => {
            const roleIds = prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId];
            return { ...prev, roleIds };
        });
    };

    const getRoleNames = (userRoles) => {
        if (!userRoles || userRoles.length === 0) return 'User';
        return userRoles.map(r => r.name).join(', ');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-800">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/picture/logo.png"
                            alt="Logo"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <h1 className="text-xl font-bold">Admin Panel</h1>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                        <i className="fas fa-times"></i>
                    </button>
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
                        className="w-full flex items-center px-6 py-3 bg-indigo-800 border-l-4 border-blue-400 text-left"
                    >
                        <i className="fas fa-users mr-3"></i> Người dùng
                    </button>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="w-full flex items-center px-6 py-3 hover:bg-indigo-800 transition text-left"
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

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Top Bar */}
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-gray-600"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600 hover:text-gray-800">
                                <i className="fas fa-bell text-xl"></i>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Danh sách người dùng</h3>
                            <button
                                onClick={openAddModal}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                            >
                                <i className="fas fa-plus"></i>
                                <span>Thêm người dùng</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <i className="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điện thoại</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.phone || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                        {getRoleNames(user.roles)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold">
                                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu {!editingUser && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder={editingUser ? "Để trống nếu không đổi" : ""}
                                        required={!editingUser}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vai trò
                                    </label>
                                    <div className="space-y-2">
                                        {roles.map((role) => (
                                            <label key={role._id} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.roleIds.includes(role._id)}
                                                    onChange={() => handleRoleChange(role._id)}
                                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    {editingUser ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                            <h3 className="text-xl font-semibold mb-2">Xác nhận xóa</h3>
                            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa người dùng này?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
