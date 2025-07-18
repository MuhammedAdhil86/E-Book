import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import api from "../../api/Instance";

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get("/quotes/getall")
      .then((resp) => {
        const arr = resp.data?.responsedata;
        if (Array.isArray(arr) && arr.length > 0) {
          const items = arr.map(q => ({
            quote: q.quote,
            author: q.author || "",
          }));
          setTestimonials(items);
          setCurrent(0);
        } else {
          console.warn("No quotes returned or wrong format:", resp.data);
        }
      })
      .catch((err) => console.error("Failed to load quotes:", err));
  }, []);

  const next = () => setCurrent(prev => (prev + 1) % testimonials.length);
  const prev = () => setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);

  if (!testimonials.length) return null; // can substitute with a Loader

  return (
    <section className="bg-[#fbf5f1] px-4 font-serif text-center h-64">
      <div className="max-w-4xl mx-auto relative overflow-hidden min-h-[220px]">
        <div className="flex justify-center items-center h-full mt-20">
          <div
            className="transition-transform duration-500 ease-in-out flex w-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((item, index) => (
                <div
                key={index}
                className="flex-shrink-0 w-full  text-center    "
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

        

      
      </div>
    </section>
  );
}
