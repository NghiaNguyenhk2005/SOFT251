**Cấu trúc thư mục chính (cập nhật 28/11/2025)**:
```
student-fe-js/
├── .gitignore
├── eslint.config.js
├── file_structure.md
├── index.html              # Entry HTML
├── package.json
├── package-lock.json
├── PROJECT_CONTEXT.md
├── README.md
├── vite.config.js
├── public/
│   └── vite.svg
├── src/
│   ├── main.jsx            # Mount app
│   ├── App.jsx             # Router chính (route `/student` và children)
│   ├── App.css
│   ├── index.css           # Import Tailwind (và custom css)
│   ├── assets/
│   │   └── react.svg
│   ├── modules/
│   │   └── student/
│   │       ├── components/
│   │       │   ├── Header.jsx
│   │       │   └── Sidebar.jsx
│   │       ├── layouts/
│   │       │   └── MainLayout.jsx
│   │       └── pages/
│   │           ├── CommunityPage.jsx         # Cộng đồng
│   │           ├── ConsultationRequestPage.jsx # Yêu cầu tư vấn
│   │           ├── DashboardPage.jsx         # Lịch của tôi
│   │           ├── EventsPage.jsx            # Seminar
│   │           ├── HistoryPage.jsx           # Lịch sử & Đánh giá
│   │           ├── LibraryPage.jsx           # Chia sẻ tài liệu
│   │           ├── MyConsultationsPage.jsx   # Lịch tư vấn của tôi
│   │           └── ProgramRegisterPage.jsx   # Đăng kí tutor
│   └── services/
│       ├── communityService.js       # Mock data cộng đồng (bài viết, comments)
│       ├── consultationService.js    # Mock data yêu cầu tư vấn & lịch tư vấn
│       ├── documentService.js        # Mock data tài liệu chia sẻ
│       ├── eventService.js           # Mock data sự kiện/seminar
│       ├── historyService.js         # Mock data lịch sử & đánh giá
│       ├── sessionService.js         # Mock data phiên học/lịch tutor
│       └── tutorService.js           # Mock data danh sách tutor & đăng ký
```

**Project Overview**:
- **Mô tả**: Frontend SPA cho hệ thống BK Tutor (React + Vite + TailwindCSS).
- **Mục tiêu file này**: Giúp người mới hiểu cấu trúc thư mục, các file quan trọng và cách chạy project trên Windows PowerShell.

**Cài đặt & Chạy (PowerShell)**:
- **npm install**: Lệnh này cài đặt các thư viện cần thiết từ `package.json`. Chỉ cần chạy một lần sau khi clone project.
- **npm run dev**: Lệnh này khởi động server phát triển (dev server) để bạn có thể xem và chỉnh sửa code với live-reload.

Hướng dẫn chi tiết:
1. Mở PowerShell và chuyển vào thư mục project:
```powershell
cd "c:\Users\ADMIN\Downloads\Học kì 251\CNPM\BTL_Assignment\project_cnpm\student-fe-js"
```
2. Cài dependencies:
```powershell
npm install
```
3. Chạy dev server:
```powershell
npm run dev
```
4. Mở trình duyệt vào: `http://localhost:5173/` (Vite mặc định in URL khi server ready).

**Nếu server đã báo "ready" nhưng không mở được**:
- Kiểm tra phản hồi HTTP:
```powershell
Invoke-WebRequest http://localhost:5173 -UseBasicParsing
```
- Kiểm tra port lắng nghe (5173):
```powershell
netstat -ano | findstr :5173
```
- Nếu có PID chiếm port, xem process:
```powershell
tasklist /FI "PID eq <PID>"
Stop-Process -Id <PID> -Force
```
- Nếu cần mở host trên mạng (hoặc WSL), chạy Vite với `--host`:
```powershell
npx vite --host
# hoặc sửa package.json scripts thành: "dev": "vite --host"
```
- Đảm bảo terminal không bị đóng — nếu đóng thì server dừng.

**Quick Troubleshooting**:
- Lỗi module thiếu? chạy `npm install` lại.
- Lỗi Tailwind (không thấy class)? kiểm tra `tailwind.config.js` và `src/index.css` đã include `@tailwind base; @tailwind components; @tailwind utilities;`.

**File/Module quan trọng**:
- `src/App.jsx` — cấu hình routes, `MainLayout` là parent route cho `/student`.
- `src/modules/student/layouts/MainLayout.jsx` — chứa `Sidebar`, `Header` và `<Outlet />`.
- `src/modules/student/components/Header.jsx` — header bar.
- `src/modules/student/components/Sidebar.jsx` — điều khiển hiển thị sidebar (slide-in) và overlay.
- `src/modules/student/pages/*.jsx` — các page UI theo mockup.
- `src/services/*.js` — nơi chứa mock data / fetch giả lập; chỉnh ở đây nếu muốn thay dữ liệu hiển thị.

**Cách thêm 1 trang mới**:
1. Tạo file trong `src/modules/student/pages/MyPage.jsx` (functional component + Tailwind).
2. Import vào `src/App.jsx` và thêm route con trong `<Route path="/student" ...>`:
```jsx
import MyPage from "./modules/student/pages/MyPage.jsx";
// in <Route path="/student"> children
<Route path="mypage" element={<MyPage />} />
```
3. Chạy `npm run dev` và mở `http://localhost:5173/student/mypage`.

**Styling / Tailwind**:
- Tailwind đã được thêm vào `package.json` nhưng kiểm tra xem project có `tailwind.config.js` và `@tailwind` directives trong `src/index.css`.
- Nếu chưa có, dùng lệnh sau để cài & tạo config:
```powershell
npx tailwindcss init
# rồi thêm vào src/index.css:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

**Notes & Recommendations**:
- File mockup (PDF) nên đặt vào thư mục project (ví dụ `docs/`) để dễ mở và tham chiếu.
- Giữ terminal dev server mở để Vite phục vụ live-reload.
- Nếu muốn project có Production build: `npm run build` và `npm run preview` (xem trang build).