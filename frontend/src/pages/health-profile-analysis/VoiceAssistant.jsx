import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Mic, Volume2, StopCircle, Bot, Paperclip, Send,
  Users, Tag, ChevronRight, FileText
} from "lucide-react";

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
  `Spicy food: very low → low → moderate → high → very high\nOily food: very low → low → moderate → high → very high\nSweet food: very low → low → moderate → high → very high`,
  `Caffeine: very low → low → moderate → high → very high\nProcessed food: very low → low → moderate → high → very high\nDiet type: vegetarian | eggetarian | non-vegetarian`,
  "clear | pale yellow | yellow | dark yellow",
  "Stress: very low | low | moderate | high | very high",
  "Sleep quality: very poor | poor | average | good | very good",
  "Headache & joint pain: very low | low | moderate | high | very high",
  "diabetes | cholesterol | thyroid | heart disease",
  "age number | male | female | other"
];

/* All keywords shown in the bottom panel */
const allKeywords = [
  "Body Type", "Appetite Level", "Meal Regularity", "Daily Diet",
  "Spicy Food", "Oily Food", "Sweet Food", "Digestion",
  "Sleep Pattern", "Energy Level"
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const aiColRef = useRef(null);
  const userColRef = useRef(null);

  const [step, setStep] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [healthProfile, setHealthProfile] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [started, setStarted] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    aiColRef.current?.scrollTo({ top: aiColRef.current.scrollHeight, behavior: "smooth" });
    userColRef.current?.scrollTo({ top: userColRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setIsListening(true); setCurrentTranscript(""); };

    recognition.onresult = (event) => {
      let interim = "", final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      setCurrentTranscript(final || interim);
      if (final) {
        recognition.stop();
        handleUserResponse(final.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "no-speech") alert("No speech detected. Please try again.");
      else if (event.error === "audio-capture") alert("Microphone not accessible. Please check permissions.");
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, [step]);

  const speak = (text, callback) => {
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; utterance.pitch = 1; utterance.volume = 1;
    utterance.onend = () => { setIsSpeaking(false); if (callback) setTimeout(callback, 500); };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleUserResponse = async (text) => {
    setIsListening(false);
    setCurrentTranscript("");
    setConversation(prev => [...prev, { type: "user", text, time: getTime() }]);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:5000/api/voice",
        { step, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHealthProfile(prev => ({ ...prev, ...res.data.parsed }));

      if (step < questions.length - 1) {
        const nextStep = step + 1;
        setStep(nextStep);
        const nextQuestion = questions[nextStep];
        setConversation(prev => [...prev, { type: "ai", text: nextQuestion, time: getTime() }]);
        speak(nextQuestion);
      } else {
        const finalMessage = "Thank you! Your health profile is now complete. I've gathered all the necessary information.";
        setConversation(prev => [...prev, { type: "ai", text: finalMessage, time: getTime() }]);
        speak(finalMessage);
      }
    } catch (error) {
      console.error("Error processing response:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message
        ? `Error: ${error.response.data.message}`
        : "Sorry, there was an error processing your response. Please try again.";
      setConversation(prev => [...prev, { type: "ai", text: errorMessage, time: getTime() }]);
      speak(errorMessage);
    }
  };

  const startConversation = () => {
    setStarted(true);
    const welcomeMessage = "Hello! I'm your Ayurveda health assistant. I'll ask you 10 questions to create your personalized health profile. Let's begin with the first question.";
    const firstQuestion = questions[0];
    setConversation([
      { type: "ai", text: welcomeMessage, time: getTime() },
      { type: "ai", text: firstQuestion, time: getTime() }
    ]);
    speak(welcomeMessage, () => speak(firstQuestion));
  };

  const listen = () => {
    if (!recognitionRef.current || isListening || isSpeaking) return;
    setTimeout(() => {
      try { recognitionRef.current.start(); } catch (e) { console.error(e); }
    }, 300);
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };

  const handleSendText = () => {
    if (!inputText.trim() || step >= questions.length) return;
    handleUserResponse(inputText.trim());
    setInputText("");
  };

  const scaleMap = { 1: "Very Low", 2: "Low", 3: "Moderate", 4: "High", 5: "Very High" };
  const formatValue = (key, value) => {
    if (typeof value === "number" && scaleMap[value]) return scaleMap[value];
    if (!isNaN(value) && scaleMap[value]) return scaleMap[value];
    return value;
  };

  const aiMessages = conversation.filter(m => m.type === "ai");
  const userMessages = conversation.filter(m => m.type === "user");
  const profileEntries = Object.entries(healthProfile);
  const profileKeywords = profileEntries.map(([k]) =>
    k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
  );

  /* ---- USER AVATAR SVG ---- */
  const UserAvatar = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f8faf9" }}
      className="min-h-screen flex flex-col">

      {/* ══════════ TOP HEADER ══════════ */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8f0eb" }}
        className="px-8 py-3 flex items-center justify-between shrink-0">

        {/* Left: logo + title */}
        <div className="flex items-center gap-3">
          <div style={{ background: "#16a34a" }}
            className="w-9 h-9 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M8 12s1.5 2 4 2 4-2 4-2" />
              <path d="M9 9h.01M15 9h.01" />
            </svg>
          </div>
          <div>
            <h1 style={{ color: "#111", fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
              Health Profile – Voice Assistant
            </h1>
            <p style={{ color: "#888", fontSize: 12 }}>I can help you with answers, ideas, plans and more.</p>
          </div>
        </div>

        {/* Center: progress */}
        {started && (
          <div className="flex-1 mx-12">
            <div className="flex items-center gap-3 mb-1">
              <span style={{ color: "#555", fontSize: 13, fontWeight: 500 }}>Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: "#444", fontSize: 12 }}>Question {step + 1}/{questions.length}</span>
              <div style={{ flex: 1, height: 6, background: "#e5f5ec", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${((step + 1) / questions.length) * 100}%`,
                  background: "#16a34a",
                  borderRadius: 99,
                  transition: "width 0.5s ease"
                }} />
              </div>
              <span style={{ color: "#444", fontSize: 12, fontWeight: 600 }}>
                {Math.round(((step + 1) / questions.length) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Right: action buttons */}
        <div className="flex items-center gap-3">
        <button
  onClick={() => navigate("/health-profile/view")}
  style={{
    border: "1.5px solid #d1d5db",
    borderRadius: 10,
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer"
  }}
>
  <FileText size={14} />
  View Health Profile
</button>
         
        </div>
      </header>

      {/* ══════════ BODY ══════════ */}
      {!started ? (
        /* Welcome screen */
        <div className="flex-1 flex items-center justify-center p-8">
          <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Mic size={32} color="#16a34a" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 8 }}>AI Ayurveda Assistant</h2>
            <p style={{ color: "#888", marginBottom: 28, fontSize: 14 }}>
              I'll ask you 10 questions to create your personalized health profile.
            </p>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb", textAlign: "left", marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", marginBottom: 14 }}>💡 Tips for Best Results</p>
              {[
                "Wait for the AI to finish speaking before you respond",
                "Listen to the full question before answering",
                "Check the hint box for keyword suggestions",
                "Speak in a quiet environment",
                "Hold the microphone/device steady while speaking",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, fontSize: 13, color: "#555" }}>
                  <span style={{ color: "#16a34a", marginTop: 1 }}>✓</span>{tip}
                </div>
              ))}
            </div>
            <button onClick={startConversation} style={{
              background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "12px 36px", borderRadius: 12, border: "none", cursor: "pointer",
              boxShadow: "0 4px 16px rgba(22,163,74,0.25)"
            }}>Start Conversation</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── THREE-COLUMN CHAT AREA ── */}
          <div style={{ flex: 1, display: "flex", gap: 16, padding: "16px 24px 0", overflow: "hidden", minHeight: 0 }}>

            {/* AI Column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", borderRadius: 16, border: "1px solid #e5f0e9", overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid #e5f0e9", background: "#f0faf4", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>AI Assistant</span>
              </div>
              <div ref={aiColRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                {aiMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 30, height: 30, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Bot size={15} color="#fff" />
                    </div>
                    <div>
                      <div style={{ background: "#f0faf4", border: "1px solid #d1fae5", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", maxWidth: 280 }}>
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#bbb", marginTop: 4, marginLeft: 4 }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                {isSpeaking && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 30, height: 30, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Volume2 size={14} color="#fff" />
                    </div>
                    <div style={{ background: "#f0faf4", border: "1px solid #d1fae5", borderRadius: "14px 14px 14px 4px", padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center", height: 16 }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 6, height: 6, background: "#16a34a", borderRadius: "50%", animation: "bounce 0.8s infinite", animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, background: "#e5e7eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                  <UserAvatar size={14} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6b7280" }}>You</span>
              </div>
              <div ref={userColRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                {userMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "flex-end" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ background: "#f0faf4", border: "1px solid #d1fae5", borderRadius: "14px 14px 4px 14px", padding: "10px 14px", maxWidth: 280, marginLeft: "auto" }}>
                        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                      </div>
                      <p style={{ fontSize: 11, color: "#bbb", marginTop: 4, marginRight: 4 }}>
                        {msg.time} <span style={{ color: "#16a34a" }}>✓✓</span>
                      </p>
                    </div>
                    <div style={{ width: 30, height: 30, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, color: "#9ca3af" }}>
                      <UserAvatar size={15} />
                    </div>
                  </div>
                ))}
                {isListening && currentTranscript && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "flex-end" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ background: "#f0faf4", border: "1px solid #bbf7d0", borderRadius: "14px 14px 4px 14px", padding: "10px 14px", maxWidth: 280, marginLeft: "auto" }}>
                        <p style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic", margin: 0 }}>{currentTranscript}...</p>
                      </div>
                    </div>
                    <div style={{ width: 30, height: 30, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#9ca3af" }}>
                      <UserAvatar size={15} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Summary Column */}
            <div style={{ width: 280, display: "flex", flexDirection: "column", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {/* Profile Summary header */}
              <div style={{ padding: "10px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={15} color="#16a34a" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Profile Summary</span>
              </div>

              {/* Profile fields */}
              <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
                {profileEntries.length === 0 ? (
                  <div style={{ padding: "24px 8px", textAlign: "center", color: "#bbb", fontSize: 12 }}>
                    Responses will appear here…
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {profileEntries.map(([key, value]) => (
                      <div key={key} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px", border: "1px solid #f0f0f0" }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                          {key.replace(/_/g, " ")}
                        </p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", margin: 0 }}>
                          {typeof value === "object" ? JSON.stringify(value) : formatValue(key, value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

               
              </div>

              {/* Structured Data Preview */}
              {profileEntries.length > 0 && (
                <div style={{ padding: 12, borderTop: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#1f2937", borderRadius: "10px 10px 0 0", padding: "7px 12px", margin: 0 }}>
                    Structured Data (Preview)
                  </p>
                  <pre style={{
                    background: "#111827", color: "#4ade80", fontSize: 11,
                    borderRadius: "0 0 10px 10px", padding: "10px 12px",
                    overflowX: "auto", margin: 0, maxHeight: 120, overflowY: "auto",
                    lineHeight: 1.6
                  }}>
                    {JSON.stringify(healthProfile, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* ── BOTTOM PANEL ── */}
          <div style={{ padding: "12px 24px 16px", background: "transparent" }}>

            {/* Bello Keywords + Mic row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>

              {/* Keywords panel */}
              <div style={{ flex: 1, background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>💡</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>Bellow Keywords</span>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
                  These are important factors we'll consider in your health profile.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {allKeywords.map((kw, i) => (
                    <span key={i} style={{
                      fontSize: 12, color: "#374151", background: "#f9fafb",
                      border: "1px solid #e5e7eb", borderRadius: 8,
                      padding: "5px 12px", display: "flex", alignItems: "center", gap: 5
                    }}>
                      <span style={{ color: "#16a34a", fontSize: 10 }}>•</span> {kw}
                    </span>
                  ))}
                </div>
                {/* Current hint */}
                {step < questions.length && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ color: "#16a34a", fontSize: 13 }}>💡</span>
                    <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, whiteSpace: "pre-line" }}>
                      {questionHints[step]}
                    </span>
                  </div>
                )}
              </div>

              {/* Mic panel */}
              <div style={{ width: 220, background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <Mic size={15} color={isListening ? "#16a34a" : "#9ca3af"} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>
                    {isListening ? "Listening…" : isSpeaking ? "AI Speaking…" : "Mic Open"}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>
                  {isListening ? "Speak now" : "Tap the mic and speak your answer"}
                </p>

                {isListening ? (
                  <button onClick={stopListening} style={{
                    width: 64, height: 64, borderRadius: "50%", background: "#16a34a",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", boxShadow: "0 0 0 10px rgba(22,163,74,0.15)",
                    animation: "pulse 1.2s infinite"
                  }}>
                    <StopCircle size={28} color="#fff" />
                  </button>
                ) : (
                  <button onClick={listen} disabled={isSpeaking || step >= questions.length} style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: isSpeaking || step >= questions.length ? "#d1d5db" : "#16a34a",
                    border: "none", cursor: isSpeaking || step >= questions.length ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(22,163,74,0.3)", transition: "background 0.2s"
                  }}>
                    <Mic size={28} color="#fff" />
                  </button>
                )}

                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 10 }}>
                  {isListening ? "Click again to stop" : ""}
                </p>

                {isSpeaking && (
                  <button onClick={stopSpeaking} style={{
                    fontSize: 11, color: "#f97316", background: "none", border: "none",
                    cursor: "pointer", textDecoration: "underline", marginTop: 6
                  }}>Stop</button>
                )}
              </div>
            </div>

           
          </div>
        </div>
      )}

      {/* bounce keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.3); }
          50% { box-shadow: 0 0 0 14px rgba(22,163,74,0.08); }
        }
      `}</style>
    </div>
  );
}