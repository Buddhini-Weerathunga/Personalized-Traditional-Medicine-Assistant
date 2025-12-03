// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureSkinPage.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

// ⭐ Navbar import
import Navbar from "../../components/layout/Navbar.jsx";

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CaptureSkinPage() {
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
          step: "skin",
          notes: "Skin texture capture from React webcam",
        },
      });

      setAnalysisResult(res.data);
    } catch (err) {
      console.error("Skin analyze error:", err?.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          "Failed to analyze skin texture. Please check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ⭐ NAVBAR ONLY FOR THIS PAGE */}
      <Navbar />

      <section className="pt-6 pb-10 min-h-screen bg-[#f5ebdd]">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#3e2b20] mb-2">
            Prakriti Analysis – Skin Texture Capture
          </h1>

          <p className="text-sm md:text-base text-[#7a5b3f] mb-6">
            Bring your face closer to the camera in good light so the skin
            texture on forehead, cheeks, and chin is clearly visible.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: webcam & controls */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center shadow-inner overflow-hidden">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured skin texture"
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
                  Skin zone:
                </label>
                <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
                  <option>Full face</option>
                  <option>Forehead focus</option>
                  <option>Cheeks focus</option>
                  <option>Chin area</option>
                </select>
              </div>

              <p className="text-sm text-[#7a5b3f]">
                <strong>Tip:</strong> Avoid harsh shadows. Natural daylight or a
                soft white light gives the best skin texture capture.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow hover:bg-[#6f4725]"
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
                  {loading ? "Analyzing…" : "Analyze Skin"}
                </button>
              </div>

              <div className="flex justify-between text-xs text-[#8b6b4b]">
                <Link to="/prakriti/mouth" className="underline">
                  &laquo; Back to mouth/teeth
                </Link>
                <Link
                  to="/prakriti/profile"
                  className="underline text-[#8b5d33]"
                >
                  Next: profile view &raquo;
                </Link>
              </div>

              {error && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            {/* Right: illustration + result */}
            <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-4">
                <div className="w-40 h-52 border-2 border-[#d4b690] rounded-3xl relative mb-4">
                  <div className="absolute inset-4 border border-dashed border-[#d4b690] rounded-3xl" />
                  <div className="absolute top-8 left-12 w-6 h-6 rounded-full border border-[#d4b690]" />
                  <div className="absolute top-24 left-8 w-28 h-10 border border-[#d4b690] rounded-full opacity-60" />
                </div>
                <p className="text-sm text-center text-[#7a5b3f]">
                  Different zones (forehead, cheeks, chin) help understand dryness,
                  oiliness, and sensitivity, which map to Vata–Pitta–Kapha traits.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-t border-[#e2d1b8] pt-4 space-y-2">
                  <h2 className="text-sm font-semibold text-[#5b3b2a] mb-1">
                    Skin Texture Analysis Result
                  </h2>

                  <p className="text-xs text-[#7a5b3f]">
                    Dominant Dosha (skin):{" "}
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
