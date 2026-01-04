// src/services/api.js
import API from "../api/axios";

// LOGIN
export const loginUser = (data) => API.post("/auth/login", data);

// REGISTER
export const registerUser = (data) => API.post("/auth/register", data);

// PROFILE (Protected)
export const getProfile = () => API.get("/user/profile");
