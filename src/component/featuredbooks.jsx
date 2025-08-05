import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Instance";
import { useBookStore } from "../store/useBookStore";

// ✅ Swiper Core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const FALLBACK_IMAGE =
  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436194631i/25859879.jpg";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { subscriptionType } = useBookStore();
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    return url.startsWith("http") ? url : `${IMAGE_BASE_URL}${url}`;
  };

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

  const handleReadClick = (bookId) => {
    if (subscriptionType === "pending") {
      navigate("/subscribe");
    } else {
      navigate(`/read/${bookId}`);
    }
  };

  if (loading)
    return (
      <p className="text-center py-10 font-body">
        Loading featured books...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-body">
        {error}
      </p>
    );

  return (
    <section className="py-12 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl  text-gray-800 mb-2 font-serifTitle">
          Featured Books
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto    font-serifTitle">
          Discover our special featured books curated just for you
        </p>
      </div>

      {/* ✅ Responsive Swiper Slider */}
      <div className="px-6">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
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
              <div className="flex flex-col items-center w-32 relative group mx-auto">
                <div className="relative w-full h-48">
                  <img
                    src={getImageUrl(book.cover_image)}
                    alt={book.title}
                    className="w-full h-48 rounded-md object-fill relative z-10 shadow-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/100 rounded-full blur-md z-0"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition z-20">
                    <button
                      onClick={() => handleReadClick(book._id || book.id)}
                      className="bg-white px-4 py-2 rounded text-black font-semibold hover:bg-yellow-500 font-body"
                    >
                      Read
                    </button>
                  </div>
                </div>

                <h3
                  className="mt-4 font-medium text-gray-800 
                             text-xs sm:text-sm md:text-base 
                             text-center truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px] 
                             font-serifTitle"
                >
                  {book.title || "Untitled"}
                </h3>
                <p className="text-gray-500 text-xs mt-1 font-sans">
                  {book.author || ""}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
