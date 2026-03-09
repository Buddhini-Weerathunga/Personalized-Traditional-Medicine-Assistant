import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mic, Volume2, StopCircle } from "lucide-react";
import { User, Bot } from "lucide-react";


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

/* ---------------- QUESTIONS ---------------- */

const questions = [
  "How would you describe your body type?",
  "How would you describe your appetite, and how regular are your meals?",
 "How would you describe your daily diet including spicy, oily, sweet foods?",
  "What is your caffeine intake, processed food consumption, and are you vegetarian, eggetarian, or non-vegetarian?",
  "What is the usual color of your urine?",
  "How would you describe your stress level?",
  "How would you rate your sleep quality?",
  "Do you experience headaches or joint pain, and how strong are they?",
 
  "Does your family have diabetes, cholesterol, thyroid or heart disease?",
  "Please tell me your age and gender"
];


/* ---------------- KEYWORD HINTS ---------------- */

const questionHints = [
  "thin | medium | heavy",
  "high | moderate | low | variable appetite — regular | irregular | sometimes",
 `Spicy food: very low → low → moderate → high → very high
Oily food: very low → low → moderate → high → very high
Sweet food: very low → low → moderate → high → very high`,
  `Caffeine: very low → low → moderate → high → very high
Processed food: very low → low → moderate → high → very high
Diet type: vegetarian | eggetarian | non-vegetarian`,
  "clear | pale yellow | yellow | dark yellow",
  "Stress: very low | low | moderate | high | very high",
  "Sleep quality: very poor | poor | average | good | very good",
  "Headache & joint pain: very low | low | moderate | high | very high",
 
  "diabetes | cholesterol | thyroid | heart disease",
  "age number | male | female | other"
];


