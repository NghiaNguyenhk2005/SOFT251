// src/services/sessionService.js

// Mock data: mô phỏng các buổi học (Session) của sinh viên
const MOCK_SESSIONS = [
  {
    id: 1,
    subjectName: "Công nghệ phần mềm",
    tutorName: "ThS. Mai Đức Trung",
    date: "Mon, Jan 11, 2050",
    timeRange: "13:30 - 15:00",
    location: "Online (Google Meet)",
    meetLink: "https://meet.google.com/abc-defg-hij",
    status: "Sắp diễn ra",
  },
  {
    id: 2,
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    tutorName: "ThS. Nguyễn Trí Hải",
    date: "Tue, Jan 12, 2050",
    timeRange: "09:00 - 10:30",
    location: "Online (Google Meet)",
    meetLink: "https://meet.google.com/xyz-1234-789",
    status: "Sắp diễn ra",
  },
  {
    id: 3,
    subjectName: "Kỹ thuật lập trình",
    tutorName: "ThS. Phan Huy Quang Minh",
    date: "Wed, Jan 13, 2050",
    timeRange: "15:30 - 17:00",
    location: "Phòng B4-201",
    meetLink: "",
    status: "Đã hoàn thành",
  },
  {
    id: 4,
    subjectName: "Cơ sở dữ liệu",
    tutorName: "TS. Nguyễn Văn A",
    date: "Thu, Jan 14, 2050",
    timeRange: "08:00 - 09:30",
    location: "Online (Google Meet)",
    meetLink: "https://meet.google.com/db-123-data",
    status: "Sắp diễn ra",
  },
];

// Hàm GIẢ LẬP gọi backend lấy lịch học của sinh viên
export function fetchStudentSessions() {
  // Sau này chỉ cần thay bằng gọi API thật:
  // const res = await fetch("/api/student/sessions");
  // return res.json();
  return Promise.resolve(MOCK_SESSIONS);
}
