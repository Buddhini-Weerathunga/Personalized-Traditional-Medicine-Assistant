// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    if (!req.user) {
      res.status(401);
      return next(new Error("User not found"));
    }
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
}

module.exports = { protect };
