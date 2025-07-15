import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuoteStore from "../store/useQuoteStore";

export default function LandingPage() {
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
    <section className="w-full h-auto px-6 md:px-12 overflow-auto">
      <div className="max-w-7xl mx-auto flex flex-col py-8">

        {/* === Desktop Header + Image Wrapper (100vh only on lg) === */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10 lg:h-screen items-center">
          {/* === LEFT COLUMN: Heading === */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left ml-16">
            <h1 className="text-3xl md:text-5xl font-serif font-semibold">
              Motor Vehicle Law
            </h1>
            <h3 className="text-lg md:text-xl text-gray-900">
              Welcome to the{" "}
              <span className="text-yellow-600">Motor Vehicles Law</span> Hub - your
              central source for real-time updates and insights into the ever-evolving
              landscape of Motor Vehicles Act, 1988 followed by its Central Motor
              Vehicles Rules 1989.
            </h3>

            {/* === Explore Button === */}
            <div className="pt-4">
              <button
                className="bg-yellow-500 text-white px-6 py-2 text-sm rounded hover:bg-yellow-600 transition"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                Explore Library
              </button>
            </div>
          </div>

          {/* === RIGHT COLUMN: Book Image === */}
          <div className="flex justify-center items-center">
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
        </div>

        {/* === Mobile View (Updated) === */}
        <div className="lg:hidden flex flex-col items-center space-y-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">Motor Vehicle Law</h1>
                   <h1 className="text-3xl md:text-5xl font-serif font-semibold">
              Motor Vehicle Law
            </h1>
          <h3 className="text-lg md:text-xl text-gray-900 px-2">
            Welcome to the{" "}
            <span className="text-yellow-600 font-semibold">Motor Vehicles Law</span> Hub - your
            source for updates and insights into the Motor Vehicles Act, 1988 and its Rules.
          </h3>
          <div className="flex justify-center items-center">
            <img
              src={coverImageUrl}
              alt={currentQuote.EbookCover?.title || "Ebook Cover"}
              className="w-40 md:w-52 shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ebook.commerciallawpublishers.com/fa/mva/files/mobile/1.jpg?220607085837";
              }}
            />
          </div>
          <div className="pt-2">
            <button
              className="bg-yellow-500 text-white px-5 py-2 text-sm rounded hover:bg-yellow-600 transition"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              Explore Library
            </button>
          </div>
        </div>

        {/* === DESKTOP ONLY: Quote of the Day Section === */}
        <div className="hidden lg:block w-full">
          <div className="bg-gray-100 py-8 px-4 md:px-12 rounded-lg shadow w-full">
            <div className="text-center space-y-4 max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-800">Quote Of The Day</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuote.quote}
              </p>
              <p className="text-base text-gray-600 font-semibold">
                — {currentQuote.EbookCover?.author}
              </p>
              <button
                className="mt-2 bg-yellow-500 text-white px-5 py-2 text-sm rounded hover:bg-yellow-600 transition"
                onClick={() => {
                  selectQuote(currentQuote);
                  navigate("/quotes");
                }}
              >
                Know More
              </button>
            </div>
          </div>
        </div>

        {/* === MOBILE Quote of the Day Section (Updated) === */}
        <div className="lg:hidden w-full bg-gray-100 mt-10 py-6 px-4 rounded-lg shadow text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Quote Of The Day</h3>
          <p className="text-base text-gray-700 leading-relaxed">
            {currentQuote.quote}
          </p>
          <p className="text-sm text-gray-600 font-semibold">
            — {currentQuote.EbookCover?.author}
          </p>
          <button
            className="mt-2 bg-yellow-500 text-white px-5 py-2 text-sm rounded hover:bg-yellow-600 transition"
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
