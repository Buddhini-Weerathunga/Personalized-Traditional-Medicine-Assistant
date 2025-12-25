import { Mic, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthProfileMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <span className="text-white text-lg">❤</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Create Health Profile
            </h1>
          </div>
        </div>

        {/* SUBTITLE */}
        <p className="text-center text-gray-600 mb-12">
          Choose your preferred method to create your Ayurvedic health profile
        </p>
 <button
      onClick={() => navigate("/health-profile/view")}
      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
    >
      👁 View Health Profile
    </button>

    <button
  onClick={() => navigate("/health-prediction")}
  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
>
  🔮 Predict My Health
</button>

        {/* OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* VOICE BASED */}
          <div
            onClick={() => navigate("/health-profile/voice-assistant")}
            className="cursor-pointer bg-white border-2 border-blue-200 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-3">
              Voice-Based Profile
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Simply speak about your health concerns, lifestyle, and symptoms.
              Our AI will automatically generate your complete health profile.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 space-y-1">
              <p>✓ Quick & Easy</p>
              <p>✓ Natural Conversation</p>
              <p>✓ AI-Powered Analysis</p>
            </div>
          </div>

          {/* MANUAL FORM */}
          <div
            onClick={() => navigate("/health-profile/create")}
            className="cursor-pointer bg-white border-2 border-green-200 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-center mb-3">
              Fill Manual Form
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Complete a detailed step-by-step form covering all aspects of your
              health, lifestyle, and medical history.
            </p>

            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700 space-y-1">
              <p>✓ Detailed & Precise</p>
              <p>✓ Structured Information</p>
              <p>✓ Complete Control</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
