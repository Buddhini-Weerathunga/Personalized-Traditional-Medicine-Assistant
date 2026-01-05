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

  // ================= DYNAMIC RECOMMENDATION GENERATOR =================
  const generateDynamicRecommendations = () => {
    if (!result || !result.dosha_risk) return null;

    const vataRisk = result.dosha_risk.future_vata_imbalance_risk;
    const pittaRisk = result.dosha_risk.future_pitta_imbalance_risk;
    const kaphaRisk = result.dosha_risk.future_kapha_imbalance_risk;

    // Find dominant dosha
    const doshas = [
      { name: "Vata", risk: vataRisk },
      { name: "Pitta", risk: pittaRisk },
      { name: "Kapha", risk: kaphaRisk }
    ];
    
    const sortedDoshas = [...doshas].sort((a, b) => b.risk - a.risk);
    const dominant = sortedDoshas[0];
    const secondary = sortedDoshas[1];

    // Determine severity
    const getSeverity = (risk) => {
      if (risk >= 0.50) return "high";
      if (risk >= 0.35) return "moderate";
      return "low";
    };

    const recommendations = {
      diet: "",
      lifestyle: "",
      yoga: "",
      herbal: ""
    };

    // ========== VATA RECOMMENDATIONS ==========
    if (dominant.name === "Vata" || vataRisk >= 0.35) {
      const severity = getSeverity(vataRisk);
      
      if (severity === "high") {
        recommendations.diet = "Focus on warm, moist, grounding foods like soups, stews, cooked grains (rice, oats), ghee, and root vegetables. Favor sweet, sour, and salty tastes. Avoid cold, dry, and raw foods. Eat at regular times without skipping meals.";
        recommendations.lifestyle = "Establish a strict daily routine. Practice daily oil massage (Abhyanga) with warm sesame oil. Get 7-8 hours of sleep. Avoid excessive travel, multitasking, and overstimulation. Keep warm and calm environments.";
        recommendations.yoga = "Practice slow, grounding yoga: gentle Hatha yoga, forward bends (Paschimottanasana), child's pose (Balasana), and legs-up-the-wall (Viparita Karani). Focus on deep, slow breathing (Nadi Shodhana pranayama).";
        recommendations.herbal = "Ashwagandha (300mg twice daily) for stress and anxiety, Brahmi for mental clarity and focus, Bala for strength. Take Triphala before bed for gentle detoxification.";
      } else if (severity === "moderate") {
        recommendations.diet = "Include more cooked, warm foods. Eat regular meals with healthy fats like ghee and olive oil. Reduce raw salads and cold drinks. Include warming spices like ginger and cinnamon.";
        recommendations.lifestyle = "Maintain a regular daily schedule for meals and sleep. Practice self-massage 2-3 times per week. Avoid excess caffeine and stimulants. Create a calming evening routine.";
        recommendations.yoga = "Gentle yoga with focus on grounding poses and deep breathing. Practice 20-30 minutes daily. Include meditation for 10 minutes.";
        recommendations.herbal = "Consider Ashwagandha for stress support and Triphala for digestive health. Consult an Ayurvedic practitioner for dosage.";
      }
    }

    // ========== PITTA RECOMMENDATIONS ==========
    if (dominant.name === "Pitta" || pittaRisk >= 0.35) {
      const severity = getSeverity(pittaRisk);
      
      if (severity === "high") {
        recommendations.diet = "Choose cooling, alkaline foods: sweet fruits (melons, grapes, coconut), leafy greens, cucumber, rice, and milk. Favor sweet, bitter, and astringent tastes. Strictly avoid spicy, salty, sour, fried, and fermented foods. Reduce red meat and alcohol.";
        recommendations.lifestyle = "Avoid excessive heat, sun exposure, and competitive situations. Practice patience and forgiveness. Take cool showers. Spend time in nature near water. Avoid overworking and schedule regular breaks.";
        recommendations.yoga = "Practice cooling yoga: Chandra Namaskar (Moon Salutation), forward bends, gentle twists, and Shitali pranayama (cooling breath). Avoid hot yoga, power yoga, and excessive inversions.";
        recommendations.herbal = "Amalaki (Indian Gooseberry) for cooling and vitamin C, Guduchi for immunity, Neem for blood purification, and Shatavari for hormonal balance. Rose water can be added to drinking water.";
      } else if (severity === "moderate") {
        recommendations.diet = "Reduce spicy and oily foods. Increase cooling foods like cucumbers, melons, and leafy greens. Drink coconut water. Use cooling herbs like mint and coriander.";
        recommendations.lifestyle = "Balance work and relaxation. Avoid excessive sun exposure. Practice stress management techniques. Maintain emotional balance through mindfulness.";
        recommendations.yoga = "Moderate yoga practice with cooling elements. Include forward bends and gentle stretches. Practice cooling breath techniques 5-10 minutes daily.";
        recommendations.herbal = "Amalaki for cooling effects and digestive support. Neem tablets for skin and blood health. Consult practitioner for personalized dosing.";
      }
    }

    // ========== KAPHA RECOMMENDATIONS ==========
    if (dominant.name === "Kapha" || kaphaRisk >= 0.35) {
      const severity = getSeverity(kaphaRisk);
      
      if (severity === "high") {
        recommendations.diet = "Eat light, warm, dry foods with pungent, bitter, and astringent tastes. Include leafy greens, legumes (lentils, mung beans), barley, millet, and hot spices (ginger, garlic, black pepper, cayenne). Strictly reduce sweets, dairy, fried foods, and heavy grains.";
        recommendations.lifestyle = "Daily vigorous exercise is essential (45-60 minutes of cardio). Wake up before 6 AM. Completely avoid daytime sleep and prolonged sitting. Stay mentally active with new challenges. Reduce portion sizes.";
        recommendations.yoga = "Practice vigorous yoga: Surya Namaskar (12+ rounds daily), Vinyasa flow, standing poses (Warrior series), backbends, and inversions. Practice Kapalabhati and Bhastrika pranayama for energy and metabolism.";
        recommendations.herbal = "Triphala for digestion and weight management, Guggulu for metabolism and cholesterol support, Tulsi (Holy Basil) and ginger tea for energy. Punarnava for water retention.";
      } else if (severity === "moderate") {
        recommendations.diet = "Limit heavy and oily foods. Increase vegetables, legumes, and light grains. Use spices moderately. Reduce dairy and sweets. Start day with warm lemon water and ginger.";
        recommendations.lifestyle = "Maintain an active routine with regular walking or yoga. Avoid excessive sleep. Stay mentally stimulated. Practice portion control at meals.";
        recommendations.yoga = "Moderate Sun Salutations and energizing yoga. Practice 30-40 minutes daily. Include light pranayama for energy.";
        recommendations.herbal = "Triphala for digestive health and gentle detox. Ginger tea for metabolism. Consider Guggulu under professional guidance.";
      }
    }

    // ========== COMBINATION RECOMMENDATIONS ==========
    if (secondary.risk >= 0.35) {
      recommendations.combination = `You have elevated ${dominant.name} (${(dominant.risk * 100).toFixed(1)}%) and ${secondary.name} (${(secondary.risk * 100).toFixed(1)}%) risks. Balance both by: ${
        dominant.name === "Vata" && secondary.name === "Pitta" 
          ? "eating warm but not too spicy foods, maintaining routine while avoiding excessive heat"
          : dominant.name === "Vata" && secondary.name === "Kapha"
          ? "eating warm, light foods, regular moderate exercise, and consistent daily schedule"
          : dominant.name === "Pitta" && secondary.name === "Kapha"
          ? "choosing cooling but light foods, moderate exercise, and avoiding both heat and lethargy"
          : "maintaining overall balance through mindful living"
      }.`;
    }

    // Fill in any empty recommendations
    if (!recommendations.diet) {
      recommendations.diet = "Maintain a balanced diet with variety. Include fresh fruits, vegetables, whole grains, and adequate protein. Eat mindfully at regular times.";
    }
    if (!recommendations.lifestyle) {
      recommendations.lifestyle = "Continue your balanced lifestyle with regular exercise, adequate rest (7-8 hours), and stress management through meditation or yoga.";
    }
    if (!recommendations.yoga) {
      recommendations.yoga = "Practice balanced yoga routine including Surya Namaskar, pranayama, and meditation for overall wellness. Aim for 20-30 minutes daily.";
    }
    if (!recommendations.herbal) {
      recommendations.herbal = "Tulsi tea for immunity, Triphala for digestion, and Ashwagandha for stress management can support overall health. Always consult an Ayurvedic practitioner.";
    }

    return recommendations;
  };

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

  const dynamicRecs = generateDynamicRecommendations();

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
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                  result.dosha_risk.future_vata_imbalance_risk >= 0.50 
                    ? "border-red-400 bg-red-50" 
                    : result.dosha_risk.future_vata_imbalance_risk >= 0.35
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-green-300 bg-green-50"
                }`}>
                  <span className={`text-xl font-bold ${
                    result.dosha_risk.future_vata_imbalance_risk >= 0.50 
                      ? "text-red-700" 
                      : result.dosha_risk.future_vata_imbalance_risk >= 0.35
                      ? "text-yellow-700"
                      : "text-green-700"
                  }`}>
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
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                  result.dosha_risk.future_pitta_imbalance_risk >= 0.50 
                    ? "border-red-400 bg-red-50" 
                    : result.dosha_risk.future_pitta_imbalance_risk >= 0.35
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-yellow-300 bg-yellow-50"
                }`}>
                  <span className={`text-xl font-bold ${
                    result.dosha_risk.future_pitta_imbalance_risk >= 0.50 
                      ? "text-red-700" 
                      : result.dosha_risk.future_pitta_imbalance_risk >= 0.35
                      ? "text-orange-700"
                      : "text-yellow-700"
                  }`}>
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
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                  result.dosha_risk.future_kapha_imbalance_risk >= 0.50 
                    ? "border-red-400 bg-red-50" 
                    : result.dosha_risk.future_kapha_imbalance_risk >= 0.35
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-blue-300 bg-blue-50"
                }`}>
                  <span className={`text-xl font-bold ${
                    result.dosha_risk.future_kapha_imbalance_risk >= 0.50 
                      ? "text-red-700" 
                      : result.dosha_risk.future_kapha_imbalance_risk >= 0.35
                      ? "text-orange-700"
                      : "text-blue-700"
                  }`}>
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
                  className={`p-3 rounded-xl border min-h-[60px] flex flex-col justify-between ${
                    data.present
                      ? "border-red-300 bg-red-50"
                      : "border-green-300 bg-green-50"
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800 uppercase mb-2">
                    {risk.replace("risk_", "").replace(/_/g, " ")}
                  </p>

                  <p className="text-base text-gray-600">
                    Probability: {(data.probability * 100).toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= SECTION 2: DYNAMIC LIFESTYLE GUIDANCE ================= */}
      {activeSection === "guidance" && dynamicRecs && (
        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 space-y-8">

          <div>
            <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2 mb-2">
              🌿 Personalized Lifestyle Guidance
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Based on your dosha imbalance risks: 
              <span className="font-semibold"> Vata {(result.dosha_risk.future_vata_imbalance_risk * 100).toFixed(1)}%</span>, 
              <span className="font-semibold"> Pitta {(result.dosha_risk.future_pitta_imbalance_risk * 100).toFixed(1)}%</span>, 
              <span className="font-semibold"> Kapha {(result.dosha_risk.future_kapha_imbalance_risk * 100).toFixed(1)}%</span>
            </p>
          </div>

          {/* Combination Warning if needed */}
          {dynamicRecs.combination && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Combined Dosha Imbalance</h4>
              <p className="text-sm text-yellow-800 leading-relaxed">
                {dynamicRecs.combination}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* DIET */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                🥗 Diet Guidance
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dynamicRecs.diet}
              </p>
            </div>

            {/* LIFESTYLE */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                🏃 Lifestyle Habits
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dynamicRecs.lifestyle}
              </p>
            </div>

            {/* YOGA */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                🧘 Yoga & Movement
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dynamicRecs.yoga}
              </p>
            </div>

            {/* HERBAL */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                🌿 Herbal Support
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {dynamicRecs.herbal}
              </p>
            </div>

          </div>

          {/* Additional Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-xs text-blue-800">
              💡 <strong>Note:</strong> These recommendations are based on Ayurvedic principles and your personal risk profile. 
              Always consult with a qualified Ayurvedic practitioner or healthcare provider before making significant dietary or lifestyle changes, 
              especially if you have existing health conditions or are taking medications.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}