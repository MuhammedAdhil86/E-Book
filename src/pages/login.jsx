import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookStore } from "../store/useBookStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNotificationStore } from "../store/useToastStore"; // ✅ Zustand store

export default function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const mobile = useBookStore((s) => s.mobile);
  const setMobile = useBookStore((s) => s.setMobile);
  const sendOtp = useBookStore((s) => s.sendOtp);
  const verifyOtp = useBookStore((s) => s.verifyOtp);

  const setNotification = useNotificationStore((s) => s.setNotification); // ✅ Zustand toast store
  const navigate = useNavigate();

  // ✅ OTP Send handler with Zustand toast
  const handleSendOtp = async () => {
    try {
      await sendOtp(mobile);
      setShowOtp(true);
      setNotification("OTP sent successfully", "success"); // ✅ toast
    } catch (e) {
      setNotification("Failed to send OTP", "error"); // ✅ toast
    }
  };

  // ✅ OTP Verify handler with Zustand toast
  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(mobile, otp);
      setNotification("Login successful", "success"); // ✅ toast
      navigate("/");
    } catch (e) {
      setNotification("Invalid OTP", "error"); // ✅ toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <ToastContainer /> {/* Still required once in the app */}
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-between">
          <button
            className="text-gray-600 text-xl"
            onClick={() => setShowOtp(false)}
            type="button"
          >
            {showOtp ? "←" : ""}
          </button>
          <h2 className="text-md font-medium text-gray-700">Login</h2>
          <div className="w-6" />
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-gray-800 font-semibold text-lg mb-1">
              Welcome Back
            </label>
          </div>

          {/* Mobile Number Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
              <span className="text-gray-700 text-sm pr-2">+91</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full outline-none text-sm"
                disabled={showOtp}
              />
            </div>
          </div>

          {/* OTP Field */}
          {showOtp && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm outline-none"
                maxLength={6}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition"
            onClick={showOtp ? handleVerifyOtp : handleSendOtp}
          >
            {showOtp ? "Verify OTP" : "Get OTP"}
          </button>

          {/* Signup Link */}
          <p className="text-xs text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium">
              Create Account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
