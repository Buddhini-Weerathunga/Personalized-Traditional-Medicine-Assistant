import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    category: "Mind & Body Response",
    question: "How do you typically feel about weather changes?",
    options: [
      { text: "Discomfort in cold, dry weather", dosha: "Vata" },
      { text: "Discomfort in hot, humid weather", dosha: "Pitta" },
      { text: "Discomfort in cold, damp weather", dosha: "Kapha" },
    ],
  },
  {
    category: "Response Pattern",
    question: "How do you describe your response mechanism?",
    options: [
      { text: "Instinctive and quick", dosha: "Vata" },
      { text: "Calculated and sure", dosha: "Pitta" },
      { text: "Slow but lasting", dosha: "Kapha" },
    ],
  },
  {
    category: "Energy & Endurance",
    question: "How would you describe your stamina?",
    options: [
      { text: "Sudden burst, burn out easily", dosha: "Vata" },
      { text: "Strong but may overexert", dosha: "Pitta" },
      { text: "Slow start, long endurance", dosha: "Kapha" },
    ],
  },
  {
    category: "Stress Reaction",
    question: "How do you handle stress?",
    options: [
      { text: "Anxiety, restlessness", dosha: "Vata" },
      { text: "Irritability, impatience", dosha: "Pitta" },
      { text: "Withdrawal, lethargy", dosha: "Kapha" },
    ],
  },
  {
    category: "Emotional Pattern",
    question: "What emotional traits do you identify with?",
    options: [
      { text: "Creative, enthusiastic", dosha: "Vata" },
      { text: "Determined, focused", dosha: "Pitta" },
      { text: "Calm, loyal, compassionate", dosha: "Kapha" },
    ],
  },
];

