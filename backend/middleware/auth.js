const jwt = require('jsonwebtoken');

// Use a strong secret string; ideally from environment variables
const JWT_SECRET = '7c9e3a9f5b4e2d8f1234abcde56789f0e1d2c3b4a5f6d7e8c9b0a1b2c3d4e5f6';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Expected format: "Bearer tokenstring"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Malformed token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user data from token to request object
    req.user = decoded; // decoded has userId, fullName, role
    next();
  });
}

function adminAuth(req, res, next) {
  // Call verifyToken first, then check role
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  });
}

module.exports = { verifyToken, adminAuth };
