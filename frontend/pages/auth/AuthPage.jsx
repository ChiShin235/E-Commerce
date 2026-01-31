import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();
    const [isSignUp, setIsSignUp] = useState(() => location.pathname === '/register');
    const [isLoading, setIsLoading] = useState(false);
    const isNavigatingRef = useRef(false);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loginErrors, setLoginErrors] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [registerErrors, setRegisterErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });

        // Clear error when user types
        if (loginErrors[name]) {
            setLoginErrors({
                ...loginErrors,
                [name]: ''
            });
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });

        // Clear error when user types
        if (registerErrors[name]) {
            setRegisterErrors({
                ...registerErrors,
                [name]: ''
            });
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (isNavigatingRef.current || isLoading) {
            return; // Prevent duplicate submissions
        }

        // Validate form
        const errors = {};

        if (!loginData.email.trim()) {
            errors.email = 'Email không được để trống';
        } else if (!validateEmail(loginData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!loginData.password) {
            errors.password = 'Mật khẩu không được để trống';
        } else if (loginData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (Object.keys(errors).length > 0) {
            setLoginErrors(errors);
            toast.error('Vui lòng kiểm tra lại thông tin đăng nhập');
            return;
        }

        setIsLoading(true);
        setLoginErrors({ email: '', password: '' });

        try {
            const result = await login(loginData.email, loginData.password);

            if (result.success) {
                isNavigatingRef.current = true;
                toast.success(result.message || 'Đăng nhập thành công!');
                // Use setTimeout to ensure toast is shown before navigation
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 100);
            } else {
                setIsLoading(false);
                toast.error(result.message || 'Email hoặc mật khẩu không đúng');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Login error:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (isNavigatingRef.current || isLoading) {
            return; // Prevent duplicate submissions
        }

        // Validate form
        const errors = {};

        if (!registerData.name.trim()) {
            errors.name = 'Họ tên không được để trống';
        } else if (registerData.name.trim().length < 2) {
            errors.name = 'Họ tên phải có ít nhất 2 ký tự';
        }

        if (!registerData.email.trim()) {
            errors.email = 'Email không được để trống';
        } else if (!validateEmail(registerData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!registerData.phone.trim()) {
            errors.phone = 'Số điện thoại không được để trống';
        } else if (!/^[0-9]{10,11}$/.test(registerData.phone)) {
            errors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!registerData.password) {
            errors.password = 'Mật khẩu không được để trống';
        } else if (registerData.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (Object.keys(errors).length > 0) {
            setRegisterErrors(errors);
            toast.error('Vui lòng kiểm tra lại thông tin đăng ký');
            return;
        }

        setIsLoading(true);
        setRegisterErrors({ name: '', email: '', phone: '', password: '' });

        try {
            const result = await register(registerData.name, registerData.email, registerData.phone, registerData.password);

            console.log('Register result:', result);

            if (result.success) {
                setIsLoading(false);
                toast.success(result.message || 'Đăng ký thành công!');

                // Reset form fields
                setRegisterData({
                    name: '',
                    email: '',
                    phone: '',
                    password: ''
                });

                setTimeout(() => {
                    isNavigatingRef.current = false; // Reset để có thể login sau
                    setIsSignUp(false);
                    navigate('/login', { replace: true });
                }, 1000);
            } else {
                setIsLoading(false);
                toast.error(result.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Register error:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Back to Home Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors z-50"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back Home</span>
            </button>

            <div className={`relative bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl min-h-[550px] transition-all duration-700 ${isSignUp ? 'right-panel-active' : ''}`}>

                {/* Sign Up Container */}
                <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-full opacity-100 z-50' : 'translate-x-0 opacity-0 z-10'
                    } w-1/2 left-0`}>
                    <form onSubmit={handleRegisterSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
                        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Tạo tài khoản</h1>

                        <div className="flex gap-3 mb-5">
                            <button type="button" onClick={(e) => e.preventDefault()} className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all">
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button type="button" onClick={(e) => e.preventDefault()} className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all">
                                <i className="fab fa-google"></i>
                            </button>
                            <button type="button" onClick={(e) => e.preventDefault()} className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all">
                                <i className="fab fa-linkedin-in"></i>
                            </button>
                        </div>

                        <span className="text-xs text-gray-500 mb-4">hoặc đăng ký bằng email của bạn</span>

                        <div className="w-full">
                            <input
                                type="text"
                                name="name"
                                placeholder="Username"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                className={`bg-gray-50 border-b py-3 px-4 my-2 w-full outline-none focus:bg-white transition-all font-['Montserrat'] ${registerErrors.name ? 'border-red-500' : 'border-gray-300 focus:border-gray-800'
                                    }`}
                                required
                            />
                            {registerErrors.name && (
                                <p className="text-red-500 text-xs mt-1 text-left">{registerErrors.name}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                className={`bg-gray-50 border-b py-3 px-4 my-2 w-full outline-none focus:bg-white transition-all font-['Montserrat'] ${registerErrors.email ? 'border-red-500' : 'border-gray-300 focus:border-gray-800'
                                    }`}
                                required
                            />
                            {registerErrors.email && (
                                <p className="text-red-500 text-xs mt-1 text-left">{registerErrors.email}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                className={`bg-gray-50 border-b py-3 px-4 my-2 w-full outline-none focus:bg-white transition-all font-['Montserrat'] ${registerErrors.phone ? 'border-red-500' : 'border-gray-300 focus:border-gray-800'
                                    }`}
                                required
                            />
                            {registerErrors.phone && (
                                <p className="text-red-500 text-xs mt-1 text-left">{registerErrors.phone}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className={`bg-gray-50 border-b py-3 px-4 my-2 w-full outline-none focus:bg-white transition-all font-['Montserrat'] ${registerErrors.password ? 'border-red-500' : 'border-gray-300 focus:border-gray-800'
                                    }`}
                                required
                            />
                            {registerErrors.password && (
                                <p className="text-red-500 text-xs mt-1 text-left">{registerErrors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 border border-gray-800 bg-gray-800 text-white text-xs font-bold py-3 px-11 uppercase tracking-wider hover:bg-gray-900 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                        </button>
                    </form>
                </div>

                {/* Sign In Container */}
                <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-full' : 'translate-x-0'
                    } w-1/2 left-0 z-20`}>
                    <form onSubmit={handleLoginSubmit} className="bg-white flex flex-col items-center justify-center px-12 h-full text-center">
                        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Đăng Nhập</h1>

                        <div className="flex gap-3 mb-5">
                            <button type="button" onClick={(e) => e.preventDefault()} className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all">
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button type="button" onClick={(e) => e.preventDefault()} className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all">
                                <i className="fab fa-google"></i>
                            </button>
                            <button type="button" onClick={(e) => e.preventDefault()} className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all">
                                <i className="fab fa-linkedin-in"></i>
                            </button>
                        </div>

                        <span className="text-xs text-gray-500 mb-4">hoặc sử dụng tài khoản của bạn</span>

                        <div className="w-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className={`bg-gray-50 border-b py-3 px-4 my-2 w-full outline-none focus:bg-white transition-all font-['Montserrat'] ${loginErrors.email ? 'border-red-500' : 'border-gray-300 focus:border-gray-800'
                                    }`}
                                required
                            />
                            {loginErrors.email && (
                                <p className="text-red-500 text-xs mt-1 text-left">{loginErrors.email}</p>
                            )}
                        </div>
                        <div className="w-full">
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className={`bg-gray-50 border-b py-3 px-4 my-2 w-full outline-none focus:bg-white transition-all font-['Montserrat'] ${loginErrors.password ? 'border-red-500' : 'border-gray-300 focus:border-gray-800'
                                    }`}
                                required
                            />
                            {loginErrors.password && (
                                <p className="text-red-500 text-xs mt-1 text-left">{loginErrors.password}</p>
                            )}
                        </div>

                        <button type="button" onClick={(e) => e.preventDefault()} className="text-gray-700 text-sm my-4 hover:border-b hover:border-gray-800 transition-all">
                            Quên mật khẩu?
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 border border-gray-800 bg-gray-800 text-white text-xs font-bold py-3 px-11 uppercase tracking-wider hover:bg-gray-900 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isSignUp ? '-translate-x-full' : 'translate-x-0'
                    }`}>
                    <div
                        className="relative -left-full h-full w-[200%] transition-transform duration-700 ease-in-out"
                        style={{
                            background: `#333 url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center`,
                            backgroundSize: 'cover',
                            transform: isSignUp ? 'translateX(50%)' : 'translateX(0)'
                        }}
                    >
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/30"></div>

                        {/* Overlay Left Panel */}
                        <div className={`absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-700 ease-in-out z-10 ${isSignUp ? 'translate-x-0' : '-translate-x-1/5'
                            }`}>
                            <h1 className="text-3xl font-semibold mb-5 text-white">Chào mừng trở lại!</h1>
                            <p className="text-sm font-light leading-5 tracking-wide my-5 text-white mb-8">
                                Để tiếp tục mua sắm những bộ cánh thời thượng, vui lòng đăng nhập.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(false);
                                    navigate('/login');
                                }}
                                className="bg-transparent border border-white text-white text-xs font-bold py-3 px-11 uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all"
                            >
                                Đăng Nhập
                            </button>
                        </div>

                        {/* Overlay Right Panel */}
                        <div className={`absolute right-0 flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 transition-transform duration-700 ease-in-out z-10 ${isSignUp ? 'translate-x-1/5' : 'translate-x-0'
                            }`}>
                            <h1 className="text-3xl font-semibold mb-5 text-white">Xin chào!</h1>
                            <p className="text-sm font-light leading-5 tracking-wide my-5 text-white mb-8">
                                Nhập thông tin cá nhân của bạn và bắt đầu hành trình thời trang cùng chúng tôi.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(true);
                                    navigate('/register');
                                }}
                                className="bg-transparent border border-white text-white text-xs font-bold py-3 px-11 uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all"
                            >
                                Đăng Ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
