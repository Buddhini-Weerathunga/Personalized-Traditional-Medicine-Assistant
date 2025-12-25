import { useEffect, useState } from "react";
import { getMyHealthPrediction } from "../../../services/api";
import DoshaCard from "../../../components/health-profile-analysis/DoshaCard";

export default function HealthPrediction() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

  if (loading) return <p className="text-center mt-10">Analyzing...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!result) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-2">🧠 Health Prediction Report</h2>
        <p><b>Predicted Dosha:</b> {result.predicted_dosha}</p>
        <p><b>Primary Future Condition:</b> {result.primary_future_condition}</p>
        <p>
          <b>Risk Level:</b>{" "}
          <span className="text-red-600 font-semibold">
            {result.risk_level}
          </span>
        </p>
      </div>

      {/* ================= DOSHA DISTRIBUTION ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Dosha Distribution</h3>
        <div className="flex gap-4">
          {Object.entries(result.dosha_distribution).map(([dosha, value]) => (
            <DoshaCard key={dosha} title={dosha} value={value} />
          ))}
        </div>
      </div>

      {/* ================= DOSHA IMBALANCE RISK ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Dosha Imbalance Risk</h3>
        <ul className="space-y-2">
          {Object.entries(result.dosha_risk).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span>{k.replace(/_/g, " ")}</span>
              <span className="font-semibold">
                {(v * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= HEALTH RISKS ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Health Risk Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(result.health_risk).map(([risk, data]) => (
            <div
              key={risk}
              className={`p-4 rounded-lg border ${
                data.present ? "border-red-400 bg-red-50" : "border-green-300 bg-green-50"
              }`}
            >
              <p className="font-semibold">
                {risk.replace("risk_", "").replace(/_/g, " ")}
              </p>
              <p>
                Status:{" "}
                {data.present ? "⚠️ Present" : "✅ Normal"}
              </p>
              <p>
                Probability: {(data.probability * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RECOMMENDATIONS ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Personalized Recommendations</h3>

        <div className="space-y-3">
          <p><b>🥗 Diet:</b> {result.recommendations.diet}</p>
          <p><b>🏃 Lifestyle:</b> {result.recommendations.lifestyle}</p>
          <p><b>🧘 Yoga:</b> {result.recommendations.yoga}</p>
          <p><b>🌿 Herbal:</b> {result.recommendations.herbal}</p>
        </div>
      </div>

    </div>
  );
}
