// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureFacePage.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

// ⭐ Correct Navbar import (IMPORTANT)
import Navbar from "../../components/layout/Navbar.jsx";

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CaptureFacePage() {
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
          step: "front_face",
          notes: "Front face capture from React webcam",
        },
      });

      setAnalysisResult(res.data);
    } catch (err) {
      console.error("Face analyze error:", err?.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          "Failed to analyze face. Please check backend / Python service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ⭐ NAVBAR ONLY FOR THIS PAGE ⭐ */}
      <Navbar />

      <section className="pt-6 pb-10 min-h-screen bg-[#f5ebdd]">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-semibold text-[#3e2b20] mb-2">
            Prakriti Analysis – Front Face Capture
          </h1>
          <p className="text-[#7b5a40] mb-6">
            Look straight at the camera with a neutral expression.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: webcam + controls */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#e0cfba] bg-[#faf2e7] shadow-inner flex items-center justify-center overflow-hidden">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured face"
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
                <button
                  onClick={handleCapture}
                  className="px-5 py-2 rounded-full bg-[#a66a3a] text-white text-sm font-medium shadow hover:bg-[#915a30]"
                  disabled={loading}
                >
                  Capture
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full border border-[#c7aa87] text-[#7a5b3f] text-sm bg-[#fdf7ef] hover:bg-[#f3e7d5]"
                  disabled={loading}
                >
                  Reset
                </button>

                <button
                  onClick={handleAnalyze}
                  className="ml-auto px-5 py-2 rounded-full bg-[#7b5a3b] text-white text-sm font-medium shadow hover:bg-[#694a31]"
                  disabled={loading || !capturedImage}
                >
                  {loading ? "Analyzing..." : "Analyze Face"}
                </button>
              </div>

              <div className="text-xs text-[#8b6b4b]">
                Step 1 of 5 – Front face. Next:{" "}
                <Link
                  to="/prakriti/eyes"
                  className="text-[#8b5d33] underline"
                >
                  Capture eyes &raquo;
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
                <div className="w-40 h-52 border-2 border-[#d4b690] rounded-full flex items-center justify-center mb-4">
                  <div className="w-24 h-32 border border-[#d4b690] rounded-full" />
                </div>
                <p className="text-sm text-center text-[#7a5b3f]">
                  Front-view capture pose. Keep your head straight, eyes level,
                  and maintain a soft, neutral expression.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-t border-[#e2d1b8] pt-4 space-y-2">
                  <h2 className="text-sm font-semibold text-[#5b3b2a] mb-1">
                    Front Face Analysis Result
                  </h2>

                  <p className="text-xs text-[#7a5b3f]">
                    Dominant Dosha:{" "}
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
