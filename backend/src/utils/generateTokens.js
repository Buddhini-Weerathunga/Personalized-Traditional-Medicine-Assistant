// generateToken.js
const crypto = require("crypto");

function generateSecret() {
  return crypto.randomBytes(64).toString("hex");
}

console.log("\nYour JWT Secret:\n");
console.log(generateSecret());
