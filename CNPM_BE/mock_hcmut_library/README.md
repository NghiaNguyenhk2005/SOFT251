# Mock HCMUT Library Service

Mock service giả lập HCMUT Library API để tìm kiếm và truy cập tài liệu học tập.

## Endpoints

### Health Check
```
GET /health
```

### Search Resources
```
GET /api/resources/search?query=calculus&subject=Mathematics&type=BOOK&page=1&limit=10
```
Query params:
- `query`: Tìm kiếm theo tiêu đề, tác giả, tags
- `subject`: Lọc theo môn học (Mathematics, Physics, Computer Science, etc.)
- `type`: BOOK, VIDEO, JOURNAL, DOCUMENT
- `page`: Trang hiện tại (default: 1)
- `limit`: Số kết quả mỗi trang (default: 10)

### Get Resource Details
```
GET /api/resources/:id
```
Ví dụ: `/api/resources/LIB_001`

### Get All Resources
```
GET /api/resources
```

### Get All Subjects
```
GET /api/subjects
```

### Get All Resource Types
```
GET /api/types
```

### Get Popular Resources
```
GET /api/resources/popular
```

## Mock Data

### Books
- LIB_001 - Calculus: Early Transcendentals
- LIB_002 - Introduction to Algorithms
- LIB_003 - Physics for Scientists and Engineers
- LIB_004 - Linear Algebra and Its Applications
- LIB_005 - Database System Concepts

### Videos
- VID_001 - MIT OpenCourseWare - Linear Algebra

### Journals
- JOU_001 - Nature - Machine Learning Applications

### Documents
- DOC_001 - HCMUT Course Catalog 2024

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Docker

```bash
# Build image
docker build -t mock-hcmut-library .

# Run container
docker run -p 3002:3002 mock-hcmut-library
```
