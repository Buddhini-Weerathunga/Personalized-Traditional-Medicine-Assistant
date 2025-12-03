// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureProfilePage.jsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "axios";

// ⭐ Navbar
import Navbar from "../../components/layout/Navbar.jsx";

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CaptureProfilePage() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  // ------------------ CAPTURE ------------------
  const handleCapture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture image. Please try again.");
      return;
    }
    setCapturedImage(imageSrc);
    setError("");
  };

  // ------------------ RESET ------------------
  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError("");
  };

  // ------------------ ANALYZE ------------------
  const handleAnalyze = async () => {
    try {
      if (!capturedImage) {
        setError("Please capture a profile image first.");
        return;
      }

      setLoading(true);
      setError("");

      const base64 = capturedImage.split(",")[1];

      const res = await axios.post(`${API_BASE}/api/prakriti/analyze`, {
        imageBase64: base64,
        meta: {
          step: "profile",
          notes: "Profile view capture",
        },
      });

      setAnalysisResult(res.data);
    } catch (err) {
      console.error("Profile analyze error:", err?.response?.data || err.message);
      setError(
        err?.response?.data?.message ||
          "Profile analysis failed. Please check backend."
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
          <h1 className="text-3xl font-semibold text-[#3e2b20] mb-4">
            Prakriti Analysis – Profile View Capture
          </h1>

          <p className="text-[#7a5b3f] mb-6">
            Turn your face sideways. Show a clear side profile including the nose, jawline, and forehead.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* ---------------- LEFT SIDE ---------------- */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-[#cfae87] bg-[#fdf7ef] flex items-center justify-center overflow-hidden shadow-inner">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured profile"
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
                <label className="text-sm font-medium text-[#5a402c]">Profile:</label>
                <select className="text-sm px-3 py-1.5 rounded-full border border-[#d7c1a5] bg-[#fdf7ef]">
                  <option>Left side</option>
                  <option>Right side</option>
                </select>
              </div>

              <p className="text-sm text-[#7a5b3f]">
                <strong>Tip:</strong> Keep neck straight, shoulders relaxed, and face 90° to the camera.
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
                  {loading ? "Analyzing…" : "Analyze Profile"}
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 flex gap-2">
                {["Face", "Eyes", "Mouth", "Skin", "Profile"].map((label) => (
                  <div
                    key={label}
                    className="w-14 h-14 rounded-xl bg-[#f7ebdd] border border-[#dec7a7] flex items-center justify-center text-[11px] text-[#7a5b3f]"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between text-xs text-[#8b6b4b] mt-2">
                <Link to="/prakriti/skin" className="underline">
                  &laquo; Back to skin
                </Link>
                <button
                  onClick={() => navigate("/prakriti/results")}
                  className="underline text-[#8b5d33]"
                >
                  View Results &raquo;
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
            </div>

            {/* ---------------- RIGHT SIDE ---------------- */}
            <div className="bg-[#fdf7ef] rounded-2xl border border-[#e0cfba] shadow p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-4">
                <div className="w-36 h-40 flex items-center justify-center mb-4">
                  <div className="w-24 h-32 border-2 border-[#d4b690] rounded-full relative">
                    <div className="absolute right-0 top-12 w-10 h-14 border border-[#d4b690] rounded-full" />
                  </div>
                </div>
                <p className="text-sm text-center text-[#7a5b3f]">
                  Side-view helps identify jawline angles, nose shape, and structural balance.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-t border-[#e2d1b8] pt-4 space-y-2">
                  <h2 className="text-sm font-semibold text-[#5b3b2a] mb-1">
                    Profile Analysis Result
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
