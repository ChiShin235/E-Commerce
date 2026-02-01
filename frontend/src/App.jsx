import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
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
