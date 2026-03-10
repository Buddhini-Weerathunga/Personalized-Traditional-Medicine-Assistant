// src/dosha-diagnosis/chat/ChatbotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/layout/Navbar.jsx";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";

const AYURVEDA_KEYWORDS = [
  "dosha", "vata", "pitta", "kapha", "ayurveda", "ayurvedic", "prakriti",
  "vikriti", "tridosha", "panchakarma", "dinacharya", "ritucharya",
  "diet", "food", "herb", "remedy", "remedies", "lifestyle", "health",
  "wellness", "meditation", "yoga", "pranayama", "constitution", "imbalance",
  "digestion", "agni", "metabolism", "energy", "prana", "ojas", "tejas",
  "skin", "hair", "sleep", "stress", "anxiety", "balance", "detox",
  "massage", "abhyanga", "oil", "ghee", "turmeric", "ginger", "ashwagandha",
  "triphala", "brahmi", "tulsi", "neem", "amla", "shatavari", "guggulu",
  "trikatu", "chyawanprash", "nasya", "basti", "virechana", "vamana",
  "raktamokshana", "shirodhara", "treatment", "therapy", "holistic",
  "natural", "traditional", "medicine", "healing", "cleanse", "rasayana",
  "sattvic", "tamasic", "rajasic", "marma", "chakra", "nadi",
];

const SYSTEM_PROMPT = `You are an expert Ayurvedic practitioner and wellness guide with deep knowledge of traditional Ayurvedic medicine. You ONLY answer questions related to:
- Ayurveda, doshas (Vata, Pitta, Kapha), Prakriti and Vikriti
- Ayurvedic diet, nutrition, and food guidelines
- Ayurvedic herbs, remedies, and treatments
- Lifestyle practices (Dinacharya, Ritucharya, Yoga, Pranayama)
- Panchakarma and other Ayurvedic therapies
- Ayurvedic concepts like Agni, Ojas, Prana, Tridosha

If a user asks anything NOT related to Ayurveda, politely decline and remind them you can only help with Ayurvedic topics. Keep responses practical, warm, and grounded in traditional Ayurvedic wisdom.`;

const WELCOME_MESSAGE = {
  _id: "welcome",
  role: "assistant",
  content:
    "🌿 Namaste! I am your Ayurveda Assistant.\n\nI can help you with:\n• Doshas (Vata, Pitta, Kapha) and your constitution\n• Ayurvedic diet and nutrition\n• Herbal remedies and treatments\n• Lifestyle practices and daily routines\n• Panchakarma and Ayurvedic therapies\n\nWhat Ayurvedic guidance can I offer you today?",
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("ayurveda_chat_history");
      return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
    } catch {
      return [WELCOME_MESSAGE];
    }
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    try {
      localStorage.setItem("ayurveda_chat_history", JSON.stringify(messages));
    } catch {
      // ignore storage errors (e.g. private mode quota exceeded)
    }
  }, [messages]);

  const isAyurvedaRelated = (text) => {
    const lower = text.toLowerCase();
    return AYURVEDA_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");

    const userMsg = { _id: `user-${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);

    // Client-side keyword guard for obvious off-topic messages
    if (!isAyurvedaRelated(text)) {
      setMessages((prev) => [
        ...prev,
        {
          _id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            "🙏 I appreciate your question! However, I specialize exclusively in Ayurvedic medicine and wellness.\n\nI can help you with:\n• Dosha analysis (Vata, Pitta, Kapha)\n• Ayurvedic diet and nutrition\n• Herbal remedies and natural treatments\n• Yoga, meditation, and lifestyle practices\n• Traditional Ayurvedic therapies\n\nPlease feel free to ask me anything related to Ayurveda! 🌿",
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    setSending(true);
    try {
      // Build conversation history for context (last 10 messages)
      const history = messages
        .filter((m) => m._id !== "welcome")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: text },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Groq error:", err);
        throw new Error(err?.error?.message || "Groq API error");
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      setMessages((prev) => [
        ...prev,
        {
          _id: `bot-${Date.now()}`,
          role: "assistant",
          content: reply || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) => [
        ...prev,
        {
          _id: `err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem("ayurveda_chat_history");
  };

  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white min-h-screen">
        <div className="pointer-events-none">
          <div className="absolute top-10 left-0 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        </div>

        <section className="relative max-w-4xl mx-auto px-4 py-10">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span>🤖 AI-Powered Chat</span>
                <span className="h-4 w-px bg-green-300" />
                <span>Ayurveda Assistant</span>
              </div>
              {messages.length > 1 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                >
                  Clear History
                </button>
              )}
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              Your{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Ayurveda Assistant
              </span>
            </h1>
            <p className="mt-2 text-gray-700 text-sm md:text-base leading-relaxed max-w-2xl">
              Namaste! 🌿 Ask me anything about{" "}
              <span className="font-semibold">
                Doshas, diet, lifestyle, herbs, remedies, and holistic daily
                routines.
              </span>
            </p>
          </div>

          {/* Chat Container */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-green-200 shadow-xl overflow-hidden">
            {/* Messages */}
            <div className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/50 to-white">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0 mr-2 mt-1">
                      🌿
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-white border border-green-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                    {msg.timestamp && (
                      <p className={`text-[10px] mt-1 ${msg.role === "user" ? "text-green-100" : "text-gray-400"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm flex-shrink-0 mr-2 mt-1">
                    🌿
                  </div>
                  <div className="bg-white border border-green-100 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span className="text-xs text-gray-400 ml-1">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 py-2 bg-green-50/60 border-t border-green-100 flex gap-2 overflow-x-auto">
              {[
                "What is my Vata dosha?",
                "Best Pitta diet foods",
                "Kapha balancing herbs",
                "Daily Ayurvedic routine",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-green-200 bg-white text-green-700 hover:bg-green-100 transition-all flex-shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-green-100 p-4 bg-white"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Doshas, diet, herbs, lifestyle..."
                  className="flex-1 px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 placeholder-gray-400 text-sm"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 AyuCeylon. All rights reserved. Made with 💚 for wellness.</p>
        </div>
      </footer>
    </>
  );
}

