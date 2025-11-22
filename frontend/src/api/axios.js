// src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // IMPORTANT for HttpOnly cookie refresh token
});

export default api;
