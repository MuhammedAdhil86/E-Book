import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const books = [
  {
    title: "There's Something about Mira",
    img: "https://m.media-amazon.com/images/I/81l3rZK4lnL._SL1500_.jpg",
  },
  {
    title: "The Vibrant Years Novel",
    img: "https://m.media-amazon.com/images/I/815qLcSL9LL._SY425_.jpg",
  },
  {
    title: "The Wedding Setup - A Short Story",
    img: "https://m.media-amazon.com/images/I/510fg-Akt4L._SY445_SX342_.jpg",
  },
  {
    title: "The Emma Project Novel",
    img: "https://m.media-amazon.com/images/I/81HWutvBrdL._SL1500_.jpg",
  },

];



export default function BooksSection() {
  return (
    <section className="bg-white py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Heading */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="text-center md:text-left">
            <p className="italic text-sm text-gray-600 mb-1">Books</p>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold">
              Discover all my books <br className="hidden md:block" /> you were looking for
            </h2>
          </div>
          <div className="text-center md:text-right space-y-2">
            <p className="text-sm text-gray-700">
              I write hilarious & heartwarming stories <br className="hidden md:block" />
              about families without boundaries.
            </p>
            <button className="bg-yellow-500 text-white text-sm px-4 py-2 rounded hover:bg-yellow-600 transition">
              View All Books
            </button>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="block md:hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={true}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="pb-10"
          >
            {books.map((book, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-44 rounded shadow-md hover:scale-105 transition-transform duration-300"
                  />
                  <p className="text-sm font-medium text-gray-800 px-2">{book.title}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <img
                src={book.img}
                alt={book.title}
                className="w-44 lg:w-48 rounded shadow-md hover:scale-105 transition-transform duration-300"
              />
              <p className="text-sm font-medium text-gray-800">{book.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
