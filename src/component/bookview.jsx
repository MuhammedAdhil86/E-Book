//bookreader
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/Instance";
import CitationContent from "../component/book_reader/CitationContent";
import BookViewMobile from "../responsive/bookviewmobile";
import Controls from "../ui/controls";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Sidebar from "../component/book_reader/Sidebar"; // <-- new import

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const FALLBACK_IMAGE =
  "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436194631i/2585989.jpg";

const getImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  return url.startsWith("http")
    ? url
    : `${IMAGE_BASE_URL}${url.replace(/^\/+/, "")}`;
};

export default function BookReader() {
  const { id: bookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarFullscreen, setIsSidebarFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRefs = useRef({});
  const contentContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCitation, setShowCitation] = useState(false);
  const [citationData, setCitationData] = useState({ title: "", body: "" });

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
  const toggleSidebarFullScreen = () => setIsSidebarFullscreen((fs) => !fs);

  const searchFilter = (topics) =>
    topics
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

  const renderTopics = (topics) => (
    <ul className="pl-4 py-2 space-y-1">
      {topics.map((topic) => (
        <li key={topic.id}>
          <button
            onClick={() => handleTopicClick(topic)}
            className={`block w-full text-left px-2 py-1 rounded ${
              selectedTopic?.id === topic.id
                ? "bg-yellow-300 font-bold"
                : "hover:bg-yellow-100"
            }`}
          >
            {topic.header}
            {topic.title && (
              <div className="text-xs text-gray-500 italic ml-4">
                — {topic.title}
              </div>
            )}
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

  const currentChapter = selectedTopic
    ? findChapterForTopic(selectedTopic.id, chapters)
    : null;

  // ---------------------- BOOKMARK LOGIC ----------------------
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
        info_id: bookId,
      });
      toast.success("Bookmark added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add bookmark");
    }
  };
  // -------------------------------------------------------------

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden w-full h-screen overflow-hidden">
        <BookViewMobile
          bookData={bookInfo}
          chapters={chapters}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          selectedTitle={null}
          setSelectedTitle={() => {}}
          setShowCitation={setShowCitation}
          setCitationData={setCitationData}
        />
        {showCitation && (
          <CitationContent
            title={citationData.title}
            body={citationData.body}
            onClose={() => setShowCitation(false)}
          />
        )}
      </div>

      {/* Desktop View */}
      <div
        className={`hidden md:flex h-screen ${
          isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
        }`}
      >
        {/* Sidebar */}
        {!isFullscreen && (
          <Sidebar
            bookInfo={bookInfo}
            chapters={searchQuery ? searchFilter(chapters) : chapters}
            expandedChapter={expandedChapter}
            toggleChapter={toggleChapter}
            renderTopics={renderTopics}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSidebarFullscreen={isSidebarFullscreen}
            toggleSidebarFullScreen={toggleSidebarFullScreen}
          />
        )}

        {/* Main Content Area */}
        <div
          className="flex flex-col ml-2 rounded-2xl shadow-xl"
          style={{ width: isFullscreen ? "100%" : "75%" }}
        >
          {selectedTopic && (
            <div className="header-top-section border-b rounded-2xl shadow-xl mt-2">
              {/* ✅ Controls */}
              <Controls
                prevTopic={prevTopic}
                nextTopic={nextTopic}
                zoom={zoom}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleTopicClick={handleTopicClick}
                toggleFullScreen={toggleFullScreen}
                isFullscreen={isFullscreen}
                bookId={bookInfo?.id}
                contentId={selectedTopic?.id}
                onBookmarkClick={handleAddBookmark}
              />

              {/* Chapter info */}
              <div className="bg-yellow-400 text-black font-bold text-center py-3 rounded-xl ml-2 mr-2">
                {currentChapter && (
                  <div className="text-xl font-medium text-gray-800 mt-1">
                    {currentChapter.title}
                  </div>
                )}
              </div>

              {/* Topic header */}
              <div className="text-center font-semibold text-lg py-3 ">
                {selectedTopic.title} ~ {selectedTopic.header}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div
            ref={contentContainerRef}
            className="p-6 overflow-y-auto text-center flex-grow"
          >
            {loading ? (
              <p className="text-gray-500">Loading book...</p>
            ) : selectedTopic ? (
              <div
                ref={(el) => (contentRefs.current[selectedTopic.id] = el)}
                className="text-left max-w-3xl mx-auto bg-white p-6 rounded shadow"
                style={{
                  fontSize: `${zoom}%`,
                  lineHeight: `${1.5 + (zoom - 100) / 200}em`,
                }}
              >
                <h2 className="text-2xl font-bold mb-2">
                  {selectedTopic.header}
                </h2>
                {selectedTopic.title && (
                  <h3 className="text-lg italic text-gray-600 mb-4">
                    {selectedTopic.title}
                  </h3>
                )}

                <CitationContent
                  node={selectedTopic}
                  selectedNodeId={selectedTopic.id}
                />
              </div>
            ) : (
              <img
                src={getImageUrl(bookInfo?.cover_image)}
                alt={bookInfo?.title || "Book Cover"}
                className="max-h-[80vh] object-contain rounded shadow-lg mx-auto"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
