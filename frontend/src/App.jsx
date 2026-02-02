import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ManagerRoute from './components/ManagerRoute';
import HomePage from '../pages/homepage/Homepage';
import AuthPage from '../pages/auth/AuthPage';
import NotFound from '../pages/NotFound';
import Detailcard from '../pages/Detail-card/Detailcard';
import Cart from './components/cart/Cart';
import Order from '../pages/order/Order';
import Shop from '../pages/shop/shop';
import Profile from '../pages/profile/Profile';
import About from '../pages/about/About';
import Contact from '../pages/contact/contact';
import AdminDashboard from '../pages/admin/Dashboard';
import ProductManagement from '../pages/admin/ProductManagement';
import UserManagement from '../pages/admin/UserManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import ReportsAnalytics from '../pages/admin/ReportsAnalytics';
import ManagerDashboard from '../pages/manager/ManagerDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<Detailcard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute>
                <CategoryManagement />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <OrderManagement />
              </AdminRoute>
            } />
            <Route path="/admin/reports" element={
              <AdminRoute>
                <ReportsAnalytics />
              </AdminRoute>
            } />
            <Route path="/manager/dashboard" element={
              <ManagerRoute>
                <ManagerDashboard />
              </ManagerRoute>
            } />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            {/* <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
