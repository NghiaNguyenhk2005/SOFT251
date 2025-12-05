// src/services/historyService.js

// Mock data: các buổi học đã hoàn thành của sinh viên
const MOCK_HISTORY_SESSIONS = [
  {
    id: 1,
    subjectName: "Công nghệ phần mềm",
    tutorName: "ThS. Mai Đức Trung",
    date: "Mon, Jan 11, 2050",
    timeRange: "13:30 - 15:00",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    tutorName: "ThS. Nguyễn Trí Hải",
    date: "Tue, Jan 12, 2050",
    timeRange: "09:00 - 10:30",
    meetLink: "https://meet.google.com/xyz-1234-789",
  },
  {
    id: 3,
    subjectName: "Kỹ thuật lập trình",
    tutorName: "ThS. Phan Huy Quang Minh",
    date: "Wed, Jan 13, 2050",
    timeRange: "15:30 - 17:00",
    meetLink: "",
  },
  {
    id: 4,
    subjectName: "Cơ sở dữ liệu",
    tutorName: "TS. Nguyễn Văn A",
    date: "Thu, Jan 14, 2050",
    timeRange: "08:00 - 09:30",
    meetLink: "https://meet.google.com/db-123-data",
  },
];

// Giả lập gọi backend lấy lịch sử buổi học đã hoàn thành
export function fetchHistorySessions() {
  // Sau này chỉ cần thay bằng API thật, ví dụ:
  // const res = await fetch("/api/student/history");
  // return res.json();
  return Promise.resolve(MOCK_HISTORY_SESSIONS);
}
