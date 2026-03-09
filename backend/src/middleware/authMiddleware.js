const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // For development/testing - allow test user
    if (process.env.NODE_ENV !== 'production') {
      // Check if this is a test request or if we're in development
      const testMode = req.headers['x-test-mode'] === 'true';
      
      if (testMode) {
        console.log('Test mode: allowing request without token');
        req.user = { id: 'test-user-id', role: 'user' };
        return next();
      }
      
      // Also check for specific test user ID in headers
      const testUserId = req.headers['x-user-id'];
      if (testUserId) {
        console.log('Test user ID provided:', testUserId);
        req.user = { id: testUserId, role: 'user' };
        return next();
      }
    }

    // Normal authentication flow
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('No auth token provided');
      
      // In development, still allow with warning
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ No token in development mode - using test user');
        req.user = { id: 'test-user-id', role: 'user' };
        return next();
      }
      
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        
        // In development, still allow with warning
        if (process.env.NODE_ENV !== 'production') {
          console.warn('⚠️ Invalid token in development mode - using test user');
          req.user = { id: 'test-user-id', role: 'user' };
          return next();
        }
        
        return res.status(403).json({ message: "Token is not valid" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = authMiddleware;