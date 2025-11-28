# Stripe Payment Setup Guide

## 🎯 Quick Start

Your Stripe payment integration is ready! Follow these steps to complete the setup:

## Step 1: Add Your Stripe Publishable Key

1. **Get your Stripe test key:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Make sure you're in **TEST MODE** (toggle in top right)
   - Copy your **Publishable key** (starts with `pk_test_`)

2. **Create `.env.local` file:**
   - In your project root: `/Users/admin/Desktop/Projects/training-spa/`
   - Create a file named `.env.local`
   - Add this line (replace with your actual key):
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

3. **Restart your development server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   ```

## Step 2: Create Stripe Payment Links (Easiest Method)

For quick testing, use Stripe Payment Links:

1. **Go to Stripe Dashboard** → [Payment Links](https://dashboard.stripe.com/test/payment-links)

2. **Create 3 payment links** (one for each course):

   **Beginner Course - $49:**
   - Click "New" → "Payment link"
   - Product name: "Beginner Course"
   - Price: $49 USD (one-time)
   - Click "Create link"
   - Copy the link

   **Professional Course - $99:**
   - Repeat for $99
   - Product name: "Professional Course"

   **Expert Course - $199:**
   - Repeat for $199
   - Product name: "Expert Course"

3. **Update the component:**
   - Open `src/Components/CoursesAndFees.js`
   - Find the `handleEnrollClick` function (around line 61)
   - Replace the payment link URLs with your actual Stripe payment links

## Step 3: Test the Payment Flow

1. **Navigate to Courses & Fees section** on your website
2. **Click "Enroll Now"** on any course
3. **Use Stripe test cards:**
   - **Success:** `4242 4242 4242 4242`
   - **Declined:** `4000 0000 0000 0002`
   - **Requires 3D Secure:** `4000 0025 0000 3155`
   - Use any future expiry date (e.g., 12/25)
   - Use any 3-digit CVC (e.g., 123)
   - Use any ZIP code (e.g., 12345)

## Alternative: Backend Integration (More Advanced)

For production, you should create checkout sessions via a backend endpoint:

### Backend Setup (Optional)

1. **Install Stripe in backend:**
   ```bash
   cd backend
   npm install stripe
   ```

2. **Create checkout endpoint:**
   ```javascript
   // backend/routes/payment.routes.js
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   router.post('/create-checkout-session', async (req, res) => {
     const { priceId, courseName } = req.body;
     
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price: priceId,
         quantity: 1,
       }],
       mode: 'payment',
       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${process.env.CLIENT_URL}/courses-fees`,
     });
     
     res.json({ id: session.id });
   });
   ```

3. **Update frontend to use backend:**
   - Uncomment the backend code in `CoursesAndFees.js`
   - Comment out the payment link approach

## 🎨 What's Included

✅ **3 Course Tiers:**
- Beginner ($49)
- Professional ($99) - Most Popular
- Expert ($199)

✅ **Premium UI Features:**
- Gradient backgrounds
- Smooth animations
- Hover effects
- Responsive design
- Mobile-friendly

✅ **Stripe Integration:**
- Secure checkout
- Test mode ready
- PCI compliant

## 📝 Important Notes

- **Test Mode:** Always use test keys (pk_test_...) for development
- **Live Mode:** Switch to live keys (pk_live_...) only when ready for production
- **Security:** Never commit `.env.local` to git (it's already in .gitignore)
- **Webhooks:** For production, set up Stripe webhooks to handle payment confirmations

## 🚀 Next Steps

1. Add your Stripe key to `.env.local`
2. Restart your dev server
3. Create payment links in Stripe Dashboard
4. Update the payment URLs in the code
5. Test with Stripe test cards

## 📚 Resources

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Payment Links Guide](https://stripe.com/docs/payment-links)

---

**Need help?** Check the Stripe documentation or reach out for assistance!
