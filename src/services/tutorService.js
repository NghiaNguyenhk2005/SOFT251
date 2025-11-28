// src/services/tutorService.js

// TẠM THỜI: mock data, sau này sẽ thay bằng gọi API thật
const MOCK_TUTORS = [
  {
    id: 1,
    tutorCode: "C03001",
    fullName: "Tutor1",
    description: "Mô tả tutor1",
  },
  {
    id: 2,
    tutorCode: "C03001",
    fullName: "Tutor2",
    description: "Mô tả tutor2",
  },
  {
    id: 3,
    tutorCode: "C03001",
    fullName: "Tutor3",
    description: "Mô tả tutor3",
  },
  {
    id: 4,
    tutorCode: "C03002",
    fullName: "Nguyễn Văn A",
    description: "Tutor hỗ trợ môn Cấu trúc dữ liệu.",
  },
  {
    id: 5,
    tutorCode: "C03003",
    fullName: "Trần Thị B",
    description: "Tutor hỗ trợ môn Lập trình Python cơ bản.",
  },
  {
    id: 6,
    tutorCode: "C03004",
    fullName: "Lê Văn C",
    description: "Tutor hỗ trợ môn Toán rời rạc.",
  },
];

// Hàm GIẢ LẬP gọi backend
// Sau này bạn chỉ cần đổi nội dung trong hàm này thành fetch("/api/tutors")...
export function fetchTutors() {
  return Promise.resolve(MOCK_TUTORS);
}
