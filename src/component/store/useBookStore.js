// src/store/useBookStore.js
import { create } from "zustand";
import Cookies from "js-cookie";
import api from "../../api/Instance";

export const useBookStore = create((set) => ({
  // 📚 Existing book state
  bookInfo: null,
  chapters: [],
  expandedChapter: null,
  selectedTopic: null,
  popupData: null,
  zoom: 100,
  isFullscreen: false,

  // 🔐 Auth state
  token: Cookies.get("token") || null,
  mobile: "",
  isAuthenticated: !!Cookies.get("token"),

  // 📚 Book methods
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

  // 📱 Auth methods
  setMobile: (mobile) => set({ mobile }),

  sendOtp: async (mobile) => {
    try {
      const res = await api.post("/user/reader/login", { mobile });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  verifyOtp: async (mobile, otp) => {
    try {
      const res = await api.post("/user/reader/verifyloginotp", { mobile, otp });
      const token = res.data?.token;

      if (token) {
        Cookies.set("token", token, { expires: 7 }); // persist for 7 days
        set({ token, isAuthenticated: true });
      }

      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ token: null, isAuthenticated: false, mobile: "" });
  },
}));
