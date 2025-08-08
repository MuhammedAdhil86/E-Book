import React, { useState, useEffect, useMemo } from "react";
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
}) {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChapterToggle = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 50));

  const flattenTopics = (nodes = []) =>
    nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);

  const flatTopics = useMemo(() => flattenTopics(chapters), [chapters]);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  const searchFilter = (topics) => {
    return topics
      .map((topic) => {
        const children = searchFilter(topic.children || []);
        const match =
          topic.header.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (topic.title || "").toLowerCase().includes(searchQuery.toLowerCase());
        if (match || children.length > 0) {
          return { ...topic, children };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredChapters = useMemo(() => {
    return (searchQuery ? searchFilter(chapters) : chapters).filter(
      (ch) => ch.children?.length > 0
    );
  }, [searchQuery, chapters]);

  const getImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    return url.startsWith("http")
      ? url
      : `${IMAGE_BASE_URL}${url.replace(/^\/+/, "")}`;
  };

  const findChapterForTopic = (topicId, chaptersList) => {
    for (const chapter of chaptersList) {
      const allTopics = flattenTopics([chapter]);
      if (allTopics.some((t) => t.id === topicId)) {
        return chapter;
      }
    }
    return null;
  };

  const currentChapter = selectedTopic
    ? findChapterForTopic(selectedTopic.id, chapters)
    : null;

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
                  <span className="flex-1 break-words">{ch.title}</span>
                  {expandedChapter === ch.id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>

                {expandedChapter === ch.id &&
                  ch.children?.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicClick(topic)}
                      className="px-4 py-2 text-left text-sm text-black border-t border-gray-200 bg-white cursor-pointer hover:bg-gray-50"
                    >
                      <div className="text-[13px] text-yellow-800 font-medium">
                        {topic.header}
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        {topic.title}
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
              <button
                onClick={() => handleTopicClick(prevTopic)}
                disabled={!prevTopic}
              >
                <PiRewindLight
                  className={`${
                    !prevTopic
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black"
                  }`}
                />
              </button>
              <button
                onClick={() => handleTopicClick(nextTopic)}
                disabled={!nextTopic}
              >
                <PiFastForwardLight
                  className={`${
                    !nextTopic
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black"
                  }`}
                />
              </button>
              <FiZoomOut onClick={handleZoomOut} className="cursor-pointer" />
              <span>{zoom}%</span>
              <FiZoomIn onClick={handleZoomIn} className="cursor-pointer" />
              <FiBookmark className="cursor-pointer" />
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

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-grow text-left">
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
                width: `${10000 / zoom}%`,
              }}
              className="bg-white rounded p-4 shadow"
            >
              <h2 className="text-lg font-bold mb-2">{selectedTopic.header}</h2>
              <p className="text-sm italic text-gray-600 mb-3">
                {selectedTopic.title}
              </p>
              <CitationContent
                node={selectedTopic}
                selectedNodeId={selectedTopic.id}
                setShowCitation={setShowCitation}
                setCitationData={setCitationData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
