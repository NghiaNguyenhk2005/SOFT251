import { useEffect, useState } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchDocuments } from "../../../api/studentApi";

export default function LibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // gọi backend để lấy danh sách tài liệu
  useEffect(() => {
    setIsLoading(true);
    fetchDocuments()
      .then((data) => {
        setDocuments(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách tài liệu:", err);
        setDocuments([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const currentPage = 1;
  const totalPages = 4;

  if (isLoading) return <div className="py-10 text-center text-slate-500">Đang tải tài liệu...</div>;

  return (
    <div className="py-10 md:py-12">
      {/* Card lớn chứa toàn bộ bảng, giống mockup */}
      <div className="border border-slate-300 bg-white">
        {/* Header: tiêu đề + button */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-300">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Chia sẻ tài liệu
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-600">
              Chọn tài liệu môn bạn cần và chia sẻ tài liệu bạn có cho người
              khác nhé!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-slate-800 text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
            >
              Đăng tài liệu
            </button>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center border border-slate-800 hover:bg-slate-900 hover:text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bảng tài liệu */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50">
                <th className="text-left font-semibold px-6 py-3">Môn</th>
                <th className="text-left font-semibold px-6 py-3">
                  Loại tài liệu
                </th>
                <th className="text-left font-semibold px-6 py-3">
                  Tên người đăng
                </th>
                <th className="text-left font-semibold px-6 py-3">
                  Date <span className="text-xs">↓</span>
                </th>
                <th className="text-right font-semibold px-6 py-3">View</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={`border-b border-slate-200 ${
                    index % 2 === 1 ? "bg-white" : "bg-slate-50/40"
                  }`}
                >
                  <td className="px-6 py-3 align-middle text-slate-900">
                    {doc.subject}
                  </td>
                  <td className="px-6 py-3 align-middle text-slate-700">
                    {doc.type}
                  </td>
                  <td className="px-6 py-3 align-middle text-slate-700">
                    {doc.author}
                  </td>
                  <td className="px-6 py-3 align-middle text-slate-700">
                    {doc.date}
                  </td>
                  <td className="px-6 py-3 align-middle text-right">
                    <button
                      type="button"
                      className="text-xs font-semibold text-slate-900 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {documents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500 text-sm"
                  >
                    Không có tài liệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh phân trang giả phía dưới */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Prev */}
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-800 text-xs md:text-sm hover:bg-slate-900 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>
          </div>

          {/* số trang */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                type="button"
                className={`w-8 h-8 border text-xs md:text-sm flex items-center justify-center ${
                  page === currentPage
                    ? "border-slate-800"
                    : "border-slate-300 hover:border-slate-800"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next */}
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-800 text-xs md:text-sm hover:bg-slate-900 hover:text-white transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
