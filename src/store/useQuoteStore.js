// File: src/stores/useQuoteStore.js
import { create } from "zustand";
import api from "../api/Instance";

let quoteInterval = null;

const useQuoteStore = create((set, get) => ({
  quotes: [],
  currentQuoteIndex: 0,
  selectedQuote: null,

  fetchQuotes: async () => {
    try {
      const res = await api.get("/quotes/getall");
      const quotes = res.data?.responsedata || [];

      // Sort by ID to maintain consistent order
      quotes.sort((a, b) => a.id - b.id);

      set({ quotes, currentQuoteIndex: 0 });

      // Start infinite quote rotation if not already running
      if (!quoteInterval && quotes.length > 1) {
        quoteInterval = setInterval(() => {
          const { rotateQuote } = get();
          rotateQuote();
        }, 60000); // every 60 seconds
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
    }
  },

  rotateQuote: () => {
    set((state) => ({
      currentQuoteIndex:
        (state.currentQuoteIndex + 1) % state.quotes.length,
    }));
  },

  selectQuote: (quote) => set({ selectedQuote: quote }),
}));

export default useQuoteStore;
