import { useEffect, useState } from "react";
import { getMyHealthPrediction } from "../../../services/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthPrediction() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("prediction");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await getMyHealthPrediction();
        setResult(res.data.prediction);
      } catch (err) {
        setError("No health profile found. Please create one first.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">
        Analyzing your health profile...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10">
        {error}
      </p>
    );

  if (!result) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-green-50 min-h-screen">

      {/* ================= BACK + TOGGLE BUTTONS ================= */}
      <div className="flex items-center justify-between">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>

        {/* TOGGLE BUTTONS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveSection("prediction")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "prediction"
                ? "bg-green-600 text-white shadow"
                : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
            }`}
          >
            Health Predictions
          </button>

          <button
            onClick={() => setActiveSection("guidance")}
            className={`px-6 py-2 rounded-full font-medium transition ${
              activeSection === "guidance"
                ? "bg-green-600 text-white shadow"
                : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
            }`}
          >
            Lifestyle Guidance
          </button>
        </div>

        {/* BALANCE SPACE */}
        <div className="w-16" />
      </div>

      {/* ================= SECTION 1: PREDICTIONS ================= */}
      {activeSection === "prediction" && (
        <div className="space-y-8">

          {/* DOSHA IMBALANCE CIRCLES */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Dosha Imbalance Risk
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Probability of future imbalance in each dosha.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">

              {/* VATA */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-green-300 bg-green-50 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-700">
                    {(result.dosha_risk.future_vata_imbalance_risk * 100).toFixed(1)}%
                  </span>
                </div>
                <h4 className="mt-3 font-semibold text-gray-800">Vata</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Movement, nerves & digestion
                </p>
              </div>

              {/* PITTA */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-yellow-300 bg-yellow-50 flex items-center justify-center">
                  <span className="text-xl font-bold text-yellow-700">
                    {(result.dosha_risk.future_pitta_imbalance_risk * 100).toFixed(1)}%
                  </span>
                </div>
                <h4 className="mt-3 font-semibold text-gray-800">Pitta</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Metabolism & body heat
                </p>
              </div>

              {/* KAPHA */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-blue-300 bg-blue-50 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-700">
                    {(result.dosha_risk.future_kapha_imbalance_risk * 100).toFixed(1)}%
                  </span>
                </div>
                <h4 className="mt-3 font-semibold text-gray-800">Kapha</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Strength & immunity
                </p>
              </div>

            </div>
          </div>

          {/* ================= HEALTH RISK ANALYSIS ================= */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Health Risk Analysis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(result.health_risk).map(([risk, data]) => (
                <div
                  key={risk}
                  className={`p-3 rounded-xl border min-h-[110px] flex flex-col justify-between ${
                    data.present
                      ? "border-red-300 bg-red-50"
                      : "border-green-300 bg-green-50"
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800">
                    {risk.replace("risk_", "").replace(/_/g, " ")}
                  </p>

                  <p className="text-sm">
                    Status: {data.present ? "⚠️ Present" : "✅ Normal"}
                  </p>

                  <p className="text-xs text-gray-600">
                    Probability: {(data.probability * 100).toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= SECTION 2: LIFESTYLE GUIDANCE ================= */}
     {activeSection === "guidance" && (
  <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 space-y-12">

    <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
      🌿 Personalized Lifestyle Guidance
    </h2>

    <p className="text-gray-600 text-sm leading-relaxed">
      These gentle recommendations are designed to help you maintain balance,
      improve well-being, and reduce the risk of future health issues.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* DIET */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-800 mb-1">🥗 Diet Guidance</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.recommendations.diet}
        </p>
      </div>

      {/* LIFESTYLE */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-800 mb-1">🏃 Lifestyle Habits</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.recommendations.lifestyle}
        </p>
      </div>

      {/* YOGA */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-800 mb-1">🧘 Yoga & Movement</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.recommendations.yoga}
        </p>
      </div>

      {/* HERBAL */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h4 className="font-semibold text-green-800 mb-1">🌿 Herbal Support</h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {result.recommendations.herbal}
        </p>
      </div>

    </div>
  </div>
)}


    </div>
  );
}
