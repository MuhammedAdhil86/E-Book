import React from "react";

export default function Quotepart() {
  return (
    <section className="bg-[#fdf8f4] w-full md:w-screen h-auto md:h-screen px-6 md:px-12 overflow-auto md:overflow-hidden mt-16 md:mt-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between md:h-full gap-10 py-8">
        
        {/* Left Text Content */}
        <div className="text-center md:text-left space-y-4 flex-1">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold">NEW RELEASE</h1>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            USA TODAY <span className="text-yellow-500">BESTSELLING</span> AUTHOR
          </h3>
        </div>

        {/* Book Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg"
            alt="There's Something About Mira"
            className="w-48 md:w-60 shadow-md"
          />
        </div>

        {/* Right Author & Description */}
        <div className="text-center md:text-left space-y-4 flex-1">
          <h3 className="text-2xl font-cursive text-gray-800">Quote Of The Day</h3>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md">
            The heartfelt story of a woman determined to reunite a lost ring with its owner,
            who ends up finding herself along the way.
          </p>
          <button className="mt-2 bg-yellow-500 text-white px-4 py-2 text-sm rounded hover:bg-yellow-600 transition">
            Know More
          </button>
        </div>

      </div>
    </section>
  );
}
