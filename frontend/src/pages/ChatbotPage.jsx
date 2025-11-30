// frontend/src/pages/ChatbotPage.jsx
import React from "react";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatbotPage() {
  return (
    <section className="pt-6 pb-10 bg-[#f7ecdd]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#7a4b26]">
            Ayurveda Assistant
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#a2774c]">
            Namaste! I&apos;m your Ayurveda Assistant. Ask me about doshas, diet,
            lifestyle, and gentle wellness guidance.
          </p>
        </div>

        {/* Chat card wrapping the real ChatWindow */}
        <div className="rounded-3xl bg-[#f3e6d3] border border-[#e0cfba] shadow-lg p-4 md:p-6">
          <ChatWindow />
        </div>
      </div>
    </section>
  );
}
