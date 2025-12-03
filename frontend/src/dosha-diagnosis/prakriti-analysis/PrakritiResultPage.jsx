// frontend/src/dosha-diagnosis/prakriti-analysis/PrakritiResultPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";

export default function PrakritiResultPage() {
  const navigate = useNavigate();

  // Example values – later replace with real API result / context
  const vata = 0.62;
  const pitta = 0.25;
  const kapha = 0.13;
  const dominant = "Vata";

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
              profile, this is your estimated mind–body constitution
              (Prakriti) and gentle recommendations for daily life.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr,3fr] items-start">
            {/* LEFT: captured images placeholder */}
            <div className="bg-white/85 rounded-2xl border border-green-100 shadow p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-gray-900">
                  Captured Steps
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  5 of 5 completed
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {["Front", "Eyes", "Mouth", "Skin", "Profile"].map((label, idx) => (
                  <div
                    key={label}
                    className={`min-w-[4rem] h-16 rounded-xl flex items-center justify-center text-[11px] ${
                      idx === 0
                        ? "bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold"
                        : "bg-green-50 border border-green-200 text-gray-700"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-600">
                (Later you can render the actual captured thumbnails for each
                step here: face, eyes, mouth, skin, and profile.)
              </p>

              <div className="mt-2 rounded-xl bg-emerald-50/60 border border-emerald-100 px-3 py-2">
                <p className="text-xs text-emerald-900">
                  Tip: You can store image URLs and analysis scores in your
                  backend, then show them here for a full visual report.
                </p>
              </div>
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
                  <strong>{dominant}-dominant profile:</strong> Vata types are
                  often creative, quick-thinking, and sensitive. When balanced,
                  they feel energetic, enthusiastic, and inspired. When
                  imbalanced, they may experience anxiety, dryness, irregular
                  sleep or appetite, and overthinking.
                </p>
              </div>

              {/* Feature Analysis */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Feature-Based Insights
                </h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>
                    Face shape slightly elongated – aligns with{' '}
                    <span className="font-medium">Vata</span> qualities
                    (lightness, movement).
                  </li>
                  <li>
                    Eyes appear bright and alert – suggests active{' '}
                    <span className="font-medium">Vata–Pitta</span> influence.
                  </li>
                  <li>
                    Mouth and lips show moderate dryness – commonly associated
                    with <span className="font-medium">Vata</span> imbalance.
                  </li>
                  <li>
                    Overall impression of light frame and variability – supports{' '}
                    <span className="font-medium">Vata predominance</span>.
                  </li>
                </ul>
              </div>

              {/* Personalized Recommendations */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Gentle Daily Recommendations
                </h3>
                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>
                    Favor <span className="font-medium">warm, cooked, mildly spiced foods</span>;
                    reduce cold, raw, and very dry items.
                  </li>
                  <li>
                    Keep a <span className="font-medium">steady daily routine</span> for meals,
                    sleep, and screen time.
                  </li>
                  <li>
                    Practice <span className="font-medium">grounding yoga, slow walks, oil massage
                    (abhyanga)</span>, and calming breathing (e.g. deep belly
                    breaths).
                  </li>
                  <li>
                    Common Vata-supportive herbs include{' '}
                    <span className="font-medium">
                      ashwagandha, licorice, warm digestive teas
                    </span>
                    , always guided by a qualified Ayurvedic practitioner.
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
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🕉️</span>
              </div>
              <span className="text-xl font-bold">AyuCeylon</span>
            </div>
            <p className="text-gray-400 text-sm">
              Ancient Ayurvedic wisdom meets modern AI to bring holistic,
              personalized wellness insights.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">
                Yoga Consultation
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Disease Detection
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Treatment Plans
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Plant Identification
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">About Us</li>
              <li className="hover:text-green-400 cursor-pointer">Contact</li>
              <li className="hover:text-green-400 cursor-pointer">Blog</li>
              <li className="hover:text-green-400 cursor-pointer">Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4 text-2xl">
              <span className="hover:text-green-400 cursor-pointer">📘</span>
              <span className="hover:text-green-400 cursor-pointer">📷</span>
              <span className="hover:text-green-400 cursor-pointer">🐦</span>
              <span className="hover:text-green-400 cursor-pointer">💼</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </>
  );
}

function DoshaBar({ label, value, color }) {
  const percent = Math.round(value * 100);

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
