import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Revenue Chart Data
    const revenueData = {
        labels: ['Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2'],
        datasets: [
            {
                label: 'Doanh thu ($)',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const revenueOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Traffic Chart Data
    const trafficData = {
        labels: ['Facebook', 'Google', 'Trực tiếp'],
        datasets: [
            {
                data: [45, 30, 25],
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
                hoverOffset: 4,
            },
        ],
    };

    const trafficOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    const stats = [
        { title: 'Tổng doanh thu', value: '$24,500', color: 'text-green-600' },
        { title: 'Người dùng mới', value: '1,240', color: 'text-blue-600' },
        { title: 'Đơn hàng', value: '458', color: 'text-orange-600' },
        { title: 'Tỷ lệ chuyển đổi', value: '3.2%', color: 'text-indigo-600' }
    ];

    const orders = [
        { id: '#ORD-001', customer: 'Nguyễn Văn A', status: 'Hoàn tất', statusColor: 'bg-green-100 text-green-700' },
        { id: '#ORD-002', customer: 'Trần Thị B', status: 'Đang xử lý', statusColor: 'bg-yellow-100 text-yellow-700' },
        { id: '#ORD-003', customer: 'Lê Văn C', status: 'Đang giao', statusColor: 'bg-blue-100 text-blue-700' },
        { id: '#ORD-004', customer: 'Phạm Thị D', status: 'Hoàn tất', statusColor: 'bg-green-100 text-green-700' },
        { id: '#ORD-005', customer: 'Hoàng Văn E', status: 'Hủy', statusColor: 'bg-red-100 text-red-700' },
    ];

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
                        className="w-full flex items-center px-6 py-3 bg-indigo-800 border-l-4 border-blue-400 text-left"
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
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Phân tích số liệu</h2>
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
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                        {/* Revenue Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-4">Doanh thu 6 tháng gần nhất</h3>
                            <div className="h-64">
                                <Line data={revenueData} options={revenueOptions} />
                            </div>
                        </div>

                        {/* Traffic Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-700 mb-4">Nguồn khách hàng</h3>
                            <div className="max-w-[300px] mx-auto h-64 flex items-center justify-center">
                                <Doughnut data={trafficData} options={trafficOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Đơn hàng mới</h3>
                            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                Xem tất cả
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Mã đơn</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Khách hàng</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-indigo-600">{order.id}</td>
                                            <td className="px-6 py-4 text-sm">{order.customer}</td>
                                            <td className="px-6 py-4 text-xs">
                                                <span className={`${order.statusColor} px-2 py-1 rounded-full`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
