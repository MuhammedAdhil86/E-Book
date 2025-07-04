// pages/SignupPage.jsx

import React, { useState } from "react";
import { useBookStore } from "../store/useBookStore";
import indianStates from "../component/data/indianstate";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const signup = useBookStore((state) => state.signup);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    jobTitle: "",
    stateId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(formData);

      toast.success("Signup successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || err?.error || "Signup failed. Please try again.";
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbea] px-4">
      <ToastContainer />
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-1/2 border border-gray-300 p-2 rounded text-sm focus:outline-none"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-1/2 border border-gray-300 p-2 rounded text-sm focus:outline-none"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
            <span className="text-gray-700 text-sm pr-2">+91</span>
            <input
              name="mobile"
              type="tel"
              placeholder="Mobile Number"
              className="w-full outline-none text-sm"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <input
            name="jobTitle"
            placeholder="Job Title"
            className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
            value={formData.jobTitle}
            onChange={handleChange}
          />

          <select
            name="stateId"
            className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
            value={formData.stateId}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-blue-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-medium py-2 rounded transition`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>

          <p className="text-xs text-center text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
