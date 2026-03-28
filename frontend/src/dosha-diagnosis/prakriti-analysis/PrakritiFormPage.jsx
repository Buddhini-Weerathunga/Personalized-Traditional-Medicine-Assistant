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
  {
    category: "Physical Characteristics",
    question: "How would you describe your body frame?",
    options: [
      { text: "Thin, light, bony structure", dosha: "Vata" },
      { text: "Medium, athletic build", dosha: "Pitta" },
      { text: "Solid, heavier, well-developed", dosha: "Kapha" },
    ],
  },
  {
    category: "Diet & Digestion",
    question: "What best describes your appetite and digestion?",
    options: [
      { text: "Irregular, variable digestion", dosha: "Vata" },
      { text: "Strong, sharp, gets hungry quickly", dosha: "Pitta" },
      { text: "Moderate, slow but steady", dosha: "Kapha" },
    ],
  },
  {
    category: "Sleep Pattern",
    question: "How is your typical sleep pattern?",
    options: [
      { text: "Light, interrupted, difficulty falling asleep", dosha: "Vata" },
      { text: "Moderate, wake up refreshed", dosha: "Pitta" },
      { text: "Deep, long, hard to wake up", dosha: "Kapha" },
    ],
  },
  {
    category: "Learning Style",
    question: "How do you approach learning new things?",
    options: [
      { text: "Quick to learn, quick to forget", dosha: "Vata" },
      { text: "Clear understanding, good retention", dosha: "Pitta" },
      { text: "Slow to learn, excellent long-term memory", dosha: "Kapha" },
    ],
  },
  {
    category: "Climate Preference",
    question: "Which climate do you prefer most?",
    options: [
      { text: "Warm, moist, tropical", dosha: "Vata" },
      { text: "Cool, moderate temperature", dosha: "Pitta" },
      { text: "Warm, dry, energizing", dosha: "Kapha" },
    ],
  },
];

