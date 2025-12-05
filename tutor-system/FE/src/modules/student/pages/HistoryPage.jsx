import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { fetchHistorySessions } from "../../../services/historyService";

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchHistorySessions()
      .then(setSessions)
      .catch((err) => {
        console.error("Lỗi khi tải lịch sử buổi học:", err);
        setSessions([]);
      });
  }, []);

  const openRatingModal = (session) => {
    setSelectedSession(session);
    setRating(0);
    setHoverRating(0);
    setComment("");
    setIsModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sau này sẽ gửi rating + comment lên backend.
    // Hiện tại chỉ giả lập.
    alert("Đánh giá thành công");
    closeRatingModal();
  };

  const effectiveRating = hoverRating || rating;

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề trang */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:3xl font-bold text-slate-900">
          Lịch sử &amp; Đánh giá
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Xem lại các buổi học đã hoàn thành và gửi đánh giá cho tutor.
        </p>
      </div>

      {/* Bảng lịch sử buổi học */}
      <div className="border border-slate-300 bg-white">
        <div className="px-4 md:px-6 py-3 border-b border-slate-300">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Các buổi học đã hoàn thành
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50">
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Môn học
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Tutor / Giảng viên
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Thời gian
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Link Google Meet
                </th>
                <th className="px-4 md:px-6 py-3 text-right font-semibold">
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr
                  key={session.id}
                  className={`border-b border-slate-200 ${
                    index % 2 === 1 ? "bg-white" : "bg-slate-50/40"
                  }`}
                >
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-900">
                    {session.subjectName}
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-800">
                    {session.tutorName}
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-700">
                    <div>{session.date}</div>
                    <div className="text-xs text-slate-500">
                      {session.timeRange}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-700">
                    {session.meetLink ? (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs md:text-sm text-blue-700 hover:underline break-all"
                      >
                        {session.meetLink}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">
                        (Không có)
                      </span>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-right">
                    <button
                      type="button"
                      onClick={() => openRatingModal(session)}
                      className="px-3 py-1.5 border border-slate-900 text-xs md:text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                    >
                      Đánh giá
                    </button>
                  </td>
                </tr>
              ))}

              {sessions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 md:px-6 py-4 text-center text-slate-500 text-sm"
                  >
                    Chưa có buổi học nào được hoàn thành.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal đánh giá */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md mx-4 rounded-md shadow-lg">
            {/* Header modal */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Đánh giá buổi học
              </h3>
              <button
                type="button"
                onClick={closeRatingModal}
                className="p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-4 md:px-5 py-4 space-y-4">
              {/* Thông tin buổi học */}
              <div className="text-sm">
                <div className="text-xs text-slate-500">Môn học</div>
                <div className="font-semibold text-slate-900">
                  {selectedSession.subjectName}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Tutor / Giảng viên:
                  <span className="ml-1 text-slate-800">
                    {selectedSession.tutorName}
                  </span>
                </div>
              </div>

              {/* Rating stars */}
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  Mức độ hài lòng
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className="w-6 h-6"
                        fill={
                          starValue <= effectiveRating ? "#facc15" : "none"
                        }
                        stroke={
                          starValue <= effectiveRating ? "#eab308" : "#9ca3af"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs text-slate-600">
                    {effectiveRating > 0
                      ? `${effectiveRating}/5`
                      : "Chưa chọn"}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  Góp ý về buổi học
                </div>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bạn có góp ý gì cho buổi học này?"
                  className="w-full border border-slate-300 rounded-sm px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 resize-y"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeRatingModal}
                  className="px-3 py-1.5 border border-slate-300 text-xs md:text-sm text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 border border-slate-900 text-xs md:text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
