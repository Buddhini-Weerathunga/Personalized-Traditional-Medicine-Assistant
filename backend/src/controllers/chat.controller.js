// backend/src/controllers/chat.controller.js
const ChatHistory = require("../models/ChatHistory");
const { retrieveRelevantContext } = require("../services/ragService");
const { generateAyurvedaAnswer } = require("../services/llmService");

async function sendMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      res.status(400);
      throw new Error("Message is required");
    }

    const userId = req.user ? req.user._id : null;

    // Save user message
    await ChatHistory.create({
      user: userId,
      role: "user",
      message,
      sessionId,
    });

    // RAG context (stub)
    const context = await retrieveRelevantContext(message);

    // LLM answer (stub)
    const { answer, sources } = await generateAyurvedaAnswer(message, context);

    // Save assistant response
    await ChatHistory.create({
      user: userId,
      role: "assistant",
      message: answer,
      sessionId,
    });

    res.json({
      answer,
      sources,
    });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const { sessionId } = req.query;
    const query = {};

    if (req.user) {
      query.user = req.user._id;
    }
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const history = await ChatHistory.find(query).sort({ createdAt: 1 });

    res.json(history);
  } catch (err) {
    next(err);
  }
}

module.exports = { sendMessage, getHistory };
