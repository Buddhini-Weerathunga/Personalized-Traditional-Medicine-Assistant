// backend/src/services/ragService.js
// Simple RAG over local Ayurveda .txt files (CommonJS version)

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

let knowledgeBase = [];
let loadingPromise = null;

// --- Utility: cosine similarity ---
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const va = a[i];
    const vb = b[i];
    dot += va * vb;
    normA += va * va;
    normB += vb * vb;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Safe OpenAI client getter.
 */
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "[ragService] OPENAI_API_KEY is not set. RAG will return empty context."
    );
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// --- Step 1: Load + embed corpus once (lazy) ---
async function loadKnowledgeBase() {
  if (knowledgeBase.length > 0) return knowledgeBase;

  if (!loadingPromise) {
    loadingPromise = (async () => {
      const corpusDir = path.join(__dirname, "..", "rag", "corpus");

      if (!fs.existsSync(corpusDir)) {
        console.warn(
          "[ragService] Corpus directory not found at",
          corpusDir,
          " → RAG will return empty context."
        );
        knowledgeBase = [];
        return knowledgeBase;
      }

      const files = fs
        .readdirSync(corpusDir)
        .filter((f) => f.toLowerCase().endsWith(".txt"));

      if (files.length === 0) {
        console.warn(
          "[ragService] No .txt files found in corpus directory → RAG empty."
        );
        knowledgeBase = [];
        return knowledgeBase;
      }

      const chunks = [];

      for (const file of files) {
        const fullPath = path.join(corpusDir, file);
        const content = fs.readFileSync(fullPath, "utf8");

        // Split by blank lines into smaller chunks
        const rawChunks = content.split(/\n\s*\n/g);
        rawChunks.forEach((chunkText, idx) => {
          const trimmed = chunkText.trim();
          if (!trimmed) return;

          chunks.push({
            id: `${file}#${idx}`,
            file,
            text: trimmed,
          });
        });
      }

      if (chunks.length === 0) {
        console.warn("[ragService] No non-empty chunks found in corpus.");
        knowledgeBase = [];
        return knowledgeBase;
      }

      const client = getOpenAIClient();
      if (!client) {
        knowledgeBase = [];
        return knowledgeBase;
      }

      console.log(
        `[ragService] Creating embeddings for ${chunks.length} chunks...`
      );

      const batchSize = 50;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        const response = await client.embeddings.create({
          model: EMBEDDING_MODEL,
          input: batch.map((c) => c.text),
        });

        response.data.forEach((row, j) => {
          batch[j].embedding = row.embedding;
        });
      }

      knowledgeBase = chunks;
      console.log(
        `[ragService] Knowledge base ready with ${knowledgeBase.length} embedded chunks.`
      );
      return knowledgeBase;
    })();
  }

  return loadingPromise;
}

// --- Step 2: Retrieve relevant context for a question ---
/**
 * Retrieve relevant Ayurveda context for a question using embeddings.
 *
 * @param {string} question
 * @param {number} topK
 * @returns {Promise<{contextText: string, sources: any[]}>}
 */
async function retrieveRelevantContext(question, topK = 4) {
  const client = getOpenAIClient();
  if (!client) {
    return { contextText: "", sources: [] };
  }

  const kb = await loadKnowledgeBase();
  if (!kb || kb.length === 0) {
    return { contextText: "", sources: [] };
  }

  const embeddingRes = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: question,
  });

  const questionEmbedding = embeddingRes.data[0].embedding;

  const scored = kb.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, topK);

  const contextText = selected.map((c) => c.text).join("\n\n---\n\n");
  const sources = selected.map((c) => ({
    id: c.id,
    file: c.file,
    score: c.score,
  }));

  return { contextText, sources };
}

module.exports = { retrieveRelevantContext };
