import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Leaf, Activity, Heart, Stethoscope } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  if (!user)
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const features = [
    {
      title: "Disease Detection",
      description: "Identify health issues through Ayurvedic analysis",
      icon: Stethoscope,
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      iconColor: "text-red-600",
      path: "/home"
    },
    {
      title: "Plant Identification",
      description: "Discover medicinal plants and their properties",
      icon: Leaf,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600",
      path: "/plant-identification"
    },
    {
      title: "Yoga Consultation",
      description: "Get personalized yoga recommendations",
      icon: Activity,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600",
      path: "/yoga-consultation"
    },
    {
      title: "Personalized Treatment",
      description: "Receive customized Ayurvedic treatment plans",
      icon: Heart,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600",
      path: "/personalized-treatment"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Ayu Ceylon</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.name} 👋
          </h2>
          <p className="text-gray-600">
            Choose a service to begin your Ayurvedic wellness journey
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className={`${feature.color} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            About Our Services
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our Ayurvedic platform combines ancient wisdom with modern technology to provide 
            comprehensive health solutions. Each service is designed to help you achieve balance 
            and wellness through natural, holistic approaches rooted in traditional Ayurvedic principles.
          </p>
        </div>
      </main>
    </div>
  );
}