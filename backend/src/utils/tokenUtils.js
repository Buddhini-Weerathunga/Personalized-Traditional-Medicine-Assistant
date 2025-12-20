const jwt = require("jsonwebtoken");

function generateAccessToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

function generateRefreshToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { generateAccessToken, generateRefreshToken };
