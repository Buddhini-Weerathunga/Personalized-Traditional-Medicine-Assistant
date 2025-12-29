// backend/src/config/env.js
const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
  const envPath = path.join(__dirname, "../../.env");
  dotenv.config({ path: envPath });
}

module.exports = { loadEnv };
