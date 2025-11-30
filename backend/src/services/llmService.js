// backend/src/services/llmService.js
// Real OpenAI-powered Ayurveda answer generator (CommonJS version)

const OpenAI = require("openai");

// Use safe fallback model
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

/**
 * Create OpenAI client safely.
 * Returns null if API key missing.
 */
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "[llmService] OPENAI_API_KEY is not set. Using fallback responses."
    );
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generate Ayurveda answer using OpenAI + RAG + Prakriti Summary
 */
async function generateAyurvedaAnswer(
  question,
  contextText = "",
  options = {}
) {
  const { prakritiSummary = null, ragSources = [] } = options || {};

  const client = getOpenAIClient();
  if (!client) {
    return {
      answer:
        "The AI system is not fully configured (missing API key). Please try again later.",
      sources: [],
    };
  }

  // ---------------------------------------------------------------------
  // BUILD FINAL MESSAGE ARRAY
  // ---------------------------------------------------------------------
  const messages = [];

  // System prompt
  messages.push({
    role: "system",
    content:
      "You are a knowledgeable Ayurveda wellness assistant. " +
      "Use classical concepts of Vata, Pitta, Kapha, Prakriti, Vikriti. " +
      "Give calm, safe, gentle guidance. Do NOT diagnose diseases or prescribe medicine.",
  });

  // User's prakriti summary
  if (prakritiSummary) {
    messages.push({
      role: "system",
      content:
        "Here is the user's Prakriti profile. Personalize your answer accordingly:\n" +
        JSON.stringify(prakritiSummary, null, 2),
    });
  }

  // Inject retrieved Ayurveda reference texts (RAG)
  if (contextText && contextText.trim() !== "") {
    messages.push({
      role: "system",
      content:
        "Here are relevant Ayurveda reference passages:\n\n" + contextText,
    });
  }

  // User question
  messages.push({
    role: "user",
    content: question,
  });

  // ---------------------------------------------------------------------
  // SAFE OPENAI CALL  (THIS PREVENTS BACKEND CRASH)
  // ---------------------------------------------------------------------
  try {
    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.4,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I couldn't generate a helpful response.";

    // Return final answer with RAG sources
    return {
      answer,
      sources: ragSources,
    };
  } catch (err) {
    console.error("🔥 OpenAI error:", err.message);

    return {
      answer:
        "I’m sorry, I couldn’t generate a response due to a server issue. Please try again shortly.",
      sources: [],
    };
  }
}

module.exports = {
  generateAyurvedaAnswer,
};
