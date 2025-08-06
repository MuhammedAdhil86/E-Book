import React from "react";
import { useNavigate } from "react-router-dom";
import { useBookStore } from "../store/useBookStore";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const FALLBACK_IMAGE =
  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436194631i/25859879.jpg";

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const { subscriptionType } = useBookStore();

  const getImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    return url.startsWith("http") ? url : `${IMAGE_BASE_URL}${url}`;
  };

  const handleReadClick = () => {
    if (subscriptionType === "pending") {
      navigate("/subscribe");
    } else {
      navigate(`/read/${book._id || book.id}`);
    }
  };

  return (
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
            onClick={handleReadClick}
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
                   "
      >
        {book.title || "Untitled"}
      </h3>
      <p
        className="text-gray-500 text-xs mt-1 font-sm sm:text-sm md:text-base 
                   text-center truncate max-w-[120px] sm:max-w-[160px] md:max-w-[200px] "
      >
        {book.author || ""}
      </p>
    </div>
  );
}
