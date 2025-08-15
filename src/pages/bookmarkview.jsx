import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../store/useBookmarkStore";
import CitationContent from "../component/book_reader/CitationContent";
import { ChevronLeft } from "lucide-react"; // Icon import

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";

const BookmarkView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookmarks, fetchBookmarks } = useBookmarkStore();
  const [bookmark, setBookmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bookmarks if not loaded
  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      await fetchBookmarks();
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setError("Unable to load bookmark data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [fetchBookmarks]);

  useEffect(() => {
    if (!bookmarks.length) {
      loadBookmarks();
    } else {
      setLoading(false);
    }
  }, [bookmarks, loadBookmarks]);

  // Select the bookmark by ID
  useEffect(() => {
    if (bookmarks.length) {
      const found = bookmarks.find((b) => b.id.toString() === id);
      setBookmark(found || null);
    }
  }, [bookmarks, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!bookmark) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Bookmark not found.</p>
      </div>
    );
  }

  const { bookcover: cover, book_info: bookInfo } = bookmark;

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute -left-14 top-6 p-2 rounded-full  transition"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 tracking-tight">
          {cover?.title || "Untitled"}
        </h1>
        {bookInfo?.title && (
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">
            {bookInfo.title}
          </h2>
        )}
        {bookInfo?.description && (
          <p className="text-gray-600 leading-relaxed">
            {bookInfo.description}
          </p>
        )}
      </div>

      {/* Book Cover */}
      {cover?.image && (
        <div className="mb-6 flex justify-center">
          <img
            src={`${IMAGE_BASE_URL}${cover.image}`}
            alt={cover?.title || "Book Cover"}
            className="rounded-lg shadow-md max-h-72 object-contain"
          />
        </div>
      )}

      {/* Draft Content */}
      {bookInfo?.draft_content ? (
        <div className="bg-white p-6 rounded-xl shadow-md prose max-w-none">
          <CitationContent node={bookInfo} selectedNodeId={bookmark.id} />
        </div>
      ) : (
        <p className="text-gray-500 mt-4 italic text-center">
          No draft content available.
        </p>
      )}
    </div>
  );
};

export default BookmarkView;
