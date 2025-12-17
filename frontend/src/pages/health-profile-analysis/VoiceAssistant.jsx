import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

/* ---------------- QUESTIONS ---------------- */

const questions = [
  "How would you describe your body type and appetite?",
  "Do you feel more dry and restless, hot and intense, or heavy and calm?",
  "How often do you eat spicy, oily, sweet food and caffeine?",
  "Do you face constipation, gas, diarrhea or acidity?",
  "How is your stress, anger and focus level?",
  "How well do you sleep and how tired do you feel?",
  "Do you have joint pain, headaches, cold hands or dry skin?",
  "What is your living environment like and AC usage?",
  "Does your family have diabetes, cholesterol, thyroid or heart disease?",
  "Please tell me your age and gender"
];

/* ---------------- KEYWORD HINTS ---------------- */

const questionHints = [
  "thin, medium, heavy | low appetite, moderate appetite, high appetite",
  "dry, restless | hot, intense | heavy, calm",
  "spicy food, oily food, sweet food | coffee, tea",
  "constipation, gas, bloating, diarrhea, acidity",
  "calm, stressed, very stressed | angry, irritated | focused, distracted",
  "good sleep, poor sleep | tired, fatigued, energetic",
  "joint pain, headache | cold hands, cold feet | dry skin",
  "hot, cold, moderate | air conditioner, AC usage",
  "diabetes, cholesterol, thyroid, heart disease",
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
