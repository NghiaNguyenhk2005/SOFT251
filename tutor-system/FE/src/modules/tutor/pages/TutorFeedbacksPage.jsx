import { useState, useEffect } from "react";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import { getTutorFeedbacks, getTutorFeedbackStats } from "../../../services/tutorFeedbackService";

export default function TutorFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalFeedbacks: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch feedbacks first
      const feedbacksData = await getTutorFeedbacks();
      setFeedbacks(feedbacksData);
      
      // Calculate stats from the fetched feedbacks
      const statsData = await getTutorFeedbackStats(feedbacksData);
      setStats(statsData);
      
      console.log('📊 Feedback Stats:', statsData);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const calculatePercentage = (count) => {
    if (stats.totalFeedbacks === 0) return 0;
    return Math.round((count / stats.totalFeedbacks) * 100);
  };

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Đánh giá & Phản hồi
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Xem tất cả các đánh giá và phản hồi từ sinh viên về chất lượng giảng dạy của bạn.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Average Rating */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Đánh giá trung bình</div>
              <div className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                {stats.averageRating.toFixed(1)}
                <span className="text-lg text-slate-400">/5</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            {renderStars(stats.averageRating)}
          </div>
        </div>

        {/* Total Feedbacks */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-600">Tổng số đánh giá</div>
              <div className="text-3xl font-bold text-slate-900">
                {stats.totalFeedbacks}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Từ các buổi học đã hoàn thành
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Phân bố đánh giá</h3>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-slate-600 w-8">{rating} ⭐</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all"
                    style={{
                      width: `${calculatePercentage(stats.ratingDistribution[rating])}%`
                    }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-12 text-right">
                  {stats.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Tất cả đánh giá</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Đang tải...</div>
        ) : feedbacks.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              Chưa có đánh giá nào. Hoàn thành các buổi học để nhận đánh giá từ sinh viên.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center font-bold text-white shadow-md">
                      {feedback.studentName?.charAt(0) || 'S'}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Student Info */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">
                          {feedback.studentName || 'Ẩn danh'}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {feedback.studentId || 'N/A'}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {feedback.date}
                        </span>
                      </div>
                    </div>
                    
                    {/* Session Context */}
                    <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <p className="text-xs text-blue-900 font-medium">
                        📚 Buổi học: <span className="font-semibold">{feedback.sessionTitle}</span>
                      </p>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(feedback.rating)}
                      <span className="text-sm font-bold text-amber-600">
                        {feedback.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500">/ 5.0</span>
                    </div>
                    
                    {/* Comment */}
                    {feedback.comment && (
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          "{feedback.comment}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
