// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureMouthPage.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

// ⭐ Correct Navbar import
import Navbar from "../../components/layout/Navbar.jsx";

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CaptureMouthPage() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture image from webcam.");
      return;
    }
    setCapturedImage(imageSrc);
    setError("");
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    try {
      if (!capturedImage) {
        setError("Please capture an image first.");
        return;
      }
      setLoading(true);
      setError("");

      const base64 = capturedImage.split(",")[1];

      const res = await axios.post(`${API_BASE}/api/prakriti/analyze`, {
        imageBase64: base64,
        meta: {
          step: "mouth",
          notes: "Mouth/teeth capture from React webcam",
        },
      });

      setAnalysisResult(res.data);
    } catch (err) {
      console.error("Mouth analyze error:", err?.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          "Failed to analyze mouth region. Please check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ⭐ NAVBAR ONLY IN THIS PAGE */}
      <Navbar />

      <section className="pt-6 pb-10 min-h-screen bg-[#f5ebdd]">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#3e2b20] mb-2">
            Prakriti Analysis – Mouth / Teeth Capture
          </h1>

          <p className="text-sm md:text-base text-[#7a5b3f] mb-6">
            Slightly open your mouth to show the teeth. Avoid forced smiling.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Left side */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center shadow-inner overflow-hidden">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured mouth"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={VIDEO_CONSTRAINTS}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#5a402c]">
                  Region:
                </label>
                <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
                  <option>Mouth region</option>
                </select>
              </div>

              <p className="text-sm text-[#7a5b3f]">
                <strong>Instructions:</strong> Relax your jaw and gently open
                your mouth to show teeth without tension.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 rounded-full bg-[#8b5d33] text-white text-sm font-semibold shadow hover:bg-[#6f4725]"
                  disabled={loading}
                >
                  Capture
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full bg-[#fdf7ef] border border-[#d7c1a5] text-sm font-medium text-[#5a402c] hover:bg-[#f2e4d3]"
                  disabled={loading}
                >
                  Reset
                </button>

                <button
                  onClick={handleAnalyze}
                  className="ml-auto px-4 py-2 rounded-full bg-[#7b5a3b] text-white text-sm font-semibold shadow hover:bg-[#694a31]"
                  disabled={loading || !capturedImage}
                >
                  {loading ? "Analyzing…" : "Analyze Mouth"}
                </button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between text-xs text-[#8b6b4b]">
                <Link to="/prakriti/eyes" className="underline">
                  &laquo; Back to eyes
                </Link>
                <Link
                  to="/prakriti/skin"
                  className="underline text-[#8b5d33]"
                >
                  Next: skin texture &raquo;
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            {/* Right side: illustration + result */}
            <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-4">
                <div className="w-40 h-40 flex items-center justify-center mb-4">
                  <div className="w-32 h-20 border-2 border-[#d4b690] rounded-full flex items-center justify-center">
                    <div className="w-24 h-8 border border-[#d4b690] rounded-full" />
                  </div>
                </div>
                <p className="text-sm text-center text-[#7a5b3f]">
                  Mouth and teeth features help analyze dryness, shape, and
                  tension — important for Vata–Pitta–Kapha assessment.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-t border-[#e2d1b8] pt-4 space-y-2">
                  <h2 className="text-sm font-semibold text-[#5b3b2a] mb-1">
                    Mouth Analysis Result
                  </h2>

                  <p className="text-xs text-[#7a5b3f]">
                    Dominant Dosha (mouth):{" "}
                    <span className="font-semibold">
                      {analysisResult.report?.dominantDosha ??
                        analysisResult.dominant_dosha ??
                        "Unknown"}
                    </span>
                  </p>

                  {analysisResult.mlResult && (
                    <pre className="text-[11px] bg-[#f7ecdd] rounded-xl p-3 text-[#5b3b2a] whitespace-pre-wrap">
                      {JSON.stringify(analysisResult.mlResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
