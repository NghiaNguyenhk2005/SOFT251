// src/services/documentService.js

const MOCK_DOCUMENTS = [
  {
    id: 1,
    subject: "Công nghệ phần mềm",
    type: "Đề ôn thi",
    author: "Nguyễn Trí Hải",
    date: "Jan 11, 2050",
  },
  {
    id: 2,
    subject: "Kỹ thuật lập trình",
    type: "Tài liệu lab",
    author: "Phan Huy Quang Minh",
    date: "Jan 11, 2050",
  },
  {
    id: 3,
    subject: "Cấu trúc dữ liệu và giải thuật",
    type: "Tài liệu lý thuyết",
    author: "Nguyễn Trái Hi",
    date: "Jan 11, 2050",
  },
  {
    id: 4,
    subject: "Mô hình hóa toán học",
    type: "Tài liệu lý thuyết",
    author: "Phi Hoan Quynh Mang",
    date: "Jan 11, 2050",
  },
  {
    id: 5,
    subject: "Nguyên lý ngôn ngữ lập trình",
    type: "Tài liệu lý thuyết",
    author: "Mark Zuckerburg",
    date: "Jan 11, 2050",
  },
  {
    id: 6,
    subject: "Công nghệ phần mềm",
    type: "Tài liệu lý thuyết",
    author: "Elon Musk",
    date: "Jan 11, 2050",
  },
  {
    id: 7,
    subject: "Cơ sở dữ liệu",
    type: "Tài liệu lý thuyết",
    author: "Nguyễn Văn A",
    date: "Jan 11, 2050",
  },
  {
    id: 8,
    subject: "Nhập môn lập trình",
    type: "Slide bài giảng",
    author: "Trần Thị B",
    date: "Jan 11, 2050",
  },
];

export function fetchDocuments() {
  return Promise.resolve(MOCK_DOCUMENTS);
}
