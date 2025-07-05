// pages/Subscription.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../component/navbar";
import { useBookStore } from "../store/useBookStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { containerFadeIn, planCardVariant } from "../animations/subscriptionVariants";
import Footer from "../component/footer";

export default function Subscription() {
  const [billing] = useState("monthly");
  const {
    user,
    subscriptionType,
    updateSubscriptionState,
  } = useBookStore();
  const navigate = useNavigate();

 const plans = {
  monthly: [
    {
      name: "1 Year",
      price: 299,
      features: [
        "Unlimited access to legal eBooks",
        "Access latest case law archives",
        "Basic reading tools (highlight, search)",
        "Standard email support",
      ],
      duration: 1,
    },
    {
      name: "2 Year",
      price: 499,
      features: [
        "Unlimited access to legal eBooks",
        "Download PDFs for offline reading",
        "Advanced search & bookmark system",
        "Priority email support",
      ],
      duration: 3,
    },
    {
      name: "3 Year",
      price: 799,
      features: [
        "Unlimited access to legal eBooks",
        "Full access to premium journals & digests",
        "Offline mode & cross-device sync",
        "Premium chat & email support",
      ],
      duration: 12,
    },
  ],
};


  const handleRazorpay = async (plan) => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: plan.price * 100,
      currency: "INR",
      name: "Motor Law App",
      description: plan.name,
      image: "/logo.png",
      handler: function (response) {
        toast.success("✅ Payment successful!");
        updateSubscriptionState({
          ...user,
          has_subscription: true,
          subscription_type: plan.name,
        });

        navigate("/invoice", {
          state: {
            payment: response,
            plan,
            user,
          },
        });
      },
      prefill: {
        name: user?.first_name || "User",
        email: user?.email || "email@example.com",
        contact: user?.mobile?.replace("+91", "") || "9999999999",
      },
      notes: {
        plan_name: plan.name,
        user_id: user?.id || "N/A",
      },
      theme: { color: "#facc15" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-white px-4 py-12 text-black mt-5"
        {...containerFadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Choose your plan</h2>
          <p className="text-green-600 font-medium mb-1">
            📒 Current Plan:{" "}
            <span className="font-semibold capitalize">
              {subscriptionType || "Not Subscribed"}
            </span>
          </p>
          <p className="text-gray-600 mb-6">
            Access all legal research materials tailored to your practice. Choose a plan to continue.
          </p>

          <div className="inline-flex mb-10 rounded-full bg-gray-100 p-1">
            <h1 className="px-5 py-2 rounded-full text-sm font-semibold bg-yellow-400 text-black">
              Plans
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {plans[billing].map((plan, idx) => {
              const isCurrentPlan =
                subscriptionType &&
                plan.name.toLowerCase().includes(subscriptionType.toLowerCase());

              return (
                <motion.div
                  key={idx}
                  className={`border rounded-2xl p-6 shadow-sm transition bg-white ${
                    isCurrentPlan
                      ? "border-yellow-400 shadow-md"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                  {...planCardVariant(idx)}
                  initial="initial"
                  animate="animate"
                  whileHover="whileHover"
                >
                  <h3 className="text-lg font-semibold mb-2 text-black">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-1">₹{plan.price}</p>
                  <p className="text-sm text-gray-500 mb-4">/ selected plan</p>
                  <ul className="text-sm text-gray-700 space-y-2 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-yellow-500">✔</span> {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleRazorpay(plan)}
                    disabled={isCurrentPlan}
                    className={`w-full text-center text-sm font-semibold rounded-lg py-2 transition ${
                      isCurrentPlan
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black"
                    }`}
                  >
                    {isCurrentPlan ? "Active Plan" : "Get Plan"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
      <Footer/>
    </>
  );
}
