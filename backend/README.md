# 🛒 E-Commerce Backend

RESTful API server cho ứng dụng thương mại điện tử, xây dựng bằng **Node.js**, **Express** và **MongoDB**.

> Hỗ trợ đầy đủ: xác thực JWT, phân quyền RBAC, thanh toán VNPay, chatbot AI (Google Gemini), gợi ý sản phẩm cá nhân hóa, gửi email tự động và lập lịch cron job.

---

## 📋 Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Xác thực & Middleware](#xác-thực--middleware)
- [Phân quyền RBAC](#phân-quyền-rbac)
- [Tích hợp thanh toán VNPay](#tích-hợp-thanh-toán-vnpay)
- [AI & Chatbot](#ai--chatbot)
- [Email](#email)
- [Cron Jobs](#cron-jobs)
- [Seed dữ liệu](#seed-dữ-liệu)
- [Swagger Docs](#swagger-docs)
- [Xử lý lỗi](#xử-lý-lỗi)

---

## 🔧 Công nghệ sử dụng

| Package              | Mô tả                                |
| -------------------- | ------------------------------------ |
| `express`            | Web framework                        |
| `mongoose`           | ODM cho MongoDB                      |
| `jsonwebtoken`       | Xác thực JWT                         |
| `bcryptjs`           | Hash mật khẩu                        |
| `dotenv`             | Quản lý biến môi trường              |
| `cors`               | Xử lý Cross-Origin                   |
| `nodemailer`         | Gửi email                            |
| `vnpay`              | Tích hợp cổng thanh toán VNPay       |
| `@google/genai`      | Google AI – Chatbot & gợi ý sản phẩm |
| `node-cron`          | Lập lịch công việc tự động           |
| `swagger-ui-express` | Tài liệu API tương tác               |
| `nodemon`            | Auto-restart khi dev                 |

---

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── server.js                          # Entry point: khởi tạo Express, đăng ký routes, cron job
│   ├── config/
│   │   ├── db.js                          # Kết nối MongoDB với Mongoose
│   │   ├── email.js                       # Cấu hình Nodemailer, template email
│   │   └── swagger.js                     # Cấu hình Swagger/OpenAPI
│   ├── controllers/
│   │   ├── authControllers.js             # Đăng ký, đăng nhập, lấy profile, đổi mật khẩu
│   │   ├── productControllers.js          # CRUD sản phẩm, best-sellers, tìm kiếm
│   │   ├── categoryControllers.js         # CRUD danh mục
│   │   ├── reviewControllers.js           # CRUD đánh giá sản phẩm
│   │   ├── cartControllers.js             # Quản lý giỏ hàng
│   │   ├── cartItemControllers.js         # CRUD item trong giỏ hàng
│   │   ├── orderControllers.js            # Tạo, xem, cập nhật đơn hàng
│   │   ├── orderItemControllers.js        # Chi tiết item trong đơn hàng
│   │   ├── paymentControllers.js          # Quản lý thanh toán
│   │   ├── vnpayControllers.js            # Tạo URL, xử lý Return URL & IPN VNPay
│   │   ├── chatbotControllers.js          # Chat với Gemini AI, trích xuất từ khóa
│   │   ├── chatbotLogControllers.js       # Lịch sử chat
│   │   ├── aiRecommendationControllers.js # Gợi ý sản phẩm cá nhân hóa
│   │   ├── aiBehaviorLogControllers.js    # Nhật ký hành vi AI
│   │   ├── statsControllers.js            # Thống kê dashboard (doanh thu, đơn hàng...)
│   │   ├── reportControllers.js           # Báo cáo doanh thu theo thời gian
│   │   ├── contactControllers.js          # Gửi & quản lý tin nhắn liên hệ
│   │   ├── userControllers.js             # CRUD người dùng (Admin)
│   │   ├── adminControllers.js            # Các thao tác đặc quyền Admin
│   │   ├── managerControllers.js          # Các thao tác đặc quyền Manager
│   │   ├── staffControllers.js            # Các thao tác đặc quyền Staff
│   │   ├── roleControllers.js             # CRUD role
│   │   ├── permissionControllers.js       # CRUD permission
│   │   └── userRoleControllers.js         # Gán/xóa role cho user
│   ├── middleware/
│   │   ├── authMiddleware.js              # Xác thực JWT token
│   │   ├── roleMiddleware.js              # Kiểm tra role: requireAdmin/Manager/Staff/Permission
│   │   └── dbCheckMiddleware.js           # Kiểm tra kết nối DB trước khi xử lý request
│   ├── models/
│   │   ├── User.js                        # Schema người dùng
│   │   ├── Product.js                     # Schema sản phẩm
│   │   ├── Category.js                    # Schema danh mục
│   │   ├── Review.js                      # Schema đánh giá
│   │   ├── Cart.js                        # Schema giỏ hàng
│   │   ├── CartItem.js                    # Schema item giỏ hàng
│   │   ├── Order.js                       # Schema đơn hàng
│   │   ├── OrderItem.js                   # Schema item đơn hàng
│   │   ├── Payment.js                     # Schema thanh toán
│   │   ├── Role.js                        # Schema role
│   │   ├── Permission.js                  # Schema permission
│   │   ├── ChatbotLog.js                  # Schema lịch sử chat
│   │   ├── AIBehaviorLog.js               # Schema nhật ký hành vi AI
│   │   ├── AIRecommendation.js            # Schema gợi ý sản phẩm AI
│   │   └── Contact.js                     # Schema liên hệ
│   ├── routes/
│   │   ├── authRoutes.js                  # /api/users, /api/register, /api/login
│   │   ├── productsRoutes.js              # /api/products
│   │   ├── categoryRoutes.js              # /api/categories
│   │   ├── reviewRoutes.js                # /api/reviews
│   │   ├── cartRoutes.js                  # /api/carts
│   │   ├── cartItemRoutes.js              # /api/cart-items
│   │   ├── orderRoutes.js                 # /api/orders
│   │   ├── orderItemRoutes.js             # /api/order-items
│   │   ├── paymentRoutes.js               # /api/payments
│   │   ├── vnpayRoutes.js                 # /api/vnpay
│   │   ├── chatbotRoutes.js               # /api/chatbot
│   │   ├── chatbotLogRoutes.js            # /api/chatbot-logs
│   │   ├── aiRecommendationRoutes.js      # /api/recommendations
│   │   ├── aiBehaviorLogRoutes.js         # /api/ai-behavior-logs
│   │   ├── statsRoutes.js                 # /api/stats
│   │   ├── reportRoutes.js                # /api/reports
│   │   ├── contactRoutes.js               # /api/contacts
│   │   ├── adminRoutes.js                 # /api/admin
│   │   ├── managerRoutes.js               # /api/manager
│   │   ├── staffRoutes.js                 # /api/staff
│   │   ├── userRoutes.js                  # /api/users (Admin CRUD)
│   │   ├── rolesRoutes.js                 # /api/roles
│   │   ├── permissionsRoutes.js           # /api/permissions
│   │   └── userRoleRoutes.js              # /api/users (gán role)
│   ├── services/
│   │   ├── aiBehavior.js                  # Ghi nhật ký hành vi AI
│   │   └── gemini.js                      # Giao tiếp với Google Gemini API
│   └── scripts/
│       ├── seedAdmin.js                   # Tạo admin, roles và permissions mặc định
│       ├── seedManager.js                 # Tạo tài khoản Manager mẫu
│       └── seedStaff.js                   # Tạo tài khoản Staff mẫu
├── .env                                   # Biến môi trường (không commit)
└── package.json
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- Node.js >= 18
- npm >= 9
- MongoDB >= 6 (local hoặc MongoDB Atlas)

### Bước 1 – Clone & cài dependencies

```bash
cd backend
npm install
```

### Bước 2 – Tạo file `.env`

Sao chép cấu hình từ mục [Biến môi trường](#biến-môi-trường) bên dưới.

### Bước 3 – Seed dữ liệu ban đầu

```bash
# Tạo tài khoản Admin + Roles + Permissions mặc định
npm run seed:admin

# (Tuỳ chọn) Tạo tài khoản Manager
node src/scripts/seedManager.js

# (Tuỳ chọn) Tạo tài khoản Staff
node src/scripts/seedStaff.js
```

### Bước 4 – Chạy server

```bash
# Môi trường development (auto-restart với nodemon)
npm run dev

# Môi trường production
npm start
```

Server khởi động tại: `http://localhost:5001`  
Swagger UI: `http://localhost:5001/swagger`

---

## ⚙️ Biến môi trường

Tạo file `.env` trong thư mục `backend/`:

```env
# ──────────────────────────────────────
# SERVER
# ──────────────────────────────────────
PORT=5001
NODE_ENV=development

# ──────────────────────────────────────
# DATABASE
# ──────────────────────────────────────
# Kết nối MongoDB local
MONGODB_CONNECTIONSTRING=mongodb://localhost:27017/productmanager
# Hoặc MongoDB Atlas:
# MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/productmanager

# ──────────────────────────────────────
# AUTHENTICATION
# ──────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
# Token hết hạn sau 7 ngày (mặc định, cấu hình trong authControllers.js)

# ──────────────────────────────────────
# CORS
# ──────────────────────────────────────
# Các origin được phép, phân cách bằng dấu phẩy
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
# Cho phép tất cả origin (không dùng trong production):
# CORS_ORIGINS=*

# ──────────────────────────────────────
# EMAIL (Nodemailer + Gmail)
# ──────────────────────────────────────
EMAIL_USER=your_email@gmail.com
# Dùng App Password của Google (bật 2FA trước)
EMAIL_PASS=your_google_app_password

# ──────────────────────────────────────
# VNPAY
# ──────────────────────────────────────
VNPAY_TMN_CODE=your_tmn_code
VNPAY_SECURE_SECRET=your_secure_secret
# Sandbox:
VNPAY_HOST=https://sandbox.vnpayment.vn
# Production:
# VNPAY_HOST=https://pay.vnpay.vn
VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay-return
VNPAY_TEST_MODE=true
VNPAY_HASH_ALGORITHM=SHA512
VNPAY_ENABLE_LOG=false

# ──────────────────────────────────────
# GOOGLE AI (GEMINI)
# ──────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key
# Lấy tại: https://aistudio.google.com/app/apikey

# ──────────────────────────────────────
# SEED SCRIPTS (tuỳ chọn)
# ──────────────────────────────────────
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_USERNAME=admin
```

> ⚠️ **Lưu ý bảo mật:** Không commit file `.env` lên git. Thêm vào `.gitignore`.

---

## �️ Database Models

Tất cả model được định nghĩa bằng **Mongoose Schema**:

### User

| Trường     | Kiểu       | Mô tả                                     |
| ---------- | ---------- | ----------------------------------------- |
| `username` | String     | Tên đăng nhập (unique, 3-30 ký tự)        |
| `name`     | String     | Họ tên hiển thị                           |
| `email`    | String     | Email (unique, lowercase)                 |
| `password` | String     | Mật khẩu (bcrypt hash, min 6 ký tự)       |
| `phone`    | String     | Số điện thoại                             |
| `address`  | String     | Địa chỉ                                   |
| `role`     | String     | `user` \| `admin` \| `manager` \| `staff` |
| `roles`    | ObjectId[] | Tham chiếu đến Role (RBAC nâng cao)       |

### Product

| Trường          | Kiểu     | Mô tả                                |
| --------------- | -------- | ------------------------------------ |
| `name`          | String   | Tên sản phẩm (required, 2-100 ký tự) |
| `description`   | String   | Mô tả chi tiết                       |
| `price`         | Number   | Giá (>= 0)                           |
| `stock`         | Number   | Số lượng tồn kho (>= 0)              |
| `images`        | String[] | Mảng URL ảnh                         |
| `size`          | String[] | Các kích thước (S, M, L, XL...)      |
| `averageRating` | Number   | Điểm đánh giá trung bình (0-5)       |
| `category`      | ObjectId | Tham chiếu danh mục                  |

### Order

| Trường            | Kiểu     | Mô tả                                                                     |
| ----------------- | -------- | ------------------------------------------------------------------------- |
| `user`            | ObjectId | Tham chiếu User                                                           |
| `email`           | String   | Email nhận xác nhận                                                       |
| `shippingAddress` | Object   | `firstName`, `lastName`, `phone`, `address`, `district`, `city`           |
| `paymentMethod`   | String   | `cod` \| `vnpay`                                                          |
| `shippingFee`     | Number   | Phí vận chuyển                                                            |
| `totalAmount`     | Number   | Tổng tiền                                                                 |
| `status`          | String   | `pending` → `paid` → `shipping` → `delivered` → `completed` / `cancelled` |

### Payment

| Trường            | Kiểu     | Mô tả                           |
| ----------------- | -------- | ------------------------------- |
| `order`           | ObjectId | Tham chiếu Order (unique)       |
| `paymentMethod`   | String   | Phương thức thanh toán          |
| `paymentStatus`   | String   | Trạng thái thanh toán           |
| `transactionCode` | String   | Mã giao dịch VNPay              |
| `paidAt`          | Date     | Thời điểm thanh toán thành công |

### CartItem

| Trường     | Kiểu     | Mô tả                          |
| ---------- | -------- | ------------------------------ |
| `cart`     | ObjectId | Tham chiếu Cart                |
| `product`  | ObjectId | Tham chiếu Product             |
| `quantity` | Number   | Số lượng (>= 1)                |
| `price`    | Number   | Giá tại thời điểm thêm vào giỏ |
| `size`     | String   | Kích thước được chọn           |

### Review

| Trường    | Kiểu     | Mô tả               |
| --------- | -------- | ------------------- |
| `user`    | ObjectId | Tham chiếu User     |
| `product` | ObjectId | Tham chiếu Product  |
| `rating`  | Number   | Điểm đánh giá (1-5) |
| `comment` | String   | Nội dung nhận xét   |

### Role & Permission (RBAC)

| Model        | Trường quan trọng                                            |
| ------------ | ------------------------------------------------------------ |
| `Role`       | `name` (unique), `description`, `permissions[]` → ObjectId[] |
| `Permission` | `key` (unique, vd: `manage_products`), `description`         |

### AIBehaviorLog

| Trường       | Kiểu       | Mô tả                                    |
| ------------ | ---------- | ---------------------------------------- |
| `user`       | ObjectId   | Người dùng thực hiện                     |
| `flow`       | String     | `chatbot` \| `recommendation` \| `other` |
| `action`     | String     | Hành động cụ thể                         |
| `message`    | String     | Nội dung tin nhắn                        |
| `productIds` | ObjectId[] | Sản phẩm liên quan                       |
| `metadata`   | Mixed      | Dữ liệu bổ sung                          |

### Contact

| Trường    | Kiểu    | Mô tả                        |
| --------- | ------- | ---------------------------- |
| `name`    | String  | Tên người gửi                |
| `email`   | String  | Email người gửi              |
| `phone`   | String  | Số điện thoại                |
| `subject` | String  | Chủ đề                       |
| `message` | String  | Nội dung                     |
| `isRead`  | Boolean | Đã đọc chưa (default: false) |

---

## �📡 API Endpoints

### 🔑 Auth (`/api/users`, `/api`)

| Method | Endpoint                     | Mô tả                                      | Auth |
| ------ | ---------------------------- | ------------------------------------------ | ---- |
| POST   | `/api/register`              | Đăng ký tài khoản mới, gửi email chào mừng | ❌   |
| POST   | `/api/login`                 | Đăng nhập, trả về JWT token (7 ngày)       | ❌   |
| GET    | `/api/me`                    | Lấy thông tin user đang đăng nhập          | ✅   |
| PUT    | `/api/users/me`              | Cập nhật thông tin cá nhân                 | ✅   |
| PUT    | `/api/users/change-password` | Đổi mật khẩu                               | ✅   |

### 🛍️ Sản phẩm (`/api/products`)

| Method | Endpoint                     | Mô tả                                      | Auth             |
| ------ | ---------------------------- | ------------------------------------------ | ---------------- |
| GET    | `/api/products`              | Lấy tất cả sản phẩm (có populate category) | ❌               |
| GET    | `/api/products/:id`          | Chi tiết sản phẩm                          | ❌               |
| GET    | `/api/products/best-sellers` | Top sản phẩm bán chạy                      | ❌               |
| GET    | `/api/products/search?q=`    | Tìm kiếm sản phẩm theo từ khóa             | ❌               |
| GET    | `/api/products/category/:id` | Sản phẩm theo danh mục                     | ❌               |
| POST   | `/api/products`              | Tạo sản phẩm mới                           | ✅ Admin/Manager |
| PUT    | `/api/products/:id`          | Cập nhật toàn bộ sản phẩm                  | ✅ Admin/Manager |
| PATCH  | `/api/products/:id`          | Cập nhật một phần sản phẩm                 | ✅ Admin/Manager |
| DELETE | `/api/products/:id`          | Xóa sản phẩm                               | ✅ Admin         |

### 📂 Danh mục (`/api/categories`)

| Method | Endpoint              | Mô tả                     | Auth             |
| ------ | --------------------- | ------------------------- | ---------------- |
| GET    | `/api/categories`     | Danh sách tất cả danh mục | ❌               |
| GET    | `/api/categories/:id` | Chi tiết danh mục         | ❌               |
| POST   | `/api/categories`     | Tạo danh mục mới          | ✅ Admin/Manager |
| PUT    | `/api/categories/:id` | Cập nhật danh mục         | ✅ Admin/Manager |
| DELETE | `/api/categories/:id` | Xóa danh mục              | ✅ Admin         |

### ⭐ Đánh giá (`/api/reviews`)

| Method | Endpoint                          | Mô tả                                | Auth                  |
| ------ | --------------------------------- | ------------------------------------ | --------------------- |
| GET    | `/api/reviews/product/:productId` | Tất cả đánh giá của một sản phẩm     | ❌                    |
| POST   | `/api/reviews`                    | Tạo đánh giá mới (1-5 sao + comment) | ✅                    |
| PUT    | `/api/reviews/:id`                | Cập nhật đánh giá                    | ✅ (chủ sở hữu)       |
| DELETE | `/api/reviews/:id`                | Xóa đánh giá                         | ✅ (chủ sở hữu/Admin) |

### 🛒 Giỏ hàng (`/api/carts`, `/api/cart-items`)

| Method | Endpoint              | Mô tả                                          | Auth |
| ------ | --------------------- | ---------------------------------------------- | ---- |
| GET    | `/api/carts`          | Lấy giỏ hàng của user hiện tại                 | ✅   |
| POST   | `/api/carts`          | Tạo giỏ hàng mới                               | ✅   |
| GET    | `/api/cart-items`     | Lấy tất cả item trong giỏ                      | ✅   |
| POST   | `/api/cart-items`     | Thêm sản phẩm vào giỏ (có chọn size, số lượng) | ✅   |
| PUT    | `/api/cart-items/:id` | Cập nhật số lượng / size                       | ✅   |
| DELETE | `/api/cart-items/:id` | Xóa item khỏi giỏ hàng                         | ✅   |

### 📦 Đơn hàng (`/api/orders`, `/api/order-items`)

| Method | Endpoint                          | Mô tả                                                | Auth                   |
| ------ | --------------------------------- | ---------------------------------------------------- | ---------------------- |
| GET    | `/api/orders`                     | Lấy tất cả đơn hàng (Admin: toàn bộ, User: của mình) | ✅                     |
| GET    | `/api/orders/:id`                 | Chi tiết đơn hàng + danh sách sản phẩm               | ✅                     |
| POST   | `/api/orders`                     | Tạo đơn hàng mới (tự tính tổng tiền)                 | ✅                     |
| PATCH  | `/api/orders/:id/status`          | Cập nhật trạng thái đơn hàng                         | ✅ Admin/Manager/Staff |
| DELETE | `/api/orders/:id`                 | Hủy đơn hàng                                         | ✅                     |
| GET    | `/api/order-items`                | Lấy tất cả order items                               | ✅ + `manage_orders`   |
| GET    | `/api/order-items/order/:orderId` | Items của một đơn hàng                               | ✅ + `manage_orders`   |

### 💳 Thanh toán VNPay (`/api/vnpay`)

| Method | Endpoint                    | Mô tả                                             | Auth |
| ------ | --------------------------- | ------------------------------------------------- | ---- |
| POST   | `/api/vnpay/create-payment` | Tạo URL thanh toán VNPay cho đơn hàng             | ✅   |
| GET    | `/api/vnpay/vnpay-return`   | Xử lý Return URL sau khi user hoàn tất thanh toán | ❌   |
| GET    | `/api/vnpay/vnpay-ipn`      | IPN: VNPay gọi server để xác nhận giao dịch       | ❌   |

> Khi thanh toán thành công: cập nhật `Order.status = 'paid'`, tạo bản ghi `Payment`, xóa giỏ hàng, gửi email xác nhận.

### 💰 Payment (`/api/payments`)

| Method | Endpoint            | Mô tả                | Auth     |
| ------ | ------------------- | -------------------- | -------- |
| GET    | `/api/payments`     | Lấy tất cả giao dịch | ✅ Admin |
| GET    | `/api/payments/:id` | Chi tiết giao dịch   | ✅ Admin |

### 🤖 Chatbot AI (`/api/chatbot`)

| Method | Endpoint                    | Mô tả                                                          | Auth     |
| ------ | --------------------------- | -------------------------------------------------------------- | -------- |
| POST   | `/api/chatbot`              | Gửi tin nhắn, nhận phản hồi từ Gemini AI (có context sản phẩm) | ✅       |
| GET    | `/api/chatbot-logs`         | Lịch sử cuộc trò chuyện của tất cả users                       | ✅ Admin |
| GET    | `/api/chatbot-logs/:userId` | Lịch sử chat của một user cụ thể                               | ✅ Admin |

### 🎯 Gợi ý sản phẩm AI (`/api/recommendations`)

| Method | Endpoint               | Mô tả                                        | Auth |
| ------ | ---------------------- | -------------------------------------------- | ---- |
| GET    | `/api/recommendations` | Gợi ý sản phẩm cá nhân hóa dựa trên lịch sử  | ✅   |
| POST   | `/api/recommendations` | Lưu/cập nhật điểm gợi ý sản phẩm (score 0-1) | ✅   |

### 📊 Nhật ký AI (`/api/ai-behavior-logs`)

| Method | Endpoint                | Mô tả                                             | Auth |
| ------ | ----------------------- | ------------------------------------------------- | ---- |
| GET    | `/api/ai-behavior-logs` | Lấy nhật ký hành vi AI (có filter theo user/flow) | ✅   |
| POST   | `/api/ai-behavior-logs` | Ghi nhật ký hành vi mới                           | ✅   |

### 📈 Thống kê & Báo cáo

| Method | Endpoint       | Mô tả                                                                             | Auth     |
| ------ | -------------- | --------------------------------------------------------------------------------- | -------- |
| GET    | `/api/stats`   | Dashboard: doanh thu, users mới, đơn hàng, doanh thu 6 tháng, đơn theo trạng thái | ✅ Admin |
| GET    | `/api/reports` | Báo cáo doanh thu theo khoảng thời gian tùy chỉnh                                 | ✅ Admin |

### 📬 Liên hệ (`/api/contacts`)

| Method | Endpoint                 | Mô tả                | Auth     |
| ------ | ------------------------ | -------------------- | -------- |
| POST   | `/api/contacts`          | Gửi tin nhắn liên hệ | ❌       |
| GET    | `/api/contacts`          | Lấy tất cả tin nhắn  | ✅ Admin |
| PATCH  | `/api/contacts/:id/read` | Đánh dấu đã đọc      | ✅ Admin |
| DELETE | `/api/contacts/:id`      | Xóa tin nhắn         | ✅ Admin |

### 👥 Quản lý User (Admin)

| Method | Endpoint                       | Mô tả                   | Auth     |
| ------ | ------------------------------ | ----------------------- | -------- |
| GET    | `/api/users`                   | Danh sách tất cả users  | ✅ Admin |
| GET    | `/api/users/:id`               | Chi tiết user           | ✅ Admin |
| PUT    | `/api/users/:id`               | Cập nhật thông tin user | ✅ Admin |
| DELETE | `/api/users/:id`               | Xóa user                | ✅ Admin |
| POST   | `/api/users/:id/roles`         | Gán role cho user       | ✅ Admin |
| DELETE | `/api/users/:id/roles/:roleId` | Xóa role khỏi user      | ✅ Admin |

### 🔑 Roles & Permissions (RBAC)

| Method | Endpoint           | Mô tả                 | Auth     |
| ------ | ------------------ | --------------------- | -------- |
| GET    | `/api/roles`       | Danh sách roles       | ✅ Admin |
| POST   | `/api/roles`       | Tạo role mới          | ✅ Admin |
| PUT    | `/api/roles/:id`   | Cập nhật role         | ✅ Admin |
| DELETE | `/api/roles/:id`   | Xóa role              | ✅ Admin |
| GET    | `/api/permissions` | Danh sách permissions | ✅ Admin |
| POST   | `/api/permissions` | Tạo permission mới    | ✅ Admin |

### 🏢 Admin / Manager / Staff Routes

| Prefix             | Mô tả                                  | Auth       |
| ------------------ | -------------------------------------- | ---------- |
| `/api/admin/...`   | Các thao tác quản trị hệ thống cấp cao | ✅ Admin   |
| `/api/manager/...` | Quản lý sản phẩm, đơn hàng, danh mục   | ✅ Manager |
| `/api/staff/...`   | Xử lý đơn hàng, kiểm tra tồn kho       | ✅ Staff   |

---

## � Xác thực & Middleware

### Luồng xác thực

```
Client  →  Header: Authorization: Bearer <JWT>  →  authMiddleware.js
           Verify token  →  Gắn req.userId  →  Controller
```

### Middleware stack

| Middleware               | File                   | Mô tả                                         |
| ------------------------ | ---------------------- | --------------------------------------------- |
| `authenticateToken`      | `authMiddleware.js`    | Xác thực JWT, gắn `req.userId` vào request    |
| `requireAdmin`           | `roleMiddleware.js`    | Kiểm tra `user.role === 'admin'`              |
| `requireManager`         | `roleMiddleware.js`    | Kiểm tra `user.role === 'manager'`            |
| `requireStaff`           | `roleMiddleware.js`    | Kiểm tra `user.role === 'staff'`              |
| `requireAdminOrManager`  | `roleMiddleware.js`    | Cho phép admin hoặc manager                   |
| `requirePermission(key)` | `roleMiddleware.js`    | Kiểm tra permission theo key (RBAC nâng cao)  |
| `dbCheckMiddleware`      | `dbCheckMiddleware.js` | Kiểm tra MongoDB đang kết nối trước khi xử lý |

### JWT

- **Thuật toán:** HS256
- **Thời hạn:** 7 ngày
- **Payload:** `{ userId: string }`
- **Header:** `Authorization: Bearer <token>`
- **Lỗi 401:** Token không có hoặc thiếu
- **Lỗi 403:** Token không hợp lệ / hết hạn / không đủ quyền

---

## 🔐 Phân quyền RBAC

Hệ thống hỗ trợ **2 lớp phân quyền**:

**Lớp 1 – Role cơ bản** (field `user.role`):

| Role        | Quyền hạn                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| **admin**   | Toàn quyền hệ thống: quản lý users, sản phẩm, đơn hàng, báo cáo, roles, permissions, thống kê, chatbot logs |
| **manager** | Quản lý sản phẩm, danh mục, đơn hàng, xem báo cáo                                                           |
| **staff**   | Xem & xử lý đơn hàng, kiểm tra tồn kho thấp                                                                 |
| **user**    | Mua hàng, giỏ hàng, đặt hàng, đánh giá sản phẩm                                                             |

**Lớp 2 – Permission động** (RBAC nâng cao):

| Permission Key    | Mô tả            | Gán mặc định cho |
| ----------------- | ---------------- | ---------------- |
| `manage_products` | Quản lý sản phẩm | Admin, Manager   |
| `manage_orders`   | Quản lý đơn hàng | Admin, Staff     |

---

## 💳 Tích hợp thanh toán VNPay

### Luồng thanh toán

```
1. Frontend gọi POST /api/vnpay/create-payment { orderId }
2. Backend tạo URL thanh toán VNPay → trả về cho client
3. Client redirect tới URL VNPay
4. User hoàn tất thanh toán trên trang VNPay
5. VNPay redirect về VNPAY_RETURN_URL (frontend)
6. VNPay đồng thời gọi IPN URL (backend) để xác nhận server-side
7. Backend xác minh checksum → cập nhật Order.status = 'paid'
   → Tạo Payment record → Xóa giỏ hàng → Gửi email xác nhận
```

### Cấu hình

| Biến                   | Mô tả                                   |
| ---------------------- | --------------------------------------- |
| `VNPAY_TMN_CODE`       | Mã merchant (lấy từ cổng VNPay)         |
| `VNPAY_SECURE_SECRET`  | Secret key để tạo checksum              |
| `VNPAY_HOST`           | Sandbox: `https://sandbox.vnpayment.vn` |
| `VNPAY_RETURN_URL`     | URL frontend nhận kết quả               |
| `VNPAY_TEST_MODE`      | `true` = sandbox, `false` = production  |
| `VNPAY_HASH_ALGORITHM` | Mặc định `SHA512`                       |

---

## 🤖 AI & Chatbot

### Chatbot (Google Gemini)

- Sử dụng **Google Gemini AI** (`@google/genai`) làm engine trả lời
- Trước khi gọi AI, backend:
  1. Trích xuất từ khóa từ tin nhắn người dùng (loại bỏ stop words tiếng Việt)
  2. Tìm kiếm sản phẩm phù hợp trong database
  3. Build context prompt có thông tin sản phẩm thực tế
  4. Gửi prompt + lịch sử hội thoại (tối đa 6 lượt) tới Gemini
- Ghi nhật ký: lưu `ChatbotLog` và `AIBehaviorLog` sau mỗi tương tác

### Gợi ý sản phẩm

- Lưu điểm gợi ý (`AIRecommendation.score` từ 0-1) cho từng cặp user-product
- Dựa trên lịch sử xem sản phẩm, hành vi mua hàng
- API trả về danh sách sản phẩm được sắp xếp theo điểm gợi ý

---

## 📧 Email

Sử dụng **Nodemailer** + Gmail SMTP:

| Sự kiện                          | Email được gửi                                |
| -------------------------------- | --------------------------------------------- |
| Đăng ký tài khoản mới            | Email chào mừng (Welcome Email) với tên user  |
| Đặt hàng + thanh toán thành công | Email xác nhận đơn hàng với chi tiết sản phẩm |

> **Lưu ý Gmail:** Phải bật 2FA và tạo **App Password** tại [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

---

## ⏰ Cron Jobs

Chạy tự động bằng `node-cron`, được đăng ký trong `server.js`:

| Lịch chạy | Cron Expression | Công việc                                                                               |
| --------- | --------------- | --------------------------------------------------------------------------------------- |
| Mỗi giờ   | `0 * * * *`     | Tìm đơn hàng trạng thái `delivered` đã quá **2 ngày** → tự động chuyển sang `completed` |

---

## 🌱 Seed dữ liệu

| Script           | Lệnh                              | Mô tả                                                                                            |
| ---------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `seedAdmin.js`   | `npm run seed:admin`              | Tạo user Admin + Role `admin`/`manager`/`staff` + Permissions `manage_products`, `manage_orders` |
| `seedManager.js` | `node src/scripts/seedManager.js` | Tạo user Manager mẫu                                                                             |
| `seedStaff.js`   | `node src/scripts/seedStaff.js`   | Tạo user Staff mẫu                                                                               |

Thông tin tài khoản Admin mặc định (có thể ghi đè qua `.env`):

```
Email:    admin@example.com
Password: Admin@123
Username: admin
```

---

## 📖 Swagger Docs

Sau khi server chạy, truy cập tài liệu API tương tác tại:

```
http://localhost:5001/swagger
```

Swagger tự động sinh từ cấu hình trong `src/config/swagger.js`.

---

## ❌ Xử lý lỗi

- **Global error handler** được đặt sau tất cả routes trong `server.js`
- Trả về JSON chuẩn: `{ success: false, message, error? }`
- **404 handler** cho các route không tồn tại
- Bắt `unhandledRejection` và `uncaughtException` ở process level

```json
// Ví dụ response lỗi
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

### HTTP Status codes

| Code  | Ý nghĩa                                      |
| ----- | -------------------------------------------- |
| `200` | Thành công                                   |
| `201` | Tạo mới thành công                           |
| `400` | Bad Request – thiếu hoặc sai dữ liệu đầu vào |
| `401` | Unauthorized – chưa đăng nhập                |
| `403` | Forbidden – không đủ quyền                   |
| `404` | Not Found – không tìm thấy tài nguyên        |
| `500` | Internal Server Error                        |
