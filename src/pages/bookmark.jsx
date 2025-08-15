import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBookmarkStore } from "../store/useBookmarkStore";
import Cookies from "js-cookie";
import Navbar from "../component/navbar";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";

const Bookmarks = () => {
  const navigate = useNavigate();
  const {
    bookmarks,
    bookmarksLoading,
    bookmarksError,
    fetchBookmarks,
    removeBookmark,
  } = useBookmarkStore();

  const isAuthenticated = !!Cookies.get("token");

  const loadBookmarks = useCallback(async () => {
    if (isAuthenticated) {
      await fetchBookmarks();
    }
  }, [isAuthenticated, fetchBookmarks]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemove = async (id) => {
    try {
      await removeBookmark(id);
      fetchBookmarks();
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-center text-gray-600 font-serifTitle">Please log in to view bookmarks.</p>
      </div>
    );
  }

  if (bookmarksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 font-serifTitle">Loading bookmarks...</p>
      </div>
    );
  }

  if (bookmarksError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{bookmarksError}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto mt-12">
        <h1 className="text-2xl font-serifTitle md:text-3xl  mb-6 text-gray-900">
          Your Bookmarks
        </h1>

        {bookmarks.length === 0 ? (
          <p className="text-gray-600">No bookmarks found.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {bookmarks.map((bookmark) => {
              const cover = bookmark.bookcover;
              return (
                <li
                  key={bookmark.id}
                  className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-lg transition flex flex-col items-center"
                >
                  <div
                    onClick={() => navigate(`/bookmarkview/${bookmark.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") navigate(`/bookmarkview/${bookmark.id}`);
                    }}
                    className="flex flex-col items-center w-full"
                  >
                    {cover?.cover_image ? (
                      <img
                        src={IMAGE_BASE_URL + cover.cover_image}
                        alt={cover.title}
                        className="w-52 h-60 object-fill rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-52 h-72 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md mb-2">
                        No cover
                      </div>
                    )}
                    <p className="text-sm md:text-base font-medium text-gray-800 text-center">
                      {cover?.title || "Untitled"}
                    </p>
                    {bookmark.book_info?.title && (
                      <p className="text-xs md:text-sm text-gray-500 text-center mt-1 line-clamp-2">
                        {bookmark.book_info.title}
                      </p>
                    )}
                  </div>

                  {/* Remove bookmark button */}
                  <button
                    onClick={() => handleRemove(bookmark.id)}
                    className="mt-3 px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-400 rounded transition"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default Bookmarks;
