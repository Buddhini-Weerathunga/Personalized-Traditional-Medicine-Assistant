// frontend/src/pages/plant-identification/PlantIdentificationHome.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlantNavbar from "../../components/plant-identification/PlantNavbar.jsx";

export default function PlantIdentificationHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Navigate to plant scan with search query
    navigate("/plant-scan", { state: { searchQuery } });
  };

  return (
    <>
      <PlantNavbar />

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
                <span>🌿 Discover Medicinal Plants</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Identify{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Medicinal Plants
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Discover medicinal plants, understand their healing properties, and get personalized safety recommendations based on your health profile.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex-1 bg-white/70 rounded-full shadow-sm border border-green-100 flex items-center px-4">
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none py-2 text-sm md:text-base text-gray-800 placeholder:text-gray-400"
                    placeholder="Search for medicinal plants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Search Plant
                </button>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                
                {/* Plant Scan */}
                <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                      <span className="text-xl">📸</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Scan Plant</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      Take a photo of a plant to identify it and learn about its medicinal properties.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/plant-scan")}
                    className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    Start Scanning
                  </button>
                </div>

                {/* Plant Description */}
                <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center mb-3">
                      <span className="text-xl">📚</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Plant Description</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse our database of medicinal plants and their healing properties.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/plant-description")}
                    className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    Browse Plants
                  </button>
                </div>

                {/* History */}
                <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                      <span className="text-xl">📋</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">History</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      View your previously identified plants and their information.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/plant-history")}
                    className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    View History
                  </button>
                </div>

                {/* Risk Alerts */}
                <div className="bg-white/80 rounded-2xl shadow-md border border-green-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 mb-1">Risk Alerts</h2>
                    <p className="text-sm text-gray-600 mb-3">
                      Check personalized safety alerts based on your health conditions.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/risk-alerts")}
                    className="mt-2 inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    View Alerts
                  </button>
                </div>

              </div>
            </div>

            {/* RIGHT CONTENT - DECORATION */}
            <div className="hidden lg:flex flex-col gap-6 items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Plant illustration placeholder */}
                <div className="aspect-square rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center shadow-2xl">
                  <span className="text-9xl">🌿</span>
                </div>
                
                {/* Floating info cards */}
                <div className="absolute -top-4 -right-4 bg-white/90 rounded-2xl shadow-lg px-4 py-3 backdrop-blur-sm border border-green-100">
                  <p className="text-xs text-gray-500 mb-1">Identified Plants</p>
                  <p className="text-2xl font-bold text-green-600">500+</p>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white/90 rounded-2xl shadow-lg px-4 py-3 backdrop-blur-sm border border-emerald-100">
                  <p className="text-xs text-gray-500 mb-1">Medicinal Uses</p>
                  <p className="text-2xl font-bold text-emerald-600">1000+</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom info section */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <div className="text-2xl mb-2">🔬</div>
              <h3 className="font-semibold text-gray-900 mb-1">Accurate AI</h3>
              <p className="text-xs text-gray-600">
                Advanced machine learning for precise plant identification
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <div className="text-2xl mb-2">💊</div>
              <h3 className="font-semibold text-gray-900 mb-1">Medicinal Info</h3>
              <p className="text-xs text-gray-600">
                Comprehensive details on traditional and modern uses
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-semibold text-gray-900 mb-1">Personalized</h3>
              <p className="text-xs text-gray-600">
                Safety alerts tailored to your specific health profile
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
