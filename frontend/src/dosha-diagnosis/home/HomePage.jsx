// frontend/src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleAsk = () => {
    if (!query.trim()) return;
    navigate("/chat", { state: { initialQuestion: query } });
  };

  return (
    <>
      <Navbar />

      {/* Main hero area */}
      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-[calc(100vh-64px)]">
        {/* Soft glowing circles */}
        <div className="pointer-events-none">
          <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-40" />
        </div>

        <section className="relative max-w-6xl mx-auto px-4 py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[3fr,2fr] items-center">
            
            {/* LEFT CONTENT */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span>✨ Ancient Wisdom, Modern AI</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Path to{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Holistic Dosha Wellness
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Understand your unique mind–body type, balance your doshas, and
                receive AI-guided Ayurvedic insights for daily life.
              </p>

              {/* Ask Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex-1 bg-white/70 rounded-full shadow-sm border border-green-100 flex items-center px-4">
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none py-2 text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                    placeholder="Ask about doshas, herbs, diet or lifestyle…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  />
                </div>
                <button
                  onClick={handleAsk}
                  className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Ask Ayu Assistant
                </button>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                
                {/* Prakriti Analysis */}
                <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                      <span className="text-xl">🧬</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Prakriti Analysis</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      Analyze your face and lifestyle to discover your dominant Vata, Pitta, or Kapha.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/prakriti/face")}
                    className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    Start Analysis
                  </button>
                </div>

                {/* Prescription */}
                <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center mb-3">
                      <span className="text-xl">💊</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Prescription</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      View Ayurvedic lifestyle + herbal prescriptions tailored for you.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/prescription")}
                    className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-white text-green-700 border border-green-300 hover:bg-green-50 transition-all"
                  >
                    Explore Prescription
                  </button>
                </div>

              </div>
            </div>

            {/* RIGHT ILLUSTRATION */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-2xl border-2 border-white">
                
                <div className="text-center space-y-6">
                  <div className="text-7xl md:text-8xl">🧘‍♀️</div>
                  <div className="text-6xl">🧬</div>
                  <div className="flex justify-center gap-4 text-4xl">
                    <span>💊</span>
                    <span>🔍</span>
                  </div>

                  <p className="text-sm md:text-base text-gray-600 max-w-xs mx-auto">
                    Track your dosha balance and receive gentle Ayurvedic insights.
                  </p>
                </div>

                {/* Floating Decorations */}
                <div className="absolute -top-5 -right-5 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg flex items-center justify-center animate-bounce">
                  <span className="text-3xl">✨</span>
                </div>

                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🍃</span>
                </div>

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
              Ancient Ayurvedic wisdom meets modern AI technology for holistic wellness.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">Yoga Consultation</li>
              <li className="hover:text-green-400 cursor-pointer">Disease Detection</li>
              <li className="hover:text-green-400 cursor-pointer">Treatment Plans</li>
              <li className="hover:text-green-400 cursor-pointer">Plant Identification</li>
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
