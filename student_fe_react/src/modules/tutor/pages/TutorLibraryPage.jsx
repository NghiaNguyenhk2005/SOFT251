import { useEffect, useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { fetchDocuments } from "../../../services/documentService";

export default function TutorLibraryPage() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments().then(setDocuments).catch((err) => {
      console.error("Lỗi khi tải danh sách tài liệu:", err);
      setDocuments([]);
    });
  }, []);

  const currentPage = 1;
  const totalPages = 4;

  return (
    <div className="py-6 md:py-8">
      <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Thư viện & Chia sẻ tài liệu
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-600">
              Quản lý và chia sẻ tài liệu học tập cho các môn học bạn phụ trách.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white text-sm font-medium rounded-md hover:bg-sky-600"
            >
              <Upload className="w-4 h-4" />
              <span>Đăng tài liệu</span>
            </button>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-100"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="text-left font-semibold px-5 py-3 text-slate-600">Môn</th>
                <th className="text-left font-semibold px-5 py-3 text-slate-600">Loại tài liệu</th>
                <th className="text-left font-semibold px-5 py-3 text-slate-600">Người đăng</th>
                <th className="text-left font-semibold px-5 py-3 text-slate-600">Ngày đăng</th>
                <th className="text-right font-semibold px-5 py-3 text-slate-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={doc.id} className="border-t border-slate-200">
                  <td className="px-5 py-3 align-middle text-slate-800 font-medium">{doc.subject}</td>
                  <td className="px-5 py-3 align-middle text-slate-600">{doc.type}</td>
                  <td className="px-5 py-3 align-middle text-slate-600">{doc.author}</td>
                  <td className="px-5 py-3 align-middle text-slate-600">{doc.date}</td>
                  <td className="px-5 py-3 align-middle text-right">
                    <button type="button" className="text-xs font-semibold text-sky-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Không có tài liệu nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200">
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-xs rounded-md hover:bg-slate-100"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          </div>
          <div className="text-xs text-slate-600">
            Page {currentPage} of {totalPages}
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-xs rounded-md hover:bg-slate-100"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}