import React, { useEffect, useState } from "react";
import api from "../api/Instance";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const FALLBACK_IMAGE =
  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436194631i/25859879.jpg";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // 🔥 Filter only featured books
        const featuredBooks = data.filter((book) => book.is_featured === true);

        // Optional: sort alphabetically and take top 5
        const sortedBooks = featuredBooks.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );

        setBooks(sortedBooks.slice(0, 5));
      } catch (err) {
        setError("Failed to load featured books.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading)
    return <p className="text-center py-10 font-sans">Loading featured books...</p>;
  if (error)
    return <p className="text-center text-red-600 font-sans">{error}</p>;

  return (
    <section className="py-12 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-serif">
          Featured Books
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto font-sans">
          Discover our special featured books curated just for you
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-32 px-4">
        {books.map((book, index) => (
          <div
            key={book._id || book.id || index}
            className="flex flex-col items-center w-32 relative"
          >
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
            </div>

            <h3
              className="mt-4 font-medium text-gray-800 
                         text-xs sm:text-sm md:text-base 
                         text-center truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px] 
                         font-serif"
            >
              {book.title || "Untitled"}
            </h3>
            <p className="text-gray-500 text-xs mt-1 font-sans">
              {book.author || ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
