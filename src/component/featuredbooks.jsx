import React, { useEffect, useState } from "react";
import api from "../api/Instance";
import BookCard from "../component/bookcard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await api.get("/ebook/covers");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.responsedata || [];

        const featured = data.filter((book) => book.is_featured === true);
        const sortedBooks = featured.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
        setBooks(sortedBooks.slice(0, 20));
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 font-body">
        Loading featured books...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-body">{error}</p>
    );

  return (
    <section className="py-12 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl text-gray-800 mb-2 font-serifTitle">
          Featured Books
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto font-serifTitle">
          Discover our special featured books curated just for you
        </p>
      </div>

      {/* ✅ Swiper with responsive breakpoints */}
      <div className="px-6">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
     
           breakpoints={{
            0: {
              slidesPerView: 2.5,
            },
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
        >
          {books.map((book, index) => (
            <SwiperSlide key={book._id || book.id || index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
