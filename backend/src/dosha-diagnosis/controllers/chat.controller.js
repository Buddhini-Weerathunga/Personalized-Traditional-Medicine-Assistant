// backend/src/controllers/chat.controller.js

const ChatHistory = require("../models/ChatHistory");
const PrakritiReport = require("../models/PrakritiReport");
const { retrieveRelevantContext } = require("../services/ragService");
const { generateAyurvedaAnswer } = require("../services/llmService");

/**
 * POST /api/chat
 * Body: { message: string, sessionId?: string }
 */
async function sendMessage(req, res, next) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400);
      throw new Error("Message is required");
    }

    const userId = req.user ? req.user._id : null;
    const activeSessionId = sessionId || null;

    // 1) Store user's message
    const userMessageDoc = await ChatHistory.create({
      user: userId,
      role: "user",
      message,
      sessionId: activeSessionId,
    });

    // 2) RAG context
    const { contextText, sources: ragSources } = await retrieveRelevantContext(
      message
    );

    // 3) Latest Prakriti summary
    let prakritiSummary = null;

    if (userId) {
      const latestReport = await PrakritiReport.findOne({
        user: userId,
      }).sort({ createdAt: -1 });

      if (latestReport) {
        prakritiSummary = {
          dominantDosha: latestReport.dominantDosha || "Unknown",
          meta: latestReport.meta || {},
          ruleBasedResult: latestReport.ruleBasedResult || {},
          modelBasedResult: latestReport.modelBasedResult || {},
        };
      }
    }

    // 4) Generate LLM answer
    const { answer, sources } = await generateAyurvedaAnswer(
      message,
      contextText,
      {
        prakritiSummary,
        ragSources,
      }
    );

    // 5) Store assistant reply
    const assistantMessageDoc = await ChatHistory.create({
      user: userId,
      role: "assistant",
      message: answer,
      sessionId: activeSessionId,
    });

    // 6) Return to frontend
    res.json({
      reply: answer,
      sources: sources || ragSources || [],
      sessionId: activeSessionId,
      messages: [userMessageDoc, assistantMessageDoc],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/history?sessionId=...
 */
async function getHistory(req, res, next) {
  try {
    const { sessionId } = req.query;
    const query = {};

    if (req.user && req.user._id) {
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
