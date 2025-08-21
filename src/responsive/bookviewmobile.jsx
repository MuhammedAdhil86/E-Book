import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiZoomIn,
  FiZoomOut,
  FiBookmark,
  FiArrowLeft,
} from "react-icons/fi";
import { PiRewindLight, PiFastForwardLight } from "react-icons/pi";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../api/Instance";
import CitationContent from "../component/book_reader/CitationContent";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const FALLBACK_IMAGE =
  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436194631i/2585989.jpg";

export default function BookViewMobile({
  bookData,
  chapters,
  selectedTopic,
  setSelectedTopic,
  setShowCitation,
  setCitationData,
  loading,
}) {
  const [expandedChapters, setExpandedChapters] = useState([]); // ✅ multiple expanded chapters
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const contentContainerRef = useRef(null);
  const contentRefs = useRef({});

  // manual toggle
  const handleChapterToggle = (id) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleTopicClick = (topic) => setSelectedTopic(topic);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 50));

  const flattenTopics = (nodes = []) =>
    nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);

  const flatTopics = useMemo(() => flattenTopics(chapters), [chapters]);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  // highlight helper
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // recursive search filter
  const searchFilter = (topics) =>
    topics
      .map((topic) => {
        const children = searchFilter(topic.children || []);
        const verifiedText = topic.verified_content
          ? topic.verified_content.replace(/<[^>]*>/g, "").toLowerCase()
          : "";

        const match =
          topic.header.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (topic.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          verifiedText.includes(searchQuery.toLowerCase());

        if (match || children.length > 0) {
          return { ...topic, children, _match: match };
        }
        return null;
      })
      .filter(Boolean);

  const filteredChapters = useMemo(() => {
    if (!searchQuery) return chapters;
    return searchFilter(chapters);
  }, [searchQuery, chapters]);

  // ✅ auto expand on search term change
  useEffect(() => {
    if (!searchQuery) {
      setExpandedChapters([]);
      return;
    }
    const matchedIds = [];
    const collectMatches = (nodes) => {
      nodes.forEach((n) => {
        if (n._match || (n.children && n.children.length > 0)) {
          matchedIds.push(n.id);
        }
        if (n.children) collectMatches(n.children);
      });
    };
    collectMatches(filteredChapters);
    setExpandedChapters(matchedIds);
  }, [searchQuery, filteredChapters]);

  const getImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    return url.startsWith("http")
      ? url
      : `${IMAGE_BASE_URL}${url.replace(/^\/+/, "")}`;
  };

  const flattenAllTopics = (nodes = []) =>
    nodes.flatMap((n) => [n, ...flattenAllTopics(n.children || [])]);

  const findChapterForTopic = (topicId, chaptersList) => {
    for (const chapter of chaptersList) {
      const allTopics = flattenAllTopics([chapter]);
      if (allTopics.some((t) => t.id === topicId)) return chapter;
    }
    return null;
  };

  const currentChapter = selectedTopic
    ? findChapterForTopic(selectedTopic.id, chapters)
    : null;

  // ---------------------- BOOKMARK FUNCTION ----------------------
  const handleAddBookmark = async () => {
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
    const userId = user?.id || user?.user_id;

    if (!userId) {
      toast.error("You must be logged in to add a bookmark.");
      return;
    }
    if (!selectedTopic) {
      toast.error("Please select a topic to bookmark.");
      return;
    }

    try {
      await api.post(`/user/bookmark/create`, {
        user_id: userId,
        book_id: selectedTopic.id,
        info_id: bookData.id,
      });
      toast.success("Bookmark added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add bookmark");
    }
  };
  // ---------------------------------------------------------------

  return (
    <div className="h-screen w-full bg-white overflow-y-auto">
      {!selectedTopic ? (
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-28">
              <img
                src={getImageUrl(bookData?.cover_image)}
                alt="Book cover"
                className="w-full h-full object-fill rounded-md shadow-xl"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-black/100 rounded-full blur-md z-0"></div>
            </div>
            <div>
              <h1 className="font-semibold text-lg">{bookData?.title}</h1>
              <p className="text-gray-500 text-sm">
                Author: {bookData?.author || "Unknown"}
              </p>

              <p className="font-body text-sm text-yellow-500">
                Updated up to:{" "}
                {bookData?.last_updated_at
                  ? new Date(bookData.last_updated_at).toLocaleString("en-IN", {
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
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search contents"
              className="w-full border rounded-full px-4 py-2 pr-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute top-3 right-3 text-gray-400" />
          </div>

          {/* Contents */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Contents</h2>
            {filteredChapters.length === 0 && (
              <p className="text-gray-500 text-sm">No results found.</p>
            )}
            {filteredChapters.map((ch) => (
              <div key={ch.id} className="bg-gray-100 rounded-lg">
                <button
                  onClick={() => handleChapterToggle(ch.id)}
                  className="w-full flex justify-between items-center p-3 font-medium text-left"
                >
                  <span className="flex-1 break-words">
                    {highlightMatch(ch.title)}
                  </span>
                  {expandedChapters.includes(ch.id) ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>

                {expandedChapters.includes(ch.id) &&
                  ch.children?.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicClick(topic)}
                      className="px-4 py-2 text-left text-sm text-black border-t border-gray-200 bg-white cursor-pointer hover:bg-gray-50"
                    >
                      <div className="text-[13px] text-yellow-800 font-medium">
                        {highlightMatch(topic.header)}
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        {highlightMatch(topic.title)}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen bg-white">
          {/* Top Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => setSelectedTopic(null)}>
              <FiArrowLeft className="text-lg" />
            </button>
            <div className="flex items-center space-x-4 text-lg">
              <button onClick={() => handleTopicClick(prevTopic)} disabled={!prevTopic}>
                <PiRewindLight
                  className={`${
                    !prevTopic ? "text-gray-400 cursor-not-allowed" : "text-black"
                  }`}
                />
              </button>
              <button onClick={() => handleTopicClick(nextTopic)} disabled={!nextTopic}>
                <PiFastForwardLight
                  className={`${
                    !nextTopic ? "text-gray-400 cursor-not-allowed" : "text-black"
                  }`}
                />
              </button>
              <FiZoomOut onClick={handleZoomOut} className="cursor-pointer" />
              <span>{zoom}%</span>
              <FiZoomIn onClick={handleZoomIn} className="cursor-pointer" />
              <FiBookmark className="cursor-pointer" onClick={handleAddBookmark} />
            </div>
          </div>

          {/* Chapter Title */}
          <div className="bg-yellow-300 py-2 text-center">
            {currentChapter && (
              <div className="text-sm font-semibold text-gray-800">
                {currentChapter.title}
              </div>
            )}
            <div className="text-sm text-gray-600 font-medium">
              {selectedTopic.title} ~ {selectedTopic.header}
            </div>
          </div>

          {/* Content Area */}
          <div
            ref={contentContainerRef}
            className="p-6 overflow-y-auto text-center flex-grow"
            style={{ fontSize: `${zoom}%` }}
          >
            {loading ? (
              <p className="text-gray-500">Loading book...</p>
            ) : selectedTopic ? (
              <div
                ref={(el) => (contentRefs.current[selectedTopic.id] = el)}
                className="text-left max-w-3xl mx-auto bg-white p-6 rounded shadow"
              >
                <h2 className="text-2xl font-bold mb-2">
                  {highlightMatch(selectedTopic.header)}
                </h2>
                {selectedTopic.title && (
                  <h3 className="text-lg italic text-gray-600 mb-4">
                    {highlightMatch(selectedTopic.title)}
                  </h3>
                )}

                <CitationContent
                  node={selectedTopic}
                  selectedNodeId={selectedTopic.id}
                  setShowCitation={setShowCitation}
                  setCitationData={setCitationData}
                />
              </div>
            ) : (
              <img
                src={getImageUrl(bookData?.cover_image)}
                alt={bookData?.title || "Book Cover"}
                className="max-h-[80vh] object-contain rounded shadow-lg mx-auto"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
