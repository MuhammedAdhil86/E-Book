import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
  FaFilePdf,
} from "react-icons/fa";
import api from "../api/Instance";
import jsPDF from "jspdf";
import DOMPurify from "dompurify";

const IMAGE_BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com/media/";
const BASE_URL = "https://mvdebook.blr1.digitaloceanspaces.com";

const getImageUrl = (url) => {
  if (!url) return "/bookimage.jpg";
  return url.startsWith("http") ? url : `${IMAGE_BASE_URL}${url}`;
};

const fixRelativeLinks = (htmlString) => {
  if (typeof window === "undefined") return htmlString;
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

export default function BookReader() {
  const { id: bookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRefs = useRef({});
  const contentContainerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, contentRes] = await Promise.all([
          api.get(`/ebook/cover/${bookId}`),
          api.get(`/ebook-content/${bookId}`),
        ]);
        setBookInfo(bookRes.data);
        setChapters(generateNumberedTree(contentRes.data));
      } catch (error) {
        console.error("Error loading book data:", error);
      }
    };
    fetchData();
  }, [bookId]);

  const generateNumberedTree = (nodes, prefix = []) =>
    nodes.map((node, index) => {
      const numbering = [...prefix, index + 1].join(".");
      const numberedNode = { ...node, numbering };
      if (node.children) {
        numberedNode.children = generateNumberedTree(node.children, [...prefix, index + 1]);
      }
      return numberedNode;
    });

  const toggleChapter = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    const ref = contentRefs.current[topic.id];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 50));
  const toggleFullScreen = () => setIsFullscreen((fs) => !fs);

  const flattenTopics = (nodes = []) => nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);
  const flatTopics = flattenTopics(chapters);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  useEffect(() => {
    const onScroll = () => {
      const entries = Object.entries(contentRefs.current);
      for (const [id, ref] of entries) {
        if (ref && ref.getBoundingClientRect) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < 200 && rect.bottom > 200) {
            const topic = flatTopics.find((t) => String(t.id) === id);
            if (topic) setSelectedTopic(topic);
            break;
          }
        }
      }
    };
    const container = contentContainerRef.current;
    if (container) container.addEventListener("scroll", onScroll);
    return () => container && container.removeEventListener("scroll", onScroll);
  }, [chapters]);

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
            {topic.numbering}. {topic.header}
            {topic.title && <div className="text-xs text-gray-500 italic ml-4">— {topic.title}</div>}
          </button>
          {topic.children && renderTopics(topic.children)}
        </li>
      ))}
    </ul>
  );

  const renderA4Sheets = () => (
    <div ref={contentContainerRef} className="overflow-y-auto h-[calc(100vh-4rem)] pr-4">
      {flatTopics.map((topic) => (
        <div
          key={topic.id}
          ref={(el) => (contentRefs.current[topic.id] = el)}
          className="bg-white shadow-lg p-8 mx-auto mb-6 border border-gray-300"
          style={{
            width: "210mm",
            minHeight: "297mm",
            fontSize: `${zoom}%`,
          }}
        >
          <h2 className="text-2xl font-bold mb-2">
            {topic.numbering}. {topic.header}
          </h2>
          {topic.title && <h3 className="text-lg italic text-gray-600 mb-6">{topic.title}</h3>}
          <div
            className="text-gray-900 text-justify leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(fixRelativeLinks(topic.verified_content || ""), {
                ADD_ATTR: ["target", "rel"],
              }),
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-16">
      <aside className={`md:w-1/4 bg-white shadow-md p-4 overflow-y-auto h-[calc(100vh-4rem)] ${isFullscreen ? "hidden" : ""}`}>
        {chapters.map((ch) => (
          <div key={ch.id}>
            <button
              onClick={() => toggleChapter(ch.id)}
              className="w-full text-left font-semibold py-2 border-b flex justify-between items-center"
            >
              {ch.title}
              {expandedChapter === ch.id ? <FaChevronDown /> : <FaChevronRight />}
            </button>
            {expandedChapter === ch.id && renderTopics(ch.children || [])}
          </div>
        ))}
      </aside>

      <main className={`flex-1 px-4 py-6 ${isFullscreen ? "w-full" : "overflow-hidden"}`}>
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
          <div className="flex space-x-2">
            <button className="p-2 rounded hover:bg-gray-200 disabled:opacity-50" onClick={() => handleTopicClick(prevTopic)} disabled={!prevTopic}>
              <FaChevronLeft />
            </button>
            <button className="p-2 rounded hover:bg-gray-200 disabled:opacity-50" onClick={() => handleTopicClick(nextTopic)} disabled={!nextTopic}>
              <FaChevronRight />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button onClick={handleZoomOut} className="p-1 hover:bg-gray-200 rounded">
                <FaSearchMinus />
              </button>
              <span className="w-12 text-center text-sm">{zoom}%</span>
              <button onClick={handleZoomIn} className="p-1 hover:bg-gray-200 rounded">
                <FaSearchPlus />
              </button>
            </div>
            <button onClick={toggleFullScreen} className="p-2 hover:bg-gray-200 rounded" title="Fullscreen">
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
              title="Download PDF"
              disabled={isGeneratingPDF}
            >
              <FaFilePdf />
              {isGeneratingPDF ? "Generating..." : "PDF"}
            </button>
          </div>
        </div>

        <div className="mb-6 text-center border-b pb-4">
          <h1 className="text-xl font-bold text-gray-900">{bookInfo?.responsedata?.title}</h1>
          <h2 className="text-sm italic text-gray-600">{bookInfo?.responsedata?.author}</h2>
        </div>

        {renderA4Sheets()}
      </main>
    </div>
  );
}
