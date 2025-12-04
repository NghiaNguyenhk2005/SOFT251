import { useState } from "react";
import GoBackButton from "../components/GoBackBTN.jsx";

export default function PDTFeedback() {
  const [feedbacks] = useState([
  { id: 1, student: "Nguyễn Văn A", tutor: "Thầy Trần Văn B", faculty: "Cơ khí", subject: "Cơ điện tử", content: "Cần thêm buổi thực hành để hiểu rõ hơn.", upvotes: 5, time: "2025-12-01 14:30" },
  { id: 2, student: "Lê Thị C", tutor: "Cô Nguyễn Thị D", faculty: "Điện – Điện tử", subject: "Mạch điện", content: "Tutor hỗ trợ rất nhiệt tình.", upvotes: 12, time: "2025-12-02 09:15" },
  { id: 3, student: "Phạm Văn E", tutor: "Thầy Bùi Văn F", faculty: "Công nghệ Thông tin", subject: "Kỹ thuật phần mềm", content: "Muốn có thêm ví dụ thực tế.", upvotes: 8, time: "2025-12-02 16:45" },
  { id: 4, student: "Trần Minh G", tutor: "Thầy Nguyễn Văn H", faculty: "Kỹ thuật Hóa học", subject: "Hóa đại cương", content: "Cần thêm tài liệu tham khảo.", upvotes: 10, time: "2025-12-03 11:00" },
  { id: 5, student: "Đỗ Thị I", tutor: "Cô Phạm Thị K", faculty: "Quản lý Công nghiệp", subject: "Logistics & Chuỗi cung ứng", content: "Buổi học rất hữu ích và dễ hiểu.", upvotes: 15, time: "2025-12-03 15:20" },

  // More records for pagination
  { id: 6, student: "Nguyễn Văn L", tutor: "Thầy Hoàng Văn M", faculty: "Cơ khí", subject: "Vật liệu", content: "Ví dụ minh họa rất dễ hiểu.", upvotes: 7, time: "2025-12-04 10:00" },
  { id: 7, student: "Trần Thị N", tutor: "Cô Lê Thị O", faculty: "Điện – Điện tử", subject: "Điện tử cơ bản", content: "Cần thêm bài tập thực hành.", upvotes: 9, time: "2025-12-04 13:30" },
  { id: 8, student: "Phạm Văn P", tutor: "Thầy Nguyễn Văn Q", faculty: "Công nghệ Thông tin", subject: "Khoa học Máy tính", content: "Muốn có thêm case study.", upvotes: 11, time: "2025-12-05 08:45" },
  { id: 9, student: "Đinh Thị R", tutor: "Cô Trần Thị S", faculty: "Kỹ thuật Hóa học", subject: "Công nghệ Thực phẩm", content: "Tutor giải thích rất chi tiết.", upvotes: 14, time: "2025-12-05 14:20" },
  { id: 10, student: "Nguyễn Văn T", tutor: "Thầy Lê Văn U", faculty: "Quản lý Công nghiệp", subject: "Quản lý Công nghiệp", content: "Cần thêm buổi thảo luận nhóm.", upvotes: 6, time: "2025-12-06 09:00" },

  { id: 11, student: "Trần Thị V", tutor: "Cô Nguyễn Thị W", faculty: "Cơ khí", subject: "Toán ứng dụng", content: "Ví dụ thực tế rất hữu ích.", upvotes: 13, time: "2025-12-06 15:30" },
  { id: 12, student: "Phạm Văn X", tutor: "Thầy Bùi Văn Y", faculty: "Điện – Điện tử", subject: "Vật lý kỹ thuật", content: "Cần thêm slide minh họa.", upvotes: 10, time: "2025-12-07 11:10" },
  { id: 13, student: "Nguyễn Thị Z", tutor: "Cô Trần Thị AA", faculty: "Công nghệ Thông tin", subject: "Công nghệ Thông tin", content: "Tutor trả lời nhanh chóng.", upvotes: 16, time: "2025-12-07 17:45" },
  { id: 14, student: "Lê Văn BB", tutor: "Thầy Nguyễn Văn CC", faculty: "Kỹ thuật Hóa học", subject: "Hóa đại cương", content: "Cần thêm ví dụ minh họa.", upvotes: 8, time: "2025-12-08 09:25" },
  { id: 15, student: "Trần Thị DD", tutor: "Cô Phạm Thị EE", faculty: "Quản lý Công nghiệp", subject: "Logistics & Chuỗi cung ứng", content: "Buổi học rất bổ ích.", upvotes: 20, time: "2025-12-08 14:50" },

  // Add more until 30
  { id: 16, student: "Nguyễn Văn FF", tutor: "Thầy Lê Văn GG", faculty: "Cơ khí", subject: "Cơ khí", content: "Cần thêm bài tập.", upvotes: 9, time: "2025-12-09 10:00" },
  { id: 17, student: "Trần Thị HH", tutor: "Cô Nguyễn Thị II", faculty: "Điện – Điện tử", subject: "Mạch điện", content: "Tutor rất nhiệt tình.", upvotes: 12, time: "2025-12-09 13:30" },
  { id: 18, student: "Phạm Văn JJ", tutor: "Thầy Bùi Văn KK", faculty: "Công nghệ Thông tin", subject: "Kỹ thuật phần mềm", content: "Muốn thêm ví dụ thực tế.", upvotes: 15, time: "2025-12-10 08:45" },
  { id: 19, student: "Đinh Thị LL", tutor: "Cô Trần Thị MM", faculty: "Kỹ thuật Hóa học", subject: "Công nghệ Thực phẩm", content: "Tutor giải thích rõ ràng.", upvotes: 11, time: "2025-12-10 14:20" },
  { id: 20, student: "Nguyễn Văn NN", tutor: "Thầy Lê Văn OO", faculty: "Quản lý Công nghiệp", subject: "Quản lý Công nghiệp", content: "Cần thêm thảo luận nhóm.", upvotes: 7, time: "2025-12-11 09:00" },

  { id: 21, student: "Trần Thị PP", tutor: "Cô Nguyễn Thị QQ", faculty: "Cơ khí", subject: "Vật liệu", content: "Ví dụ minh họa dễ hiểu.", upvotes: 10, time: "2025-12-11 15:30" },
  { id: 22, student: "Phạm Văn RR", tutor: "Thầy Bùi Văn SS", faculty: "Điện – Điện tử", subject: "Điện tử cơ bản", content: "Cần thêm bài tập.", upvotes: 9, time: "2025-12-12 11:10" },
  { id: 23, student: "Nguyễn Thị TT", tutor: "Cô Trần Thị UU", faculty: "Công nghệ Thông tin", subject: "Khoa học Máy tính", content: "Tutor trả lời nhanh.", upvotes: 14, time: "2025-12-12 17:45" },
  { id: 24, student: "Lê Văn VV", tutor: "Thầy Nguyễn Văn WW", faculty: "Kỹ thuật Hóa học", subject: "Hóa đại cương", content: "Cần thêm ví dụ.", upvotes: 8, time: "2025-12-13 09:25" },
  { id: 25, student: "Trần Thị XX", tutor: "Cô Phạm Thị YY", faculty: "Quản lý Công nghiệp", subject: "Logistics & Chuỗi cung ứng", content: "Buổi học bổ ích.", upvotes: 18, time: "2025-12-13 14:50" },
  { id: 26, student: "Nguyễn Văn ZZ", tutor: "Thầy Lê Văn AAA", faculty: "Cơ khí", subject: "Toán ứng dụng", content: "Ví dụ thực tế hữu ích.", upvotes: 11, time: "2025-12-14 10:00" },
  { id: 27, student: "Trần Thị BBB", tutor: "Cô Nguyễn Thị CCC", faculty: "Điện – Điện tử", subject: "Vật lý kỹ thuật", content: "Cần thêm slide minh họa.", upvotes: 13, time: "2025-12-14 13:30" },
  { id: 28, student: "Phạm Văn DDD", tutor: "Thầy Bùi Văn EEE", faculty: "Công nghệ Thông tin", subject: "Kỹ thuật phần mềm", content: "Muốn thêm case study thực tế.", upvotes: 17, time: "2025-12-15 08:45" },
  { id: 29, student: "Đinh Thị FFF", tutor: "Cô Trần Thị GGG", faculty: "Kỹ thuật Hóa học", subject: "Công nghệ Thực phẩm", content: "Tutor giải thích rất chi tiết.", upvotes: 14, time: "2025-12-15 14:20" },
  { id: 30, student: "Nguyễn Văn HHH", tutor: "Thầy Lê Văn III", faculty: "Quản lý Công nghiệp", subject: "Logistics & Chuỗi cung ứng", content: "Buổi học rất bổ ích và dễ hiểu.", upvotes: 19, time: "2025-12-16 09:00" },
]);

  const [facultyFilter, setFacultyFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [orderBy, setOrderBy] = useState("time");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // max per page (adjust to 10 or 20 as needed)

  // Filtering + Sorting
  const filteredFeedbacks = feedbacks
    .filter((fb) => facultyFilter === "All" || fb.faculty === facultyFilter)
    .filter((fb) => subjectFilter === "All" || fb.subject === subjectFilter)
    .sort((a, b) => {
      if (orderBy === "upvotes") {
        return b.upvotes - a.upvotes;
      } else {
        return new Date(b.time) - new Date(a.time);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + itemsPerPage);

  // Collect unique subjects & faculties
  const subjects = ["Tất cả các môn", ...new Set(feedbacks.map((fb) => fb.subject))];
  const faculties = ["Tất cả các khoa", ...new Set(feedbacks.map((fb) => fb.faculty))];
  const [pageInput, setPageInput] = useState("");
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <main className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Phản hồi từ sinh viên gửi đến tutor</h2>
        <GoBackButton />
      </div>
        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={facultyFilter}
            onChange={(e) => {
              setFacultyFilter(e.target.value);
              setCurrentPage(1); // reset page when filter changes
            }}
            className="border px-2 py-1"
          >
            {faculties.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-2 py-1"
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-2 py-1"
          >
            <option value="time">Sắp xếp theo thời gian</option>
            <option value="upvotes">Sắp xếp theo lượt thích</option>
          </select>
        </div>

        {/* Feedback list */}
        <ul className="space-y-4">
          {currentFeedbacks.map((fb) => (
            <li key={fb.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <span className="font-semibold">
                  {fb.subject} ({fb.faculty})
                </span>
                <span className="text-sm text-slate-500">{fb.time}</span>
              </div>
              <p className="mt-2">{fb.content}</p>
              <div className="mt-2 text-sm text-slate-600">
                <strong>Sinh viên:</strong> {fb.student} → <strong>Tutor:</strong> {fb.tutor}
              </div>
              <button className="mt-2 text-blue-600">👍 {fb.upvotes}</button>
            </li>
          ))}
        </ul>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-3 mt-4">
            {/* Prev / Next with wrap-around */}
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setCurrentPage((p) => (p === 1 ? totalPages : p - 1))
                }
                className="px-3 py-1 bg-slate-200 rounded"
              >
                Trang trước
              </button>

              {/* 🔹 Inline editable current page */}
              <span className="flex items-center gap-2">
                Trang
                <input
                  type="number"
                  style={{
                    appearance: 'textfield',
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                  }}

                  min="1"
                  max={totalPages}
                  value={pageInput || currentPage}   // show currentPage, allow editing
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const pageNum = Number(pageInput);
                      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                        setCurrentPage(pageNum);
                        setPageInput(""); // clear after jump
                      }
                    }
                  }}
                  className="w-8 px-1 py-1 border rounded text-center"
                />
                / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => (p === totalPages ? 1 : p + 1))
                }
                className="px-3 py-1 bg-slate-200 rounded"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}