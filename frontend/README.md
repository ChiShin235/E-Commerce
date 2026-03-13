# 🛍️ E-Commerce Frontend

Giao diện người dùng cho ứng dụng thương mại điện tử, xây dựng bằng **React 19**, **Vite** và **Tailwind CSS v4**.

> Hỗ trợ đầy đủ: mua sắm, giỏ hàng, đặt hàng, thanh toán VNPay, chatbot AI, dashboard quản trị đa vai trò (Admin / Manager / Staff).

---

## 📋 Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [Trang & Routes](#trang--routes)
- [Context API](#context-api)
- [Services / API Layer](#services--api-layer)
- [Components](#components)
- [Phân quyền & Protected Routes](#phân-quyền--protected-routes)
- [Tính năng nổi bật](#tính-năng-nổi-bật)
- [Kết nối với Backend](#kết-nối-với-backend)

---

## 🔧 Công nghệ sử dụng

| Package                | Phiên bản | Mô tả                                   |
| ---------------------- | --------- | --------------------------------------- |
| `react`                | 19        | UI framework, hỗ trợ Concurrent Mode    |
| `vite` (rolldown-vite) | 7.x       | Build tool tốc độ cao, HMR instant      |
| `tailwindcss`          | v4        | Utility-first CSS framework             |
| `react-router-dom`     | v7        | Client-side routing, nested routes      |
| `axios`                | ^1.13     | HTTP client, tự động gắn JWT vào header |
| `chart.js`             | ^4.5      | Thư viện vẽ biểu đồ                     |
| `react-chartjs-2`      | ^5.3      | Wrapper React cho Chart.js              |
| `lucide-react`         | ^0.562    | Bộ icon SVG nhẹ và đẹp                  |
| `sonner`               | ^2.0      | Toast notification hiện đại             |
| `react-vanilla-tilt`   | ^1.0      | Hiệu ứng 3D tilt cho product card       |

**Dev Dependencies:**

| Package                | Mô tả                                |
| ---------------------- | ------------------------------------ |
| `eslint` + plugins     | Lint code React                      |
| `@vitejs/plugin-react` | Hỗ trợ JSX + Fast Refresh            |
| `@types/react`         | Type definitions                     |
| `globals`              | Khai báo global variables cho ESLint |

---

## 📁 Cấu trúc thư mục

```
frontend/
├── index.html                     # HTML entry point
├── vite.config.js                 # Cấu hình Vite + Tailwind plugin
├── eslint.config.js               # Cấu hình ESLint
├── src/
│   ├── main.jsx                   # Mount React app vào DOM
│   ├── App.jsx                    # Router chính + Providers (Auth, Cart, Toaster)
│   ├── index.css                  # Global styles (Tailwind directives)
│   ├── assets/                    # Ảnh, icon, font tĩnh
│   ├── components/
│   │   ├── card/                  # ProductCard, QuickViewModal
│   │   ├── cart/                  # Cart sidebar, CartItem, CartSummary
│   │   ├── chatbot/               # ChatbotWidget (popup AI hỗ trợ)
│   │   ├── footer/                # Footer toàn trang
│   │   ├── header/                # Navbar, menu di động, dropdown user
│   │   ├── navigate/              # Breadcrumb, navigation helpers
│   │   ├── pagination/            # Component phân trang tái sử dụng
│   │   ├── AdminRoute.jsx         # HOC kiểm tra role admin
│   │   ├── ManagerRoute.jsx       # HOC kiểm tra role manager
│   │   ├── StaffRoute.jsx         # HOC kiểm tra role staff
│   │   └── ProtectedRoute.jsx     # HOC yêu cầu đăng nhập
│   ├── context/
│   │   ├── AuthContext.jsx        # Trạng thái user, token, login/logout
│   │   └── CartContext.jsx        # Giỏ hàng toàn cục, đồng bộ với API
│   └── services/
│       ├── axios.js               # Axios instance + interceptor gắn JWT
│       └── api.js                 # Tất cả hàm gọi API (authAPI, productAPI...)
└── pages/
    ├── homepage/              # Trang chủ: banner, sản phẩm nổi bật, featured
    ├── auth/                  # Trang đăng nhập & đăng ký (AuthPage.jsx)
    ├── shop/                  # Danh sách sản phẩm, filter, search
    ├── bestseller/            # Sản phẩm bán chạy
    ├── Detail-card/           # Chi tiết sản phẩm, ảnh, size, review
    ├── order/                 # Quy trình đặt hàng, nhập địa chỉ, chọn PTTT
    ├── payment/               # VnpayReturn.jsx: xử lý kết quả VNPay
    ├── profile/               # Thông tin cá nhân, lịch sử đơn hàng
    ├── about/                 # Giới thiệu cửa hàng
    ├── contact/               # Form liên hệ
    ├── errornotfound/         # Trang 404 Not Found
    ├── admin/                 # Khu vực quản trị Admin
    │   ├── Dashboard.jsx          # Thống kê tổng quan, biểu đồ doanh thu
    │   ├── ProductManagement.jsx  # CRUD sản phẩm
    │   ├── UserManagement.jsx     # Quản lý users, đổi role
    │   ├── OrderManagement.jsx    # Quản lý đơn hàng, cập nhật trạng thái
    │   ├── CategoryManagement.jsx # CRUD danh mục
    │   ├── ReportsAnalytics.jsx   # Báo cáo doanh thu, biểu đồ Chart.js
    │   ├── AIBehaviorLogs.jsx     # Xem nhật ký hành vi AI
    │   └── ContactMessages.jsx    # Quản lý tin nhắn liên hệ
    ├── manager/               # Khu vực Manager
    │   ├── ManagerDashboard.jsx   # Tổng quan Manager
    │   ├── ManagerOrders.jsx      # Quản lý đơn hàng
    │   ├── ManagerProducts.jsx    # Quản lý sản phẩm
    │   ├── ManagerCategories.jsx  # Quản lý danh mục
    │   └── ManagerReports.jsx     # Báo cáo
    └── staff/                 # Khu vực Staff
        ├── StaffDashboard.jsx     # Tổng quan Staff
        ├── StaffOder.jsx          # Xử lý đơn hàng
        ├── StaffLowStock.jsx      # Sản phẩm sắp hết hàng
        └── ProductStaff.jsx       # Xem danh sách sản phẩm
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- Node.js >= 18
- npm >= 9
- Backend đang chạy tại `http://localhost:5001`

### Bước 1 – Cài đặt dependencies

```bash
cd frontend
npm install
```

### Bước 2 – Tạo file `.env`

```env
VITE_API_URL=http://localhost:5001/api
```

### Bước 3 – Chạy dev server

```bash
npm run dev
```

Ứng dụng chạy tại: `http://localhost:5173`

### Build production

```bash
npm run build
# Output: dist/
```

### Preview bản build

```bash
npm run preview
```

### Kiểm tra lỗi ESLint

```bash
npm run lint
```

---

## ⚙️ Biến môi trường

Tạo file `.env` trong thư mục `frontend/`:

```env
# URL của backend API (phải có /api ở cuối)
VITE_API_URL=http://localhost:5001/api
```

> Biến Vite phải bắt đầu bằng `VITE_` mới được expose ra client-side.

---

## 🗺️ Trang & Routes

### 🌍 Trang công khai (không cần đăng nhập)

| Route                   | Trang              | Mô tả                                              |
| ----------------------- | ------------------ | -------------------------------------------------- |
| `/`                     | Trang chủ          | Banner hero, sản phẩm nổi bật, featured categories |
| `/shop`                 | Cửa hàng           | Danh sách sản phẩm, filter theo danh mục, tìm kiếm |
| `/bestseller`           | Bán chạy           | Top sản phẩm bán chạy nhất                         |
| `/product/:id`          | Chi tiết           | Ảnh, mô tả, chọn size, thêm giỏ hàng, reviews      |
| `/about`                | Giới thiệu         | Thông tin về cửa hàng                              |
| `/contact`              | Liên hệ            | Form gửi tin nhắn                                  |
| `/login`                | Đăng nhập          | Form đăng nhập bằng email + password               |
| `/register`             | Đăng ký            | Form tạo tài khoản mới                             |
| `/cart`                 | Giỏ hàng           | Xem và chỉnh sửa giỏ hàng                          |
| `/payment/vnpay-return` | Kết quả thanh toán | Xử lý callback từ VNPay                            |
| `*`                     | 404 Not Found      | Trang lỗi khi không tìm thấy route                 |

### 🔒 Trang cần đăng nhập (`ProtectedRoute`)

| Route      | Trang         | Mô tả                                                     |
| ---------- | ------------- | --------------------------------------------------------- |
| `/order`   | Đặt hàng      | Nhập địa chỉ, chọn PTTT (COD / VNPay), xác nhận đơn       |
| `/profile` | Trang cá nhân | Xem & chỉnh sửa thông tin, đổi mật khẩu, lịch sử đơn hàng |

### 👑 Khu vực Admin (`AdminRoute` – chỉ role `admin`)

| Route                     | Trang               | Mô tả                                                |
| ------------------------- | ------------------- | ---------------------------------------------------- |
| `/admin/dashboard`        | Dashboard           | Tổng doanh thu, users mới, đơn hàng, biểu đồ 6 tháng |
| `/admin/users`            | Quản lý Users       | Danh sách, tìm kiếm, đổi role, xóa user              |
| `/admin/products`         | Quản lý Sản phẩm    | CRUD sản phẩm, upload ảnh, cập nhật tồn kho          |
| `/admin/categories`       | Quản lý Danh mục    | CRUD danh mục sản phẩm                               |
| `/admin/orders`           | Quản lý Đơn hàng    | Danh sách, lọc theo trạng thái, cập nhật trạng thái  |
| `/admin/reports`          | Báo cáo & Phân tích | Doanh thu theo tháng/năm, biểu đồ trực quan          |
| `/admin/ai-behavior-logs` | Nhật ký AI          | Xem hành vi chatbot, gợi ý, lịch sử tương tác AI     |
| `/admin/contacts`         | Tin nhắn liên hệ    | Quản lý, đánh dấu đọc, xóa tin nhắn khách hàng       |

### 💼 Khu vực Manager (`ManagerRoute` – chỉ role `manager`)

| Route                 | Trang            | Mô tả                               |
| --------------------- | ---------------- | ----------------------------------- |
| `/manager/dashboard`  | Dashboard        | Tổng quan Manager                   |
| `/manager/orders`     | Quản lý Đơn hàng | Xem và cập nhật trạng thái đơn hàng |
| `/manager/products`   | Quản lý Sản phẩm | Thêm, sửa, xóa sản phẩm             |
| `/manager/categories` | Quản lý Danh mục | CRUD danh mục                       |
| `/manager/reports`    | Báo cáo          | Xem báo cáo doanh thu               |

### 👷 Khu vực Staff (`StaffRoute` – chỉ role `staff`)

| Route              | Trang          | Mô tả                                  |
| ------------------ | -------------- | -------------------------------------- |
| `/staff/dashboard` | Dashboard      | Tổng quan công việc Staff              |
| `/staff/orders`    | Xử lý Đơn hàng | Xác nhận, cập nhật trạng thái đơn hàng |
| `/staff/products`  | Sản phẩm       | Xem danh sách sản phẩm                 |
| `/staff/low-stock` | Sắp hết hàng   | Danh sách sản phẩm có số lượng thấp    |

---

## 🎞️ Context API

### AuthContext

Quản lý trạng thái xác thực toàn cục, được wrap tại `App.jsx`:

```jsx
const { user, isAuthenticated, loading, login, logout, register } = useAuth();
```

| Property/Method          | Kiểu           | Mô tả                                           |
| ------------------------ | -------------- | ----------------------------------------------- |
| `user`                   | Object \| null | Thông tin user (\_id, username, email, role...) |
| `isAuthenticated`        | Boolean        | User đã đăng nhập chưa                          |
| `loading`                | Boolean        | Đang kiểm tra token trong localStorage          |
| `login(email, password)` | Function       | Gọi API login, lưu token vào localStorage       |
| `logout()`               | Function       | Xóa token, reset state                          |
| `register(data)`         | Function       | Gọi API đăng ký                                 |

**Lưu trữ:** Token và user được lưu trong `localStorage` (`token`, `user`). Khi reload trang, AuthContext tự động khôi phục trạng thái.

### CartContext

Quản lý giỏ hàng toàn cục, đồng bộ với backend API:

```jsx
const {
  cartItems,
  cartCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = useCart();
```

| Property/Method                      | Mô tả                           |
| ------------------------------------ | ------------------------------- |
| `cartItems`                          | Danh sách sản phẩm trong giỏ    |
| `cartCount`                          | Tổng số lượng item              |
| `addToCart(product, size, quantity)` | Thêm sản phẩm vào giỏ (gọi API) |
| `removeFromCart(itemId)`             | Xóa item khỏi giỏ               |
| `updateQuantity(itemId, quantity)`   | Cập nhật số lượng               |
| `clearCart()`                        | Xóa toàn bộ giỏ hàng            |

---

## 🔌 Services / API Layer

Tất cả các lời gọi API được đóng gói trong `src/services/`:

### `axios.js`

- Tạo Axios instance với `baseURL = VITE_API_URL`
- **Request interceptor:** Tự động gắn `Authorization: Bearer <token>` vào mọi request
- **Response interceptor:** Xử lý lỗi 401 (tự động logout nếu token hết hạn)

### `api.js` – Các nhóm API

| Nhóm          | Đối tượng  | Các phương thức chính                                                                          |
| ------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `authAPI`     | Auth       | `login`, `register`, `getCurrentUser`, `updateProfile`, `changePassword`                       |
| `productAPI`  | Sản phẩm   | `getAll`, `getById`, `getBestSellers`, `getByCategory`, `search`, `create`, `update`, `delete` |
| `categoryAPI` | Danh mục   | `getAll`, `getById`, `create`, `update`, `delete`                                              |
| `cartAPI`     | Giỏ hàng   | `getCart`, `addItem`, `updateItem`, `removeItem`                                               |
| `orderAPI`    | Đơn hàng   | `create`, `getAll`, `getById`, `updateStatus`, `cancel`                                        |
| `vnpayAPI`    | Thanh toán | `createPayment`, `getReturnResult`                                                             |
| `reviewAPI`   | Đánh giá   | `getByProduct`, `create`, `update`, `delete`                                                   |
| `chatbotAPI`  | Chatbot    | `sendMessage`                                                                                  |
| `adminAPI`    | Admin      | `getStats`, `getUsers`, `updateUser`, `deleteUser`                                             |
| `contactAPI`  | Liên hệ    | `send`, `getAll`, `markRead`, `delete`                                                         |

---

## 🔐 Phân quyền & Protected Routes

Mỗi route được bảo vệ bằng một HOC (Higher-Order Component) kiểm tra role từ `AuthContext`:

| Component        | Điều kiện                  | Redirect khi thất bại |
| ---------------- | -------------------------- | --------------------- |
| `ProtectedRoute` | `isAuthenticated === true` | `/login`              |
| `AdminRoute`     | `user.role === 'admin'`    | `/`                   |
| `ManagerRoute`   | `user.role === 'manager'`  | `/`                   |
| `StaffRoute`     | `user.role === 'staff'`    | `/`                   |

**Luồng kiểm tra:**

```
Truy cập route bảo vệ
  → Đọc token từ localStorage
  → Kiểm tra isAuthenticated
     → Chưa đăng nhập  →  redirect /login
     → Đã đăng nhập  →  Kiểm tra role
        → Sai role  →  redirect /
        → Đúng role  →  Render component
```

---

## 🧩 Components

### `ChatbotWidget`

- Popup chat nổi trong góc màn hình (mọi trang)
- Gửi tin nhắn tới `/api/chatbot`, nhận phản hồi từ Gemini AI
- Hiển thị có context sản phẩm liên quan
- Chỉ hoạt động khi đã đăng nhập

### `Header / Navbar`

- Hiển thị menu điều hướng chính
- Badge số lượng giỏ hàng real-time (từ CartContext)
- Dropdown thông tin user / nút đăng nhập
- Responsive: menu hamburger trên mobile

### `Cart`

- Sidebar trượt (slide-in)
- Hiển thị danh sách sản phẩm, tổng tiền
- Tăng/giảm số lượng, xóa sản phẩm
- Nút "Đặt hàng" chuyển sang `/order`

### `ProductCard`

- Hiển thị ảnh, tên, giá, rating
- Hiệu ứng 3D tilt (react-vanilla-tilt)
- Nút quick-view mở `QuickViewModal`
- Nút thêm vào giỏ hàng

### `Pagination`

- Component phân trang tái sử dụng
- Nhận props: `currentPage`, `totalPages`, `onPageChange`

### Dashboard Charts (Admin/Manager)

- Sử dụng `Chart.js` + `react-chartjs-2`
- Biểu đồ đường (Line): doanh thu 6 tháng gần nhất
- Biểu đồ tròn (Doughnut): tỉ lệ đơn hàng theo trạng thái
- Thống kê: tổng doanh thu, tổng đơn, users mới, tổng sản phẩm

---

## ✨ Tính năng nổi bật

### 🛒 Mua sắm

- Duyệt sản phẩm theo danh mục, tìm kiếm theo từ khóa
- Xem chi tiết sản phẩm: gallery ảnh, chọn size, xem reviews
- Quick view sản phẩm ngay trên trang danh sách

### 🛍️ Giỏ hàng

- Thêm sản phẩm có chọn size và số lượng
- Cập nhật real-time qua CartContext
- Đồng bộ giỏ hàng với server (giữ khi refresh trang)

### 📦 Đặt hàng

- Nhập địa chỉ giao hàng đầy đủ (họ tên, SĐT, địa chỉ, quận/huyện, tỉnh/TP)
- Chọn phương thức thanh toán: **COD** hoặc **VNPay**
- Xem lại đơn hàng trước khi xác nhận

### 💳 Thanh toán VNPay

- Redirect tới cổng VNPay để thanh toán
- Trang `VnpayReturn` xử lý kết quả và hiển thị thông báo thành công/thất bại

### 🤖 Chatbot AI

- Widget bám góc màn hình, mở bằng nút chat
- Hỗ trợ hỏi đáp về sản phẩm, tư vấn mua hàng bằng tiếng Việt
- Gemini AI trả lời dựa trên dữ liệu sản phẩm thực tế

### 📊 Dashboard Quản trị

- **Admin:** Toàn bộ thống kê, biểu đồ doanh thu, quản lý users/sản phẩm/đơn hàng/danh mục
- **Manager:** Quản lý sản phẩm & đơn hàng, xem báo cáo
- **Staff:** Xử lý đơn hàng, kiểm tra tồn kho thấp

### 🔔 Toast Notification

- Sử dụng `sonner` cho tất cả thông báo (thêm giỏ, đặt hàng, lỗi...)
- Hiển thị ở góc màn hình, tự ẩn sau vài giây

### 📱 Responsive Design

- Thiết kế tương thích mọi thiết bị với Tailwind CSS v4
- Mobile-first approach

---

## 🔗 Kết nối với Backend

| Frontend                  | Backend                                               |
| ------------------------- | ----------------------------------------------------- |
| `AuthContext.login()`     | `POST /api/users/login`                               |
| `CartContext.addToCart()` | `POST /api/cart-items`                                |
| Trang Order               | `POST /api/orders` + `POST /api/vnpay/create-payment` |
| `VnpayReturn`             | Đọc query params từ VNPay redirect                    |
| Admin Dashboard           | `GET /api/stats`                                      |
| Admin Reports             | `GET /api/reports`                                    |
| ChatbotWidget             | `POST /api/chatbot`                                   |

Axios instance ở `src/services/axios.js` tự động:

- Gắn `Authorization: Bearer <token>` vào mọi request
- Xử lý lỗi `401` bằng cách gọi `logout()` và redirect `/login`
