import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PrakritiAnalysisPage = () => {
  const navigate = useNavigate();

  // ----------------------------------------
  // NEW STATES (NEEDED FOR API RESULT)
  // ----------------------------------------
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    Age: "",
    Gender: "",
    Face_Shape: "",
    Face_Width_Ratio: "",
    Jaw_Width_Ratio: "",
    Forehead_Height_Ratio: "",
    Eye_Size: "",
    Skin_Type: "",
    Body_Frame: "",
    Body_Weight: "",
    Sleep_Pattern: "",
    Activity_Level: "",
    Diet_Type: "",
    Stress_Level: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------------------
  // NEW UPDATED API CALL FOR FEATURE ANALYSIS
  // ----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/prakriti/analyze-features",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Server error");
      }

      const data = await response.json();
      console.log("Prediction:", data);
      setResult(data); // Store the dosha result
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5ebde",
        padding: "24px 16px 40px",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: 16,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#8b5e34",
          fontWeight: 600,
        }}
      >
        ← Back to Home
      </button>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "#fdf6ec",
          borderRadius: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
          border: "1px solid rgba(139,94,52,0.12)",
          padding: 24,
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 8,
            color: "#3b2a1a",
          }}
        >
          Prakriti Analysis
        </h1>
        <p style={{ marginBottom: 20, fontSize: 14, opacity: 0.8 }}>
          Fill these details about your body, face and lifestyle. In the next
          step, the system will estimate your Vata–Pitta–Kapha balance.
        </p>

        {/* Show loading */}
        {loading && (
          <p style={{ color: "#8b5e34", fontWeight: 600 }}>Analyzing… 🔄</p>
        )}

        {/* Show error */}
        {error && (
          <p style={{ color: "red", fontWeight: 600 }}>
            ❌ Error: {error}
          </p>
        )}

        {/* Show result */}
        {result && (
          <div
            style={{
              marginBottom: 20,
              padding: 16,
              background: "#fff2d8",
              borderRadius: 12,
              border: "1px solid #e8c9a1",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 8 }}>Result:</h3>
            <pre style={{ margin: 0, fontSize: 14 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {/* All your fields remain exactly the same (unchanged) */}
            <Field label="Age" name="Age" type="number" value={form.Age} onChange={handleChange} />
            <SelectField label="Gender" name="Gender" value={form.Gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
            <SelectField label="Face Shape" name="Face_Shape" value={form.Face_Shape} onChange={handleChange} options={["Oval", "Round", "Square", "Heart", "Long"]} />
            <Field label="Face Width Ratio" name="Face_Width_Ratio" type="number" step="0.01" value={form.Face_Width_Ratio} onChange={handleChange} />
            <Field label="Jaw Width Ratio" name="Jaw_Width_Ratio" type="number" step="0.01" value={form.Jaw_Width_Ratio} onChange={handleChange} />
            <Field label="Forehead Height Ratio" name="Forehead_Height_Ratio" type="number" step="0.01" value={form.Forehead_Height_Ratio} onChange={handleChange} />
            <SelectField label="Eye Size" name="Eye_Size" value={form.Eye_Size} onChange={handleChange} options={["Small", "Medium", "Large"]} />
            <SelectField label="Skin Type" name="Skin_Type" value={form.Skin_Type} onChange={handleChange} options={["Dry", "Oily", "Normal", "Combination", "Sensitive"]} />
            <SelectField label="Body Frame" name="Body_Frame" value={form.Body_Frame} onChange={handleChange} options={["Slim", "Medium", "Broad"]} />
            <Field label="Body Weight (kg)" name="Body_Weight" type="number" step="0.1" value={form.Body_Weight} onChange={handleChange} />
            <SelectField label="Sleep Pattern" name="Sleep_Pattern" value={form.Sleep_Pattern} onChange={handleChange} options={["Regular", "Light", "Interrupted", "Deep"]} />
            <SelectField label="Activity Level" name="Activity_Level" value={form.Activity_Level} onChange={handleChange} options={["Low", "Moderate", "High"]} />
            <SelectField label="Diet Type" name="Diet_Type" value={form.Diet_Type} onChange={handleChange} options={["Vegetarian", "Vegan", "Non-vegetarian", "Mixed"]} />
            <SelectField label="Stress Level" name="Stress_Level" value={form.Stress_Level} onChange={handleChange} options={["Low", "Medium", "High"]} />
          </div>

          <div style={{ marginTop: 24, textAlign: "right" }}>
            <button
              type="submit"
              style={{
                background: "#8b5e34",
                color: "#fdf6ec",
                borderRadius: 999,
                border: "none",
                padding: "10px 24px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Analyze Prakriti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Input Field Component
const Field = ({ label, name, type = "text", value, onChange, step }) => (
  <label style={{ display: "flex", flexDirection: "column", fontSize: 13 }}>
    <span style={{ marginBottom: 4, fontWeight: 600 }}>{label}</span>
    <input
      name={name}
      type={type}
      value={value}
      step={step}
      onChange={onChange}
      style={{
        borderRadius: 999,
        border: "1px solid rgba(139,94,52,0.3)",
        padding: "8px 12px",
        fontSize: 14,
        background: "#fffaf2",
      }}
    />
  </label>
);

// Dropdown Field
const SelectField = ({ label, name, value, onChange, options }) => (
  <label style={{ display: "flex", flexDirection: "column", fontSize: 13 }}>
    <span style={{ marginBottom: 4, fontWeight: 600 }}>{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        borderRadius: 999,
        border: "1px solid rgba(139,94,52,0.3)",
        padding: "8px 12px",
        fontSize: 14,
        background: "#fffaf2",
      }}
    >
      <option value="">Select…</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export default PrakritiAnalysisPage;
