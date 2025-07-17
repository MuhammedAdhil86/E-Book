// src/components/BooksSection.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const books = [
  {
    title: "There’s Something about Mirza",
    image: "https://m.media-amazon.com/images/I/71TESTAoqFL._SL1500_.jpg",
  },
  {
    title: "The Vibrant Years Novel",
    image: "https://m.media-amazon.com/images/I/815qLcSL9LL._SY425_.jpg",
  },
  {
    title: "The Wedding Setup – A Short Story",
    image: "https://m.media-amazon.com/images/I/510fg-Akt4L._SY445_SX342_.jpg",
  },
  {
    title: "The Emma Project Novel",
    image: "https://m.media-amazon.com/images/I/81HWutvBrdL._SL1500_.jpg",
  },
];

export default function BooksSection() {
  return (
    <section className="bg-white lg:min-h-screen px-6 lg:px-24 font-serif flex flex-col justify-center lg:mt-0 mt-7">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center ">
        <div className="mb-2 lg:mb-0">
          <p className="text-sm italic text-gray-700 mb-1">Books</p>
          <h2 className="text-[15px] md:text-4xl font-serifTitle max-w-2xl leading-snug text-black">
            DISCOVER ALL MY BOOKS YOU WERE LOOKING FOR
          </h2>
        </div>

        <div className="flex flex-col items-start">
          <p className="text-sm text-gray-700 max-w-sm mb-4">
            I write hilarious & heartwarming stories about families without boundaries.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-5 py-2 transition duration-300 shadow-sm">
            View All Books
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-end mb-2 gap-3 pr-4">
        <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
          <ChevronLeft size={18} />
        </button>
        <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Book Grid on Desktop, Carousel on Mobile */}
      <div className="lg:hidden">
        {/* Carousel for small/medium screens */}
        <Swiper spaceBetween={20} slidesPerView={1}>
          {books.map((book, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col items-center text-center">
                <div className="p-1 bg-[#faf3ed] rounded">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-[180px] h-[260px] object-cover rounded shadow-md  bg-red-500"
                  />
                </div>
                <p className="mt-3 text-sm text-black font-medium leading-tight max-w-[200px]">
                  {book.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:grid grid-cols-2 md:grid-cols-4 gap-10 items-start">
        {books.map((book, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="p-8 bg-[#faf3ed] rounded">
              <img
                src={book.image}
                alt={book.title}
                className="w-[180px] h-[260px] object-cover rounded shadow-md"
              />
            </div>
            <p className="mt-3 text-sm text-black font-medium leading-tight max-w-[200px]">
              {book.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
