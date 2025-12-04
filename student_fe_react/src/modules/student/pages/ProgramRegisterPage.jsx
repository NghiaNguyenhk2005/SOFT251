import { useEffect, useState } from "react";
import { Menu, Search, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { fetchAvailableTutors, registerWithTutor } from "../../../api/studentApi";

export default function ProgramRegisterPage() {
  // State for Tutors
  const [query, setQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [isLoadingTutors, setIsLoadingTutors] = useState(false);
  const [tutorError, setTutorError] = useState(null);

  // Selection State
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Registration State
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState(null);

  // Load Tutors
  const loadTutors = async (subjectCode = "") => {
    setIsLoadingTutors(true);
    setTutorError(null);
    setSelectedTutor(null);
    setSelectedSubject(null);
    setRegisterMessage(null);
    
    try {
      const data = await fetchAvailableTutors({ subjectId: subjectCode });
      setTutors(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tutor:", err);
      setTutorError("Không tải được danh sách tutor");
      setTutors([]);
    } finally {
      setIsLoadingTutors(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const handleSearch = () => {
    loadTutors(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle Tutor Selection
  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
    setSelectedSubject(null);
    setRegisterMessage(null);
  };

  // Handle Subject Selection
  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    setRegisterMessage(null);
  };

  // Handle Registration
  const handleRegister = async () => {
    if (!selectedTutor || !selectedSubject) return;
    
    setIsRegistering(true);
    setRegisterMessage(null);
    try {
      // Call API to register with tutor
      await registerWithTutor(selectedTutor._id, selectedSubject);
      
      // Success - Auto Accept
      setRegisterMessage({ type: 'success', text: 'Đăng ký thành công! Bạn đã có thể đặt lịch với tutor này.' });
      
      // Optional: Clear selection or keep it to show success
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      // Check for specific error (e.g., already registered)
      if (err.response && err.response.status === 409) {
        setRegisterMessage({ type: 'warning', text: 'Bạn đã đăng ký môn này với tutor rồi.' });
      } else {
        setRegisterMessage({ type: 'error', text: 'Đăng ký thất bại. Vui lòng thử lại.' });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="py-10 md:py-12">
      {/* Tiêu đề */}
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Đăng kí tutor
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-500">
          Lựa chọn tutor và môn học để bắt đầu quá trình tư vấn
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
              onKeyDown={handleKeyDown}
              placeholder="Nhập mã môn (VD: CO3001)..."
              className="flex-1 bg-transparent outline-none text-sm md:text-base text-slate-700 placeholder:text-slate-400"
            />
            <button onClick={handleSearch} type="button">
              <Search className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          {tutorError && <p className="text-red-500 text-sm text-center mt-2">{tutorError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách Tutor */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Danh sách Tutor</h2>
          
          {isLoadingTutors && <div className="text-slate-500">Đang tải danh sách tutor...</div>}
          
          {!isLoadingTutors && tutors.length === 0 && !tutorError && (
            <div className="text-slate-500">Không tìm thấy tutor nào.</div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {tutors.map((tutor) => (
              <article
                key={tutor._id}
                onClick={() => handleSelectTutor(tutor)}
                className={`
                  cursor-pointer rounded-lg shadow-sm border transition-all duration-150 flex flex-col overflow-hidden
                  ${selectedTutor?._id === tutor._id 
                    ? "ring-2 ring-violet-500 border-violet-500 bg-violet-50" 
                    : "bg-white border-slate-200 hover:shadow-md hover:border-violet-300"}
                `}
              >
                <div className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                    {tutor.userId?.fullName ? tutor.userId.fullName.charAt(0) : "T"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {tutor.userId?.fullName || "Tutor"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {tutor.bio || "Chưa có mô tả"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tutor.subjectIds?.slice(0, 3).map(sub => (
                        <span key={sub} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Cột phải: Chọn môn & Đăng ký */}
        <div className="lg:col-span-1">
          {selectedTutor && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-4">
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {selectedTutor.userId?.fullName}
                </h3>
                <p className="text-sm text-slate-500 mb-6">Chọn môn học bạn muốn đăng ký</p>

                {/* Chọn môn học */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Môn học</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.subjectIds?.map(sub => (
                      <button
                        key={sub}
                        onClick={() => handleSelectSubject(sub)}
                        className={`
                          px-3 py-1.5 text-sm rounded-full border transition-colors
                          ${selectedSubject === sub
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-slate-700 border-slate-300 hover:border-violet-400"}
                        `}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nút Đăng ký */}
                <button
                  onClick={handleRegister}
                  disabled={!selectedSubject || isRegistering}
                  className={`
                    w-full py-2.5 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2
                    ${!selectedSubject || isRegistering
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-violet-600 hover:bg-violet-700 shadow-sm"}
                  `}
                >
                  {isRegistering ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Đăng ký
                    </>
                  )}
                </button>

                {registerMessage && (
                  <div className={`mt-4 p-3 rounded text-sm flex items-start gap-2 ${
                    registerMessage.type === 'success' ? 'bg-green-50 text-green-700' : 
                    registerMessage.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {registerMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <span>{registerMessage.text}</span>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
