// File: src/component/booklist.jsx
import React, { useEffect, useState } from "react";
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

export default function BookList({ selectedCategoryId }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
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
        setBooks(data);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId || selectedCategoryId === 'all') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) => String(book.category?.id) === String(selectedCategoryId)
      );
      setFilteredBooks(filtered);
    }
  }, [selectedCategoryId, books]);

  const handleReadClick = (bookId) => {
    if (subscriptionType === "pending") {
      navigate("/subscribe");
    } else {
      navigate(`/read/${bookId}`);
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
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          className="text-xl sm:text-2xl font-semibold text-gray-800"
          variants={headingFadeIn}
        >
          Explore Our Library
        </motion.h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-20">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book._id || book.id || index}
            className="relative group border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            {...cardVariant(index)}
          >
            <img
              src={getImageUrl(book.cover_image)}
              alt={book.title}
              className="w-full h-20 lg:h-[200px] sm:h-72 md:h-80 rounded-xl"
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
