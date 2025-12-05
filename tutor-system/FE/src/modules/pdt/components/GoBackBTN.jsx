import { useNavigate } from "react-router-dom";

export default function GoBackButton() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-end mb-4"> {/* right-align at top */}
      <button
        onClick={() => navigate(-1)}
        className="
          flex items-center gap-2
          px-5 py-2.5
          bg-gradient-to-r from-blue-600 to-indigo-600
          text-white font-semibold
          rounded-lg shadow-md
          transition-transform transform hover:scale-105 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-blue-400
        "
      >
        <span className="text-lg">⬅</span>
        <span>Quay lại</span>
      </button>
    </div>
  );
}