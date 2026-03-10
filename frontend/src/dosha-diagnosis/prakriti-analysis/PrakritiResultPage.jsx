// frontend/src/dosha-diagnosis/prakriti-analysis/PrakritiResultPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import Navbar from "../../components/layout/Navbar.jsx";
import { usePrakritiResults } from "./PrakritiResultContext.jsx";

export default function PrakritiResultPage() {
  const navigate = useNavigate();
  const { summary, results } = usePrakritiResults();
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const vata = summary.vata || 0;
  const pitta = summary.pitta || 0;
  const kapha = summary.kapha || 0;
  const dominant = summary.dominant || "Not enough data";
  const completedCount = summary.completedCount;

  // Save current result as a prescription in backend
  const handleSavePrescription = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in first to save your prescription.");
        navigate("/login");
        return;
      }

      // Format recommendations from AI-generated data
      const formattedRecommendations = aiRecommendations ? {
        physical_characteristics: aiRecommendations.physical_characteristics || [],
        diet_recommendations: aiRecommendations.diet_recommendations || [],
        foods_to_avoid: aiRecommendations.foods_to_avoid || [],
        lifestyle_recommendations: aiRecommendations.lifestyle_recommendations || [],
        herbal_remedies: aiRecommendations.herbal_remedies || [],
        practical_applications: aiRecommendations.practical_applications || []
      } : {
        lifestyle: ["Warm meals", "Regular sleep", "Light yoga"]
      };

      await API.post(
        "/prakritiReports/reports", // -> http://localhost:5000/api/prakritiReports/reports
        {
          vataScore: summary.vata,
          pittaScore: summary.pitta,
          kaphaScore: summary.kapha,
          dominantDosha: summary.dominant,
          recommendations: formattedRecommendations,
          capturedRegions: results,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Prescription saved successfully ✅");
    } catch (err) {
      console.error("Failed to save prescription:", err);

      const msg =
        err.response?.data?.message ||
        `Error ${err.response?.status || ""}: ${err.message}`;

      alert(`Failed to save prescription:\n${msg}`);
    }
  };

  const questionnaireResult = JSON.parse(localStorage.getItem("questionnaireResult"));


  const scores = questionnaireResult?.questionnaireScores;
  const answers = questionnaireResult?.answers || [];
  const userInfo = questionnaireResult?.userInfo || {};

  // Fetch AI recommendations on component mount
  useEffect(() => {
    if (questionnaireResult && scores) {
      fetchAIRecommendations();
    }
  }, []);

  const fetchAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const prompt = preparePrompt();

      // Using Groq API with llama3-8b-8192 (free tier)
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are an expert Ayurvedic practitioner with deep knowledge of traditional medicine. You MUST respond with ONLY a valid JSON object (no markdown, no code blocks, no extra text). The JSON must have exactly these 6 keys: physical_characteristics, diet_recommendations, foods_to_avoid, lifestyle_recommendations, herbal_remedies, practical_applications. Each key should contain an array of 4-6 detailed recommendations specific to their dosha balance.",
            },
            {
              role: "user",
              content: `Based on the user's dosha analysis (both facial and questionnaire), provide specific, practical, and actionable recommendations.\n\nHere is the user's data:\n${prompt}\n\nRemember: Respond ONLY with the JSON object, nothing else.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!groqRes.ok) {
        const errBody = await groqRes.json().catch(() => ({}));
        console.error("Groq API error:", errBody);
        setAiRecommendations(null);
        return;
      }

      const data = await groqRes.json();
      const aiText = data?.choices?.[0]?.message?.content;

      if (!aiText) {
        console.error("No response from Groq");
        setAiRecommendations(null);
        return;
      }

      // Parse JSON from response
      try {
        // Clean up the response - remove markdown code blocks if present
        let cleanText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanText;
        const parsed = JSON.parse(jsonString);
        setAiRecommendations(parsed);
      } catch (parseError) {
        console.error("Failed to parse Groq response:", parseError);
        console.log("Raw response:", aiText);
        setAiRecommendations(null);
      }
    } catch (error) {
      console.error("Failed to fetch AI recommendations:", error);
      setAiRecommendations(null);
    } finally {
      setLoadingAI(false);
    }
  };

  const preparePrompt = () => {
    let prompt = `User Profile:\n`;
    prompt += `Name: ${userInfo.firstName || 'User'} ${userInfo.lastName || ''}\n`;
    prompt += `Age: ${userInfo.age || 'Not specified'}\n\n`;
    
    prompt += `=== FACIAL ANALYSIS RESULTS ===\n`;
    prompt += `Vata: ${(vata * 100).toFixed(0)}%\n`;
    prompt += `Pitta: ${(pitta * 100).toFixed(0)}%\n`;
    prompt += `Kapha: ${(kapha * 100).toFixed(0)}%\n`;
    prompt += `Dominant Dosha: ${dominant}\n\n`;
    
    prompt += `=== QUESTIONNAIRE SCORES ===\n`;
    prompt += `Vata: ${scores?.Vata || 0}%\n`;
    prompt += `Pitta: ${scores?.Pitta || 0}%\n`;
    prompt += `Kapha: ${scores?.Kapha || 0}%\n\n`;
    
    prompt += `=== QUESTIONNAIRE ANSWERS (10 questions) ===\n`;
    answers.forEach((answer, index) => {
      prompt += `Q${index + 1}: ${answer}\n`;
    });
    
    prompt += `\nBased on this comprehensive analysis combining facial features and lifestyle questionnaire, provide personalized Ayurvedic recommendations for this ${dominant}-dominant individual. Consider both the facial analysis and questionnaire responses to give holistic advice.`;
    
    return prompt;
  };

  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        {/* Soft glowing circles */}
        <div className="pointer-events-none">
          <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span>📊 Prakriti Summary</span>
              <span className="h-4 w-px bg-green-300" />
              <span>Face · Eyes · Mouth · Skin · Profile</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              Your{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Dosha Profile
              </span>
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-700 max-w-2xl leading-relaxed">
              Based on your facial features, eyes, mouth, skin texture and side
              profile, this is your estimated mind–body constitution (Prakriti)
              and gentle recommendations for daily life.
            </p>

            {completedCount < 3 && (
              <p className="mt-2 text-xs text-red-600">
                Note: Less than 3 capture steps analyzed. For better accuracy,
                please complete all 5 steps (Face, Eyes, Mouth, Skin, Profile).
              </p>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr,3fr] items-start">
            {/* LEFT: captured steps summary */}
            <div className="bg-white/85 rounded-2xl border border-green-100 shadow p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-gray-900">
                  Captured Steps
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {completedCount} of 5 analyzed
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {["face", "eyes", "mouth", "skin", "profile"].map((key) => {
                  const labelMap = {
                    face: "Front",
                    eyes: "Eyes",
                    mouth: "Mouth",
                    skin: "Skin",
                    profile: "Profile",
                  };
                  const hasResult = !!results[key];

                  return (
                    <div
                      key={key}
                      className={`min-w-[4rem] h-16 rounded-xl flex items-center justify-center text-[11px] border ${hasResult
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold"
                          : "bg-green-50 border-green-200 text-gray-500"
                        }`}
                    >
                      {labelMap[key]}
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-gray-600">
                (Later you can render the actual captured thumbnails and scores
                for each step here.)
              </p>
            </div>

            {/* RIGHT: results panel */}
            <div className="bg-white/90 rounded-2xl border border-green-100 shadow-lg p-6 space-y-6">
              {/* Dominant dosha badge */}
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Dosha Constitution
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold shadow">
                  <span>Dominant Dosha</span>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-white/15 text-sm">
                    {dominant}
                  </span>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-3">
                <DoshaBar label="Vata" value={vata} color="#22c55e" />
                <DoshaBar label="Pitta" value={pitta} color="#f97316" />
                <DoshaBar label="Kapha" value={kapha} color="#0ea5e9" />
              </div>

              {/* Dominant description */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm text-emerald-900">
                  <strong>{dominant}-dominant profile:</strong>{" "}
                  {dominant === "Vata" &&
                    "Vata types are often creative, quick-thinking, and sensitive. When balanced, they feel energetic and inspired. When imbalanced, they may experience anxiety, dryness, or irregular sleep."}
                  {dominant === "Pitta" &&
                    "Pitta types tend to be focused, driven, and sharp. In balance they show strong digestion and confidence, but when imbalanced may feel irritable, overheated, or inflamed."}
                  {dominant === "Kapha" &&
                    "Kapha types are usually calm, steady, and nurturing. In balance they are grounded and resilient, but when imbalanced may feel heavy, sluggish, or emotionally stuck."}
                  {!["Vata", "Pitta", "Kapha"].includes(dominant) &&
                    "Please complete more steps to get a clearer dominant dosha description."}
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm text-emerald-900">
                  <strong>Questionnaire Scores:</strong>
                </p>

                <div className="mb-3">
                  <p className="text-sm font-semibold">Vata: {scores?.Vata}%</p>
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-blue-500 h-3 rounded"
                      style={{ width: `${scores?.Vata}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-semibold">Pitta: {scores?.Pitta}%</p>
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-red-500 h-3 rounded"
                      style={{ width: `${scores?.Pitta}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold">Kapha: {scores?.Kapha}%</p>
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-green-500 h-3 rounded"
                      style={{ width: `${scores?.Kapha}%` }}
                    ></div>
                  </div>
                </div>

              </div>


              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Gentle Daily Recommendations
                </h3>
                {loadingAI ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600 text-sm">Generating personalized recommendations...</span>
                  </div>
                ) : aiRecommendations ? (
                  <div className="space-y-6">
                    {/* Physical Characteristics */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🧘</span>
                        Physical Characteristics
                      </h4>
                      <ul className="list-none space-y-1">
                        {aiRecommendations.physical_characteristics.map((item, idx) => (
                          <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diet Recommendations */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🍲</span>
                        Diet Recommendations
                      </h4>
                      <ul className="list-none space-y-1">
                        {aiRecommendations.diet_recommendations.map((item, idx) => (
                          <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Foods to Avoid */}
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">❌</span>
                        Foods to Avoid
                      </h4>
                      <ul className="list-none space-y-1">
                        {aiRecommendations.foods_to_avoid.map((item, idx) => (
                          <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Lifestyle Recommendations */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🏃</span>
                        Lifestyle Recommendations
                      </h4>
                      <ul className="list-none space-y-1">
                        {aiRecommendations.lifestyle_recommendations.map((item, idx) => (
                          <li key={idx} className="text-sm text-purple-800 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Herbal Remedies */}
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🌱</span>
                        Herbal Remedies
                      </h4>
                      <ul className="list-none space-y-1">
                        {aiRecommendations.herbal_remedies.map((item, idx) => (
                          <li key={idx} className="text-sm text-emerald-800 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Applications */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        Practical Applications
                      </h4>
                      <ul className="list-none space-y-1">
                        {aiRecommendations.practical_applications.map((item, idx) => (
                          <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-red-600 font-semibold mb-2">⚠️ Unable to load recommendations</p>
                    <p className="text-sm text-gray-600">Please refresh the page or try again later.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition-all">
                  Analyze Features
                </button>

                <button
                  onClick={handleSavePrescription}
                  className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-all"
                >
                  Save as Prescription
                </button>

                <button
                  onClick={() => {
                    // Navigate to shared chat with dosha scores
                    navigate("/shared-chat", {
                      state: {
                        vataScore: vata,
                        pittaScore: pitta,
                        kaphaScore: kapha,
                        dominantDosha: dominant
                      }
                    });
                  }}
                  className="px-4 py-2 rounded-full bg-white text-emerald-700 border border-emerald-300 text-sm font-semibold shadow-sm hover:bg-emerald-50 transition-all"
                >
                  Share Results
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="px-4 py-2 rounded-full bg-white border border-green-200 text-sm font-semibold text-gray-800 hover:bg-green-50 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </>
  );
}

function DoshaBar({ label, value, color }) {
  const percent = Math.round((value || 0) * 100);

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-700 mb-1">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-emerald-50 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
