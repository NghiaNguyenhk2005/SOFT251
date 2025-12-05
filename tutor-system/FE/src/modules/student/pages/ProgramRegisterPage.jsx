import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { fetchTutors } from "../../../services/tutorService";

export default function ProgramRegisterPage() {
  const [query, setQuery] = useState("");
  const [tutors, setTutors] = useState([]);

  // gọi "backend" (hiện tại là mock) khi vào trang
  useEffect(() => {
    fetchTutors().then(setTutors).catch((err) => {
      console.error("Lỗi khi tải danh sách tutor:", err);
      setTutors([]);
    });
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    const q = query.toLowerCase();
    return (
      tutor.tutorCode.toLowerCase().includes(q) ||
      tutor.fullName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề */}
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Đăng kí tutor
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-500">
          Lựa chọn tutor phù hợp với thời gian của bạn
        </p>
      </div>

      {/* Thanh search */}
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-violet-50">
            <Menu className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="C03001,..."
              className="flex-1 bg-transparent outline-none text-sm md:text-base text-slate-700 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Grid danh sách tutor */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredTutors.map((tutor) => (
          <article
            key={tutor.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col overflow-hidden"
          >
            {/* Ảnh placeholder */}
            <div className="bg-slate-200 h-40 md:h-44 flex items-center justify-center">
              <div className="w-12 h-12 rounded-md border-2 border-dashed border-slate-400 flex items-center justify-center text-xs text-slate-500">
                IMG
              </div>
            </div>

            {/* Nội dung card */}
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-700 rounded">
                  {tutor.tutorCode}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-slate-900">
                {tutor.fullName}
              </h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {tutor.description}
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center text-sm font-medium text-slate-900 hover:underline"
              >
                Read more
                <span className="ml-1">&gt;</span>
              </button>
            </div>
          </article>
        ))}

        {filteredTutors.length === 0 && (
          <div className="col-span-full text-center text-slate-500 text-sm">
            Không tìm thấy tutor nào phù hợp với từ khóa.
          </div>
        )}
      </div>
    </div>
  );
}
