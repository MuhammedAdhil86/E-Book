import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import api from "../api/Instance";

export default function BooksSection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return "https://dummyimage.com/300x200/cccccc/000000&text=No+Cover";
    return url.startsWith("http") ? url : `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${url}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/ebook/covers");
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        } else if (Array.isArray(res.data?.responsedata)) {
          setBooks(res.data.responsedata);
        } else {
          console.error("Unexpected API response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-600">Loading books...</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
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
            <Link to="/library">
              <button className="bg-yellow-500 text-white text-sm px-4 py-2 rounded hover:bg-yellow-600 transition">
                View All Books
              </button>
            </Link>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          spaceBetween={20}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            0: { slidesPerView: 1.2, centeredSlides: true },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Pagination]}
          className="pb-10"
        >
          {books.map((book, index) => (
            <SwiperSlide key={book._id || book.id || index}>
              <div className="flex flex-col items-center text-center space-y-4">
                <img
                  src={getImageUrl(book.coverImageUrl)}
                  alt={book.title || "Book"}
                  className="w-44 lg:w-48 rounded shadow-md hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://dummyimage.com/300x200/cccccc/000000&text=No+Cover";
                  }}
                />
                <p className="text-sm font-medium text-gray-800">
                  {book.title || "Untitled"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
