import React from "react";
import { motion } from "framer-motion";

export default function PlanCard({ plan, idx, isCurrentPlan, onClick, animation }) {
  return (
    <motion.div
      className={`border rounded-2xl p-6 shadow-sm transition bg-white ${
        isCurrentPlan
          ? "border-yellow-400 shadow-md"
          : "border-gray-200 hover:shadow-md"
      }`}
      {...animation(idx)}
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
        onClick={onClick}
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
}
