const express = require('express');
const {
  register,
  login,
  logout,
  verify,
} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected route
router.get('/verify', authMiddleware, verify);

module.exports = router;
