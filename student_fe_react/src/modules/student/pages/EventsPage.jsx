import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { fetchEvents } from "../../../api/studentApi";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchEvents()
      .then((data) => {
        setEvents(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách sự kiện:", err);
        setError("Không tải được danh sách sự kiện");
        setEvents([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="py-10 text-center text-slate-500">Đang tải sự kiện...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề trang */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Đăng kí tham gia các seminar sắp tới
        </h1>
        <p className="mt-3 text-sm md:text-base text-slate-600">
          Tham gia seminar là cơ hội để mở rộng kiến thức, cập nhật xu hướng
          mới và gặp gỡ các chuyên gia cũng như những bạn sinh viên cùng đam mê.
          Hãy chọn sự kiện phù hợp với bạn nhé.
        </p>
      </div>

      {/* Timeline các sự kiện */}
      <div className="relative max-w-4xl mx-auto">
        {/* đường thẳng dọc giống mockup */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 border-l border-slate-300 pointer-events-none" />

        <div className="space-y-10">
          {events.map((event, index) => (
            <div key={event.id} className="relative pl-10 md:pl-14">
              {/* chấm tròn trên timeline */}
              <div className="absolute left-3 md:left-5 top-6 w-3 h-3 rounded-full bg-slate-900" />

              <article className="border border-slate-300 bg-white px-6 md:px-8 py-6">
                {/* Ngày + tiêu đề */}
                <div className="mb-3">
                  <div className="text-xl md:text-2xl font-bold text-slate-900">
                    {event.date}
                  </div>
                  <h2 className="mt-1 text-lg md:text-2xl font-semibold text-slate-900">
                    {event.title}
                  </h2>
                </div>

                {/* Mô tả */}
                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  {event.description}
                </p>

                {/* Thông tin thêm */}
                <div className="mt-4 flex items-center gap-2 text-xs md:text-sm text-slate-600">
                  <CalendarDays className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>

                {/* Nút hành động */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-900 text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    Đăng kí
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-300 text-sm font-medium text-slate-800 hover:border-slate-900 transition-colors flex items-center gap-1"
                  >
                    Xem thêm
                    <span className="text-lg leading-none">›</span>
                  </button>
                </div>
              </article>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center text-sm text-slate-500">
              Hiện chưa có seminar nào được mở đăng kí.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
