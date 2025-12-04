// Mock data for testing without backend

export const MOCK_TUTOR_PROFILE = {
  _id: "tutor123",
  userId: {
    _id: "user123",
    hcmutId: "CB001",
    email: "nguyen.van.a@hcmut.edu.vn",
    fullName: "Nguyễn Văn An",
    phone: "0909123456",
    role: "TUTOR"
  },
  department: "Khoa Khoa học và Kỹ thuật Máy tính",
  officeLocation: "Phòng B4-201",
  bio: "Tôi là giảng viên với hơn 10 năm kinh nghiệm giảng dạy các môn Công nghệ phần mềm, Cấu trúc dữ liệu và Giải thuật. Tôi luôn nhiệt tình hỗ trợ sinh viên trong quá trình học tập và nghiên cứu.",
  subjects: [
    { id: "CO3001", name: "Công nghệ phần mềm" },
    { id: "CO3002", name: "Cấu trúc dữ liệu và Giải thuật" },
    { id: "CO3003", name: "Kỹ thuật lập trình" }
  ],
  availability: [
    {
      _id: "av1",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "11:00",
      location: "Phòng B4-201",
      isActive: true
    },
    {
      _id: "av2",
      dayOfWeek: 3,
      startTime: "14:00",
      endTime: "16:00",
      location: "Online",
      isActive: true
    }
  ],
  isActive: true,
  createdAt: "2023-01-15T00:00:00.000Z",
  updatedAt: "2024-12-04T00:00:00.000Z"
};

export const MOCK_SESSIONS = [
  {
    _id: "session1",
    title: "Tư vấn về Đồ án Công nghệ phần mềm",
    description: "Hướng dẫn sinh viên về cách thiết kế kiến trúc phần mềm cho đồ án môn học",
    startTime: "2024-12-10T09:00:00.000Z",
    endTime: "2024-12-10T11:00:00.000Z",
    duration: 120,
    sessionType: "OFFLINE",
    location: "Phòng B4-201",
    meetLink: null,
    status: "SCHEDULED",
    participants: [
      { _id: "st1", fullName: "Trần Văn Bình", email: "binh.tran@hcmut.edu.vn" },
      { _id: "st2", fullName: "Lê Thị Cúc", email: "cuc.le@hcmut.edu.vn" }
    ],
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z"
  },
  {
    _id: "session2",
    title: "Buổi học Cấu trúc dữ liệu",
    description: "Giảng dạy về Cây nhị phân tìm kiếm và các thuật toán liên quan",
    startTime: "2024-12-08T14:00:00.000Z",
    endTime: "2024-12-08T16:00:00.000Z",
    duration: 120,
    sessionType: "ONLINE",
    location: "Online",
    meetLink: "https://meet.google.com/abc-defg-hij",
    status: "COMPLETED",
    participants: [
      { _id: "st3", fullName: "Phạm Minh Đức", email: "duc.pham@hcmut.edu.vn" },
      { _id: "st4", fullName: "Ngô Thị Em", email: "em.ngo@hcmut.edu.vn" },
      { _id: "st5", fullName: "Võ Văn Phú", email: "phu.vo@hcmut.edu.vn" }
    ],
    createdAt: "2024-11-25T00:00:00.000Z",
    updatedAt: "2024-12-08T16:00:00.000Z"
  },
  {
    _id: "session3",
    title: "Workshop: Git và GitHub",
    description: "Hướng dẫn sử dụng Git cơ bản và làm việc nhóm với GitHub",
    startTime: "2024-12-15T10:00:00.000Z",
    endTime: "2024-12-15T12:00:00.000Z",
    duration: 120,
    sessionType: "ONLINE",
    location: "Online",
    meetLink: "https://meet.google.com/xyz-abcd-efg",
    status: "SCHEDULED",
    participants: [
      { _id: "st6", fullName: "Hoàng Văn Giang", email: "giang.hoang@hcmut.edu.vn" },
      { _id: "st7", fullName: "Đặng Thị Hoa", email: "hoa.dang@hcmut.edu.vn" },
      { _id: "st8", fullName: "Bùi Văn Inh", email: "inh.bui@hcmut.edu.vn" },
      { _id: "st9", fullName: "Lý Thị Kim", email: "kim.ly@hcmut.edu.vn" }
    ],
    createdAt: "2024-12-02T00:00:00.000Z",
    updatedAt: "2024-12-02T00:00:00.000Z"
  },
  {
    _id: "session4",
    title: "Tư vấn cá nhân - Lập trình Java",
    description: "Giải đáp thắc mắc về OOP và các design patterns trong Java",
    startTime: "2024-11-30T15:00:00.000Z",
    endTime: "2024-11-30T16:00:00.000Z",
    duration: 60,
    sessionType: "OFFLINE",
    location: "Phòng B4-201",
    meetLink: null,
    status: "COMPLETED",
    participants: [
      { _id: "st10", fullName: "Trương Văn Long", email: "long.truong@hcmut.edu.vn" }
    ],
    createdAt: "2024-11-28T00:00:00.000Z",
    updatedAt: "2024-11-30T16:00:00.000Z"
  },
  {
    _id: "session5",
    title: "Review bài tập lớn",
    description: "Nhận xét và góp ý về bài tập lớn môn Công nghệ phần mềm",
    startTime: "2024-11-25T13:00:00.000Z",
    endTime: "2024-11-25T14:30:00.000Z",
    duration: 90,
    sessionType: "OFFLINE",
    location: "Thư viện H1",
    meetLink: null,
    status: "CANCELLED",
    participants: [],
    createdAt: "2024-11-20T00:00:00.000Z",
    updatedAt: "2024-11-24T00:00:00.000Z"
  }
];

