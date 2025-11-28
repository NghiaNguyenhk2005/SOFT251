import { useEffect, useState } from "react";
import {
  fetchStudentConsultations,
  cancelConsultationRequest,
} from "../../../services/consultationService";

function StatusBadge({ status }) {
  const map = {
    PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-800" },
    APPROVED: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
    REJECTED: { label: "Bị từ chối", className: "bg-red-100 text-red-700" },
    CANCELED: { label: "Đã hủy", className: "bg-slate-100 text-slate-600" },
  };
  const info = map[status] || {
    label: status || "Không rõ",
    className: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${info.className}`}
    >
      {info.label}
    </span>
  );
}

export default function MyConsultationsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    fetchStudentConsultations()
      .then(setItems)
      .catch((err) => {
        console.error("Lỗi khi tải lịch tư vấn:", err);
      });
  }, []);

  const handleCancel = async (id) => {
    const item = items.find((x) => x.id === id);
    if (!item) return;
    if (item.status !== "PENDING" && item.status !== "APPROVED") {
      alert("Chỉ có thể hủy các buổi đang chờ duyệt hoặc đã duyệt.");
      return;
    }
    if (!window.confirm("Bạn chắc chắn muốn hủy yêu cầu/buổi tư vấn này?")) {
      return;
    }
    try {
      setIsCanceling(true);
      await cancelConsultationRequest(id);
      const updated = await fetchStudentConsultations();
      setItems(updated);
      alert("Đã hủy (mock).");
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu:", error);
      alert("Hủy thất bại (mock).");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Lịch tư vấn của tôi
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">
          Xem lại các yêu cầu tư vấn đã gửi và trạng thái xử lý. Bạn có thể xem
          chi tiết từng buổi hoặc hủy nếu không còn nhu cầu (mock).
        </p>
      </div>

      {/* Bảng danh sách */}
      <div className="border border-slate-200 bg-white shadow-sm">
        <div className="px-4 md:px-6 py-3 border-b border-slate-200">
          <h2 className="text-sm md:text-base font-semibold text-slate-900">
            Danh sách các buổi tư vấn
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Chủ đề
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Tutor
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Thời gian
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Hình thức
                </th>
                <th className="px-4 md:px-6 py-3 text-left font-semibold">
                  Trạng thái
                </th>
                <th className="px-4 md:px-6 py-3 text-right font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-slate-100 ${
                    index % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                  }`}
                >
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-900">
                    <div className="font-medium text-sm">{item.topic}</div>
                    <div className="text-xs text-slate-500">
                      {item.subject || ""}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-800">
                    {item.tutorName}
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-700">
                    <div>{item.date}</div>
                    <div className="text-xs text-slate-500">
                      {item.timeRange}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-slate-700">
                    {item.mode}
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 md:px-6 py-3 align-middle text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="px-2 py-1 border border-slate-300 text-xs hover:bg-slate-50"
                      >
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        disabled={isCanceling}
                        onClick={() => handleCancel(item.id)}
                        className="px-2 py-1 border border-slate-900 text-xs font-medium text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 md:px-6 py-4 text-center text-sm text-slate-500"
                  >
                    Bạn chưa có yêu cầu tư vấn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md mx-4 rounded-md shadow-lg">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Chi tiết buổi tư vấn
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Đóng
              </button>
            </div>
            <div className="px-4 md:px-5 py-4 space-y-3 text-sm text-slate-800">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Chủ đề</div>
                <div className="font-semibold">{selected.topic}</div>
                {selected.subject && (
                  <div className="text-xs text-slate-500">
                    Môn học:{" "}
                    <span className="text-slate-800">{selected.subject}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Tutor</div>
                <div>{selected.tutorName}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Thời gian</div>
                <div>{selected.date}</div>
                <div className="text-xs text-slate-500">
                  {selected.timeRange} – {selected.mode}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Ghi chú</div>
                <div className="text-sm">
                  {selected.note || "(Không có ghi chú)"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">
                  Trạng thái hiện tại
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
