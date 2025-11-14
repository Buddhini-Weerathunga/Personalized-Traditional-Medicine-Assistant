// backend/src/services/llmService.js
// TODO: Replace stub with real Groq/OpenAI client when you’re ready.

async function generateAyurvedaAnswer(question, context = "") {
  // For now, just echo the question in a dummy way
  const answer =
    "This is a placeholder LLM answer. Later, connect Groq/OpenAI here.\n\nYour question: " +
    question;

  return {
    answer,
    sources: [], // When you add RAG, return docs metadata here
  };
}

module.exports = { generateAyurvedaAnswer };
