// src/services/eventService.js

// Mock data: các seminar / event sắp tới
const MOCK_EVENTS = [
  {
    id: 1,
    date: "30/02/2026",
    title: "Hội thảo công nghệ",
    description:
      "Hội thảo công nghệ là dịp để bạn khám phá những xu hướng, giải pháp và đổi mới mới nhất trong lĩnh vực công nghệ. Bạn sẽ được nghe các chuyên gia chia sẻ kinh nghiệm thực tế.",
    location: "Online (Google Meet)",
  },
  {
    id: 2,
    date: "31/04/2026",
    title: "Seminar an toàn thông tin",
    description:
      "Seminar an toàn thông tin giúp bạn hiểu rõ hơn về các mối đe dọa bảo mật, kỹ thuật tấn công phổ biến và cách phòng tránh. Phù hợp cho sinh viên CNTT và những ai quan tâm.",
    location: "Hội trường B4",
  },
  {
    id: 3,
    date: "15/05/2026",
    title: "Workshop kỹ năng mềm",
    description:
      "Workshop tập trung vào các kỹ năng mềm quan trọng như giao tiếp, làm việc nhóm và thuyết trình. Nội dung được thiết kế thực tế, có hoạt động nhóm và thực hành.",
    location: "Online (Zoom)",
  },
];

// Hàm GIẢ LẬP gọi backend lấy danh sách sự kiện
export function fetchEvents() {
  // Sau này chỉ cần đổi thành fetch("/api/events")...
  return Promise.resolve(MOCK_EVENTS);
}
