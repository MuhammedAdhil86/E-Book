import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import toast from "react-hot-toast";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate(); // ✅ create navigate function

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!showOtp) {
      if (mobile.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return;
      }
      setShowOtp(true);
      toast.success("OTP sent to your number.");
    } else {
      if (otp === "1234") {
        toast.success("✅ Logged in successfully!");
        setTimeout(() => {
          navigate("/"); // ✅ navigate to home
        }, 1000);
      } else {
        toast.error("❌ Incorrect OTP. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            className="text-gray-600 text-xl"
            onClick={() => {
              if (showOtp) setShowOtp(false);
            }}
          >
            &larr;
          </button>
          <h2 className="text-md font-medium text-gray-700">Login</h2>
          <div className="w-6" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold text-lg mb-1">
              Welcome Back
            </label>
          </div>

          {/* Mobile Number */}
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
                required
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
                placeholder="Enter 1234"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm outline-none"
                maxLength={4}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition"
          >
            {showOtp ? "Verify OTP" : "Get OTP"}
          </button>

          {/* Switch to Signup */}
          <p className="text-xs text-center text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 font-medium">
              Create Account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
