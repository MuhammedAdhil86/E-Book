// store/useBookStore.js

import { create } from "zustand";
import Cookies from "js-cookie";
import api from "../api/Instance";

/**
 * Zustand store for managing book, UI, and authentication state
 */
export const useBookStore = create((set) => ({
  // -----------------------
  // BOOK & UI STATE
  // -----------------------
  bookInfo: null,
  chapters: [],
  expandedChapter: null,
  selectedTopic: null,
  popupData: null,
  zoom: 100,
  isFullscreen: false,

  // -----------------------
  // AUTH STATE
  // -----------------------
  token: Cookies.get("token") || null,
  mobile: "",
  isAuthenticated: !!Cookies.get("token"),

  // -----------------------
  // UI ACTIONS
  // -----------------------
  setBookInfo: (info) => set({ bookInfo: info }),
  setChapters: (chapters) => set({ chapters }),
  toggleChapter: (id) =>
    set((s) => ({
      expandedChapter: s.expandedChapter === id ? null : id,
    })),
  setSelectedTopic: (topic) => set({ selectedTopic: topic, popupData: null }),
  setPopupData: (data) => set({ popupData: data }),
  setZoom: (zoom) => set({ zoom }),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

  // -----------------------
  // AUTH ACTIONS
  // -----------------------

  /**
   * Set mobile number in state
   */
  setMobile: (mobile) => set({ mobile }),

  /**
   * Send OTP to mobile number
   */
  sendOtp: async (mobile) => {
    try {
      const formattedMobile = `+91${mobile.replace(/[^\d]/g, "").slice(-10)}`;
      const res = await api.post("/user/reader/login", { mobile: formattedMobile });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  /**
   * Verify OTP and set auth token
   */
  verifyOtp: async (mobile, otp) => {
    try {
      const formattedMobile = `+91${mobile.replace(/[^\d]/g, "").slice(-10)}`;
      const res = await api.post("/user/reader/verifyloginotp", {
        mobile: formattedMobile,
        otp,
      });

      const token = res.data?.token;
      if (token) {
        Cookies.set("token", token, { expires: 7 }); // 7-day token
        set({ token, isAuthenticated: true });
      }

      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  /**
   * Signup user with full validation
   */
  signup: async (formData) => {
    try {
      // Prepare and sanitize mobile number
      const cleanedMobile = formData.mobile?.replace(/[^\d]/g, "").slice(-10);

      // Construct payload for API
      const payload = {
        first_name: formData.firstName?.trim(),
        last_name: formData.lastName?.trim(),
        email: formData.email?.trim(),
        mobile: `+91${cleanedMobile}`,
        job_title: formData.jobTitle?.trim(),
        state_id: Number(
          formData.stateId ||
            (typeof formData.state === "object" ? formData.state.value : formData.state)
        ),
        role: "reader",
        password: formData.password,
      };

      // --------------------
      // CLIENT-SIDE VALIDATION
      // --------------------
      if (!payload.first_name || !payload.last_name) {
        throw new Error("First and last name are required.");
      }

      if (!payload.email || !/\S+@\S+\.\S+/.test(payload.email)) {
        throw new Error("Valid email is required.");
      }

      if (!/^\+91\d{10}$/.test(payload.mobile)) {
        throw new Error("Valid 10-digit mobile number is required.");
      }

      if (!payload.state_id || isNaN(payload.state_id)) {
        throw new Error("State selection is required.");
      }

      if (!payload.password || payload.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      // --------------------
      // SIGNUP REQUEST
      // --------------------
      const res = await api.post("/user/reader/create", payload);
      return res.data; // contains success message or next step
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      throw err.response?.data || new Error("Signup failed. Please try again.");
    }
  },

  /**
   * Logout and clear session
   */
  logout: () => {
    Cookies.remove("token");
    set({ token: null, isAuthenticated: false, mobile: "" });
  },
}));
