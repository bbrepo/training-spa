const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// Webhook route (no auth - verified by Stripe signature)
// Note: Raw body parser is configured in server.js for this route
router.post('/webhook', paymentController.handleWebhook);

// Protected routes (require authentication)
router.post('/create-checkout-session', protect, paymentController.createCheckoutSession);
router.get('/verify-session/:sessionId', protect, paymentController.verifySession);
router.get('/user-courses', protect, paymentController.getUserCourses);
router.get('/all-enrollments', protect, paymentController.getAllEnrollments);

module.exports = router;
