import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

/* ---------------- QUESTIONS ---------------- */

const questions = [
  "How would you describe your body type?",
  "How would you describe your appetite, and how regular are your meals?",
  "How would you describe your daily diet and eating habits, including spicy, oily, sweet foods, caffeine intake, fruits, vegetables, processed foods, and whether you are vegetarian, eggetarian, or non-vegetarian?",
  "What is the usual color of your urine?",
  "How are your stress and focus levels?",
  "How would you rate your sleep quality?",
  "Do you have headaches or joint pain, and how strong are they?",
  "How would you describe your living environment: mostly hot, cool, or moderate?",
  "Does your family have diabetes, cholesterol, thyroid or heart disease?",
  "Please tell me your age and gender"
];

/* ---------------- KEYWORD HINTS ---------------- */

const questionHints = [
  // 0 – Body type
  "thin, medium, heavy",

  // 1 – Appetite + meal regularity
  "high, moderate, low, variable appetite | regular, irregular, sometimes",

  // 2 – Daily diet & eating habits (MULTI-LINE STRING FIXED)
  `Spicy food: very low, low, moderate, high, very high
Oily food: very low, low, moderate, high, very high
Sweet food: very low, low, moderate, high, very high
Caffeine: very low, low, moderate, high, very high
Processed food: very low, low, moderate, high, very high
Fruits: very low, low, moderate, high, very high
Vegetables: very low, low, moderate, high, very high

Diet type: vegetarian | eggetarian | non-vegetarian`,

 

  // 3– Urine color
  "clear | pale yellow | yellow | dark yellow",

  // 4 – Stress + focus
  "Stress: very low, low, moderate, high, very high | Focus: very low, low, moderate, high, very high",

  // 5 – Sleep
  "good sleep, poor sleep | tired, fatigued, energetic",

  // 6 – Headache + joint pain
  "Headache: very low, low, moderate, high, very high | Joint pain: very low, low, moderate, high, very high",

  // 7 – Living environment
  "hot, cool, moderate",

  // 8 – Family history
  "diabetes, cholesterol, thyroid, heart disease",

  // 9 – Age & gender
  "age number | male, female, other"
];


export default function VoiceAssistant() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [step, setStep] = useState(0);
  const [aiText, setAiText] = useState("");
  const [userText, setUserText] = useState("");
  const [healthProfile, setHealthProfile] = useState({});

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
    }
  }, [navigate]);

  // 🎤 Speech recognition setup
  useEffect(() => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setUserText(text);

      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        "http://localhost:5000/api/voice",
        { step, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHealthProfile(prev => ({
        ...prev,
        ...res.data.parsed
      }));

      if (step < questions.length - 1) {
        const next = step + 1;
        setStep(next);
        speak(questions[next]);
      } else {
        speak("Thank you. Your health profile is ready.");
      }
    };

    recognitionRef.current = recognition;
  }, [step]);

  const speak = (text) => {
    setAiText(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(
      new SpeechSynthesisUtterance(text)
    );
  };

  const listen = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              🧘 AI Ayurveda Voice Assistant
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-32">
              <p className="text-gray-700 mb-3">
                <span className="font-semibold text-purple-600">AI:</span>{" "}
                {aiText || "Click Ask Question to begin"}
              </p>

              {/* 🔹 KEYWORD HINTS */}
              {aiText && (
                <p className="text-sm text-gray-500 italic mb-3">
                  You can answer like:{" "}
                  <span className="text-indigo-600 font-medium">
                    {questionHints[step]}
                  </span>
                </p>
              )}

              <p className="text-gray-700">
                <span className="font-semibold text-indigo-600">You:</span>{" "}
                {userText || "Your voice response will appear here"}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => speak(questions[step])}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:scale-105 transition"
              >
                Ask Question
              </button>

              <button
                onClick={listen}
                className="flex-1 border-2 border-purple-600 text-purple-600 py-4 rounded-xl hover:bg-purple-600 hover:text-white transition"
              >
                🎤 Speak Answer
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">
                Question {step + 1} of {questions.length}
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              📋 Extracted Health Profile
            </h3>

            <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-auto max-h-96">
{Object.keys(healthProfile).length > 0
  ? JSON.stringify(healthProfile, null, 2)
  : "Your extracted health data will appear here..."}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
