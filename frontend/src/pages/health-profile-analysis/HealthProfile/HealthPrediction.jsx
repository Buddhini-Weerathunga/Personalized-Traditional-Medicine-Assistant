import { useLocation, useNavigate } from "react-router-dom";

export default function HealthPrediction() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 🚨 If user refreshes page or opens directly
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No prediction data found</p>
      </div>
    );
  }

  // ✅ SAFE DESTRUCTURING WITH FALLBACKS
  const {
    predicted_dosha = "Unknown",
    dosha_risk = {},
    health_risks = {}, // prevents Object.entries crash
    primary_future_condition = "Not available",
    risk_level = "Unknown"
  } = state;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold">🌿 Health Prediction</h1>
          <p className="text-gray-500 text-sm">
            AI-based Ayurvedic health analysis
          </p>
        </div>

        {/* Predicted Dosha */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Predicted Dosha</h2>
          <p className="text-3xl font-bold text-green-600">
            {predicted_dosha}
          </p>
        </div>

        {/* Dosha Risk */}
        {Object.keys(dosha_risk).length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Dosha Imbalance Risk</h2>
            <ul className="space-y-2 text-sm">
              <li>Vata: {dosha_risk.vata?.toFixed(2)}</li>
              <li>Pitta: {dosha_risk.pitta?.toFixed(2)}</li>
              <li>Kapha: {dosha_risk.kapha?.toFixed(2)}</li>
            </ul>
          </div>
        )}

        {/* Health Risks (optional – future ready) */}
        {Object.keys(health_risks).length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Health Risks</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(health_risks).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg text-sm font-medium ${
                    value
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {key.replaceAll("_", " ")}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="bg-white p-6 rounded-xl shadow space-y-2">
          <p>
            <strong>Primary Future Condition:</strong>{" "}
            {primary_future_condition}
          </p>
          <p>
            <strong>Risk Level:</strong>{" "}
            <span className="text-red-600 font-semibold">
              {risk_level}
            </span>
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          ← Back
        </button>

      </div>
    </div>
  );
}
