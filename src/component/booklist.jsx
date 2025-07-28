import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Instance";
import { useBookStore } from "../store/useBookStore";
import { motion } from "framer-motion";
import {
  sectionFadeIn,
  headingFadeIn,
  cardVariant,
} from "../animations/libraryAnimation";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const FALLBACK_IMAGE =
  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436194631i/25859879.jpg";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { subscriptionType } = useBookStore();
  const navigate = useNavigate();
  const featuredRef = useRef(null);

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
        setBooks(
          data.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
        );
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

  const filteredBooks = books.filter((book) =>
    (book.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBooks = books.slice(0, 20);

  const scrollFeatured = (direction) => {
    const container = featuredRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) return <p className="text-center py-10">Loading books...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <motion.section
      className="bg-[#fcf6f1] min-h-screen py-6 px-2 sm:px-4 md:px-8 mt-10"
      variants={sectionFadeIn}
      initial="initial"
      animate="animate"
    >
      {/* 🔹 Featured Books Section with Single Row and Arrows */}
      <motion.div
        className="mb-8"
        variants={headingFadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Featured Books
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollFeatured("left")}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7v14z" />
              </svg>
            </button>
            <button
              onClick={() => scrollFeatured("right")}
              className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7V5z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Scrollable Row - Responsive */}
        <div
          ref={featuredRef}
          className="flex overflow-x-hidden gap-4 pb-2 scroll-smooth"
        >
          {featuredBooks.map((book, index) => (
            <motion.div
              key={`featured-${book._id || book.id || index}`}
              className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] relative group border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              {...cardVariant(index)}
            >
              <img
                src={getImageUrl(book.cover_image)}
                alt={book.title}
                className="w-full h-60 sm:h-72 md:h-80 rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">
                  {book.title || "Untitled"}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {book.author || "Unknown Author"}
                </p>
                {book.language?.name && (
                  <p className="text-xs text-gray-500">
                    Language: {book.language.name}
                  </p>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <button
                  onClick={() => handleReadClick(book._id || book.id)}
                  className="bg-white px-4 py-2 rounded text-black font-semibold hover:bg-yellow-500"
                >
                  Read
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 sm:gap-2">
        <motion.h2
          className="text-xl sm:text-2xl font-semibold text-gray-800"
          variants={headingFadeIn}
          initial="initial"
          animate="animate"
        >
          Explore Our Library
        </motion.h2>

        {/* Search box */}
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm-6 8a6 6 0 1112 0 6 6 0 01-12 0z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search books here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {searchQuery && filteredBooks.length === 0 && (
        <p className="text-center text-gray-500">
          No books found for "{searchQuery.trim()}".
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book._id || book.id || index}
            className="relative group border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            {...cardVariant(index)}
          >
            <img
              src={getImageUrl(book.cover_image)}
              alt={book.title}
              className="w-full h-60 sm:h-72 md:h-80 rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">
                {book.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {book.author || "Unknown Author"}
              </p>
              {book.language?.name && (
                <p className="text-xs text-gray-500">
                  Language: {book.language.name}
                </p>
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <button
                onClick={() => handleReadClick(book._id || book.id)}
                className="bg-white px-4 py-2 rounded text-black font-semibold hover:bg-yellow-500"
              >
                Read
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