export const MOCK_FEEDBACKS = [
  {
    _id: "fb1",
    studentId: {
      _id: "st3",
      fullName: "Phạm Minh Đức",
      hcmutId: "2152001"
    },
    sessionId: {
      _id: "session2",
      title: "Buổi học Cấu trúc dữ liệu"
    },
    rating: 5,
    comment: "Thầy giảng rất hay và dễ hiểu. Các ví dụ thực tế giúp em nắm bắt kiến thức tốt hơn. Cảm ơn thầy!",
    createdAt: "2024-12-08T17:00:00.000Z"
  },
  {
    _id: "fb2",
    studentId: {
      _id: "st4",
      fullName: "Ngô Thị Em",
      hcmutId: "2152002"
    },
    sessionId: {
      _id: "session2",
      title: "Buổi học Cấu trúc dữ liệu"
    },
    rating: 4.5,
    comment: "Buổi học bổ ích, thầy nhiệt tình. Tuy nhiên em mong thầy có thể giảng chậm hơn một chút ở phần cuối.",
    createdAt: "2024-12-08T17:30:00.000Z"
  },
  {
    _id: "fb3",
    studentId: {
      _id: "st10",
      fullName: "Trương Văn Long",
      hcmutId: "2152003"
    },
    sessionId: {
      _id: "session4",
      title: "Tư vấn cá nhân - Lập trình Java"
    },
    rating: 5,
    comment: "Thầy giải đáp rất chi tiết và tận tâm. Em đã hiểu rõ hơn về các design patterns. Rất cảm ơn thầy!",
    createdAt: "2024-11-30T16:30:00.000Z"
  },
  {
    _id: "fb4",
    studentId: {
      _id: "st5",
      fullName: "Võ Văn Phú",
      hcmutId: "2152004"
    },
    sessionId: {
      _id: "session2",
      title: "Buổi học Cấu trúc dữ liệu"
    },
    rating: 4,
    comment: "Nội dung hay nhưng thời gian hơi ngắn. Em mong có thêm buổi học nâng cao về chủ đề này.",
    createdAt: "2024-12-08T18:00:00.000Z"
  },
  {
    _id: "fb5",
    studentId: {
      _id: "st1",
      fullName: "Trần Văn Bình",
      hcmutId: "2152005"
    },
    sessionId: {
      _id: "session1",
      title: "Tư vấn về Đồ án Công nghệ phần mềm"
    },
    rating: 5,
    comment: "Thầy hướng dẫn rất chi tiết về kiến trúc phần mềm. Em đã có định hướng rõ ràng cho đồ án của mình.",
    createdAt: "2024-12-10T11:30:00.000Z"
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    _id: "notif1",
    title: "Yêu cầu tư vấn mới",
    message: "Sinh viên Nguyễn Văn An đã gửi yêu cầu tư vấn về môn Công nghệ phần mềm",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 phút trước
  },
  {
    _id: "notif2",
    title: "Buổi học sắp diễn ra",
    message: "Buổi học 'Tư vấn về Đồ án Công nghệ phần mềm' sẽ bắt đầu trong 2 giờ nữa",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 giờ trước
  },
  {
    _id: "notif3",
    title: "Đánh giá mới",
    message: "Phạm Minh Đức đã đánh giá 5 sao cho buổi học 'Buổi học Cấu trúc dữ liệu'",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 giờ trước
  },
  {
    _id: "notif4",
    title: "Hủy buổi học",
    message: "Sinh viên Trần Thị B đã hủy đăng ký buổi học 'Review bài tập lớn'",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 ngày trước
  },
  {
    _id: "notif5",
    title: "Nhắc nhở",
    message: "Bạn có 3 buổi học trong tuần này. Hãy chuẩn bị tài liệu giảng dạy.",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 ngày trước
  },
  {
    _id: "notif6",
    title: "Sinh viên mới tham gia",
    message: "Lê Văn C đã đăng ký tham gia buổi học 'Workshop: Git và GitHub'",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 ngày trước
  }
];

