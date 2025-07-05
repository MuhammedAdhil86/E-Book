// pages/Subscribe.jsx
import React from "react";
import { useBookStore } from "../store/useBookStore";

export default function Subscribe() {
  const { subscriptionType } = useBookStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Subscription Required</h1>
      {subscriptionType === "pending" ? (
        <p className="text-gray-700 max-w-xl">
          You currently do not have an active subscription. Please subscribe to access books.
        </p>
      ) : (
        <p className="text-green-600 text-lg">You already have an active subscription!</p>
      )}
    </div>
  );
}
