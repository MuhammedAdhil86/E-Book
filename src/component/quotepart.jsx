// File: src/components/Quotepart.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuoteStore from "../store/useQuoteStore";

export default function Quotepart() {
  const navigate = useNavigate();
  const {
    quotes,
    fetchQuotes,
    currentQuoteIndex,
    selectQuote,
  } = useQuoteStore();

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const currentQuote = quotes[currentQuoteIndex];

  if (!currentQuote) return <div className="p-6">Loading quotes...</div>;

  const coverImageUrl = currentQuote.EbookCover?.cover_image
    ? `https://mvdapi-mxjdw.ondigitalocean.app/media/${currentQuote.EbookCover.cover_image}`
    : "https://ebook.commerciallawpublishers.com/fa/mva/files/mobile/1.jpg?220607085837";

  return (
    <section className="bg-[#fdf8f4] w-full h-auto px-6 md:px-12 overflow-auto mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 py-8">

        {/* Left Text */}
        <div className="text-center md:text-left space-y-4 flex-1">
          <h1 className="text-3xl md:text-5xl font-serif font-semibold">Motor Vehicle Law</h1>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            EXPLORE <span className="text-yellow-500">OUR E BOOK</span> LIBRARY
          </h3>
        </div>

        {/* Center Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={coverImageUrl}
            alt={currentQuote.EbookCover?.title || "Ebook Cover"}
            className="w-48 md:w-60 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://ebook.commerciallawpublishers.com/fa/mva/files/mobile/1.jpg?220607085837";
            }}
          />
        </div>

        {/* Right Quote */}
        <div className="text-center md:text-left space-y-4 flex-1">
          <h3 className="text-2xl font-cursive text-gray-800">Quote Of The Day</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md">
            {currentQuote.quote}
          </p>
          <p className="text-sm text-gray-700 font-semibold">
            — {currentQuote.EbookCover?.author}
          </p>
          <button
            className="mt-2 bg-yellow-500 text-white px-4 py-2 text-sm rounded hover:bg-yellow-600 transition"
            onClick={() => {
              selectQuote(currentQuote);
              navigate("/quotes");
            }}
          >
            Know More
          </button>
        </div>

      </div>
    </section>
  );
}
