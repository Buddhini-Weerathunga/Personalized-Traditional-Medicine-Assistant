// frontend/src/dosha-diagnosis/prakriti-analysis/ShareResultsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Correct path (3 levels up)
import Navbar from "../../components/layout/Navbar.jsx";


export default function ShareResultsPage() {
  const navigate = useNavigate();

  // Dummy values (replace with actual results later)
  const vata = 62;
  const pitta = 25;
  const kapha = 13;
  const dominant = "Vata";

  return (
    <>
      {/* ⭐ NAVBAR ONLY FOR THIS PAGE ⭐ */}
      <Navbar />

      <section className="pt-6 pb-10">
        <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
          Ayurveda Assistant – Shared Prakriti Results
        </h1>

        <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow-lg p-6 space-y-5">

          {/* Dosha summary */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Vata", value: vata, color: "#c78857" },
              { label: "Pitta", value: pitta, color: "#c96b4b" },
              { label: "Kapha", value: kapha, color: "#5f8c57" },
            ].map((d) => (
              <div
                key={d.label}
                className="flex-1 min-w-[120px] bg-[#f7ecde] rounded-xl p-3 border border-[#ead4b8] flex flex-col items-center"
              >
                <span className="text-xs font-medium text-[#7a5b3f]">
                  {d.label}
                </span>
                <span className="text-lg font-semibold text-[#3e2b20]">
                  {d.value}%
                </span>
              </div>
            ))}
          </div>

          {/* Dominant Dosha */}
          <div className="bg-[#f3e3cf] rounded-xl p-3 border border-[#e4caaa]">
            <p className="text-sm text-[#3e2b20]">
              <strong>Dominant Dosha: {dominant}</strong> – A {dominant}-dominant
              prakriti typically reflects lightness, creativity, and variability.
              Ayurveda recommends warm, grounding routines to maintain balance.
            </p>
          </div>

          {/* Feature analysis */}
          <div>
            <h2 className="text-sm font-semibold text-[#3e2b20] mb-1">
              Feature Analysis
            </h2>
            <ul className="text-sm text-[#7a5b3f] list-disc pl-5 space-y-1">
              <li>Face shape suggests subtle Vata predominance.</li>
              <li>Eyes show alertness and brightness – Pitta/Vata mix.</li>
              <li>Skin texture tends towards dryness in some zones.</li>
              <li>Overall impression: light frame, active mind.</li>
            </ul>
          </div>

          {/* Lifestyle suggestions */}
          <div>
            <h2 className="text-sm font-semibold text-[#3e2b20] mb-1">
              Personalized Lifestyle Suggestions
            </h2>
            <ul className="text-sm text-[#7a5b3f] list-disc pl-5 space-y-1">
              <li>Warm, nourishing meals; avoid skipping meals.</li>
              <li>Regular sleep/wake routine & relaxation rituals.</li>
              <li>Gentle yoga, pranayama, oil massage.</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]">
              Send to Contact
            </button>
            <button className="px-4 py-2 rounded-full bg-[#3f6b4a] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#30553a]">
              Save PDF
            </button>
            <button
              onClick={() => navigate("/prakriti/results")}
              className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-semibold text-[#5a402c] hover:bg-[#f2e4d3]"
            >
              Back to Results
            </button>
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-semibold text-[#5a402c] hover:bg-[#f2e4d3]"
            >
              Home
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
