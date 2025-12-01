import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function analyzeFace(base64Data) {
  const res = await axios.post(`${API_BASE}/api/prakriti/analyze`, {
    image_base64: base64Data,
  });
  return res.data;
}
