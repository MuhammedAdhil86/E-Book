// pages/subscription.jsx

import React, { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../component/navbar";
import { useBookStore } from "../store/useBookStore";
import api from "../api/Instance";

export default function Subscription() {
  const [billing] = useState("monthly");
  const { user, subscriptionType, updateSubscriptionState } = useBookStore();

  const plans = {
    monthly: [
      {
        name: "1 Month Plan",
        price: 299,
        features: ["Access to all features", "1 month validity", "Email support"],
        duration: 1,
      },
      {
        name: "3 Month Plan",
        price: 499,
        features: ["Access to all features", "3 months validity", "Priority support"],
        duration: 3,
      },
      {
        name: "12 Month Plan",
        price: 799,
        features: ["Access to all features", "1 year validity", "Premium support"],
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
      handler: async function (response) {
        try {
          const res = await api.post("/user/reader/subscribe", {
            payment_id: response.razorpay_payment_id,
            plan_name: plan.name,
            duration: plan.duration,
          });

          const updatedUser = res.data?.user;
          updateSubscriptionState(updatedUser);

          toast.success("✅ Subscription successful! Redirecting...");
          setTimeout(() => {
            window.location.href = "/subscribed";
          }, 1500);
        } catch (err) {
          console.error("Subscription update failed:", err);
          toast.error("❌ Payment success, but subscription update failed.");
        }
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
      <div className="min-h-screen bg-white px-4 py-12 text-black mt-5">
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
                <div
                  key={idx}
                  className={`border rounded-2xl p-6 shadow-sm transition bg-white ${
                    isCurrentPlan
                      ? "border-yellow-400 shadow-md"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2 text-black">
                    {plan.name}
                  </h3>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
