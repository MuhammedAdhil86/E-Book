// store/useToastStore.js
import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  message: null,
  type: "info",
  setNotification: (message, type = "info") =>
    set({ message, type }),
  clearNotification: () => set({ message: null }),
}));
