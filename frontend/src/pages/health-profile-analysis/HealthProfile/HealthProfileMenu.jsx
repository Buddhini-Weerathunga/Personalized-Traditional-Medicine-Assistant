import { useState, useEffect } from "react";
import { Mic, FileText, ArrowLeft, Leaf, Heart, Brain, Sun } from "lucide-react";
import { getProfile } from "../../../services/api";
import AyurvedaHeader from "../../../components/health-profile-analysis/AyurvedaHeader";
import { useNavigate } from "react-router-dom";


export default function HealthProfileMenu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
    getProfile()
      .then(res => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      });
  }, [navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <AyurvedaHeader user={user} />


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-green-100 transition"
            >
              <ArrowLeft className="w-6 h-6 text-green-700" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-800">
              Create Health Profile
            </h1>
          </div>
          <button 
            onClick={() => window.location.href = "/health-profile/view"}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
          >
            View Health Profile
          </button>
        </div>

        {/* Ayurveda Elements Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Balance Your Doshas</h2>
              <p className="text-green-50 mb-4">
                Choose your preferred method to create your personalized Ayurvedic health profile
              </p>
              <div className="flex gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  <span>Vata · Pitta · Kapha</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span>Mind-Body Balance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  <span>Natural Wellness</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <Leaf className="w-24 h-24 text-white/30 relative" />
              </div>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Voice-Based Profile */}
          <div 
            onClick={() => window.location.href = "/health-profile/voice-assistant"}
            className="cursor-pointer bg-white border-2 border-blue-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-inner">
                <Mic className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
              Voice-Based Profile
            </h2>

            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Simply speak about your health concerns, lifestyle, and symptoms.
              Our AI will automatically generate your complete health profile.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 space-y-3 mb-6">
              <div className="flex items-center gap-3 text-blue-800">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Quick & Easy</span>
              </div>
              <div className="flex items-center gap-3 text-blue-800">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">Natural Conversation</span>
              </div>
              <div className="flex items-center gap-3 text-blue-800">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-medium">AI-Powered Analysis</span>
              </div>
            </div>

            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Recommended for Quick Setup
              </span>
            </div>
          </div>

          {/* Manual Form */}
          <div 
            onClick={() => window.location.href = "/health-profile/create"}
            className="cursor-pointer bg-white border-2 border-green-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 transition-all"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-inner">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
              Fill Manual Form
            </h2>

            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Complete a detailed step-by-step form covering all aspects of your
              health, lifestyle, and medical history.
            </p>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 space-y-3 mb-6">
              <div className="flex items-center gap-3 text-green-800">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="font-medium">Detailed & Precise</span>
              </div>
              <div className="flex items-center gap-3 text-green-800">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="font-medium">Structured Information</span>
              </div>
              <div className="flex items-center gap-3 text-green-800">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="font-medium">Complete Control</span>
              </div>
            </div>

            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Best for Comprehensive Assessment
              </span>
            </div>
          </div>
        </div>

        {/* Ayurveda Principles Footer */}
        <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                <Sun className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Holistic Approach</h3>
              <p className="text-sm text-gray-600">
                Understanding your unique constitution and imbalances
              </p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Natural Remedies</h3>
              <p className="text-sm text-gray-600">
                Personalized recommendations based on ancient wisdom
              </p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Preventive Care</h3>
              <p className="text-sm text-gray-600">
                Focus on balance and prevention for long-term wellness
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}