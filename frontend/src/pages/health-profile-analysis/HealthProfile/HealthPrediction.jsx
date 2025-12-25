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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🧠 Your Health Prediction</h2>

      <p><b>Dosha:</b> {result.predicted_dosha}</p>
      <p><b>Condition:</b> {result.primary_future_condition}</p>
      <p><b>Risk Level:</b> {result.risk_level}</p>

      <div className="flex gap-4 my-4">
        {Object.entries(result.dosha_distribution).map(([k, v]) => (
          <DoshaCard key={k} title={k} value={v} />
        ))}
      </div>
    </div>
  );
}
