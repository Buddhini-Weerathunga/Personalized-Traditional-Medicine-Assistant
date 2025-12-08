// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureFacePage.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";

import Navbar from "../../components/layout/Navbar.jsx";
import { predictDoshaFromFace } from "../../services/doshaMlService";
import { dataUrlToFile } from "../../utils/imageUtils";

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
};

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
    setAnalysisResult(null);
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

      // 👉 Convert webcam dataURL to File and send to ML service
      const file = await dataUrlToFile(capturedImage, "face.jpg");
      const res = await predictDoshaFromFace(file);

      setAnalysisResult(res);
    } catch (err) {
      console.error("Face analyze error:", err);
      setError("Failed to analyze face. Please check ML service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        <div className="pointer-events-none">
          <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span>📷 Step 1 of 5</span>
              <span className="h-4 w-px bg-green-300" />
              <span>Front Face Capture</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Prakriti Analysis –{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Front Face
              </span>
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-700 max-w-2xl leading-relaxed">
              Sit in a well-lit place, look straight at the camera with a
              neutral expression. Keep your face centered and avoid strong
              shadows for best analysis.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-start">
            {/* LEFT: webcam + controls */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-green-200 bg-white/70 shadow-inner flex items-center justify-center overflow-hidden">
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

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCapture}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-60"
                  disabled={loading}
                >
                  {capturedImage ? "Retake" : "Capture"}
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full border border-green-200 text-green-800 text-sm bg-white hover:bg-green-50 transition-all disabled:opacity-60"
                  disabled={loading && !capturedImage}
                >
                  Reset
                </button>

                <button
                  onClick={handleAnalyze}
                  className="ml-auto px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-all disabled:opacity-60"
                  disabled={loading || !capturedImage}
                >
                  {loading ? "Analyzing..." : "Analyze Face"}
                </button>
              </div>

              <div className="text-xs text-gray-700">
                Step 1 of 5 – Front face. Next:{" "}
                <Link
                  to="/prakriti/eyes"
                  className="text-emerald-700 font-semibold underline underline-offset-2"
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

            {/* RIGHT: illustration + result */}
            <div className="bg-white/85 rounded-2xl border border-green-100 shadow p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-4">
                <div className="w-40 h-52 border-2 border-emerald-200 rounded-full flex items-center justify-center mb-4 bg-emerald-50/40">
                  <div className="w-24 h-32 border border-emerald-200 rounded-full" />
                </div>
                <p className="text-sm text-center text-gray-700">
                  Keep your head straight, eyes at camera level, and maintain a
                  soft, neutral expression. Avoid glasses and heavy makeup if
                  possible for clearer analysis.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-t border-green-100 pt-4 space-y-2">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">
                    Front Face Analysis Result
                  </h2>

                  <p className="text-xs text-gray-700">
                    Dominant Dosha:{" "}
                    <span className="font-semibold text-emerald-700">
                      {analysisResult.dosha_label ?? "Unknown"}
                    </span>
                  </p>

                  {analysisResult.probabilities && (
                    <pre className="text-[11px] bg-emerald-50 rounded-xl p-3 text-gray-800 whitespace-pre-wrap border border-emerald-100">
                      {JSON.stringify(analysisResult.probabilities, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (unchanged) */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        {/* ... your existing footer code ... */}
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </>
  );
}
