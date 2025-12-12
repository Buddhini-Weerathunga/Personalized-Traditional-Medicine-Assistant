import React, { useState } from "react";
import { predictDoshaFromFace } from "../../services/doshaMlService";

export default function FacePredictTest() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await predictDoshaFromFace(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while predicting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Face Dosha Prediction Test</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Dosha"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Prediction</h2>
          <p><b>Dominant:</b> {result.dosha_label}</p>
          {result.probabilities && (
            <pre>{JSON.stringify(result.probabilities, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
