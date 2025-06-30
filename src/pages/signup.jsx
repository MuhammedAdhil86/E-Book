import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import
import toast from "react-hot-toast";

export default function Signup() {
  const [role, setRole] = useState("parent");
  const [mobile, setMobile] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate(); // ✅ Create navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showOtp) {
      if (mobile.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return;
      }
      setShowOtp(true);
      toast.success("OTP sent to your mobile number!");
    } else {
      if (otp === "1234") {
        toast.success("✅ Account created successfully!");
        setTimeout(() => {
          navigate("/login"); // ✅ Redirect to login after success
        }, 1000);
      } else {
        toast.error("❌ Invalid OTP. Please try again.");
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
              if (showOtp) {
                setShowOtp(false);
              }
            }}
          >
            &larr;
          </button>
          <h2 className="text-md font-medium text-gray-700">Sign Up</h2>
          <div className="w-6" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-semibold text-lg mb-1">
              Create Account
            </label>
          </div>

          {/* Mobile Number Input */}
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

          {/* OTP Input */}
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

          <p className="text-xs text-center text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
