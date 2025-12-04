// src/services/tutorCourseDetailService.js

const MOCK_COURSE_DETAILS = {
  id: 'CO3001',
  name: 'Công nghệ phần mềm',
  description: 'Quản lý yêu cầu, thiết kế, kiểm thử và bảo trì phần mềm.',
  
  // Dựa trên "Trang chi tiết môn học - Buổi học.png"
  sessions: [
    {
      id: 's1',
      title: 'Buổi 1: Giới thiệu và ôn tập',
      date: 'Thứ 2, 11/01/2050',
      time: '13:30 - 15:00',
      location: 'Online',
      status: 'Đã diễn ra',
    },
    {
      id: 's2',
      title: 'Buổi 2: Thu thập yêu cầu',
      date: 'Thứ 2, 18/01/2050',
      time: '13:30 - 15:00',
      location: 'Online',
      status: 'Sắp diễn ra',
    },
    {
      id: 's3',
      title: 'Buổi 3: Phân tích và thiết kế',
      date: 'Thứ 2, 25/01/2050',
      time: '13:30 - 15:00',
      location: 'Phòng B4-201',
      status: 'Sắp diễn ra',
    },
  ],

  // Dựa trên "Trang chi tiết môn học - Yêu cầu buổi học.png"
  requests: [
    {
      id: 'r1',
      studentName: 'Nguyễn Văn A',
      studentId: '2112345',
      requestDate: '10/01/2050',
      topic: 'Hỏi về bài tập lớn',
      note: 'Em muốn hỏi về cách áp dụng design pattern cho BTL ạ.',
    },
    {
      id: 'r2',
      studentName: 'Trần Thị B',
      studentId: '2112346',
      requestDate: '11/01/2050',
      topic: 'Cần tư vấn 1-1',
      note: 'Em gặp khó khăn ở phần testing, mong thầy/cô giúp đỡ.',
    },
  ],

  // Dựa trên "Trang chi tiết môn học - DS SInh viên.png"
  students: [
    {
      id: 'sv1',
      name: 'Nguyễn Văn A',
      studentId: '2112345',
      email: 'a.nguyen@hcmut.edu.vn',
      joinDate: '01/01/2050',
    },
    {
      id: 'sv2',
      name: 'Trần Thị B',
      studentId: '2112346',
      email: 'b.tran@hcmut.edu.vn',
      joinDate: '01/01/2050',
    },
    {
      id: 'sv3',
      name: 'Lê Văn C',
      studentId: '2112347',
      email: 'c.le@hcmut.edu.vn',
      joinDate: '02/01/2050',
    },
    {
      id: 'sv4',
      name: 'Phạm Thị D',
      studentId: '2112348',
      email: 'd.pham@hcmut.edu.vn',
      joinDate: '03/01/2050',
    },
  ],
};

export function fetchTutorCourseDetails(courseId) {
  // Trong thực tế, bạn sẽ dùng courseId để fetch đúng dữ liệu
  console.log(`Fetching details for course: ${courseId}`);
  return Promise.resolve(MOCK_COURSE_DETAILS);
}

// Mock API calls for actions
export function approveRequest(requestId) {
    console.log(`Approving request ${requestId}`);
    return Promise.resolve({ success: true });
}

export function rejectRequest(requestId, reason) {
    console.log(`Rejecting request ${requestId} with reason: ${reason}`);
    return Promise.resolve({ success: true });
}

export function cancelSession(sessionId, reason) {
    console.log(`Canceling session ${sessionId} with reason: ${reason}`);
    return Promise.resolve({ success: true });
}

export function rescheduleSession(sessionId, newDateTime) {
    console.log(`Rescheduling session ${sessionId} to ${newDateTime}`);
    return Promise.resolve({ success: true });
}

export function evaluateStudent(studentId, evaluation) {
    console.log(`Evaluating student ${studentId}:`, evaluation);
    return Promise.resolve({ success: true });
}