export default function PrakritiFormPage() {
  const navigate = useNavigate();

  const [formStep, setFormStep] = useState(0);
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
  });

  const isUserInfoComplete =
    userInfo.firstName.trim() &&
    userInfo.lastName.trim() &&
    userInfo.email.trim() &&
    userInfo.age;

  const handleAnswer = (dosha) => {
    const updated = [...answers];
    updated[step] = dosha;
    setAnswers(updated);
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!answers[step]) return;

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {

      const counts = { Vata: 0, Pitta: 0, Kapha: 0 };
      answers.forEach((a) => counts[a]++);

      const total = answers.length;

      const questionnaireScores = {
        Vata: Math.round((counts.Vata / total) * 100),
        Pitta: Math.round((counts.Pitta / total) * 100),
        Kapha: Math.round((counts.Kapha / total) * 100),
      };

      localStorage.setItem(
        "questionnaireResult",
        JSON.stringify({
          userInfo,
          questions,
          answers,
          questionnaireScores,
        })
      );

      navigate("/prakriti/face");
    }
  };

  /* ================= LANDING ================= */

  if (formStep === 0)
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-100 to-lime-50 px-6 py-10 sm:px-8">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-green-300/40 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
          <div className="grid w-full gap-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur transition-all duration-500 md:grid-cols-2 md:items-center md:p-10">
            <div className="order-2 text-center md:order-1 md:text-left">
              <p className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
                Ayurveda Wellness Journey
              </p>

              <h1 className="mt-5 text-4xl font-bold leading-tight text-emerald-900 md:text-5xl">
                Discover Your Prakriti
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-emerald-900/75 md:text-lg">
                Take a mindful self-assessment to understand your Ayurvedic body
                constitution and receive personalized, traditional wellness
                guidance.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-emerald-800/80 md:justify-start">
                <span className="rounded-full bg-emerald-100 px-3 py-1">
                  10 focused questions
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1">
                  2-3 minutes
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1">
                  Personalized insights
                </span>
              </div>

              <button
                onClick={() => setFormStep(1)}
                className="mt-10 rounded-xl bg-emerald-700 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                Start Assessment
              </button>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 shadow-xl">
                <img
                  src="/images/ayurveda2.jpg"
                  alt="Ayurvedic herbs and natural wellness ingredients"
                  className="h-64 w-full object-cover sm:h-80 md:h-[420px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-900/25 via-transparent to-emerald-100/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  /* ================= USER INFO ================= */

  if (formStep === 1)
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-100 to-lime-50 px-6 py-10 sm:px-8">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-green-300/40 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-white/70 bg-white/85 p-7 shadow-2xl backdrop-blur sm:p-10 transition-all duration-500">
            <div className="mb-6 flex items-center justify-between">
              <p className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Step 1 of 2
              </p>
              <button
                onClick={() => setFormStep(0)}
                className="text-sm font-medium text-emerald-700 transition-colors duration-200 hover:text-emerald-900"
              >
                Back
              </button>
            </div>

            <h2 className="text-3xl font-bold text-emerald-900">User Information</h2>
            <p className="mt-2 text-sm text-emerald-900/70">
              Share a few details to personalize your wellness journey.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-emerald-900">
                  First Name
                </label>
                <input
                  value={userInfo.firstName}
                  placeholder="Enter first name"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-950 outline-none transition-all duration-200 placeholder:text-emerald-900/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                  onChange={(e) => handleUserInfoChange("firstName", e.target.value)}
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-emerald-900">
                  Last Name
                </label>
                <input
                  value={userInfo.lastName}
                  placeholder="Enter last name"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-950 outline-none transition-all duration-200 placeholder:text-emerald-900/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                  onChange={(e) => handleUserInfoChange("lastName", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-emerald-900">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-950 outline-none transition-all duration-200 placeholder:text-emerald-900/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                  onChange={(e) => handleUserInfoChange("email", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-emerald-900">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  value={userInfo.age}
                  placeholder="Enter age"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-emerald-950 outline-none transition-all duration-200 placeholder:text-emerald-900/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200"
                  onChange={(e) => handleUserInfoChange("age", e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setFormStep(2)}
              disabled={!isUserInfoComplete}
              className="mt-7 w-full rounded-xl bg-emerald-700 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
            >
              Continue to Questionnaire
            </button>
          </div>
        </div>
      </div>
    );

  /* ================= QUESTIONNAIRE ================= */

  if (formStep === 2)
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-100 to-lime-50 px-4 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-green-300/40 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
          <div className="w-full max-w-3xl rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur sm:p-10 transition-all duration-500">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Step 2 of 2
              </p>
              <p className="text-sm font-medium text-emerald-800/80">
                Question {step + 1} of {questions.length}
              </p>
            </div>

            <div className="mb-7">
              <div className="h-2 w-full rounded-full bg-emerald-100">
                <div
                  className="h-2 rounded-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
              {questions[step].category}
            </h3>

            <h2 className="mb-6 text-2xl font-bold leading-snug text-emerald-950 sm:text-3xl">
              {questions[step].question}
            </h2>

            <div className="space-y-3">
              {questions[step].options.map((opt, index) => {
                const selected = answers[step] === opt.dosha;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(opt.dosha)}
                    className={`w-full rounded-xl border px-4 py-4 text-left transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 ${
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                        : "border-emerald-200 bg-emerald-50/60 text-emerald-950 hover:border-emerald-400 hover:bg-emerald-100"
                    }`}
                  >
                    <span className="block text-base font-medium">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  if (step > 0) {
                    setStep(step - 1);
                    return;
                  }
                  setFormStep(1);
                }}
                className="w-full rounded-xl border border-emerald-300 bg-white py-3 text-sm font-semibold text-emerald-800 transition-colors duration-200 hover:bg-emerald-50 sm:w-40"
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!answers[step]}
                className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
              >
                {step === questions.length - 1
                  ? "Proceed to Face Analysis"
                  : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

}