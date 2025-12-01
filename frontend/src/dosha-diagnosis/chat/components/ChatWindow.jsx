// src/dosha-diagnosis/chat/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../../context/ChatContext";
import Loader from "../../../components/common/Loader";
import Button from "../../../components/common/Button";

import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const { messages, loadingInitial, sending, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {loadingInitial && (
          <div className="h-full flex items-center justify-center">
            <Loader label="Loading your previous Ayurveda conversations..." />
          </div>
        )}

        {!loadingInitial && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-sm text-slate-500 gap-2">
            <p>👋 Start a conversation with your AI Ayurveda assistant.</p>
            <p className="text-xs">
              Ask about doshas, lifestyle, diet, or remedies.
            </p>
          </div>
        )}

        {!loadingInitial &&
          messages.map((m) => (
            <MessageBubble key={m._id} role={m.role} content={m.content} />
          ))}

        <div ref={bottomRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSend}>
        <input
          className="chat-input"
          type="text"
          placeholder="Ask something like: 'What is a Vata-pacifying diet?'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
