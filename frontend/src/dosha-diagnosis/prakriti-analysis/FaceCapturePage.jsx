// frontend/src/pages/FaceCapturePage.jsx
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const VIDEO_CONSTRAINTS = {
  width: 480,
  height: 360,
  facingMode: "user",
};

const FaceCapturePage = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const handleCapture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setCapturedImage(imageSrc);
    setLoading(true);
    setError("");
    setAnalysisResult(null);

    try {
      // imageSrc is a base64 data URL "data:image/jpeg;base64,..."
      // Strip the prefix, send only pure base64
      const base64 = imageSrc.split(",")[1];

      const res = await axios.post(
        "http://localhost:5000/api/prakriti/analyze-image",
        { imageBase64: base64 }
      );

      setAnalysisResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f5ebdd] flex flex-col items-center px-4 py-6">
      <h1 className="text-3xl font-semibold text-[#5b3b2a] mb-2">
        Prakriti Facial Capture – Front View
      </h1>
      <p className="text-[#7b5a40] mb-6">
        Look straight at the camera with a neutral expression.
      </p>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Webcam & controls */}
        <div className="bg-[#fdf7ee] rounded-3xl shadow-md p-4 flex flex-col items-center">
          <div className="w-full overflow-hidden rounded-2xl border border-[#d8c2a5] bg-black">
            {!capturedImage ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={VIDEO_CONSTRAINTS}
                className="w-full h-auto"
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full h-auto"
              />
            )}
          </div>

          <div className="w-full flex flex-col gap-3 mt-4">
            <label className="text-sm font-medium text-[#5b3b2a]">
              Face Region
            </label>
            <select
              disabled
              className="w-full rounded-full border border-[#d1b896] bg-[#fbf2e3] px-4 py-2 text-sm text-[#5b3b2a]"
            >
              <option>Face</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleCapture}
                disabled={loading}
                className="flex-1 rounded-full bg-[#8b5c3b] text-white py-2 text-sm font-semibold shadow-md hover:bg-[#74472a] disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Capture & Analyze"}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-full border border-[#c9a982] text-[#5b3b2a] py-2 text-sm font-semibold bg-[#fff7ec] hover:bg-[#f5e3cc]"
              >
                Reset
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
            )}
          </div>
        </div>

        {/* Right: Illustration + Result */}
        <div className="bg-[#fdf7ee] rounded-3xl shadow-md p-6 flex flex-col gap-6">
          {/* Stylized head outline */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-40 h-48 border-[3px] border-[#d1b28a] rounded-full relative">
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-6 border border-[#d1b28a] rounded-full" />
              <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-4">
                <span className="w-4 h-4 rounded-full border border-[#d1b28a]" />
                <span className="w-4 h-4 rounded-full border border-[#d1b28a]" />
              </div>
              <div className="absolute top-28 left-1/2 -translate-x-1/2 w-10 h-2 border-b-2 border-[#d1b28a] rounded-full" />
              <div className="absolute top-34 left-1/2 -translate-x-1/2 w-12 h-6 border border-[#d1b28a] rounded-b-full border-t-0" />
            </div>
            <p className="mt-3 text-sm text-[#7b5a40] text-center">
              Front-view pose illustration for face capture.
            </p>
          </div>

          {/* Analysis Result (simple preview) */}
          {analysisResult && (
            <div className="mt-4 bg-[#f8efe0] rounded-2xl p-4">
              <h2 className="text-lg font-semibold text-[#5b3b2a] mb-2">
                Quick Analysis (Rule-based)
              </h2>
              <pre className="text-xs text-[#6b4a34] whitespace-pre-wrap">
                {JSON.stringify(analysisResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceCapturePage;
