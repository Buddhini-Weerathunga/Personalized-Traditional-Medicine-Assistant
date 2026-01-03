import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../../services/api";
import AyurvedaHeader from "../../../components/health-profile-analysis/AyurvedaHeader";



export default function CreateHealthProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [step, setStep] = useState(1);

  /* ================= DEFAULT FORM ================= */
  const [form, setForm] = useState({
    age: "",
    gender: "Other",

    body_frame: "medium",
    appetite_level: "Moderate",
    meal_regular: "Yes",
    veg_nonveg: "Vegetarian",

    spicy_food_frequency: 3,
    oily_food_frequency: 3,
    sweet_food_frequency: 3,
    caffeine_intake: 2,
    processed_food_intake: 2,

    urine_color: "Yellow",

    stress_level: 3,
    sleep_quality: 3,
    headache_severity: 3,
    joint_pain_severity: 3,

    environment_temperature: "Moderate",
    environment_humidity: "Moderate",
    environment_wind: "Moderate",

    family_diabetes: "No",
    family_thyroid: "No",
    family_cholesterol: "No",
    family_obesity: "No",
    family_asthma: "No",
    family_heart_disease: "No",
    family_mental_health: "No"
  });

  useEffect(() => {
  getProfile()
    .then(res => setUser(res.data.user))
    .catch(() => {
      localStorage.removeItem("accessToken");
      navigate("/login");
    });
}, [navigate]);

  /* ================= CHANGE HANDLER ================= */
  const updateField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🚫 Prevent submit if not last step
  if (step !== 6) return;

  try {
    const token = localStorage.getItem("accessToken");

    await axios.post(
      "http://localhost:5000/api/patient-input",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Health profile created successfully 🌿");
    navigate("/health-profile/view");
  } catch (err) {
    alert("Failed to create profile ❌");
  }
};


  return (
    <div>
        <AyurvedaHeader user={user} />
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-4">
  

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-8"
      >
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800">
            🌿 Create Health Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Step {step} of 6
          </p>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <Section title="Basic Information">
            <Grid>
              <Input label="Age" name="age" value={form.age} onChange={updateField} />
              <Select label="Gender" name="gender" value={form.gender}
                onChange={updateField} options={["Male", "Female", "Other"]} />
            </Grid>
          </Section>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <Section title="Body & Diet">
            <Grid>
              <Select label="Body Frame" name="body_frame" value={form.body_frame}
                onChange={updateField} options={["thin", "medium", "heavy"]} />
              <Select label="Appetite Level" name="appetite_level"
                value={form.appetite_level} onChange={updateField}
                options={["Low", "Moderate", "High", "Variable"]} />
              <Select label="Meal Regularity" name="meal_regular"
                value={form.meal_regular} onChange={updateField}
                options={["Yes", "No", "Sometime"]} />
              <Select label="Diet Type" name="veg_nonveg"
                value={form.veg_nonveg} onChange={updateField}
                options={["Vegetarian", "Eggetarian", "Non-Vegetarian"]} />
            </Grid>
          </Section>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <Section title="Food Intake (1–5)">
             <p className="text-sm text-gray-600 mb-4">
    Rate how often you consume each food type:
    <br />
    <b>1</b> = Very Low / Never &nbsp;&nbsp;
    <b>2</b> = Low &nbsp;&nbsp;
    <b>3</b> = Moderate &nbsp;&nbsp;
    <b>4</b> = High &nbsp;&nbsp;
    <b>5</b> = Very High
  </p>
            {foodKeys.map(k => (
              <Range key={k} label={k.replace(/_/g, " ")}
                name={k} value={form[k]} onChange={updateField} />
            ))}
          </Section>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <>
            <Section title="Mental & Sleep">
               <p className="text-sm text-gray-600 mb-4">
    Rate how often you consume each food type:
    <br />
    <b>1</b> = Very Low / Never &nbsp;&nbsp;
    <b>2</b> = Low &nbsp;&nbsp;
    <b>3</b> = Moderate &nbsp;&nbsp;
    <b>4</b> = High &nbsp;&nbsp;
    <b>5</b> = Very High
  </p>
              <Range label="Stress Level" name="stress_level"
                value={form.stress_level} onChange={updateField} />
              <Range label="Sleep Quality" name="sleep_quality"
                value={form.sleep_quality} onChange={updateField} />
            </Section>

            <Section title="Pain">
              <Range label="Headache Severity" name="headache_severity"
                value={form.headache_severity} onChange={updateField} />
              <Range label="Joint Pain Severity" name="joint_pain_severity"
                value={form.joint_pain_severity} onChange={updateField} />
            </Section>
          </>
        )}

        {/* ================= STEP 5 ================= */}
        {step === 5 && (
          <Section title="Environment">
            <Grid>
              <Select label="Temperature" name="environment_temperature"
                value={form.environment_temperature} onChange={updateField}
                options={["cold", "Moderate", "hot"]} />
              <Select label="Humidity" name="environment_humidity"
                value={form.environment_humidity} onChange={updateField}
                options={["cold", "Moderate", "hot"]} />
              <Select label="Wind" name="environment_wind"
                value={form.environment_wind} onChange={updateField}
                options={["cold", "Moderate", "hot"]} />
            </Grid>
          </Section>
        )}

        {/* ================= STEP 6 ================= */}
        {step === 6 && (
          <Section title="Family History">
            <Grid>
              {familyKeys.map(k => (
                <Select key={k} label={k.replace("family_", "")}
                  name={k} value={form[k]} onChange={updateField}
                  options={["No", "Yes"]} />
              ))}
            </Grid>
          </Section>
        )}

        {/* ================= NAVIGATION ================= */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-lg border border-green-300 text-green-700 hover:bg-green-50"
            >
              Back
            </button>
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Health Profile
            </button>
          )}
        </div>
      </form>
    </div>
    </div>
  );
}

/* ================= HELPERS ================= */

const foodKeys = [
  "spicy_food_frequency",
  "oily_food_frequency",
  "sweet_food_frequency",
  "caffeine_intake",
  "processed_food_intake"
];

const familyKeys = [
  "family_diabetes",
  "family_thyroid",
  "family_cholesterol",
  "family_obesity",
  "family_asthma",
  "family_heart_disease",
  "family_mental_health"
];

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4 text-green-800">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600 mb-1 block">{label}</label>
    <input {...props}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm text-gray-600 mb-1 block">{label}</label>
    <select {...props}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Range = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600 mb-1 block">
      {label} ({props.value}/5)
    </label>
    <input type="range" min="1" max="5" {...props}
      className="w-full accent-green-600" />
  </div>

);
