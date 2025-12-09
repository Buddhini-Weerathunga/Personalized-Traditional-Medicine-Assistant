// frontend/src/dosha-diagnosis/prakriti-analysis/ShareResultsPage.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar.jsx";
import { usePrakritiResults } from "./PrakritiResultContext.jsx";
import html2pdf from "html2pdf.js";

export default function ShareResultsPage() {
  const navigate = useNavigate();
  const { summary } = usePrakritiResults(); // 👉 get values from context
  const reportRef = useRef(null);

  // Convert 0–1 values to percentages
  const vataPct = Math.round((summary?.vata || 0) * 100);
  const pittaPct = Math.round((summary?.pitta || 0) * 100);
  const kaphaPct = Math.round((summary?.kapha || 0) * 100);
  const dominant = summary?.dominant || "Not enough data";

  // ✅ Simplest: share via WhatsApp
  const handleShareWhatsApp = () => {
    const msg = `My Prakriti Results (AyuCeylon):

Vata: ${vataPct}%
Pitta: ${pittaPct}%
Kapha: ${kaphaPct}%
Dominant Dosha: ${dominant}

Shared from AyuCeylon – AI-powered Ayurveda assistant.`;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // ✅ Simplest: save visible card as PDF
  const handleDownloadPdf = () => {
    if (!reportRef.current) return;

    const opt = {
      margin: 10,
      filename: "AyuCeylon_Prakriti_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(reportRef.current).save();
  };

  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        {/* Soft glow background */}
        <div className="pointer-events-none">
          <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-5xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span>🔗 Shareable Prakriti Summary</span>
              <span className="h-4 w-px bg-green-300" />
              <span>AyuCeylon Ayurveda Assistant</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              Prakriti Results –{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Share View
              </span>
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-700 max-w-2xl leading-relaxed">
              This view is designed for sharing with an Ayurvedic practitioner,
              friend, or as a saved report. It summarizes your dosha
              percentages, dominant type, and gentle lifestyle suggestions.
            </p>
          </div>

          {/* Main card – this part will become the PDF */}
          <div
            ref={reportRef}
            className="bg-white/90 rounded-2xl border border-green-100 shadow-lg p-6 space-y-6"
          >
            {/* Dosha summary */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Dosha Percentage Overview
              </h2>
              <div className="flex flex-wrap gap-4">
                {[
                  {
                    label: "Vata",
                    value: vataPct,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    label: "Pitta",
                    value: pittaPct,
                    color: "from-amber-500 to-orange-500",
                  },
                  {
                    label: "Kapha",
                    value: kaphaPct,
                    color: "from-sky-500 to-cyan-500",
                  },
                ].map((d) => (
                  <div
                    key={d.label}
                    className="flex-1 min-w-[120px] rounded-xl p-3 border border-emerald-50 bg-gradient-to-br from-green-50 to-white flex flex-col items-center shadow-sm"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {d.label}
                    </span>
                    <span className="mt-1 text-lg font-semibold text-gray-900">
                      {d.value}%
                    </span>
                    <div className="mt-2 w-full h-1.5 rounded-full bg-emerald-50 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                        style={{ width: `${d.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dominant Dosha */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-sm text-emerald-900">
                <strong>Dominant Dosha: {dominant}</strong>{" "}
                {["Vata", "Pitta", "Kapha"].includes(dominant) ? (
                  <>
                    – A {dominant}-dominant prakriti often reflects unique
                    physical and mental tendencies. Ayurveda gently recommends
                    aligning food, sleep, and lifestyle with your dosha to
                    maintain balance.
                  </>
                ) : (
                  <>
                    – Not enough capture steps were completed to confidently
                    determine a single dominant dosha. Please repeat the
                    analysis when possible.
                  </>
                )}
              </p>
            </div>

            {/* Feature analysis – keep generic for now */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                Feature-Based Observations
              </h2>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>
                  Facial structure and expressions may reflect a combination of
                  Vata, Pitta and Kapha qualities.
                </li>
                <li>
                  Eye region, mouth, skin texture and profile each contribute to
                  your unique prakriti pattern.
                </li>
                <li>
                  Subtle changes over time may indicate temporary{" "}
                  <span className="font-medium">imbalance</span> rather than
                  your core constitution.
                </li>
                <li>
                  This digital analysis is a{" "}
                  <span className="font-medium">supporting tool</span>, not a
                  replacement for a full Ayurvedic consultation.
                </li>
              </ul>
            </div>

            {/* Lifestyle suggestions – generic & safe */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">
                Gentle Lifestyle Suggestions
              </h2>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>
                  Prefer warm, freshly prepared meals and avoid overeating or
                  long gaps without food.
                </li>
                <li>
                  Maintain a regular sleep/wake routine and simple evening
                  wind-down practice.
                </li>
                <li>
                  Include gentle movement such as walking, yoga or stretching
                  most days of the week.
                </li>
                <li>
                  Practice simple breathing or mindfulness techniques to support
                  emotional balance.
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-gray-500">
                Note: These are general wellness suggestions and do not replace
                personalized guidance from a qualified Ayurvedic doctor.
              </p>
            </div>
          </div>

          {/* Buttons (outside ref, not included in PDF) */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Send to Contact (WhatsApp)
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-full bg-white text-emerald-700 border border-emerald-300 text-sm font-semibold shadow-sm hover:bg-emerald-50 transition-all"
            >
              Save as PDF
            </button>
            <button
              onClick={() => navigate("/prakriti/results")}
              className="px-4 py-2 rounded-full bg-white border border-green-200 text-sm font-semibold text-gray-800 hover:bg-green-50 transition-all"
            >
              Back to Results
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-full bg-white border border-green-200 text-sm font-semibold text-gray-800 hover:bg-green-50 transition-all"
            >
              Home
            </button>
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
