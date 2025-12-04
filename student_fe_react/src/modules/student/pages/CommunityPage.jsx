import { useEffect, useState } from "react";
import { Facebook } from "lucide-react";
import { fetchCommunities } from "../../../api/studentApi";

export default function CommunityPage() {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetchCommunities()
      .then((data) => {
        setCommunities(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách cộng đồng:", err);
        setError("Không tải được danh sách cộng đồng");
        setCommunities([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="py-10 text-center text-slate-500">Đang tải cộng đồng...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề trang */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Cộng đồng trực tuyến
        </h1>
        <p className="mt-3 text-sm md:text-base text-slate-600">
          Tham gia các cộng đồng sinh viên để cập nhật thông tin, chia sẻ tài
          liệu và kết nối với những người có cùng mối quan tâm.
        </p>
      </div>

      {/* Grid các cộng đồng */}
      <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
        {communities.map((community) => (
          <article
            key={community.id}
            className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-150 flex flex-col overflow-hidden"
          >
            {/* Ảnh cover lớn */}
            <div className="h-40 md:h-44 w-full overflow-hidden bg-white flex items-center justify-center p-4 border-b border-slate-100">
              <img
                src={community.imageUrl}
                alt={community.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Nội dung card */}
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <h2 className="text-base md:text-lg font-semibold text-slate-900">
                {community.name}
              </h2>
              <p className="mt-2 text-xs md:text-sm text-slate-600 line-clamp-3">
                {community.description}
              </p>

              <div className="mt-3 text-xs text-slate-500">
                {community.memberCount}
              </div>

              {/* Footer: icon Facebook + nút tham gia */}
              <div className="mt-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <Facebook className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>Facebook Group</span>
                </div>

                <a
                  href={community.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs md:text-sm font-semibold text-slate-900 hover:underline"
                >
                  Tham gia nhóm &gt;
                </a>
              </div>
            </div>
          </article>
        ))}

        {communities.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-500">
            Chưa có cộng đồng nào được hiển thị.
          </div>
        )}
      </div>
    </div>
  );
}