export const MOCK_STUDENTS_FOR_RATING = [
  {
    id: 1,
    studentId: "2152001",
    name: "Phạm Minh Đức",
    course: "CO3002 - Cấu trúc dữ liệu",
    sessions: 8,
    attendance: "100%",
    currentRating: 4.5,
    hasRating: true,
  },
  {
    id: 2,
    studentId: "2152002",
    name: "Ngô Thị Em",
    course: "CO3002 - Cấu trúc dữ liệu",
    sessions: 6,
    attendance: "83%",
    currentRating: null,
    hasRating: false,
  },
  {
    id: 3,
    studentId: "2152003",
    name: "Trương Văn Long",
    course: "CO3001 - Công nghệ phần mềm",
    sessions: 10,
    attendance: "100%",
    currentRating: 5.0,
    hasRating: true,
  },
  {
    id: 4,
    studentId: "2152004",
    name: "Võ Văn Phú",
    course: "CO3002 - Cấu trúc dữ liệu",
    sessions: 7,
    attendance: "86%",
    currentRating: 4.0,
    hasRating: true,
  },
  {
    id: 5,
    studentId: "2152005",
    name: "Trần Văn Bình",
    course: "CO3001 - Công nghệ phần mềm",
    sessions: 5,
    attendance: "100%",
    currentRating: null,
    hasRating: false,
  },
  {
    id: 6,
    studentId: "2152006",
    name: "Lê Thị Cúc",
    course: "CO3001 - Công nghệ phần mềm",
    sessions: 9,
    attendance: "89%",
    currentRating: 4.8,
    hasRating: true,
  },
  {
    id: 7,
    studentId: "2152007",
    name: "Hoàng Văn Giang",
    course: "CO3003 - Kỹ thuật lập trình",
    sessions: 4,
    attendance: "75%",
    currentRating: 3.5,
    hasRating: true,
  },
  {
    id: 8,
    studentId: "2152008",
    name: "Đặng Thị Hoa",
    course: "CO3003 - Kỹ thuật lập trình",
    sessions: 3,
    attendance: "100%",
    currentRating: null,
    hasRating: false,
  }
];

export const MOCK_CALENDAR_EVENTS = [
  {
    id: "evt1",
    type: "session",
    subjectName: "Công nghệ phần mềm",
    studentCount: 2,
    date: "Mon, Dec 9, 2024",
    timeRange: "09:00 - 11:00",
    location: "Phòng B4-201",
    meetLink: "",
    status: "scheduled",
  },
  {
    id: "evt2",
    type: "session",
    subjectName: "Workshop Git",
    studentCount: 4,
    date: "Wed, Dec 11, 2024",
    timeRange: "10:00 - 12:00",
    location: "Online",
    meetLink: "https://meet.google.com/xyz-abcd-efg",
    status: "scheduled",
  },
  {
    id: "evt3",
    type: "availability",
    date: "Tue, Dec 10, 2024",
    timeRange: "14:00 - 16:00",
    location: "Online / Offline",
    status: "available",
  },
  {
    id: "evt4",
    type: "session",
    subjectName: "Cấu trúc dữ liệu",
    studentCount: 3,
    date: "Thu, Dec 12, 2024",
    timeRange: "13:00 - 15:00",
    location: "Phòng H1-101",
    meetLink: "",
    status: "scheduled",
  },
  {
    id: "evt5",
    type: "availability",
    date: "Fri, Dec 13, 2024",
    timeRange: "09:00 - 11:00",
    location: "Phòng B4-201",
    status: "available",
  }
];

export const MOCK_COURSES = [
  {
    id: "CO3001",
    name: "Công nghệ phần mềm",
    code: "CO3001",
    studentCount: 45,
    description: "Môn học về quy trình phát triển phần mềm, các mô hình phát triển, và quản lý dự án phần mềm"
  },
  {
    id: "CO3002",
    name: "Cấu trúc dữ liệu và Giải thuật",
    code: "CO3002",
    studentCount: 52,
    description: "Các cấu trúc dữ liệu cơ bản và nâng cao, thuật toán sắp xếp, tìm kiếm, và tối ưu hóa"
  },
  {
    id: "CO3003",
    name: "Kỹ thuật lập trình",
    code: "CO3003",
    studentCount: 38,
    description: "Lập trình hướng đối tượng, design patterns, và best practices trong lập trình"
  }
];
