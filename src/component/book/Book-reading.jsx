// src/pages/Reading.jsx
import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const chapters = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Chapter ${i + 1}`,
  description: `Description for Chapter ${i + 1}`,
  topics: Array.from({ length: 5 }, (_, j) => ({
    id: (i + 1) * 100 + j,
    title: `Topic ${j + 1} ~ Subtitle of Topic ${j + 1}`,
    content: `### Heading for Topic ${j + 1}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  })),
}));

export default function BookReading() {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const toggleChapter = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const flatTopics = chapters.flatMap((ch) => ch.topics);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
      {/* Sidebar */}
      <aside className="md:w-1/3 lg:w-1/4 bg-white shadow-md px-4 py-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-bold text-black">
            Ikigai - The Japanese Secret to a Long and Happy Life
          </h1>
          <button className="text-gray-500 text-sm" title="Fullscreen">
            ⛶
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search inside Ikigai"
            className="w-full px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring"
          />
        </div>

        <ul className="space-y-2 text-sm">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex justify-between items-center px-2 py-2 font-semibold text-left border-b text-black"
              >
                <span>
                  {chapter.title} ~ {chapter.description}
                </span>
                <span>
                  {expandedChapter === chapter.id ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </button>
              {expandedChapter === chapter.id && (
                <ul className="pl-4 py-2 space-y-1">
                  {chapter.topics.map((topic) => (
                    <li key={topic.id}>
                      <button
                        onClick={() => handleTopicClick(topic)}
                        className={`block w-full text-left px-3 py-2 rounded ${
                          selectedTopic?.id === topic.id
                            ? "bg-yellow-400 text-black"
                            : "hover:bg-yellow-100"
                        }`}
                      >
                        {topic.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Reader Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto relative">
        {selectedTopic ? (
          <div className="space-y-4">
            {/* Navigation Arrows */}
            <div className="flex space-x-2 mb-5">
              <button
                className="p-2 rounded disabled:opacity-50"
                onClick={() => handleTopicClick(prevTopic)}
                disabled={!prevTopic}
              >
                <FaChevronLeft />
              </button>
              <button
                className="p-2 rounded disabled:opacity-50"
                onClick={() => handleTopicClick(nextTopic)}
                disabled={!nextTopic}
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Book Header */}
            <div className="text-center bg-yellow-500 p-4 rounded mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ikigai - The Japanese Secret to a Long and Happy Life
              </h1>
              <h2 className="text-md font-semibold text-yellow-800 mb-4">
                {selectedTopic.title}
              </h2>
            </div>

            {/* Topic Content */}
            <div className="bg-white p-6 rounded shadow">
              {selectedTopic.content.split("\n\n").map((para, index) => (
                <p
                  key={index}
                  className={`mb-4 ${
                    index === 0 ? "text-lg font-semibold" : "text-gray-800"
                  }`}
                >
                  {para.replace("### ", "")}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <img
              src="https://5.imimg.com/data5/SELLER/Default/2021/8/LW/QJ/WS/135742206/ikagai-png-500x500.png"
              alt="Ikigai Book Cover"
              className="max-h-[500px] object-contain transition-transform duration-500 hover:animate-spin-slow"
            />
          </div>
        )}
      </main>
    </div>
  );
}
