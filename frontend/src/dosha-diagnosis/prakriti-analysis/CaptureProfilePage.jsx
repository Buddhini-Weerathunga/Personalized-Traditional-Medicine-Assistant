// frontend/src/dosha-diagnosis/prakriti-analysis/CaptureProfilePage.jsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

import Navbar from "../../components/layout/Navbar.jsx";
import { predictDoshaFromFace } from "../../services/doshaMlService";
import { dataUrlToFile } from "../../utils/imageUtils";

const VIDEO_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function CaptureProfilePage() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture image. Please try again.");
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
        setError("Please capture a profile image first.");
        return;
      }

      setLoading(true);
      setError("");

      // 👉 Convert webcam dataURL to File and send to ML vision endpoint
      const file = await dataUrlToFile(capturedImage, "profile.jpg");
      const res = await predictDoshaFromFace(file); // { dosha_label, probabilities }

      setAnalysisResult(res);
    } catch (err) {
      console.error("Profile analyze error:", err);
      setError("Profile analysis failed. Please check ML service.");
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
              <span>📷 Step 5 of 5</span>
              <span className="h-4 w-px bg-green-300" />
              <span>Profile View Capture</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              Prakriti Analysis –{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Side Profile
              </span>
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-700 mb-2 max-w-2xl leading-relaxed">
              Turn your face sideways and show a clear side profile including
              nose, jawline, and forehead. Keep your neck straight and shoulders
              relaxed.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-start">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-green-200 bg-white/70 flex items-center justify-center overflow-hidden shadow-inner">
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
                <label className="text-sm font-medium text-gray-800">
                  Profile:
                </label>
                <select className="text-sm px-3 py-1.5 rounded-full border border-green-200 bg-white text-gray-800">
                  <option>Left side</option>
                  <option>Right side</option>
                </select>
              </div>

              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Keep your face at 90° to the camera.
                Avoid tilting up or down so the jawline and nose are clearly
                visible.
              </p>

              {/* Buttons */}
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
                  {loading ? "Analyzing…" : "Analyze Profile"}
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 flex gap-2">
                {["Face", "Eyes", "Mouth", "Skin", "Profile"].map((label, idx) => (
                  <div
                    key={label}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-[11px] ${
                      idx === 4
                        ? "bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold"
                        : "bg-green-50 border border-green-200 text-gray-700"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between text-xs text-gray-700 mt-2">
                <Link
                  to="/prakriti/skin"
                  className="underline underline-offset-2 hover:text-emerald-700"
                >
                  &laquo; Back to skin
                </Link>
                <button
                  onClick={() => navigate("/prakriti/results")}
                  className="underline underline-offset-2 text-emerald-700 font-semibold"
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

            {/* RIGHT SIDE */}
            <div className="bg-white/85 rounded-2xl border border-green-100 shadow p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center mb-4">
                <div className="w-36 h-40 flex items-center justify-center mb-4">
                  <div className="w-24 h-32 border-2 border-emerald-200 rounded-full relative bg-emerald-50/30">
                    <div className="absolute right-0 top-12 w-10 h-14 border border-emerald-200 rounded-full" />
                  </div>
                </div>
                <p className="text-sm text-center text-gray-700">
                  Side view helps assess jawline angle, chin prominence, nose
                  shape, and overall structural balance — key structural
                  features for understanding Vata (sharp/lean), Pitta
                  (moderate/defined), and Kapha (rounded/steady) traits.
                </p>
              </div>

              {analysisResult && (
                <div className="mt-4 border-t border-green-100 pt-4 space-y-2">
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">
                    Profile Analysis Result
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
