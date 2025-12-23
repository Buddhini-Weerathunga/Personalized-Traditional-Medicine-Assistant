import { useState } from 'react';
import { Activity, AlertCircle, Heart, Leaf, TrendingUp, User } from 'lucide-react';

export default function AyurvedicHealthPrediction() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample prediction data structure matching the Python output
  const samplePrediction = {
    predicted_dosha: "Pitta",
    dosha_distribution: {
      Vata: 0.25,
      Pitta: 0.50,
      Kapha: 0.25
    },
    dosha_risk: {
      future_vata_imbalance_risk: 0.28,
      future_pitta_imbalance_risk: 0.52,
      future_kapha_imbalance_risk: 0.20
    },
    health_risk: {
      risk_joint_pain: { present: 0, probability: 0.35 },
      risk_anxiety: { present: 1, probability: 0.62 },
      risk_insomnia: { present: 1, probability: 0.55 },
      risk_constipation: { present: 0, probability: 0.38 },
      risk_gas_bloating: { present: 0, probability: 0.41 },
      risk_cold_feet_hands: { present: 0, probability: 0.33 },
      risk_acidity_ulcers: { present: 1, probability: 0.58 },
      risk_skin_rash: { present: 1, probability: 0.51 },
      risk_irritability: { present: 1, probability: 0.67 },
      risk_diarrhea: { present: 0, probability: 0.42 },
      risk_heat_intolerance: { present: 1, probability: 0.59 },
      risk_hair_fall_pitta: { present: 0, probability: 0.48 },
      risk_weight_gain: { present: 0, probability: 0.31 },
      risk_sluggishness: { present: 0, probability: 0.36 },
      risk_cold_cough: { present: 0, probability: 0.39 },
      risk_water_retention: { present: 0, probability: 0.37 },
      risk_diabetes_tendency: { present: 0, probability: 0.29 },
      risk_high_cholesterol: { present: 0, probability: 0.32 }
    },
    primary_future_condition: "Stress-related disorders",
    risk_level: "Moderate",
    recommendations: {
      diet: "Cooling, sweet, bitter foods like cucumber, melons, leafy greens, coconut. Reduce spicy, salty, and fried foods.",
      lifestyle: "Avoid excessive heat and sun, practice stress management, maintain work-life balance, stay cool.",
      yoga: "Cooling poses like Forward Bends, gentle twists, and Shitali pranayama (cooling breath). Avoid hot yoga.",
      herbal: "Amalaki for cooling, Guduchi for immunity, Neem for skin, Brahmi for mental calm, coriander and fennel.",
      specific_concerns: [
        "Anxiety: Practice meditation, Pranayama (breathing exercises), use Ashwagandha and Brahmi",
        "Sleep: Warm milk with nutmeg before bed, oil foot massage, maintain sleep schedule"
      ]
    }
  };

  const getDoshaColor = (dosha) => {
    const colors = {
      Vata: 'from-blue-400 to-indigo-500',
      Pitta: 'from-red-400 to-orange-500',
      Kapha: 'from-green-400 to-emerald-500'
    };
    return colors[dosha] || 'from-gray-400 to-gray-500';
  };

  const getRiskColor = (level) => {
    const colors = {
      Low: 'text-green-600 bg-green-50 border-green-200',
      Moderate: 'text-orange-600 bg-orange-50 border-orange-200',
      High: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[level] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatRiskName = (key) => {
    return key
      .replace('risk_', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleLoadSample = () => {
    setLoading(true);
    setTimeout(() => {
      setPredictionResult(samplePrediction);
      setLoading(false);
    }, 800);
  };

  if (!predictionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ayurvedic Health Analysis</h1>
          <p className="text-gray-600 mb-8">AI-powered Dosha and Health Risk Prediction</p>
          <button
            onClick={handleLoadSample}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'View Sample Prediction'}
          </button>
        </div>
      </div>
    );
  }

  const activeRisks = Object.entries(predictionResult.health_risk).filter(
    ([_, value]) => value.present === 1
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Health Prediction Report</h1>
          </div>
          <p className="text-gray-600">Ayurvedic health analysis based on AI-powered assessment</p>
        </div>

        {/* Predicted Dosha - Large Card */}
        <div className={`bg-gradient-to-br ${getDoshaColor(predictionResult.predicted_dosha)} rounded-2xl shadow-xl p-8 md:p-12 text-white`}>
          <div className="flex items-center gap-3 mb-4">
            <User className="w-10 h-10" />
            <h2 className="text-2xl font-semibold">Predicted Dosha Type</h2>
          </div>
          <p className="text-6xl md:text-7xl font-bold mb-4">{predictionResult.predicted_dosha}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-6">
            <h3 className="text-lg font-semibold mb-3">Dosha Distribution</h3>
            <div className="space-y-3">
              {Object.entries(predictionResult.dosha_distribution).map(([dosha, value]) => (
                <div key={dosha}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{dosha}</span>
                    <span className="font-semibold">{(value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2.5">
                    <div
                      className="bg-white h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Level & Primary Condition */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`rounded-2xl shadow-lg p-6 border-2 ${getRiskColor(predictionResult.risk_level)}`}>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Overall Risk Level</h3>
            </div>
            <p className="text-4xl font-bold mt-4">{predictionResult.risk_level}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Primary Future Condition</h3>
            </div>
            <p className="text-2xl font-semibold text-blue-600 mt-4">{predictionResult.primary_future_condition}</p>
          </div>
        </div>

        {/* Dosha Imbalance Risk */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Dosha Imbalance Risk</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(predictionResult.dosha_risk).map(([key, value]) => {
              const doshaName = key.replace('future_', '').replace('_imbalance_risk', '');
              const displayName = doshaName.charAt(0).toUpperCase() + doshaName.slice(1);
              return (
                <div key={key} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">{displayName}</h3>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - value)}`}
                        className={`${doshaName === 'vata' ? 'text-blue-500' : doshaName === 'pitta' ? 'text-orange-500' : 'text-green-500'} transition-all duration-1000`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">{(value * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Risks */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">Health Risk Assessment</h2>
          </div>
          
          {activeRisks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-xl font-semibold text-green-600">No major health risks detected! 🎉</p>
              <p className="text-gray-600 mt-2">Keep maintaining your healthy lifestyle.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Detected <span className="font-bold text-red-600">{activeRisks.length}</span> health risk(s) that require attention
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRisks.map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-red-800 text-sm">{formatRiskName(key)}</h3>
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-red-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${value.probability * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-red-700">
                        {(value.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {predictionResult.recommendations && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Personalized Recommendations</h2>
            </div>
            
            <div className="space-y-6">
              {predictionResult.recommendations.diet && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                    🍽️ Dietary Guidelines
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{predictionResult.recommendations.diet}</p>
                </div>
              )}
              
              {predictionResult.recommendations.lifestyle && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                    🌅 Lifestyle Practices
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{predictionResult.recommendations.lifestyle}</p>
                </div>
              )}
              
              {predictionResult.recommendations.yoga && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    🧘 Yoga & Exercises
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{predictionResult.recommendations.yoga}</p>
                </div>
              )}
              
              {predictionResult.recommendations.herbal && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-amber-700 mb-2 flex items-center gap-2">
                    🌿 Herbal Remedies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{predictionResult.recommendations.herbal}</p>
                </div>
              )}
              
              {predictionResult.recommendations.specific_concerns && (
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    ⚠️ Specific Health Concerns
                  </h3>
                  <ul className="space-y-2">
                    {predictionResult.recommendations.specific_concerns.map((concern, idx) => (
                      <li key={idx} className="text-gray-700 leading-relaxed pl-4 border-l-3 border-red-400">
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <button
            onClick={() => setPredictionResult(null)}
            className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg"
          >
            ← Back
          </button>
          <button
            onClick={handleLoadSample}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            View Another Sample
          </button>
        </div>

      </div>
    </div>
  );
}