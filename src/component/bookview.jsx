// Updated BookReaderr.js with CitationContent integration

import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
  FaBookmark,
  FaInfoCircle,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../api/Instance";
import DOMPurify from "dompurify";
import CitationContent from "../component/book_reader/CitationContent"; // <-- Import CitationContent component

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com";

const getImageUrl = (url) => {
  if (!url)
    return "https://dummyimage.com/300x200/cccccc/000000&text=No+Cover";
  return url.startsWith("http") ? url : `${IMAGE_BASE_URL}${url}`;
};

const fixRelativeLinks = (htmlString) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  const links = tempDiv.querySelectorAll("a");
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!href || href === "#") {
      a.removeAttribute("href");
      a.style.pointerEvents = "none";
      a.style.color = "gray";
      a.style.textDecoration = "none";
      a.title = "This link is inactive";
      return;
    }
    if (!href.startsWith("http")) {
      a.setAttribute("href", `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`);
    }
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
  return tempDiv.innerHTML;
};

export default function BookReaderr() {
  const { id: bookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRefs = useRef({});
  const contentContainerRef = useRef();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, contentRes] = await Promise.all([
          api.get(`/ebook/cover/${bookId}`),
          api.get(`/ebook-content/${bookId}`),
        ]);
        setBookInfo(bookRes.data?.responsedata || null);
        setChapters(contentRes.data);
      } catch (error) {
        console.error("Error loading book data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookId]);

  const toggleChapter = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const flattenTopics = (nodes = []) =>
    nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);

  const flatTopics = flattenTopics(chapters);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    const ref = contentRefs.current[topic.id];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(200, z + 10));
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 10));
  const toggleFullScreen = () => setIsFullscreen((fs) => !fs);

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

  const renderTopics = (topics) => (
    <ul className="pl-4 py-2 space-y-1">
      {topics.map((topic) => (
        <li key={topic.id}>
          <button
            onClick={() => handleTopicClick(topic)}
            className={`block w-full text-left px-2 py-1 rounded ${
              selectedTopic?.id === topic.id ? "bg-yellow-300 font-bold" : "hover:bg-yellow-100"
            }`}
          >
            {topic.header}
            {topic.title && <div className="text-xs text-gray-500 italic ml-4">— {topic.title}</div>}
          </button>
          {topic.children && renderTopics(topic.children)}
        </li>
      ))}
    </ul>
  );

  const findChapterForTopic = (topicId, chaptersList) => {
    for (const chapter of chaptersList) {
      const allTopics = flattenTopics([chapter]);
      if (allTopics.some((t) => t.id === topicId)) {
        return chapter;
      }
    }
    return null;
  };

  const currentChapter = selectedTopic ? findChapterForTopic(selectedTopic.id, chapters) : null;

  return (
    <div className={`flex h-screen ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {!isFullscreen && (
        <div className="w-[35%] shadow-xl p-4 flex flex-col rounded-xl">
          <div className="relative mb-4 h-10 flex items-center justify-center border-b pb-2">
            <div className="absolute left-0 flex items-center pl-2">
              <FaInfoCircle className="text-gray-500" title="Book Info" />
            </div>
            <h2 className="font-bold text-lg text-center truncate max-w-[70%]">
              {bookInfo?.title}
            </h2>
            <div className="absolute right-0 flex items-center pr-2">
              <button onClick={toggleFullScreen} title="Fullscreen">
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search inside ${bookInfo?.title || "this book"}`}
              className="w-full border rounded p-2 pr-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-2.5 right-2 text-gray-400" />
          </div>

          <div className="overflow-y-auto flex-grow">
            {(searchQuery ? searchFilter(chapters) : chapters).map((ch) => (
              <div key={ch.id}>
                <button
                  onClick={() => toggleChapter(ch.id)}
                  className="w-full text-left font-semibold py-2 border-b flex justify-between items-center"
                >
                  {ch.title}
                  {expandedChapter === ch.id ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
                {expandedChapter === ch.id && renderTopics(searchQuery ? ch.children : ch.children || [])}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col ml-2 rounded-2xl shadow-xl" style={{ width: isFullscreen ? "100%" : "63%" }}>
        {selectedTopic && (
          <div className="header-top-section border-b rounded-2xl shadow-xl mt-2">
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center space-x-2">
                <button onClick={() => handleTopicClick(prevTopic)} disabled={!prevTopic}>
                  <FaChevronLeft className={`${!prevTopic ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}`} />
                </button>
                <button onClick={() => handleTopicClick(nextTopic)} disabled={!nextTopic}>
                  <FaChevronRight className={`${!nextTopic ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"}`} />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <FaSearchMinus onClick={handleZoomOut} className="cursor-pointer" />
                <span>{zoom}%</span>
                <FaSearchPlus onClick={handleZoomIn} className="cursor-pointer" />
                <FaBookmark className="cursor-pointer" />
                <button onClick={toggleFullScreen}>
                  {isFullscreen ? <FaCompress className="cursor-pointer" /> : <FaExpand className="cursor-pointer" />}
                </button>
              </div>
            </div>

            <div className="bg-yellow-400 text-black font-bold text-center py-5 rounded-xl ml-2 mr-2">
              {currentChapter && (
                <div className="text-xl font-medium text-gray-800 mt-1 ">
                  {currentChapter.title}
                </div>
              )}
            </div>
            <div className="text-center font-semibold text-lg py-3 ">
              {selectedTopic.header}
            </div>
          </div>
        )}

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
              <h2 className="text-2xl font-bold mb-2">{selectedTopic.header}</h2>
              {selectedTopic.title && (
                <h3 className="text-lg italic text-gray-600 mb-4">{selectedTopic.title}</h3>
              )}
              <CitationContent node={selectedTopic} selectedNodeId={selectedTopic.id} />
              {/* Render citations instead of static content */}
            </div>
          ) : (
            <img
              src={getImageUrl(bookInfo?.cover)}
              alt="Book Cover"
              className="max-h-[80vh] object-contain rounded shadow-lg mx-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
}
