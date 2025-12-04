// src/services/tutorNotificationService.js

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: 'request',
        title: 'Yêu cầu buổi học mới',
        description: 'SV Nguyễn Văn A đã gửi yêu cầu cho môn Công nghệ phần mềm.',
        time: '5 phút trước',
        read: false,
    },
    {
        id: 2,
        type: 'cancellation',
        title: 'Buổi học đã bị hủy',
        description: 'Buổi học môn CTDL & GT vào 10:00 18/01 đã bị sinh viên hủy.',
        time: '1 giờ trước',
        read: false,
    },
    {
        id: 3,
        type: 'feedback',
        title: 'Bạn có đánh giá mới',
        description: 'Một sinh viên đã gửi đánh giá cho buổi học ngày 11/01.',
        time: '3 giờ trước',
        read: true,
    },
    {
        id: 4,
        type: 'reminder',
        title: 'Nhắc nhở: Buổi học sắp diễn ra',
        description: 'Buổi học môn Kỹ thuật lập trình sẽ bắt đầu trong 1 giờ nữa.',
        time: 'Hôm qua',
        read: true,
    }
];

export function fetchTutorNotifications() {
    return Promise.resolve(MOCK_NOTIFICATIONS);
}
