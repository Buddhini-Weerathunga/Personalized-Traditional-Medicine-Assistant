import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function sendMessage(message, userId = null) {
  const res = await axios.post(`${API_BASE}/api/chat`, {
    message,
    userId,
  });
  return res.data;
}

export async function getHistory(userId = null) {
  const res = await axios.get(`${API_BASE}/api/chat/history`, {
    params: { userId },
  });
  return res.data;
}
