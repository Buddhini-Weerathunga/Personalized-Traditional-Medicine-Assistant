// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureEyesPage.jsx
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

export default function CaptureEyesPage() {
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
      const file = await dataUrlToFile(capturedImage, "eyes.jpg");
      const res = await predictDoshaFromFace(file);

      setAnalysisResult(res);
    } catch (err) {
      console.error("Eyes analyze error:", err);
      setError("Failed to analyze eyes. Please check ML service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        {/* Soft glowing circles */}
        <div className="pointer-events-none">
          <div className="absolute -top-16 -left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-6xl mx-auto px-4 pt-8 pb-12">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span>📷 Step 2 of 5</span>
              <span className="h-4 w-px bg-green-300" />
              <span>Eyes Capture</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              Prakriti Analysis –{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Eyes Region
              </span>
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-700 mb-2 max-w-2xl leading-relaxed">
              Look directly at the camera with both eyes clearly visible and
              well-lit. Keep your face steady and avoid blinking during capture
              if possible.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-start">
            {/* LEFT: webcam + controls */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-green-200 bg-white/70 flex items-center justify-center shadow-inner overflow-hidden">
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured eyes"
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
                <label className="text-sm font-medium text-gray-800">
                  Region:
                </label>
                <select className="text-sm px-3 py-1.5 rounded-full border border-green-200 bg-white text-gray-800">
                  <option>Eyes region</option>
                </select>
              </div>

              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Relax your face, keep your eyes open
                naturally and avoid strong reflections from glasses or harsh
                lights.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCapture}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-60"
                  disabled={loading}
                >
                  {capturedImage ? "Retake" : "Capture"}
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-full bg-white border border-green-200 text-sm font-medium text-green-900 hover:bg-green-50 transition-all disabled:opacity-60"
                  disabled={loading && !capturedImage}
                >
                  Reset
                </button>

                <button
                  onClick={handleAnalyze}
                  className="ml-auto px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-all disabled:opacity-60"
                  disabled={loading || !capturedImage}
                >
                  {loading ? "Analyzing…" : "Analyze Eyes"}
                </button>
              </div>

              <div className="flex justify-between text-xs text-gray-700">
                <Link
                  to="/prakriti/face"
                  className="underline underline-offset-2 hover:text-emerald-700"
                >
                  &laquo; Back to face capture
                </Link>
                <Link
                  to="/prakriti/mouth"
                  className="underline underline-offset-2 text-emerald-700 font-semibold"
                >
                  Next: mouth / teeth &raquo;
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
                <div className="w-40 h-52 flex items-center justify-center mb-4">
                  <div className="w-32 h-20 border-2 border-emerald-200 rounded-3xl flex items-center justify-center bg-emerald-50/40">
                    <div className="w-10 h-10 border border-emerald-200 rounded-full" />
                  </div>
                </div>
                <p className="text-sm text-center text-gray-700">
                  The eyes reveal clarity, brightness, moisture and gaze
                  steadiness – important indicators of Vata (dry/uneasy),
                  Pitta (sharp/reddish), and Kapha (calm/moist) tendencies.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-top border-green-100 pt-4 space-y-2 border-t">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">
                    Eyes Analysis Result
                  </h2>

                  <p className="text-xs text-gray-700">
                    Dominant Dosha (eyes):{" "}
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
              Ancient Ayurvedic wisdom meets modern AI to bring holistic,
              personalized wellness insights.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-green-400 cursor-pointer">
                Yoga Consultation
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Disease Detection
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Treatment Plans
              </li>
              <li className="hover:text-green-400 cursor-pointer">
                Plant Identification
              </li>
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
