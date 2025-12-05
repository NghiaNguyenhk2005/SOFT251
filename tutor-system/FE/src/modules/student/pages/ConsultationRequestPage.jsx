import { useEffect, useState } from "react";
import {
  fetchConsultationConfig,
  createConsultationRequest,
} from "../../../services/consultationService";

export default function ConsultationRequestPage() {
  const [topics, setTopics] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [topic, setTopic] = useState("");
  const [tutorId, setTutorId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchConsultationConfig()
      .then((data) => {
        setTopics(data.topics || []);
        setTutors(data.tutors || []);
        setSlots(data.slots || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải cấu hình tư vấn:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !tutorId || !slotId) {
      alert("Vui lòng chọn chủ đề, tutor và thời gian tư vấn.");
      return;
    }

    const selectedTutor = tutors.find((t) => t.id === tutorId);
    const selectedSlot = slots.find((s) => s.id === slotId);

    const payload = {
      topic,
      tutorName: selectedTutor?.name,
      subject: subject || selectedTutor?.specialty || "",
      date: selectedSlot?.date,
      timeRange: selectedSlot?.timeRange,
      mode: selectedSlot?.mode,
      note,
    };

    try {
      setIsSubmitting(true);
      await createConsultationRequest(payload);
      alert("Yêu cầu tư vấn đã được gửi (mock).");
      // reset form
      setTopic("");
      setTutorId("");
      setSlotId("");
      setSubject("");
      setNote("");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu tư vấn:", error);
      alert("Gửi yêu cầu thất bại (mock). Thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Đặt lịch tư vấn
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">
          Chọn chủ đề, tutor và thời gian phù hợp để gửi yêu cầu tư vấn. Yêu
          cầu của bạn sẽ được tutor hoặc điều phối viên xem xét và phản hồi.
        </p>
      </div>

      {/* Form + danh sách slot gợi ý */}
      <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 p-4 md:p-6 shadow-sm"
        >
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
            Thông tin yêu cầu tư vấn
          </h2>

          {/* Chủ đề tư vấn */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Chủ đề tư vấn <span className="text-red-500">*</span>
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-slate-300 rounded-sm px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white"
            >
              <option value="">-- Chọn chủ đề --</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Tutor */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tutor / Giảng viên mong muốn <span className="text-red-500">*</span>
            </label>
            <select
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              className="w-full border border-slate-300 rounded-sm px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white"
            >
              <option value="">-- Chọn tutor --</option>
              {tutors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Môn học (tùy chọn) */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Môn học / chủ đề cụ thể (tùy chọn)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: Công nghệ phần mềm, Cấu trúc dữ liệu..."
              className="w-full border border-slate-300 rounded-sm px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            />
          </div>

          {/* Ghi chú */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Ghi chú cho tutor (tùy chọn)
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mô tả ngắn về khó khăn, câu hỏi của bạn..."
              className="w-full border border-slate-300 rounded-sm px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 resize-y"
            />
          </div>

          {/* Slot được chọn (nếu có) */}
          {slotId && (
            <div className="mb-4 text-xs text-slate-600 bg-slate-50 border border-dashed border-slate-300 px-3 py-2">
              <div className="font-semibold text-slate-800 mb-1">
                Thời gian đã chọn
              </div>
              {(() => {
                const s = slots.find((x) => x.id === slotId);
                if (!s) return null;
                return (
                  <>
                    <div>{s.date}</div>
                    <div>{s.timeRange}</div>
                    <div>Hình thức: {s.mode}</div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Submit */}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 border border-slate-900 text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
            </button>
          </div>
        </form>

        {/* Slot gợi ý (UC-STUDENT-003 – chọn thời gian) */}
        <div className="bg-white border border-slate-200 p-4 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
            Thời gian gợi ý
          </h2>
          <p className="text-xs md:text-sm text-slate-600 mb-3">
            Chọn một trong các khung giờ rảnh dưới đây. Thời gian chính xác
            vẫn sẽ được tutor hoặc điều phối viên xác nhận.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {slots.map((slot) => {
              const isSelected = slotId === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSlotId(slot.id)}
                  className={`text-left border text-sm px-3 py-2 ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 hover:border-slate-900 hover:bg-slate-50"
                  } transition-colors`}
                >
                  <div className="font-semibold">{slot.date}</div>
                  <div className="text-xs mt-0.5">{slot.timeRange}</div>
                  <div className="text-xs mt-0.5">
                    Hình thức:{" "}
                    <span className="font-medium">{slot.mode}</span>
                  </div>
                </button>
              );
            })}
            {slots.length === 0 && (
              <div className="text-sm text-slate-500">
                Hiện chưa có slot gợi ý (mock).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
