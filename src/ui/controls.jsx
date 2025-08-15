// src/ui/controls.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  FiZoomIn,
  FiZoomOut,
  FiBookmark,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";
import { PiRewindLight, PiFastForwardLight } from "react-icons/pi";
import { useBookmarkStore } from "../store/useBookmarkStore";

/**
 * Controls component
 *
 * Props:
 * - prevTopic, nextTopic: topic objects (or undefined)
 * - zoom: number (percentage)
 * - handleZoomIn, handleZoomOut: functions
 * - handleTopicClick: function(topic)
 * - toggleFullScreen: function
 * - isFullscreen: boolean
 * - bookId: cover/book id (info_id) - optional until book loads
 * - contentId: topic/content id (book_id in API) - optional until a topic is selected
 *
 * This version:
 * - Ensures bookmarks are fetched on mount
 * - Derives bookmark state from the store (no duplicated local state)
 * - Handles common bookmark response shapes (info_id / cover_id / coverId / infoId)
 * - Disables the bookmark action while an operation is in progress
 * - Avoids noisy warnings unless user actually clicks before data is available
 */
export default function Controls({
  prevTopic,
  nextTopic,
  zoom,
  handleZoomIn,
  handleZoomOut,
  handleTopicClick,
  toggleFullScreen,
  isFullscreen,
  bookId, // expected cover/info id
  contentId, // expected topic/content id
   onBookmarkClick,
}) {
  const {
    bookmarks = [],
    addBookmark,
    removeBookmark,
    fetchBookmarks,
    loading: storeLoading,
  } = useBookmarkStore();

  // Local busy flag for bookmark toggle requests
  const [busy, setBusy] = useState(false);

  // Ensure bookmarks are loaded on mount (store handles missing user gracefully)
  useEffect(() => {
    fetchBookmarks().catch((e) => {
      // don't throw — just log so UI still works
      // console.debug("fetchBookmarks failed in Controls", e);
    });
  }, [fetchBookmarks]);

  // Utility: read possible cover/info id keys from bookmark object
  const _getCoverIdFromBookmark = (b) =>
    b?.cover_id ??
    b?.info_id ??
    b?.coverId ??
    b?.infoId ??
    b?.coverid ??
    b?.infoid ??
    null;

  // Derive the active bookmark object for the current contentId & bookId (if available)
  const activeBookmark = useMemo(() => {
    if (!Array.isArray(bookmarks) || !contentId) return null;
    return (
      bookmarks.find((b) => {
        const bBookId = b?.book_id ?? b?.bookId ?? b?.bookid ?? null;
        if (bBookId == null) return false;
        if (String(bBookId) !== String(contentId)) return false;

        // If we have a cover/book id to match, prefer matching it; otherwise ignore
        if (bookId) {
          const bCover = _getCoverIdFromBookmark(b);
          if (bCover == null) return false;
          return String(bCover) === String(bookId);
        }
        return true;
      }) || null
    );
  }, [bookmarks, contentId, bookId]);

  const isBookmarked = Boolean(activeBookmark);


  // Determine UI disabled state for bookmark button
  const bookmarkDisabled = busy || storeLoading || !contentId || !bookId;

  return (
    <div className="flex justify-between items-center p-4">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleTopicClick(prevTopic)}
          disabled={!prevTopic}
          className="text-xl"
          title="Previous topic"
        >
          <PiRewindLight
            className={`${
              !prevTopic
                ? "text-gray-400 cursor-not-allowed"
                : "cursor-pointer text-black"
            }`}
          />
        </button>

        <button
          onClick={() => handleTopicClick(nextTopic)}
          disabled={!nextTopic}
          className="text-xl"
          title="Next topic"
        >
          <PiFastForwardLight
            className={`${
              !nextTopic
                ? "text-gray-400 cursor-not-allowed"
                : "cursor-pointer text-black"
            }`}
          />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-5 text-lg">
        <button onClick={handleZoomOut} title="Zoom Out" className="p-1">
          <FiZoomOut className="cursor-pointer" />
        </button>

        <span className="text-lg select-none">{zoom}%</span>

        <button onClick={handleZoomIn} title="Zoom In" className="p-1">
          <FiZoomIn className="cursor-pointer" />
        </button>

           {/* Bookmark toggle */}
        <button
          onClick={onBookmarkClick} // <-- call parent function
          title="Add / Remove Bookmark"
          className="p-1"
        >
          <FiBookmark className="cursor-pointer text-gray-500" size={20} />
        </button>


        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullScreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="p-1"
        >
          {isFullscreen ? (
            <FiMinimize className="cursor-pointer" />
          ) : (
            <FiMaximize className="cursor-pointer" />
          )}
        </button>
      </div>
    </div>
  );
}