export default function PrakritiFormPage() {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0); // 0 landing, 1 userinfo, 2 assessment, 3 result, 4 report
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (dosha) => {
    const updated = [...answers];
    updated[step] = dosha;
    setAnswers(updated);
  };

  // Calculate dominant dosha from answers
  const calculateDominantDosha = (counts) => {
    if (counts.Vata >= counts.Pitta && counts.Vata >= counts.Kapha) return "Vata";
    if (counts.Pitta >= counts.Vata && counts.Pitta >= counts.Kapha) return "Pitta";
    if (counts.Kapha >= counts.Vata && counts.Kapha >= counts.Pitta) return "Kapha";
    return "Not enough data";
  };

  // 🔥 Save to backend using existing /api/prakritiReports/reports endpoint
  const saveResult = async () => {
    const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
    answers.forEach((a) => counts[a]++);

    const total = answers.length;
    const questionnaireScores = {
      Vata: Math.round((counts.Vata / total) * 100),
      Pitta: Math.round((counts.Pitta / total) * 100),
      Kapha: Math.round((counts.Kapha / total) * 100),
    };

    const dominantDosha = calculateDominantDosha(counts);
    const faceScores = JSON.parse(localStorage.getItem("faceResult")) || {
      Vata: 33,
      Pitta: 33,
      Kapha: 34,
    };

    // Calculate final hybrid scores
    const finalScores = {
      Vata: Math.round((questionnaireScores.Vata + faceScores.Vata) / 2),
      Pitta: Math.round((questionnaireScores.Pitta + faceScores.Pitta) / 2),
      Kapha: Math.round((questionnaireScores.Kapha + faceScores.Kapha) / 2),
    };

    try {
      setLoading(true);

      // Using your existing backend endpoint
      const response = await fetch("http://localhost:5000/api/prakritiReports/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          vataScore: finalScores.Vata,
          pittaScore: finalScores.Pitta,
          kaphaScore: finalScores.Kapha,
          dominantDosha: dominantDosha,
          capturedRegions: {
            userInfo,
            questionnaireAnswers: answers,
            questionnaireScores,
            faceScores,
          },
          recommendations: {}, // Will be populated by backend or you can add logic
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      // Set result from backend response
      setResult({
        Vata: data.report.vataScore,
        Pitta: data.report.pittaScore,
        Kapha: data.report.kaphaScore,
        primary: data.report.dominantDosha,
        id: data.report._id,
        recommendations: data.report.recommendations,
        capturedRegions: data.report.capturedRegions,
      });

      setFormStep(3);
    } catch (error) {
      console.error("Error saving result:", error);
      alert("Error saving result. Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      await saveResult();
    }
  };

  // ================= LANDING =================
  if (formStep === 0)
    return (
      <div className="min-h-screen bg-green-100">
        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-6">
          <h1 className="text-2xl font-bold text-green-800">Prakriti</h1>
          <button
            onClick={() => setFormStep(1)}
            className="text-green-700 font-medium"
          >
            Start Assessment
          </button>
        </div>

        {/* HERO */}
        <div className="text-center mt-20 px-6">
          <h2 className="text-5xl font-bold text-green-800 mb-6">
            Discover Your Ayurvedic Constitution
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Understand your unique mind-body type through our comprehensive
            Prakriti assessment and receive personalized wellness recommendations.
          </p>

          <button
            onClick={() => setFormStep(1)}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-full shadow-lg transition"
          >
            Begin Your Journey →
          </button>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-20 px-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-green-700">
              Personalized Analysis
            </h3>
            <p className="text-gray-600 text-sm">
              Get insights into your unique Prakriti (body constitution)
              based on Ayurvedic principles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-green-700">
              Comprehensive Assessment
            </h3>
            <p className="text-gray-600 text-sm">
              Answer questions about your physical, mental, and emotional traits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-green-700">
              Detailed Report
            </h3>
            <p className="text-gray-600 text-sm">
              Receive a full wellness report with diet, lifestyle, and herbal guidance.
            </p>
          </div>
        </div>

        {/* JOURNEY STEPS */}
        <div className="text-center mt-24 px-6">
          <h3 className="text-3xl font-bold text-green-800 mb-12">
            Your Journey to Self-Discovery
          </h3>

          <div className="grid md:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {[
              "Start Assessment",
              "Answer Questions",
              "Get Results",
              "Receive Guidance",
            ].map((stepTitle, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md mb-4">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium text-center">
                  {stepTitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="max-w-4xl mx-auto mt-24 bg-white rounded-3xl shadow-xl p-10 text-center">
          <h3 className="text-3xl font-bold text-green-800 mb-4">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-gray-600 mb-6">
            Start your personalized Ayurvedic assessment today and discover
            the path to balanced wellness.
          </p>

          <button
            onClick={() => setFormStep(1)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-md"
          >
            Start Your Assessment →
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-sm mt-16 pb-6">
          © 2024 Prakriti Assessment. Based on traditional Ayurvedic principles.
        </div>
      </div>
    );

  // ================= USER INFO =================
  if (formStep === 1)
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-4xl">
          {/* STEP INDICATOR */}
          <div className="flex items-center justify-between mb-10">
            {[
              "Introduction",
              "User Info",
              "Assessment",
              "Results",
              "Report",
            ].map((label, index) => (
              <div key={index} className="flex-1 flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                    index <= 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm mt-2 text-gray-700">{label}</span>
                {index < 4 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                )}
              </div>
            ))}
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
            Tell Us About Yourself
          </h2>

          {/* FORM GRID */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">First Name</label>
              <input
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Last Name</label>
              <input
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, lastName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Age</label>
              <input
                type="number"
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, age: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, gender: e.target.value })
                }
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Location</label>
              <input
                placeholder="City, Country"
                className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-green-500"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-10">
            <button
              onClick={() => setFormStep(0)}
              className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Back
            </button>

            <button
              onClick={() => setFormStep(2)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg shadow-md"
            >
              Continue to Assessment
            </button>
          </div>
        </div>
      </div>
    );

  // ================= QUESTIONNAIRE =================
  if (formStep === 2)
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-4xl">
          {/* STEPPER */}
          <div className="flex items-center justify-between mb-10">
            {["Introduction", "User Info", "Assessment", "Results", "Report"].map(
              (label, index) => (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                      index <= 2
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2">{label}</span>
                  {index < 4 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                  )}
                </div>
              )
            )}
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((step + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* QUESTION */}
          <h3 className="text-sm text-green-600 mb-2">
            {questions[step].category}
          </h3>

          <h2 className="text-2xl font-semibold mb-8">
            {questions[step].question}
          </h2>

          {/* OPTIONS */}
          <div className="space-y-4">
            {questions[step].options.map((opt, index) => (
              <label
                key={index}
                className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition ${
                  answers[step] === opt.dosha
                    ? "border-green-600 bg-green-50"
                    : "hover:bg-green-50"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  className="accent-green-600"
                  onChange={() => handleAnswer(opt.dosha)}
                  checked={answers[step] === opt.dosha}
                />
                {opt.text}
              </label>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-10">
            <button
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={!answers[step] || loading}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : step === questions.length - 1
                ? "View Results"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    );

  // ================= RESULTS =================
  if (formStep === 3 && result)
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-4xl">
          {/* STEPPER */}
          <div className="flex items-center justify-between mb-10">
            {["Introduction", "User Info", "Assessment", "Results", "Report"].map(
              (label, index) => (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                      index <= 3
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2">{label}</span>
                  {index < 4 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                  )}
                </div>
              )
            )}
          </div>

          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            Your Final Hybrid Constitution
          </h2>

          <h3 className="text-2xl font-semibold text-center mb-10">
            {result.primary}
          </h3>

          {["Vata", "Pitta", "Kapha"].map((key) => (
            <div key={key} className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>{key}</span>
                <span>{result[key]}%</span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${result[key]}%` }}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-10">
            <button
              onClick={() => setFormStep(4)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg shadow-md"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    );

  // ================= REPORT =================
  if (formStep === 4)
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-5xl">
          {/* STEPPER */}
          <div className="flex items-center justify-between mb-10">
            {["Introduction", "User Info", "Assessment", "Results", "Report"].map(
              (label, index) => (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${
                      index <= 4
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2">{label}</span>
                  {index < 4 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 -z-10"></div>
                  )}
                </div>
              )
            )}
          </div>

          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
            Your Personalized Wellness Report
          </h2>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-3 text-green-700">Dietary Guidelines</h3>
              <ul className="list-disc ml-5 text-sm space-y-2">
                {result.recommendations?.dietary ? (
                  result.recommendations.dietary.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>Favor balanced seasonal foods</li>
                    <li>Avoid excessive spicy & processed food</li>
                    <li>Maintain regular meal times</li>
                  </>
                )}
              </ul>
            </div>

            <div className="border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-3 text-green-700">Lifestyle Practices</h3>
              <ul className="list-disc ml-5 text-sm space-y-2">
                {result.recommendations?.lifestyle ? (
                  result.recommendations.lifestyle.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>Practice meditation</li>
                    <li>Sleep before 10:30pm</li>
                    <li>Daily movement</li>
                  </>
                )}
              </ul>
            </div>

            <div className="border rounded-xl p-6 shadow-sm col-span-2">
              <h3 className="font-semibold mb-3 text-green-700">Herbal Recommendations</h3>
              <ul className="list-disc ml-5 text-sm space-y-2">
                {result.recommendations?.herbal ? (
                  result.recommendations.herbal.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>Consult with an Ayurvedic practitioner</li>
                    <li>Consider dosha-balancing herbs</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => {
                setFormStep(0);
                setStep(0);
                setAnswers([]);
                setResult(null);
                localStorage.removeItem("faceResult");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg shadow-md"
            >
              Start New Assessment
            </button>
            
            <button
              onClick={() => navigate("/prakriti/face")}
              className="bg-gray-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg shadow-md"
            >
              Prakriti Face Analysis
            </button>

            <button
              onClick={() => navigate("/home")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg shadow-md"
            >
              Go to Dashboard
            </button>

          </div>
        </div>
      </div>
    );
}