export default function VoiceAssistant() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const conversationEndRef = useRef(null);

  const [step, setStep] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [healthProfile, setHealthProfile] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");

  // 🔐 Auth check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
    }
  }, [navigate]);

  // Auto-scroll to latest message
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // 🎤 Speech recognition setup with improved timing
  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setCurrentTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setCurrentTranscript(final || interim);

      if (final) {
        handleUserResponse(final);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        alert("No speech detected. Please try again.");
      } else if (event.error === 'audio-capture') {
        alert("Microphone not accessible. Please check permissions.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [step]);

  const speak = (text, callback) => {
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (callback) {
        setTimeout(callback, 500);
      }
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleUserResponse = async (text) => {
    setIsListening(false);
    setCurrentTranscript("");

    // Add user message to conversation
    setConversation(prev => [...prev, { type: "user", text }]);

    try {
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

      // Move to next question or finish
      if (step < questions.length - 1) {
        const nextStep = step + 1;
        setStep(nextStep);
        const nextQuestion = questions[nextStep];
        
        setConversation(prev => [...prev, { type: "ai", text: nextQuestion }]);
        speak(nextQuestion);
      } else {
        const finalMessage = "Thank you! Your health profile is now complete. I've gathered all the necessary information.";
        setConversation(prev => [...prev, { type: "ai", text: finalMessage }]);
        speak(finalMessage);
      }
    } catch (error) {
      console.error("Error processing response:", error);
      const errorMessage = "Sorry, there was an error processing your response. Please try again.";
      setConversation(prev => [...prev, { type: "ai", text: errorMessage }]);
      speak(errorMessage);
    }
  };

  const startConversation = () => {
    const welcomeMessage = "Hello! I'm your Ayurveda health assistant. I'll ask you 10 questions to create your personalized health profile. Let's begin with the first question.";
    const firstQuestion = questions[0];
    
    setConversation([
      { type: "ai", text: welcomeMessage },
      { type: "ai", text: firstQuestion }
    ]);
    
    speak(welcomeMessage, () => {
      speak(firstQuestion);
    });
  };

  const listen = () => {
    if (!recognitionRef.current || isListening || isSpeaking) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const scaleMap = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High"
};
const formatValue = (key, value) => {
  // If value is number 1–5 → convert
  if (typeof value === "number" && scaleMap[value]) {
    return scaleMap[value];
  }

  // If value is string number ("1","2"...)
  if (!isNaN(value) && scaleMap[value]) {
    return scaleMap[value];
  }

  return value;
};


  return (
    <div className="min-h-screen  bg-gradient-to-br from-green-50 via-white to-green-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          {/* LEFT - Conversation Panel */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[700px]">
            <div className=" bg-gradient-to-br from-green-400  to-green-200 p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                AI Ayurveda Assistant
              </h2>
              <p className="text-white mt-2 text-sm">
                Question {step + 1} of {questions.length}
              </p>
            </div>

            {/* Conversation Display */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {conversation.length === 0 ? (
                <div className="text-center ">
                  <div className="text-6xl mb-4">🎙️</div>
                  <p className="text-gray-500 mb-6">Ready to start your health assessment</p>
                     {/* Instructions */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8 text-left max-w-md mx-auto">
        <h4 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
          💡 Tips for Best Results
        </h4>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg flex-shrink-0">✅</span>
            <p>Wait for the AI to finish speaking before you respond</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg flex-shrink-0">✅</span>
            <p>Listen to the full question before answering</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg flex-shrink-0">✅</span>
            <p>Check the hint box for keyword suggestions</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg flex-shrink-0">✅</span>
            <p>Speak in a quiet environment</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg flex-shrink-0">✅</span>
            <p>Hold the microphone/device steady while speaking</p>
          </div>
        </div>
      </div>
                  <button
                    onClick={startConversation}
                    disabled={isSpeaking}
                    className="bg-gradient-to-br from-green-400  to-green-400 text-white px-8 py-3 rounded-xl hover:scale-105 transition disabled:opacity-50"
                  >
                    Start Conversation
                  </button>
                </div>
              ) : (
                <>
                  {conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                          msg.type === "user"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">
                            {msg.type === "user" ? (
  <User className="w-6 h-6 text-white" />
) : (
  <Bot className="w-6 h-6 text-green-600" />
)}

                          </span>
                          <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isListening && currentTranscript && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl p-4 bg-indigo-100 border-2 border-indigo-300 text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">👤</span>
                          <p className="text-sm md:text-base leading-relaxed italic">
                            {currentTranscript}...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={conversationEndRef} />
                </>
              )}
            </div>

            {/* Hint Display */}
            {conversation.length > 0 && step < questions.length && (
              <div className="bg-blue-50 border-t border-blue-100 p-4">
                <p className="text-xs text-gray-600 mb-1">💡 You can answer like:</p>
                <p className="text-sm text-indigo-700 font-medium whitespace-pre-line">
                  {questionHints[step]}
                </p>
              </div>
            )}

            {/* Control Buttons */}
            {conversation.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  {!isListening ? (
                    <button
                      onClick={listen}
                      disabled={isSpeaking || step >= questions.length}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                    >
                      <Mic className="w-5 h-5" />
                      Speak Answer
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl hover:scale-105 transition flex items-center justify-center gap-2 font-semibold animate-pulse"
                    >
                      <StopCircle className="w-5 h-5" />
                      Stop Recording
                    </button>
                  )}
                  
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="px-6 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition flex items-center gap-2"
                    >
                      <StopCircle className="w-5 h-5" />
                      Stop AI
                    </button>
                  )}
                </div>
                
                {isListening && (
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-2 text-green-600">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Listening...</span>
                    </div>
                  </div>
                )}
                
                {isSpeaking && (
                  <div className="mt-3 text-center">
                    <div className="inline-flex items-center gap-2 text-purple-600">
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span className="text-sm font-medium">AI Speaking...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            <div className="bg-gray-100 px-6 py-3">
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT - Health Profile */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[700px]">
        <div className="bg-gradient-to-br from-green-400 to-green-200 p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-2xl font-bold text-white">
        Health Profile
      </h3>
      <p className="text-white mt-1 text-sm">
        Extracted data from your responses
      </p>
    </div>

    <button 
      onClick={() => window.location.href = "/health-profile/view"}
      className="px-5 py-2 bg-green-500 text-white rounded-lg font-medium 
                 hover:bg-green-800 transition shadow-sm whitespace-nowrap"
    >
      View Profile
    </button>
  </div>
</div>


            <div className="flex-1 overflow-y-auto p-6">
              {Object.keys(healthProfile).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(healthProfile).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">
                        {key.replace(/_/g, " ")}
                      </p>
                     <p className="text-gray-800 font-medium">
  {typeof value === "object"
    ? JSON.stringify(value, null, 2)
    : formatValue(key, value)}
</p>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">📝</div>
                  <p>Your health data will appear here as you answer questions</p>
                </div>
              )}
            </div>

            {Object.keys(healthProfile).length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 p-4">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-32">
                  {JSON.stringify(healthProfile, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}