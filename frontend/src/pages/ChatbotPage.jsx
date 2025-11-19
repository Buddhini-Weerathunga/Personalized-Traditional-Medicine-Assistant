import React from "react";
import ChatWindow from "../components/chat/ChatWindow";

// frontend/src/pages/ChatbotPage.jsx
export default function ChatbotPage() {
  return (
    <section className="pt-6 pb-10">
      <div className="rounded-3xl bg-[#f3e6d3] bg-[radial-gradient(circle_at_top,_#f7efe2,_#f3e0c7)] border border-[#e0cfba] shadow-lg p-6 md:p-8 relative overflow-hidden">
        {/* subtle background art */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-10 -top-10 w-40 h-40 border border-[#dfc8aa] rounded-full" />
          <div className="absolute right-4 top-6 text-5xl">🕉️</div>
          <div className="absolute left-10 bottom-4 text-4xl">🌺</div>
        </div>

        <div className="relative">
          <h1 className="text-2xl font-semibold text-[#3e2b20] mb-4">
            Ayurveda Assistant
          </h1>

          {/* Chat area */}
          <div className="bg-[#fdf7ef]/90 rounded-2xl border border-[#e2cfb7] p-4 md:p-5 max-w-2xl mx-auto space-y-4">
            {/* Assistant bubble */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8b5d33] flex items-center justify-center text-[#fdf7ef] text-lg">
                ॐ
              </div>
              <div className="bg-[#f0e0cc] text-[#3e2b20] rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-xl">
                <p className="text-sm">
                  Namaste! I&apos;m your Ayurveda Assistant. How may I help you
                  on your path to well-being today?
                </p>
              </div>
            </div>

            {/* User bubble */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-[#d9efe0] text-[#234032] rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-xl">
                <p className="text-sm">what is ayurveda?</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#e3e7ea] flex items-center justify-center text-sm">
                🙋‍♀️
              </div>
            </div>
          </div>

          {/* Input area (visual only right now) */}
          <div className="max-w-2xl mx-auto mt-5 flex gap-3">
            <input
              type="text"
              className="flex-1 bg-[#fdf7ef] border border-[#ddc6ab] rounded-full px-4 py-2 text-sm outline-none"
              placeholder="Type your question about Ayurveda, doshas, or remedies…"
            />
            <button className="px-5 py-2 rounded-full bg-[#8b5d33] text-[#fdf7ef] text-sm font-semibold shadow-md hover:bg-[#6f4725] transition-colors">
              Send
            </button>
          </div>

          <p className="mt-3 text-xs text-center text-[#8b6b4b]">
            (Later you can connect this to your backend chat API using GPT-4
            Turbo.)
          </p>
        </div>
      </div>
    </section>
  );
}
