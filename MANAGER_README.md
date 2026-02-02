# Manager Dashboard - Hướng dẫn sử dụng

## Tổng quan

Manager Dashboard là một hệ thống quản lý riêng biệt, hoàn toàn độc lập với Admin. Manager có quyền quản lý đơn hàng và sản phẩm mà không cần quyền Admin.

## Cài đặt

### 1. Tạo role Manager trong database

Chạy script seed để tạo role manager:

```bash
cd backend
node src/scripts/seedManager.js
```

### 2. Gán role Manager cho user

#### Cách 1: Qua Admin Dashboard

1. Đăng nhập với quyền Admin
2. Vào User Management
3. Chọn user cần gán role
4. Thêm role "manager"

#### Cách 2: Trực tiếp trong database

```javascript
// Trong MongoDB, cập nhật user
db.users.updateOne(
  { email: "manager@example.com" },
  { $set: { role: "manager" } },
);
```

## Tính năng Manager Dashboard

### 1. Dashboard - Trang tổng quan

- **URL**: `/manager/dashboard`
- **Chức năng**:
  - Xem tổng doanh thu
  - Thống kê đơn hàng mới (30 ngày)
  - Tổng số đơn hàng
  - Đơn hàng chờ xử lý
  - Biểu đồ doanh thu 6 tháng
  - Biểu đồ thống kê đơn hàng theo trạng thái
  - Top 5 sản phẩm bán chạy
  - Danh sách đơn hàng gần đây

### 2. Quản lý đơn hàng

- **URL**: `/manager/orders`
- **Chức năng**:
  - Xem danh sách tất cả đơn hàng
  - Lọc đơn hàng theo trạng thái
  - Phân trang
  - Xem chi tiết từng đơn hàng

### 3. Quản lý sản phẩm

- **URL**: `/manager/products`
- **Chức năng**:
  - Xem danh sách sản phẩm
  - Tìm kiếm sản phẩm
  - Xem thông tin tồn kho
  - Phân trang

## Backend API cho Manager

### Các endpoints:

- `GET /api/manager/stats` - Lấy thống kê dashboard
- `GET /api/manager/orders` - Lấy danh sách đơn hàng
- `GET /api/manager/products` - Lấy danh sách sản phẩm

### Middleware bảo mật:

- `authenticateToken` - Kiểm tra token hợp lệ
- `requireManager` - Chỉ cho phép user có role "manager"

## Phân quyền

### Manager role:

- ✅ Xem dashboard riêng
- ✅ Quản lý đơn hàng (xem, lọc)
- ✅ Quản lý sản phẩm (xem, tìm kiếm)
- ❌ KHÔNG có quyền Admin
- ❌ KHÔNG thể truy cập `/admin/*` routes
- ❌ KHÔNG thể tạo/xóa user
- ❌ KHÔNG thể quản lý roles/permissions

### Admin role:

- ✅ Tất cả quyền của Manager
- ✅ Quản lý users
- ✅ Quản lý roles & permissions
- ✅ Quản lý categories
- ✅ Xem reports & analytics

## Giao diện

### Màu sắc chủ đạo:

- Manager Dashboard: **Teal/Xanh lam** (`bg-teal-600`)
- Admin Dashboard: **Indigo/Xanh đậm** (`bg-indigo-900`)

### Layout:

- Sidebar bên trái với menu điều hướng
- Top bar hiển thị tên user và role badge
- Main content area với cards, charts, và tables
- Responsive design cho mobile

## Testing

### Tạo user test với role manager:

```bash
# 1. Đăng ký user mới
POST /api/users/register
{
  "username": "manager_test",
  "email": "manager@test.com",
  "password": "Manager123!",
  "phone": "0123456789"
}

# 2. Cập nhật role thành manager (cần admin)
# Hoặc trực tiếp trong database
```

### Kiểm tra quyền truy cập:

1. Đăng nhập với user manager
2. Truy cập `/manager/dashboard` - ✅ Thành công
3. Truy cập `/admin/dashboard` - ❌ Bị chuyển về trang chủ

## Troubleshooting

### Lỗi "Manager access required"

- Kiểm tra user có role "manager" chưa
- Kiểm tra token có hợp lệ không
- Xem log backend để debug

### Dashboard không load được data

- Kiểm tra backend đã chạy chưa
- Kiểm tra API endpoint có hoạt động không
- Xem console browser để debug

### Không thể truy cập manager routes

- Kiểm tra ManagerRoute component
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra role trong localStorage

## Development

### Thêm tính năng mới:

1. Tạo controller trong `backend/src/controllers/managerControllers.js`
2. Thêm route trong `backend/src/routes/managerRoutes.js`
3. Tạo component trong `frontend/pages/manager/`
4. Thêm route trong `frontend/src/App.jsx`

### Best practices:

- Luôn sử dụng middleware `requireManager` cho manager routes
- Không dùng chung API với admin
- Giữ UI riêng biệt với admin (màu sắc, icon)
- Test kỹ phân quyền

## Support

Nếu có vấn đề, liên hệ team dev hoặc tạo issue trên repo.
