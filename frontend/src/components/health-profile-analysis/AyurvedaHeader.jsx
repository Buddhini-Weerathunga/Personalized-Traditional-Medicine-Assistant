import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AyurvedaHeader({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <header className="bg-white/90 backdrop-blur border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-xl shadow-sm">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-green-800">
              Ayu Ceylon
            </h1>
            <p className="text-xs text-green-600">
              Holistic Wellness Platform
            </p>
          </div>
        </div>

        {/* RIGHT: USER INFO */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}
