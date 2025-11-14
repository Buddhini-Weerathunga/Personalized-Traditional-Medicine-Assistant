// backend/src/routes/chat.routes.js
const express = require("express");
const { sendMessage, getHistory } = require("../controllers/chat.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// protected optional: you can remove `protect` if you want public chat
router.post("/", protect, sendMessage);
router.get("/history", protect, getHistory);

module.exports = router;
