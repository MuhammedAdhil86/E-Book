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

// ✅ Image base URL for DigitalOcean Spaces
const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";

export default function ProductList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscriptionType } = useBookStore();
  const navigate = useNavigate();

  // ✅ Constructs full image URL
  const getImageUrl = (url) => {
    if (!url)
      return "https://dummyimage.com/300x200/cccccc/000000&text=No+Cover";
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

  if (loading) return <p className="text-center py-10">Loading books...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!books.length)
    return <p className="text-center text-gray-500">No books found.</p>;

  return (
    <motion.section
      className="bg-[#fcf6f1] min-h-screen py-10 px-4 md:px-8 mt-10"
      variants={sectionFadeIn}
      initial="initial"
      animate="animate"
    >
      <motion.h2
        className="text-2xl font-semibold mb-8 text-center text-gray-800"
        variants={headingFadeIn}
        initial="initial"
        animate="animate"
      >
        Explore Our Library
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book._id || book.id || index}
            className="relative group border rounded overflow-hidden shadow hover:shadow-lg transition"
            {...cardVariant(index)}
          >
            <img
              src={getImageUrl(book.cover_image)} // ✅ Use correct field name
              alt={book.title}
              className="w-full h-56 object-cover"
              onError={(e) =>
                (e.target.src =
                  "https://dummyimage.com/300x200/cccccc/000000&text=No+Cover")
              }
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">
                {book.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600">
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
