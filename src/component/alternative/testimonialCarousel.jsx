import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const testimonials = [
  {
    quote: `A sparkling page-turner about the unbreakable bonds of women and the necessity of forging an authentic path. Dev’s storytelling shines!”`,
    author:
      "—Kristy Woodson Harvey, New York Times bestselling author of The Wedding Veil",
  },
  {
    quote: `Dev delivers another gem—uplifting, emotional, and full of heart.`,
    author: "—Emily Henry, Author of Book Lovers",
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-[#fbf5f1]  px-4 font-serif text-center h-64">
      <div className="max-w-4xl mx-auto relative overflow-hidden min-h-[220px]">
        {/* Centered Slide Content */}
        <div className="flex justify-center items-center h-full mt-20">
          <div
            className="transition-transform duration-500 ease-in-out flex w-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full px-6 text-center flex flex-col justify-center items-center"
              >
                <p className="text-lg sm:text-xl md:text-2xl italic text-gray-800 leading-relaxed max-w-3xl">
                  {item.quote}
                </p>
                <span className="not-italic font-medium block mt-4 text-gray-700 text-sm sm:text-base">
                  {item.author}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows aligned with text content */}
        <button
          onClick={prev}
          className="absolute left-1 top-28 -translate-y-1/2 transform text-gray-500 hover:text-black"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={next}
          className="absolute right-1 top-28 -translate-y-1/2 transform text-gray-500 hover:text-black"
        >
          <ChevronRight size={28} />
        </button>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={clsx(
                "w-2 h-2 rounded-full transition-colors",
                current === idx ? "bg-gray-800" : "bg-gray-400"
              )}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
