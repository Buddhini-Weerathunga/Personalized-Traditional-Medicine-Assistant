import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Helper to attach JWT token to every request
function getAuthHeaders() {
  const token = localStorage.getItem("token"); // <-- change key if needed
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function sendMessage(message, userId = null) {
  const res = await axios.post(
    `${API_BASE}/api/chat`,
    { message, userId },
    {
      headers: getAuthHeaders(),
    }
  );
  return res.data;
}

export async function getHistory(userId = null) {
  const res = await axios.get(`${API_BASE}/api/chat/history`, {
    params: { userId },
    headers: getAuthHeaders(),
  });
  return res.data;
}
