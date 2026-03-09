import { useEffect, useState } from "react";
import { getProfile } from "../../services/api";
import { Heart, User, TrendingUp, Utensils, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AyurvedaDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // PROTECTED CALL
    getProfile()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (!user)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const allFeatures = [
    {
      title: "Health Profile",
      description: "Create and manage your complete health profile",
      icon: User,
      color: "bg-amber-50 hover:bg-amber-100 border-amber-200",
      iconColor: "text-amber-600",
      path: "/health-profile/menu"
    },
    {
      title: "Predict Future Imbalances",
      description: "AI-powered predictions for potential health issues",
      icon: TrendingUp,
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
      iconColor: "text-indigo-600",
      path: "/predict-imbalances"
    },
    {
      title: "Personalized Treatment",
      description: "Get customized Ayurvedic treatment recommendations",
      icon: Heart,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600",
      path: "/personalized-treatment"
    },
    {
      title: "Multi-Profile Management",
      description: "Manage health profiles for your entire family",
      icon: Users,
      color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
      iconColor: "text-teal-600",
      path: "/multi-profile"
    },
    {
      title: "Digital Diet Coach",
      description: "Get personalized nutrition and meal recommendations",
      icon: Utensils,
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      iconColor: "text-orange-600",
      path: "/diet-coach"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Ayurveda Portal</h1>
              <p className="text-xs text-gray-500">Holistic Wellness Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-4">Welcome, {user.name} 🙏</h2>
        <p className="text-gray-600 text-lg mb-6">
          Begin your journey to holistic wellness.
        </p>

        {/* ALL FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                onClick={() => handleNavigate(feature.path)}
                className={`cursor-pointer ${feature.color} border-2 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg shadow">
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
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
