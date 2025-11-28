import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Book } from "lucide-react";
import { fetchTutorCourses } from "../../../services/tutorCourseService";

export default function TutorCoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchTutorCourses()
      .then(setCourses)
      .catch((err) => {
        console.error("Lỗi khi tải danh sách môn học:", err);
        setCourses([]);
      });
  }, []);

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Môn học của tôi
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Danh sách các môn học bạn đang phụ trách. Chọn một môn để xem chi
          tiết, quản lý buổi học và sinh viên.
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            to={`/tutor/courses/${course.id}`}
            key={course.id}
            className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-150 flex flex-col overflow-hidden group"
          >
            {/* Cover Image */}
            <div className="h-40 w-full overflow-hidden">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Card Content */}
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                {course.name}
              </h3>
              <p className="mt-1 text-xs md:text-sm text-slate-600 line-clamp-2 flex-1">
                {course.description}
              </p>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{course.studentCount} sinh viên</span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Book className="w-3.5 h-3.5" />
                  <span>{course.sessionCount} buổi</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Không có môn học nào được giao.
          </div>
        )}
      </div>
    </div>
  );
}