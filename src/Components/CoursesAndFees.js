import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { FaCheckCircle, FaGraduationCap, FaBriefcase, FaCrown } from "react-icons/fa";
import "./CoursesAndFees.css";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CoursesAndFees = () => {
  const courses = [
    {
      id: "beginner",
      title: "Beginner Course",
      subtitle: "Perfect for getting started",
      price: 49,
      icon: <FaGraduationCap />,
      features: [
        "Introduction to fundamentals",
        "10+ video lessons",
        "Basic exercises & quizzes",
        "Email support",
        "Certificate of completion",
        "30-day money-back guarantee"
      ],
      stripePriceId: "price_beginner_test", // Replace with your actual Stripe Price ID
      popular: false
    },
    {
      id: "professional",
      title: "Professional Course",
      subtitle: "Most popular choice",
      price: 99,
      icon: <FaBriefcase />,
      features: [
        "All Beginner features",
        "Advanced techniques & strategies",
        "25+ comprehensive video lessons",
        "Real-world projects",
        "Priority email support",
        "Certificate + LinkedIn badge",
        "Lifetime access to materials",
        "Community forum access"
      ],
      stripePriceId: "price_professional_test", // Replace with your actual Stripe Price ID
      popular: true
    },
    {
      id: "expert",
      title: "Expert Course",
      subtitle: "Ultimate mastery package",
      price: 199,
      icon: <FaCrown />,
      features: [
        "All Professional features",
        "Master-level content",
        "50+ in-depth video lessons",
        "Capstone project with review",
        "1-on-1 mentorship sessions",
        "Priority support (24/7)",
        "Job placement assistance",
        "Exclusive networking events",
        "Lifetime updates & new content"
      ],
      stripePriceId: "price_expert_test", // Replace with your actual Stripe Price ID
      popular: false
    }
  ];

  const handleEnrollClick = async (course) => {
    try {
      const stripe = await stripePromise;

      if (!stripe) {
        alert("Stripe failed to load. Please check your internet connection and try again.");
        return;
      }

      // For now, we'll redirect to Stripe Checkout with a simple payment link
      // In production, you would create a checkout session via your backend
      
      // TEMPORARY: Using Stripe's test mode payment links
      // You'll need to create these in your Stripe Dashboard
      const checkoutUrl = `https://buy.stripe.com/test_XXXXXXXX`; // Replace with actual payment link
      
      // Better approach: Create checkout session via backend (recommended for production)
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     priceId: course.stripePriceId,
      //     courseName: course.title
      //   })
      // });
      // const session = await response.json();
      // const result = await stripe.redirectToCheckout({ sessionId: session.id });

      // For testing purposes, show alert with course info
      alert(
        `🎓 Enrolling in ${course.title}!\n\n` +
        `Price: $${course.price}\n\n` +
        `To complete the integration:\n` +
        `1. Create a Product in Stripe Dashboard\n` +
        `2. Create a Payment Link for this product\n` +
        `3. Replace the checkoutUrl in the code\n\n` +
        `OR\n\n` +
        `Set up a backend endpoint to create checkout sessions.\n\n` +
        `For now, this is a demo. In test mode, you can use card:\n` +
        `4242 4242 4242 4242`
      );

      // Uncomment this when you have payment links set up:
      // window.location.href = checkoutUrl;

    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="courses-fees-section" id="courses-fees">
      <div className="courses-fees-container">
        <div className="courses-fees-header">
          <p className="primary-subheading">Investment in Your Future</p>
          <h1>Courses & Fees</h1>
          <p>
            Choose the perfect plan for your learning journey. All courses include
            lifetime access and are backed by our satisfaction guarantee.
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`course-card ${course.popular ? "popular" : ""}`}
            >
              {course.popular && (
                <div className="popular-badge">Most Popular</div>
              )}

              <div className="course-header">
                <div className="course-icon">{course.icon}</div>
                <h2 className="course-title">{course.title}</h2>
                <p className="course-subtitle">{course.subtitle}</p>
              </div>

              <div className="course-price">
                <div className="price-amount">
                  <span className="price-currency">$</span>
                  {course.price}
                </div>
                <span className="price-period">One-time payment</span>
              </div>

              <ul className="course-features">
                {course.features.map((feature, index) => (
                  <li key={index}>
                    <FaCheckCircle className="feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="enroll-button"
                onClick={() => handleEnrollClick(course)}
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesAndFees;
