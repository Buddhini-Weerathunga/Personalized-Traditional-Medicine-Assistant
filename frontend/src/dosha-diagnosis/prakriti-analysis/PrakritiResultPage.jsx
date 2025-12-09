// frontend/src/dosha-diagnosis/prakriti-analysis/PrakritiResultPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import { usePrakritiResults } from "./PrakritiResultContext.jsx";

export default function PrakritiResultPage() {
  const navigate = useNavigate();
  const { summary, results } = usePrakritiResults();

  const vata = summary.vata || 0;
  const pitta = summary.pitta || 0;
  const kapha = summary.kapha || 0;
  const dominant = summary.dominant || "Not enough data";
  const completedCount = summary.completedCount;

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
                      className={`min-w-[4rem] h-16 rounded-xl flex items-center justify-center text-[11px] border ${
                        hasResult
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

              {/* Generic recommendations */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Gentle Daily Recommendations
                </h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>
                    Favor <span className="font-medium">warm, freshly cooked meals</span> and
                    avoid skipping meals.
                  </li>
                  <li>
                    Keep a <span className="font-medium">regular routine</span> for sleep, work,
                    and relaxation.
                  </li>
                  <li>
                    Include simple movement (walking, yoga, stretches) and{" "}
                    <span className="font-medium">short screen breaks</span>.
                  </li>
                  <li>
                    Always discuss herbs or treatments with a{" "}
                    <span className="font-medium">qualified Ayurvedic doctor</span>.
                  </li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition-all">
                  Analyze Features
                </button>
                <button
                  onClick={() => navigate("/prakriti/share")}
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
