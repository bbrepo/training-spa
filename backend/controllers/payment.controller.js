const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Initialize Stripe only if secret key is available
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not found in environment variables. Payment features will not work.');
}

// Course configuration - prices defined server-side for security
const COURSES = {
  beginner: {
    id: 'beginner',
    name: 'Beginner Course',
    price: 4900, // $49 in cents
  },
  professional: {
    id: 'professional',
    name: 'Professional Course',
    price: 9900, // $99 in cents
  },
  expert: {
    id: 'expert',
    name: 'Expert Course',
    price: 19900, // $199 in cents
  },
};

/**
 * Create Stripe Checkout Session
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Payment system not configured. Please contact administrator.',
      });
    }

    const { courseId } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate course
    const course = COURSES[courseId];
    if (!course) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course selected',
      });
    }

    // Check if user already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        userId,
        courseId,
        status: 'completed',
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.name,
              description: `Enroll in ${course.name}`,
            },
            unit_amount: course.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        courseId: course.id,
        courseName: course.name,
      },
    });

    // Create pending enrollment record
    await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId: course.id,
        courseName: course.name,
        stripeSessionId: session.id,
        amount: course.price,
        status: 'pending',
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message,
    });
  }
};

/**
 * Handle Stripe Webhook Events
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

/**
 * Handle successful checkout
 */
async function handleCheckoutComplete(session) {
  const { id: sessionId, payment_intent, metadata } = session;

  try {
    // Update enrollment to completed
    await prisma.courseEnrollment.update({
      where: { stripeSessionId: sessionId },
      data: {
        status: 'completed',
        stripePaymentId: payment_intent,
      },
    });

    console.log(`✅ Enrollment completed for user ${metadata.userId}, course: ${metadata.courseName}`);
  } catch (error) {
    console.error('Error updating enrollment:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  try {
    // Find enrollment by payment intent
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (enrollment) {
      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { status: 'failed' },
      });
      console.log(`❌ Payment failed for enrollment ${enrollment.id}`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Verify session and get enrollment details
 */
exports.verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Get enrollment from database
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        stripeSessionId: sessionId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found',
      });
    }

    // Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // If payment was successful and enrollment is still pending, update it
    if (session.payment_status === 'paid' && enrollment.status === 'pending') {
      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: 'completed',
          stripePaymentId: session.payment_intent,
        },
      });
      
      console.log(`✅ Enrollment ${enrollment.id} marked as completed (verified via success page)`);
      
      // Update the enrollment object to reflect the change
      enrollment.status = 'completed';
      enrollment.stripePaymentId = session.payment_intent;
    }

    res.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        courseName: enrollment.courseName,
        amount: enrollment.amount,
        status: enrollment.status,
        purchasedAt: enrollment.purchasedAt,
        paymentStatus: session.payment_status,
      },
    });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify session',
      error: error.message,
    });
  }
};

/**
 * Get all courses enrolled by the authenticated user
 */
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId,
        status: 'completed',
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    res.json({
      success: true,
      courses: enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        courseName: e.courseName,
        amount: e.amount,
        purchasedAt: e.purchasedAt,
      })),
    });
  } catch (error) {
    console.error('Get user courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
};

/**
 * Get all enrollments (admin only - optional)
 */
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    res.json({
      success: true,
      enrollments: enrollments.map((e) => ({
        id: e.id,
        user: e.user,
        courseId: e.courseId,
        courseName: e.courseName,
        amount: e.amount,
        status: e.status,
        purchasedAt: e.purchasedAt,
      })),
    });
  } catch (error) {
    console.error('Get all enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message,
    });
  }
};
