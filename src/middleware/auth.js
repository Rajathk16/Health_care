const jwt = require('jsonwebtoken');

const authMiddleware = function(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is required', code: 'NO_TOKEN' });
  }

  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token has expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(403).json({ success: false, message: 'Invalid or malformed token', code: 'INVALID_TOKEN' });
    }

    req.user = user;
    next();
  });
};

const roleMiddleware = function(...allowedRoles) {
  return function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated', code: 'NOT_AUTHENTICATED' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Required role: ' + allowedRoles.join(' or '), code: 'INSUFFICIENT_PERMISSIONS' });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
