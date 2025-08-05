import React from "react";
import { FaSearch, FaChevronLeft, FaChevronRight, FaExpand, FaCompress, FaInfoCircle } from "react-icons/fa";

export default function Sidebar({
  bookInfo,
  chapters,
  expandedChapter,
  toggleChapter,
  handleTopicClick,
  selectedTopic,
  searchQuery,
  setSearchQuery,
  isSidebarFullscreen,
  toggleSidebarFullScreen,
}) {
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

  const displayedChapters = searchQuery ? searchFilter(chapters) : chapters;

  return (
    <div className={`shadow-xl p-4 flex flex-col rounded-xl bg-white z-50 ${isSidebarFullscreen ? "fixed inset-0 w-full h-full" : "w-[28%]"}`}>
      <div className="relative mb-4 h-10 flex items-center justify-center border-b pb-2">
        <div className="absolute left-0 flex items-center pl-2 space-x-2">
          <FaInfoCircle className="text-gray-500" title="Book Info" />
        </div>
        <h2 className="font-bold text-lg text-center truncate max-w-[70%]">
          {bookInfo?.title}
        </h2>
        <div className="absolute right-0 flex items-center pr-2">
          <button onClick={toggleSidebarFullScreen} title="Sidebar Fullscreen">
            {isSidebarFullscreen ? <FaCompress /> : <FaExpand />}
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
        {displayedChapters.map((ch) => (
          <div key={ch.id}>
            <button
              onClick={() => toggleChapter(ch.id)}
              className="w-full text-left font-semibold py-2 border-b flex justify-between items-center"
            >
              {ch.title}
              {expandedChapter === ch.id ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
            {expandedChapter === ch.id && renderTopics(ch.children || [])}
          </div>
        ))}
      </div>
    </div>
  );
}