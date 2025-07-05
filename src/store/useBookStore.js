// store/useBookStore.js

import { create } from "zustand";
import Cookies from "js-cookie";
import api from "../api/Instance";

export const useBookStore = create((set, get) => ({
  // UI State
  bookInfo: null,
  chapters: [],
  expandedChapter: null,
  selectedTopic: null,
  popupData: null,
  zoom: 100,
  isFullscreen: false,

  // Auth & Subscription State
  token: Cookies.get("token") || null,
  user: null,
  mobile: "",
  isAuthenticated: !!Cookies.get("token"),
  subscriptionType: Cookies.get("subscription_type") || null,
  hasSubscription: Cookies.get("has_subscription") === "true",

  // UI Actions
  setBookInfo: (info) => set({ bookInfo: info }),
  setChapters: (chapters) => set({ chapters }),
  toggleChapter: (id) =>
    set((s) => ({
      expandedChapter: s.expandedChapter === id ? null : id,
    })),
  setSelectedTopic: (topic) => set({ selectedTopic: topic, popupData: null }),
  setPopupData: (data) => set({ popupData: data }),
  setZoom: (zoom) => set({ zoom }),
  toggleFullscreen: () =>
    set((s) => ({ isFullscreen: !s.isFullscreen })),

  // Auth Actions
  setMobile: (mobile) => set({ mobile }),

  sendOtp: async (mobile) => {
    const formattedMobile = `+91${mobile.replace(/[^\d]/g, "").slice(-10)}`;
    const res = await api.post("/user/reader/login", { mobile: formattedMobile });
    return res.data;
  },

  verifyOtp: async (mobile, otp) => {
    const formattedMobile = `+91${mobile.replace(/[^\d]/g, "").slice(-10)}`;
    const res = await api.post("/user/reader/verifyloginotp", {
      mobile: formattedMobile,
      otp,
    });

    const token = res.data?.token;
    const user = res.data?.user;

    if (token && user) {
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("subscription_type", user.subscription_type, { expires: 7 });
      Cookies.set("has_subscription", user.has_subscription, { expires: 7 });

      set({
        token,
        user,
        isAuthenticated: true,
        subscriptionType: user.subscription_type,
        hasSubscription: user.has_subscription,
      });

      // Redirect based on subscription status
      if (!user.has_subscription) return "/subscription";
      if (user.subscription_type === "trial") return "/subscription";
      if (user.subscription_type === "expired") return "/renew";
      return "/subscribed";
    }

    return res.data;
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("subscription_type");
    Cookies.remove("has_subscription");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      mobile: "",
      subscriptionType: null,
      hasSubscription: false,
    });
  },

  isSubscribed: () => {
    const state = get();
    return (
      state.isAuthenticated &&
      state.subscriptionType &&
      !["pending", "expired"].includes(state.subscriptionType)
    );
  },

  getUser: () => get().user,

  updateSubscriptionState: (user) => {
    if (user) {
      Cookies.set("subscription_type", user.subscription_type, { expires: 7 });
      Cookies.set("has_subscription", user.has_subscription, { expires: 7 });
      set({
        user,
        subscriptionType: user.subscription_type,
        hasSubscription: user.has_subscription,
      });
    }
  },
}));
