// src/services/tutorCourseService.js

const MOCK_TUTOR_COURSES = [
  {
    id: 'CO3001',
    name: 'Công nghệ phần mềm',
    studentCount: 42,
    sessionCount: 8,
    description: 'Quản lý yêu cầu, thiết kế, kiểm thử và bảo trì phần mềm.',
    imageUrl: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'CO3002',
    name: 'Cấu trúc dữ liệu và giải thuật',
    studentCount: 58,
    sessionCount: 12,
    description: 'Các cấu trúc dữ liệu cơ bản và các thuật toán sắp xếp, tìm kiếm, đồ thị.',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'CO3003',
    name: 'Kỹ thuật lập trình',
    studentCount: 75,
    sessionCount: 15,
    description: 'Nguyên lý lập trình, con trỏ, cấp phát động và các kỹ thuật gỡ lỗi.',
    imageUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
    {
    id: 'CO4001',
    name: 'An toàn và an ninh mạng',
    studentCount: 35,
    sessionCount: 6,
    description: 'Các vấn đề về an toàn, mã hóa, và phòng chống tấn công mạng.',
    imageUrl: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export function fetchTutorCourses() {
  return Promise.resolve(MOCK_TUTOR_COURSES);
}
