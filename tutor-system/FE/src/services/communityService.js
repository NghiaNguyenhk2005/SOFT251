// src/services/communityService.js

// Mock data: các cộng đồng / nhóm sinh viên
const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "Cộng đồng sinh viên khoa Khoa học & Kỹ thuật Máy tính",
    description:
      "Nhóm dành cho toàn bộ sinh viên Khoa KH&KT Máy tính, cập nhật thông báo, học bổng, cơ hội nghiên cứu và chia sẻ tài liệu học tập.",
    memberCount: "5.2K thành viên",
    facebookUrl: "https://facebook.com/groups/khtn-cs-community",
    imageUrl:
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
  },
  {
    id: 2,
    name: "Cộng đồng học thuật Công nghệ phần mềm",
    description:
      "Nơi thảo luận về kiến trúc phần mềm, thiết kế hệ thống, kinh nghiệm làm đồ án CNPM và chia sẻ cơ hội thực tập.",
    memberCount: "2.3K thành viên",
    facebookUrl: "https://facebook.com/groups/software-engineering-vn",
    imageUrl:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg",
  },
  {
    id: 3,
    name: "Cộng đồng Lập trình & Thuật toán",
    description:
      "Nhóm luyện thuật toán, chia sẻ tài liệu competitive programming, hướng dẫn giải các bài LeetCode, Codeforces, ICPC.",
    memberCount: "3.8K thành viên",
    facebookUrl: "https://facebook.com/groups/algorithms-cp-vn",
    imageUrl:
      "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
  },
  {
    id: 4,
    name: "Cộng đồng Kỹ năng mềm cho sinh viên CNTT",
    description:
      "Tập trung vào kỹ năng thuyết trình, phỏng vấn, viết CV, làm việc nhóm và phát triển bản thân dành riêng cho sinh viên IT.",
    memberCount: "1.7K thành viên",
    facebookUrl: "https://facebook.com/groups/softskills-it-students",
    imageUrl:
      "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
  },
];

// Giả lập gọi backend lấy danh sách cộng đồng
export function fetchCommunities() {
  // Sau này chỉ cần đổi thành:
  // const res = await fetch("/api/communities");
  // return res.json();
  return Promise.resolve(MOCK_COMMUNITIES);
}
