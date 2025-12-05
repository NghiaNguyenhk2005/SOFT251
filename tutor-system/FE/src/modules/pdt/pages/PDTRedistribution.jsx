import GoBackButton from "../components/GoBackBTN.jsx";
import { useState } from "react";
export default function PDTRedistributionUI() {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Tutors with current subject + allowed subjects
  const tutors = [
    { id: 1, name: "Nguyễn Văn A", subject: "Cơ khí", allowedSubjects: ["Cơ khí", "Cơ điện tử", "Vật liệu"] },
    { id: 2, name: "Trần Thị B", subject: "Điện – Điện tử", allowedSubjects: ["Điện – Điện tử", "Cơ điện tử", "Khoa học & Kỹ thuật Máy tính"] },
    { id: 3, name: "Lê Văn C", subject: "Công nghệ Thông tin", allowedSubjects: ["Công nghệ Thông tin", "Kỹ thuật phần mềm", "Khoa học Máy tính"] },
    { id: 4, name: "Phạm Thùy D", subject: "Kỹ thuật Hóa học", allowedSubjects: ["Hóa đại cương", "Kỹ thuật Hóa học", "Công nghệ Thực phẩm"] },
    { id: 5, name: "Bùi Minh E", subject: "Quản lý Công nghiệp", allowedSubjects: ["Quản lý Công nghiệp", "Logistics & Chuỗi cung ứng"] },
  ];

  // Preloaded history with 25 records
  const [history, setHistory] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      tutor: `Tutor ${i + 1}`,
      from: "Cơ khí",
      to: i % 2 === 0 ? "Cơ điện tử" : "Vật liệu",
      date: new Date(2025, 11, (i % 30) + 1).toLocaleDateString("vi-VN"),
    }))
  );

  const handleReassign = () => {
    if (selectedTutor && newSubject) {
      const newRecord = {
        id: history.length + 1,
        tutor: selectedTutor.name,
        from: selectedTutor.subject,
        to: newSubject,
        date: new Date().toLocaleDateString("vi-VN"),
      };
      setHistory([...history, newRecord]);
      selectedTutor.subject = newSubject;
      setNewSubject("");
      alert(`Tutor ${selectedTutor.name} đã được chuyển từ "${newRecord.from}" sang "${newRecord.to}".`);
    }
  };

  // Pagination logic (latest first)
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const sortedHistory = [...history].reverse(); // newest first
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHistory = sortedHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-2xl font-bold text-slate-800">
        Tái phân bổ Tutor theo môn học 
      </h1>
      <GoBackButton />
    </div>
      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Chọn Tutor</label>
          <select
            value={selectedTutor?.id || ""}
            onChange={(e) => setSelectedTutor(tutors.find((t) => t.id === parseInt(e.target.value)))}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">-- Chọn Tutor --</option>
            {tutors.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (hiện tại: {t.subject})
              </option>
            ))}
          </select>
        </div>

        {selectedTutor && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Môn hiện tại</label>
              <input readOnly value={selectedTutor.subject} className="w-full border rounded-md px-3 py-2 bg-slate-50" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chọn môn mới (phù hợp)</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">-- Chọn môn học --</option>
                {selectedTutor.allowedSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleReassign}
          disabled={!selectedTutor || !newSubject || newSubject === selectedTutor.subject}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:opacity-50"
        >
          Xác nhận chuyển
        </button>
      </div>

      {/* History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Lịch sử phân bổ</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Tutor</th>
              <th className="p-2 text-left">Từ môn</th>
              <th className="p-2 text-left">Đến môn</th>
              <th className="p-2 text-left">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {currentHistory.map((h) => (
              <tr key={h.id} className="border-t">
                <td className="p-2">{h.tutor}</td>
                <td className="p-2">{h.from}</td>
                <td className="p-2">{h.to}</td>
                <td className="p-2">{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}