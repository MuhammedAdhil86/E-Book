// ✅ File: src/component/booklist.jsx
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
import BookCard from "./bookcard"; // ✅ Imported reusable BookCard component

const BookList = React.forwardRef(({ selectedCategoryId, searchKeyword }, ref) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { subscriptionType } = useBookStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await api.get("/ebook/covers");
        const data = Array.isArray(res.data) ? res.data : res.data?.responsedata || [];
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;
    if (selectedCategoryId && selectedCategoryId !== "all") {
      result = result.filter(
        (book) => String(book.category?.id) === String(selectedCategoryId)
      );
    }
    if (searchKeyword) {
      const keyword = searchKeyword.trim().toLowerCase();
      result = result.filter((book) =>
        (book.title || "").toLowerCase().includes(keyword)
      );
    }
    setFilteredBooks(result);
  }, [selectedCategoryId, searchKeyword, books]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="text-gray-500 text-lg animate-pulse">Loading books...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>;
  }

  return (
    <motion.section
      ref={ref}
      className="bg-[#fcf6f1] min-h-screen py-6 px-2 sm:px-4 md:px-8 mt-10"
      variants={sectionFadeIn}
      initial="initial"
      animate="animate"
    >
      <div className="flex justify-center items-center mb-8 font-serifTitle">
        <motion.h2
          className="text-xl sm:text-2xl font-semibold text-gray-800"
          variants={headingFadeIn}
        >
          Explore Our Library
        </motion.h2>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-1">No books found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book._id || book.id || index}
              className="mt-10"
              {...cardVariant(index)}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
});

export default BookList;
