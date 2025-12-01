// backend/src/utils/logger.js

// Simple wrapper around console for now.
// You can later replace with winston/pino if you want.
const logger = {
  info: (...args) => console.log("[INFO]", ...args),
  warn: (...args) => console.warn("[WARN]", ...args),
  error: (...args) => console.error("[ERROR]", ...args),
};

module.exports = { logger };
