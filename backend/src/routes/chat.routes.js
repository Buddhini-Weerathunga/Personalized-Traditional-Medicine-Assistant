// backend/src/routes/chat.routes.js
const express = require("express");
const { sendMessage, getHistory } = require("../controllers/chat.controller");
// TEMP: no auth for chat
// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔓 Public chat routes (no JWT required)
router.post("/", sendMessage);
router.get("/history", getHistory);

module.exports = router;
