// backend/src/routes/auth.routes.js
const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);

module.exports = router;
