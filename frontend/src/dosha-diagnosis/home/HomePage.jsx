// frontend/src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleAsk = () => {
    navigate("/chat", { state: { initialQuestion: query } });
  };

  return (
    <>
      {/* Navbar at the top */}
      <Navbar />

      <section className="pt-8 pb-12">
        <div className="grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
          {/* Left main content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-[#3e2b20] mb-3">
              Ayurveda Assistant
            </h1>
            <p className="text-lg text-[#7a5b3f] mb-6">
              Ancient wisdom for modern well-being.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 bg-[#fdf7ef] rounded-full shadow-sm border border-[#e0cfba] flex items-center px-4">
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none py-2 text-sm"
                  placeholder="Ask about doshas, herbs, treatments…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                onClick={handleAsk}
                className="px-6 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow-md hover:bg-[#6f4725] transition-colors"
              >
                Ask
              </button>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Prakriti card */}
              <div className="bg-[#fdf7ef] rounded-2xl shadow-md border border-[#e0cfba] p-4 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#f3e0c8] flex items-center justify-center mb-3">
                    <span className="text-xl">🧬</span>
                  </div>
                  <h2 className="font-semibold text-[#3e2b20] mb-1">
                    Prakriti Analysis
                  </h2>
                  <p className="text-sm text-[#8b6b4b] mb-3">
                    Understand your unique mind–body constitution through facial
                    and lifestyle analysis.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/prakriti/capture/face")}
                  className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-[#8b5d33] text-[#fdf7ef] hover:bg-[#6f4725] transition-colors"
                >
                  Start Analysis
                </button>
              </div>

              {/* Herbal remedies card */}
              <div className="bg-[#fdf7ef] rounded-2xl shadow-md border border-[#e0cfba] p-4 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#e1f0df] flex items-center justify-center mb-3">
                    <span className="text-xl">💊</span>
                  </div>
                  <h2 className="font-semibold text-[#3e2b20] mb-1">
                    Prescription
                  </h2>
                  <p className="text-sm text-[#8b6b4b] mb-3">
                    View and manage your medical prescriptions and recommended
                    treatments.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/prescription")}
                  className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-[#3f6b4a] text-[#fdf7ef] hover:bg-[#30553a] transition-colors"
                >
                  Explore Prescription
                </button>
              </div>
            </div>
          </div>

          {/* Right decorative panel */}
          <div className="hidden lg:block">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#f6e3c6] via-[#f2d8bd] to-[#f3e9da] p-8 shadow-xl border border-[#e3cfb3]">
              <div className="absolute inset-4 border border-dashed border-[#e2c9aa] rounded-3xl pointer-events-none" />
              <div className="relative space-y-4">
                <h3 className="text-lg font-semibold text-[#3e2b20]">
                  Balance your Doshas
                </h3>
                <p className="text-sm text-[#7a5b3f]">
                  AyuCeylon blends Sri Lankan Ayurvedic wisdom with intelligent
                  analysis to guide your daily routines, diet and lifestyle.
                </p>
                <ul className="text-sm text-[#6b4f3a] space-y-2">
                  <li>• Personalized prakriti insights</li>
                  <li>• Gentle lifestyle recommendations</li>
                  <li>• Herbal support for body and mind</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}