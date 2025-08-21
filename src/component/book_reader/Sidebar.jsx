import { Book } from "lucide-react";
import React from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiInfo,
} from "react-icons/fi";

export default function Sidebar({
  bookInfo,
  chapters,
  expandedChapter,
  toggleChapter,
  renderTopics,
  searchQuery,
  setSearchQuery,
  isSidebarFullscreen,
  toggleSidebarFullScreen,
}) {
  return (
    <>
      {isSidebarFullscreen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebarFullScreen}
        />
      )}
      <div
        className={`shadow-xl p-4 flex flex-col rounded-xl bg-white z-50 ${
          isSidebarFullscreen ? "fixed inset-0 w-full h-full" : "w-[24%]"
        }`}
      >
        {/* Header */}
        <div className="relative mb-2">
          <div className="flex flex-col items-center justify-center border-b pb-2 relative h-auto">
            {/* Left icon */}
            <div className="absolute left-0 top-2 flex items-center pl-2 space-x-2">
              <FiInfo className="text-gray-500" title="Book Info" />
            </div>

            {/* Title */}
            <h2 className="font-bold text-lg text-center truncate max-w-[70%]">
              {bookInfo?.title}
            </h2>

            {/* Subtitle (h3) under title, above border */}
            <h3 className="font-body text-sm text-gray-600 text-center mt-1">
              {bookInfo?.author || "Subtitle goes here"}
            </h3>

            {/* Right button */}
            <div className="absolute right-0 top-2 flex items-center pr-2">
              <button
                onClick={toggleSidebarFullScreen}
                title="Sidebar Fullscreen"
              >
                {isSidebarFullscreen ? (
                  <FiChevronLeft className="text-xl" />
                ) : (
                  <FiChevronRight className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Updated date */}
        <p className="font-body text-sm text-yellow-500 ">
          Updated up to:{" "}
          {bookInfo?.last_updated_at
            ? new Date(bookInfo.last_updated_at).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A"}
        </p>

        {/* Search */}
        <div className="relative mb-4 mt-3">
          <input
            type="text"
            placeholder={`Search inside ${bookInfo?.title || "this book"}`}
            className="font-body w-full border rounded p-2 pr-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute top-2.5 right-2 text-gray-400" />
        </div>

        {/* Chapters */}
        <div className="overflow-y-auto flex-grow ">
          {chapters.map((ch) => (
            <div key={ch.id}>
              <button
                onClick={() => toggleChapter(ch.id)}
                className="font-body w-full text-left  py-2 border-b flex justify-between items-center"
              >
                {ch.title}
                {expandedChapter === ch.id ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button >
              {expandedChapter === ch.id && renderTopics(ch.children || [])}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
