import React, { useState } from "react";
import Navbar from "../component/navbar";
import { useBookStore } from "../store/useBookStore";
import { useRazorpayHandler } from "../hooks/useRazorpay";
import { plans } from "../data/subscriptionPlans";
import PlanCard from "../component/plancard";
import { motion } from "framer-motion";
import { containerFadeIn, planCardVariant } from "../animations/subscriptionVariants";

export default function Subscription() {
  const [billing] = useState("monthly");
  const { subscriptionType } = useBookStore();
  const { handleRazorpay } = useRazorpayHandler();

  return (
    <>
      <Navbar />
      <motion.div
        className="min-h-screen bg-[#fcf6f1] px-4 py-12 text-black mt-5"
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
                <PlanCard
                  key={idx}
                  plan={plan}
                  idx={idx}
                  isCurrentPlan={isCurrentPlan}
                  onClick={() => handleRazorpay(plan)}
                  animation={planCardVariant}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
