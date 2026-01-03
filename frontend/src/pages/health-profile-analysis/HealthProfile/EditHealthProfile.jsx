import React, { useEffect, useState } from "react";
import { Leaf, Heart, Brain, Sun, Wind, Droplets } from "lucide-react";

export default function EditHealthProfile() {
  const [user, setUser] = useState({ name: "Perera", email: "p@gmail.com" });
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({});

  /* ================= FETCH EXISTING PROFILE ================= */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5000/api/my-profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm(data.profile || {});
        setLoading(false);
      })
      .catch(() => window.location.href = "/login");
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const updateField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:5000/api/patient-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert("Health profile updated successfully ✅");
        window.location.href = "/health-profile/view";
      } else {
        alert("Update failed ❌");
      }
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Ayu Ceylon</h1>
              <p className="text-xs text-green-600">Holistic Wellness Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Ayurveda Info Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">✏️ Update Your Ayurvedic Profile</h2>
                <p className="text-green-50 text-sm">
                  Review and update your health information to maintain accurate Dosha analysis
                </p>
              </div>
              <div className="hidden lg:flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5" />
                  <span>Vata</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  <span>Pitta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  <span>Kapha</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Ayurveda Elements */}
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100">
                <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
                <div className="space-y-3">
                  {stepInfo.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step > i + 1 ? 'bg-green-600 text-white' :
                        step === i + 1 ? 'bg-green-100 text-green-700 border-2 border-green-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span className={`text-sm ${step === i + 1 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosha Info Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-800">Dosha Balance</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Keep your profile updated to receive the most accurate Ayurvedic recommendations.
                </p>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Ayurveda Tip</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {stepInfo[step - 1]?.tip}
                </p>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                {/* HEADER */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-green-800">
                      {stepInfo[step - 1]?.title}
                    </h1>
                    <span className="text-sm text-gray-500 font-medium">
                      Step {step} of 6
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{stepInfo[step - 1]?.description}</p>
                </div>

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <Section title="Basic Information">
                    <Grid>
                      <Input label="Age" name="age" value={form.age || ""} onChange={updateField} type="number" />
                      <Select label="Gender" name="gender" value={form.gender || "Other"}
                        onChange={updateField} options={["Male", "Female", "Other"]} />
                    </Grid>
                  </Section>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                  <Section title="Body & Diet">
                    <Grid>
                      <Select label="Body Frame" name="body_frame" value={form.body_frame || "medium"}
                        onChange={updateField} options={["thin", "medium", "heavy"]} />
                      <Select label="Appetite Level" name="appetite_level"
                        value={form.appetite_level || "Moderate"} onChange={updateField}
                        options={["Low", "Moderate", "High", "Variable"]} />
                      <Select label="Meal Regularity" name="meal_regular"
                        value={form.meal_regular || "Yes"} onChange={updateField}
                        options={["Yes", "No", "Sometime"]} />
                      <Select label="Diet Type" name="veg_nonveg"
                        value={form.veg_nonveg || "Vegetarian"} onChange={updateField}
                        options={["Vegetarian", "Eggetarian", "Non-Vegetarian"]} />
                    </Grid>
                  </Section>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && (
                  <Section title="Food Intake (1–5)">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700">
                        Rate how often you consume each food type:<br />
                        <span className="inline-flex gap-3 mt-2 flex-wrap">
                          <span><b>1</b> = Very Low</span>
                          <span><b>2</b> = Low</span>
                          <span><b>3</b> = Moderate</span>
                          <span><b>4</b> = High</span>
                          <span><b>5</b> = Very High</span>
                        </span>
                      </p>
                    </div>
                    {foodKeys.map(k => (
                      <Range key={k} label={k.replace(/_/g, " ")}
                        name={k} value={form[k] || 3} onChange={updateField} />
                    ))}
                  </Section>
                )}

                {/* ================= STEP 4 ================= */}
                {step === 4 && (
                  <>
                    <Section title="Mental & Sleep">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                          Rate your experience with each aspect:<br />
                          <span className="inline-flex gap-3 mt-2 flex-wrap">
                            <span><b>1</b> = Very Low</span>
                            <span><b>2</b> = Low</span>
                            <span><b>3</b> = Moderate</span>
                            <span><b>4</b> = High</span>
                            <span><b>5</b> = Very High</span>
                          </span>
                        </p>
                      </div>
                      <Range label="Stress Level" name="stress_level"
                        value={form.stress_level || 3} onChange={updateField} />
                      <Range label="Sleep Quality" name="sleep_quality"
                        value={form.sleep_quality || 3} onChange={updateField} />
                    </Section>

                    <Section title="Pain">
                      <Range label="Headache Severity" name="headache_severity"
                        value={form.headache_severity || 3} onChange={updateField} />
                      <Range label="Joint Pain Severity" name="joint_pain_severity"
                        value={form.joint_pain_severity || 3} onChange={updateField} />
                    </Section>
                  </>
                )}

             

                {/* ================= STEP 6 ================= */}
                {step === 5 && (
                  <Section title="Family History">
                    <Grid>
                      {familyKeys.map(k => (
                        <Select key={k} label={k.replace("family_", "").replace(/_/g, " ")}
                          name={k} value={form[k] || "No"} onChange={updateField}
                          options={["No", "Yes"]} />
                      ))}
                    </Grid>
                  </Section>
                )}

                {/* ================= NAVIGATION ================= */}
                <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 rounded-lg border-2 border-green-300 text-green-700 font-medium hover:bg-green-50 transition"
                    >
                      ← Back
                    </button>
                  )}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-md"
                    >
                      Save & Update Profile ✅
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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

const stepInfo = [
  {
    title: "Basic Information",
    description: "Update your basic details to keep your profile current",
    tip: "Age and gender help determine your baseline constitution in Ayurveda"
  },
  {
    title: "Body & Diet",
    description: "Review your physical characteristics and eating habits",
    tip: "Body frame and appetite patterns are key indicators of your dominant Dosha"
  },
  {
    title: "Food Preferences",
    description: "Update your dietary patterns and food consumption",
    tip: "Excessive spicy or oily foods can aggravate Pitta, while sweets may increase Kapha"
  },
  {
    title: "Mental & Physical Wellbeing",
    description: "Reflect on your current stress, sleep, and pain levels",
    tip: "Poor sleep and high stress often indicate Vata imbalance in Ayurveda"
  },
 
  {
    title: "Family History",
    description: "Review your family medical history information",
    tip: "Family history helps identify potential health risks for preventive care"
  }
];

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
      <Leaf className="w-5 h-5 text-green-600" />
      {title}
    </h2>
    <div className="space-y-5">{children}</div>
  </section>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
    <input {...props}
      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
    <select {...props}
      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition capitalize">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Range = ({ label, ...props }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center justify-between">
      <span className="capitalize">{label}</span>
      <span className="text-green-600 font-bold text-base">{props.value}/5</span>
    </label>
    <input type="range" min="1" max="5" {...props}
      className="w-full h-2 accent-green-600 cursor-pointer" />
    <div className="flex justify-between text-xs text-gray-500 mt-2">
      <span>Low</span>
      <span>Moderate</span>
      <span>High</span>
    </div>
  </div>
);