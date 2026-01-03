import { useEffect, useState } from "react";
import { getProfile } from "../../services/api";
import { Heart, User, TrendingUp, Utensils, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AyurvedaDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  const allFeatures = [
    {
      title: "Health Profile",
      description: "Create and manage your complete health profile with the help of an AI voice assistant or by filling a guided manual form",
      icon: User,
      color:
        "bg-white hover:bg-green-50 border border-green-200 hover:border-green-300",
      iconColor: "text-green-600",
      path: "/health-profile/menu"
    },
    {
      title: "Predict future health risks & get personalized Ayurvedic care",
      description:
        "AI-powered prediction of health issues with personalized Ayurvedic treatment",
      icon: TrendingUp,
      color:
        "bg-white hover:bg-green-50 border border-green-200 hover:border-green-300",
      iconColor: "text-green-600",
      path: "/health-prediction"
    },
    {
      title: "Multi-Profile Management",
      description: "Manage multiple family health profiles, track wellness status, and view personalized health insights for each member",
      icon: Users,
      color:
        "bg-white hover:bg-green-50 border border-green-200 hover:border-green-300",
      iconColor: "text-green-600",
      path: "/multi-profile"
    },
    {
      title: "Digital Diet Coach",
      description: "Input your diet details and receive AI-based guidance on whether your meals match your health condition",
      icon: Utensils,
      color:
        "bg-white hover:bg-green-50 border border-green-200 hover:border-green-300",
      iconColor: "text-green-600",
      path: "/diet-coach"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-semibold text-green-800 mb-2">
          Welcome, {user.name} 🙏
        </h2>
        <p className="text-gray-600 mb-10">
          Begin your journey to holistic wellness.
        </p>

        {/* FEATURES GRID */}
       {/* FEATURES GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
  {allFeatures.map((feature, i) => {
    const Icon = feature.icon;
    return (
      <div
        key={i}
        onClick={() => handleNavigate(feature.path)}
        className={`cursor-pointer ${feature.color}
        rounded-2xl p-6 h-40
        flex items-center
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg`}
      >
        <div className="flex gap-4 items-start w-full">
          <div className="p-3 bg-green-100 rounded-xl shrink-0">
            <Icon className={`w-7 h-7 ${feature.iconColor}`} />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-snug">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    );
  })}
</div>
</main>
    </div>
  );
}
