import React, { createContext, useContext, useState, useEffect } from "react";
import { sendMessage as apiSendMessage, getHistory } from "../api/chatApi";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const history = await getHistory();
        setMessages(history || []);
      } catch (err) {
        console.error("Failed to load history:", err.message);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, []);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = {
      _id: `local-${Date.now()}`,
      role: "user",
      content: text
    };
    setMessages((prev) => [...prev, userMsg]);

    setSending(true);
    try {
      const res = await apiSendMessage(text);
      // expect backend: { reply, history? }
      const botMsg = {
        _id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply || res.message || "…"
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        _id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Sorry, something went wrong while generating the response. Please try again."
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{ messages, loadingInitial, sending, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
