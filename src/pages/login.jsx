import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/Instance"; // ✅ axios instance with baseURL

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!showOtp) {
      // Validate mobile number format
      if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return;
      }

      try {
        const res = await api.post("/user/reader/login", { mobile });
        console.log("Login OTP Response:", res.data);

        if (res.data?.status === true) {
          setShowOtp(true);
          toast.success("✅ OTP sent to your number.");
        } else {
          toast.error(res.data?.message || "❌ Failed to send OTP.");
        }
      } catch (error) {
        console.error("Login OTP error:", error?.response?.data || error);
        toast.error(error?.response?.data?.error || "Server error while sending OTP.");
      }
    } else {
      // Verify OTP
      if (!otp || otp.length < 4) {
        toast.error("Please enter a valid OTP.");
        return;
      }

      try {
        const res = await api.post("/user/reader/verifyloginotp", {
          mobile,
          otp,
        });
        console.log("Verify OTP Response:", res.data);

        if (res.data?.status === true) {
          toast.success("🎉 Successfully logged in!");
          // Optionally store token:
          // localStorage.setItem("token", res.data.token);

          setTimeout(() => {
            navigate("/"); // ✅ Redirect to homepage
          }, 1000);
        } else {
          toast.error(res.data?.message || "❌ Incorrect OTP. Try again.");
        }
      } catch (error) {
        console.error("OTP verification error:", error?.response?.data || error);
        toast.error(error?.response?.data?.error || "Failed to verify OTP.");
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
            onClick={() => setShowOtp(false)}
            type="button"
          >
            {showOtp ? "←" : ""}
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
                placeholder="Enter OTP"
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm outline-none"
                maxLength={6}
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

          {/* Link to Signup */}
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
