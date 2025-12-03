// frontend/src/dosha-diagnosis/prakriti-analysis/PrakritiResultPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";

export default function PrakritiResultPage() {
  const navigate = useNavigate();

  // Example values – later replace with real API result
  const vata = 0.62;
  const pitta = 0.25;
  const kapha = 0.13;
  const dominant = "Vata";

  return (
    <>
      {/* ⭐ NAVBAR ONLY FOR THIS PAGE ⭐ */}
      <Navbar />

      <section className="pt-6 pb-10">
        <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
          Prakriti Analysis – Results
        </h1>

        <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          {/* Left thumbnails */}
          <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-4 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-[#5a402c] mb-1">
              Captured Images
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["Front", "Eyes", "Mouth", "Skin", "Profile"].map((label) => (
                <div
                  key={label}
                  className="w-16 h-16 rounded-xl bg-[#f7ebdd] border border-[#dec7a7] flex items-center justify-center text-[11px] text-[#7a5b3f]"
                >
                  {label}
                </div>
              ))}
            </div>
            <p className="text-xs text-[#8b6b4b]">
              (Later you can render the actual captured thumbnails here.)
            </p>
          </div>

          {/* Right: result panel */}
          <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow-lg p-6 space-y-5">
            <h2 className="text-lg font-semibold text-[#3e2b20] mb-2">
              Dosha Constitution
            </h2>

            {/* Bars */}
            <div className="space-y-3">
              <DoshaBar label="Vata" value={vata} color="#c78857" />
              <DoshaBar label="Pitta" value={pitta} color="#c96b4b" />
              <DoshaBar label="Kapha" value={kapha} color="#5f8c57" />
            </div>

            <div className="bg-[#f7ecde] rounded-xl p-3 border border-[#ead4b8]">
              <p className="text-sm text-[#3e2b20]">
                <strong>Dominant Dosha: {dominant}</strong> – Vata types are
                typically creative, quick-thinking, and sensitive. When
                balanced, they are energetic and enthusiastic; when imbalanced,
                they may experience anxiety, dryness, or irregular routines.
              </p>
            </div>

            {/* Feature Analysis */}
            <div>
              <h3 className="text-sm font-semibold text-[#3e2b20] mb-1">
                Feature Analysis
              </h3>
              <ul className="text-sm text-[#7a5b3f] list-disc pl-5 space-y-1">
                <li>
                  Face shape slightly elongated – aligns with Vata qualities.
                </li>
                <li>
                  Eyes appear bright and alert – indicates active Vata/Pitta
                  influence.
                </li>
                <li>
                  Mouth and lips show moderate dryness – often associated with
                  Vata.
                </li>
                <li>
                  Overall impression of light frame and variability – Vata
                  predominance.
                </li>
              </ul>
            </div>

            {/* Personalized Recommendations */}
            <div>
              <h3 className="text-sm font-semibold text-[#3e2b20] mb-1">
                Personalized Recommendations
              </h3>
              <ul className="text-sm text-[#7a5b3f] list-disc pl-5 space-y-1">
                <li>
                  Favor warm, cooked, mildly spiced foods; reduce raw and cold
                  items.
                </li>
                <li>
                  Maintain a regular daily routine for meals, sleep, and work.
                </li>
                <li>
                  Gentle grounding yoga, oil massage (abhyanga), and calming
                  breathing.
                </li>
                <li>
                  Herbs often used for Vata balancing include ashwagandha,
                  licorice, and warm digestive teas.
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]">
                Analyze Features
              </button>
              <button
                onClick={() => navigate("/prakriti/share")}
                className="px-4 py-2 rounded-full bg-[#3f6b4a] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#30553a]"
              >
                Share Results
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-semibold text-[#5a402c] hover:bg-[#f2e4d3]"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DoshaBar({ label, value, color }) {
  const percent = Math.round(value * 100);

  return (
    <div>
      <div className="flex justify-between text-xs text-[#7a5b3f] mb-1">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 rounded-full bg-[#f1e0cc] overflow-hidden">
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
