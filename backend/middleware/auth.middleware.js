const { verifyToken } = require('../utils/jwt.utils');

/**
 * Authentication middleware
 * Verifies JWT token from httpOnly cookie
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Add user info to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Export as both default and named export
module.exports = authMiddleware;
module.exports.protect = authMiddleware;
