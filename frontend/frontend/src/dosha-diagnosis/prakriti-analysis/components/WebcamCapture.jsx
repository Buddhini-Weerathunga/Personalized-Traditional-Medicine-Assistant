import React, { useState } from "react";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { analyzeFace } from "../../api/prakritiApi";
import DoshaResultCard from "./DoshaResultCard";

export default function WebcamCapture() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // base64 with prefix
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) {
      setError("Please upload a face image first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      // backend expects pure base64 (without "data:image/..;base64,")
      const base64 = preview.split(",")[1];

      const res = await analyzeFace(base64);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Failed to analyze image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const dominant = result?.dominant_dosha;
  const doshas = result?.doshas || {};

  return (
    <div className="webcam-card">
      <h2 className="text-lg font-semibold text-slate-800">
        Face-based Prakriti Analysis
      </h2>
      <p className="text-xs text-slate-500 text-center max-w-md">
        Upload a clear, front-facing photo with good lighting. The system uses
        facial ratios and skin texture heuristics to estimate your dominant
        dosha.
      </p>

      <div className="w-full flex flex-col md:flex-row gap-6 mt-4">
        <div className="flex-1 flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-2xl border border-slate-200"
            />
          ) : (
            <div className="w-40 h-40 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
              No image selected
            </div>
          )}

          <label className="text-xs">
            <span className="block mb-1 text-slate-600">
              Select face image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs"
            />
          </label>

          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !preview}
            className="mt-1"
          >
            {loading ? "Analyzing..." : "Analyze Prakriti"}
          </Button>

          {error && (
            <p className="text-xs text-red-500 text-center max-w-xs">{error}</p>
          )}

          {loading && <Loader label="Analyzing facial features..." />}
        </div>

        <div className="flex-1">
          {result ? (
            <>
              <h3 className="text-sm font-semibold text-slate-700">
                Result:{" "}
                <span className="capitalize text-primary">
                  {dominant || "N/A"}
                </span>
              </h3>

              <div className="dosha-grid md:grid-cols-3">
                <DoshaResultCard
                  label="Vata"
                  value={doshas.vata || 0}
                  isDominant={dominant === "vata" || dominant === "Vata"}
                />
                <DoshaResultCard
                  label="Pitta"
                  value={doshas.pitta || 0}
                  isDominant={dominant === "pitta" || dominant === "Pitta"}
                />
                <DoshaResultCard
                  label="Kapha"
                  value={doshas.kapha || 0}
                  isDominant={dominant === "kapha" || dominant === "Kapha"}
                />
              </div>

              {result.feature_description && (
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1">
                  <p className="font-semibold text-slate-700">
                    Facial Feature Summary
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {result.feature_description.face_shape && (
                      <li>{result.feature_description.face_shape}</li>
                    )}
                    {result.feature_description.eyes && (
                      <li>{result.feature_description.eyes}</li>
                    )}
                    {result.feature_description.mouth && (
                      <li>{result.feature_description.mouth}</li>
                    )}
                    {result.feature_description.overall_impression && (
                      <li>{result.feature_description.overall_impression}</li>
                    )}
                  </ul>
                </div>
              )}

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="mt-3 bg-white border border-primary/30 rounded-2xl p-3 text-xs">
                  <p className="font-semibold text-primary mb-1">
                    Lifestyle Suggestions
                  </p>
                  <ul className="list-disc list-inside text-slate-700 space-y-1 max-h-40 overflow-y-auto">
                    {result.recommendations.slice(0, 8).map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500 mt-4">
              After analyzing, your dosha graph and recommendations will appear
              here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
