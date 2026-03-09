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
  const [userInfo, setUserInfo] = useState({});

  const handleAnswer = (dosha) => {
    const updated = [...answers];
    updated[step] = dosha;
    console.log("Step:", step, "Answer:", dosha);
    console.log("Updated Answers:", updated);
    setAnswers(updated);
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
      console.log(questionnaireScores);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 text-center p-8">

        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Prakriti Assessment
        </h1>

        <p className="max-w-xl text-gray-700 mb-8">
          Discover your Ayurvedic body constitution and receive personalized
          wellness guidance based on traditional Ayurvedic principles.
        </p>

        <button
          onClick={() => setFormStep(1)}
          className="bg-green-600 text-white px-8 py-3 rounded-lg shadow"
        >
          Start Assessment
        </button>

      </div>
    );

  /* ================= USER INFO ================= */

  if (formStep === 1)
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">

        <div className="bg-white p-10 rounded-xl shadow w-full max-w-xl">

          <h2 className="text-2xl font-bold mb-6 text-green-700">
            User Information
          </h2>

          <div className="space-y-4">

            <input
              placeholder="First Name"
              className="w-full border p-3 rounded"
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              className="w-full border p-3 rounded"
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="w-full border p-3 rounded"
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Age"
              className="w-full border p-3 rounded"
              onChange={(e) =>
                setUserInfo({ ...userInfo, age: e.target.value })
              }
            />

          </div>

          <button
            onClick={() => setFormStep(2)}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded"
          >
            Continue
          </button>

        </div>

      </div>
    );

  /* ================= QUESTIONNAIRE ================= */

  if (formStep === 2)
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-green-50">

        <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-2xl">

          {/* progress bar */}

          <div className="mb-6">
            <div className="w-full bg-gray-200 h-2 rounded">

              <div
                className="bg-green-500 h-2 rounded"
                style={{
                  width: `${((step + 1) / questions.length) * 100}%`,
                }}
              />

            </div>
          </div>

          <h3 className="text-green-600 mb-2">
            {questions[step].category}
          </h3>

          <h2 className="text-2xl font-bold mb-6">
            {questions[step].question}
          </h2>

          <div className="space-y-4">
            {questions[step].options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(opt.dosha)}
                className={`w-full p-4 rounded-lg border ${
                  answers[step] === opt.dosha
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg"
          >
            {step === questions.length - 1
              ? "Proceed to Face Analysis"
              : "Next"}
          </button>

        </div>

      </div>
    );
}