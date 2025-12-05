// src/services/consultationService.js

// Mock: các chủ đề tư vấn
const MOCK_TOPICS = [
  "Hỗ trợ môn học cụ thể",
  "Định hướng học tập",
  "Kế hoạch học kỳ / đăng ký môn",
  "Chuẩn bị thi / đồ án",
  "Kỹ năng mềm & định hướng nghề nghiệp",
];

// Mock: danh sách tutor có thể tư vấn
const MOCK_TUTORS = [
  {
    id: "t1",
    name: "ThS. Mai Đức Trung",
    specialty: "Công nghệ phần mềm",
  },
  {
    id: "t2",
    name: "ThS. Nguyễn Trí Hải",
    specialty: "Cấu trúc dữ liệu & Giải thuật",
  },
  {
    id: "t3",
    name: "ThS. Phan Huy Quang Minh",
    specialty: "Kỹ thuật lập trình",
  },
];

// Mock: slot gợi ý (giống kiểu “lịch rảnh” mà student có thể chọn)
const MOCK_SLOTS = [
  {
    id: "s1",
    date: "Mon, Jan 11, 2050",
    timeRange: "09:00 - 09:30",
    mode: "Online",
  },
  {
    id: "s2",
    date: "Mon, Jan 11, 2050",
    timeRange: "14:00 - 14:30",
    mode: "Offline",
  },
  {
    id: "s3",
    date: "Tue, Jan 12, 2050",
    timeRange: "10:00 - 10:30",
    mode: "Online",
  },
];

// Mock: các yêu cầu tư vấn của sinh viên (UC-STUDENT-004)
let MOCK_STUDENT_CONSULTATIONS = [
  {
    id: 1,
    topic: "Định hướng học tập",
    tutorName: "ThS. Mai Đức Trung",
    subject: "Công nghệ phần mềm",
    date: "Mon, Jan 11, 2050",
    timeRange: "09:00 - 09:30",
    mode: "Online",
    status: "APPROVED", // PENDING | APPROVED | REJECTED | CANCELED
    note: "Trao đổi về kế hoạch học kỳ tới.",
  },
  {
    id: 2,
    topic: "Hỗ trợ môn học cụ thể",
    tutorName: "ThS. Nguyễn Trí Hải",
    subject: "Cấu trúc dữ liệu & Giải thuật",
    date: "Tue, Jan 12, 2050",
    timeRange: "10:00 - 10:30",
    mode: "Offline",
    status: "PENDING",
    note: "Em muốn hỏi thêm về bài tập lớn.",
  },
];

// --- Các hàm giả lập gọi backend ---

// Lấy cấu hình cho màn đặt lịch (chủ đề, tutor, slot gợi ý)
export function fetchConsultationConfig() {
  return Promise.resolve({
    topics: MOCK_TOPICS,
    tutors: MOCK_TUTORS,
    slots: MOCK_SLOTS,
  });
}

// Lấy danh sách yêu cầu tư vấn của sinh viên hiện tại
export function fetchStudentConsultations() {
  return Promise.resolve(MOCK_STUDENT_CONSULTATIONS);
}

// Tạo yêu cầu tư vấn mới (mock)
export function createConsultationRequest(payload) {
  const newItem = {
    id: Date.now(),
    status: "PENDING",
    ...payload,
  };
  MOCK_STUDENT_CONSULTATIONS = [newItem, ...MOCK_STUDENT_CONSULTATIONS];
  return Promise.resolve(newItem);
}

// Hủy yêu cầu tư vấn (mock)
export function cancelConsultationRequest(id) {
  MOCK_STUDENT_CONSULTATIONS = MOCK_STUDENT_CONSULTATIONS.map((item) =>
    item.id === id ? { ...item, status: "CANCELED" } : item
  );
  return Promise.resolve(true);
}
