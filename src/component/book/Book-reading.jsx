import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
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
import api from "../../api/Instance";

export default function BookReader() {
  const { id: bookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const contentRef = useRef();

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
    setPopupData(null);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 50));
  const toggleFullScreen = () => setIsFullscreen((fs) => !fs);

  const flattenTopics = (nodes = []) =>
    nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);
  const flatTopics = flattenTopics(chapters);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

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
            {topic.numbering}. {topic.header}
            {topic.title && (
              <div className="text-xs text-gray-500 italic ml-4">— {topic.title}</div>
            )}
          </button>
          {topic.children && renderTopics(topic.children)}
        </li>
      ))}
    </ul>
  );

  const cleanHTML = (rawHTML) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHTML, "text/html");
    const allowedTags = ["B", "I", "EM", "STRONG", "P", "BR", "UL", "OL", "LI"];

    const walk = (node) => {
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach((child) => {
        if (child.nodeType === 1) {
          // Remove disallowed tags
          if (!allowedTags.includes(child.tagName)) {
            const fragment = document.createDocumentFragment();
            while (child.firstChild) {
              fragment.appendChild(child.firstChild);
            }
            child.replaceWith(fragment);
          } else {
            walk(child);
          }
        }
      });
    };

    walk(doc.body);
    return doc.body.innerHTML;
  };

  const parseDraftContent = (html) => {
    if (!html) return null;
    const regex = /~ *@\[([^\]]+)\]~@([^~]+)~@/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(html)) !== null) {
      const before = html.slice(lastIndex, match.index);
      if (before) {
        elements.push(
          <div key={key++} className="mb-3 text-justify">
            <span dangerouslySetInnerHTML={{ __html: cleanHTML(before) }} />
          </div>
        );
      }

      const header = cleanHTML(match[1].trim());
      const body = cleanHTML(match[2].trim());

      elements.push(
        <button
          key={key++}
          className="text-blue-700 font-semibold underline hover:text-blue-900 cursor-pointer px-1"
          onClick={() => setPopupData({ header, body })}
        >
          {header}
        </button>
      );

      lastIndex = regex.lastIndex;
    }

    const after = html.slice(lastIndex);
    if (after) {
      elements.push(
        <div key={key++} className="mb-3 text-justify">
          <span dangerouslySetInnerHTML={{ __html: cleanHTML(after) }} />
        </div>
      );
    }

    return elements;
  };

  const calculatePages = (content) => {
    if (!content) return [];
    const baseCharsPerPage = 2500;
    const adjustedCharsPerPage = Math.floor(baseCharsPerPage * (zoom / 100));
    const pages = [];
    let remaining = content;
    while (remaining.length > 0) {
      const pageEnd = Math.min(adjustedCharsPerPage, remaining.length);
      pages.push(remaining.substring(0, pageEnd));
      remaining = remaining.substring(pageEnd);
    }
    return pages;
  };

  const renderA4Pages = () => {
    if (!selectedTopic?.draft_content) return null;
    const pages = calculatePages(selectedTopic.draft_content);
    return (
      <div className="space-y-4" style={{ width: "210mm" }}>
        {pages.map((pageContent, index) => (
          <div
            key={index}
            className="bg-white shadow border"
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "25mm 30mm",
              fontFamily: "Georgia, serif",
              fontSize: "13pt",
              lineHeight: "1.8",
              color: "#222",
              backgroundColor: "#fff",
              boxSizing: "border-box",
              breakInside: "avoid",
              border: "1px solid #ccc",
            }}
          >
            {index === 0 && (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedTopic.numbering}. {selectedTopic.header}
                </h2>
                {selectedTopic.title && (
                  <h3 className="text-lg italic text-gray-600 mb-6">{selectedTopic.title}</h3>
                )}
              </>
            )}
            <div className="text-gray-900 text-justify leading-relaxed">
              {parseDraftContent(pageContent)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const downloadFullBookPDF = () => {
    const container = document.createElement("div");
    container.style.width = "210mm";
    container.style.minHeight = "297mm";
    container.style.margin = "auto";
    container.style.padding = "25mm 30mm";
    container.style.boxSizing = "border-box";
    container.style.fontFamily = "Georgia, serif";
    container.style.lineHeight = "1.8";
    container.style.fontSize = "13pt";
    container.style.color = "#222";
    container.style.backgroundColor = "#fff";

    const cover = document.createElement("div");
    cover.style.pageBreakAfter = "always";
    cover.style.textAlign = "center";
    cover.innerHTML = `
      <div style="margin-top: 100px;">
        <h1 style="font-size: 30pt; font-weight: bold; margin-bottom: 30px;">${bookInfo?.responsedata?.title || "Book Title"}</h1>
        <h2 style="font-size: 18pt; font-weight: normal; margin-bottom: 50px;">${bookInfo?.responsedata?.author || "Author"}</h2>
        <img src="${bookInfo?.responsedata?.cover_image || "/bookimage.jpg"}" style="max-width: 70%; height: auto;" />
      </div>
    `;
    container.appendChild(cover);

    const index = document.createElement("div");
    index.style.pageBreakAfter = "always";
    index.style.textAlign = "center";
    index.innerHTML = `
      <div style="margin-top: 80px;">
        <img src="${bookInfo?.responsedata?.cover_image || "/bookimage.jpg"}" style="max-width: 70%; height: auto; opacity: 0.5;" />
      </div>
    `;
    container.appendChild(index);

    const renderTopic = (topic) => {
      const topicSection = document.createElement("div");
      topicSection.style.marginBottom = "25px";
      topicSection.style.pageBreakInside = "avoid";
      topicSection.innerHTML = `
        <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 10px;">${topic.numbering}. ${topic.header}</h3>
        <div style="font-size: 12pt; font-style: italic; margin-bottom: 10px;">${topic.title || ""}</div>
        <div style="font-size: 11pt; text-align: justify;">${cleanHTML(topic.draft_content)}</div>
      `;
      container.appendChild(topicSection);
      (topic.children || []).forEach(renderTopic);
    };

    chapters.forEach((chapter) => {
      const chapterHeader = document.createElement("div");
      chapterHeader.style.pageBreakBefore = "always";
      chapterHeader.innerHTML = `<h2 style="font-size: 16pt; font-weight: bold;">${chapter.numbering}. ${chapter.title}</h2>`;
      container.appendChild(chapterHeader);
      (chapter.children || []).forEach(renderTopic);
    });

    document.body.appendChild(container);

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename: `${bookInfo?.responsedata?.title || "ebook"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(container)
        .save()
        .then(() => container.remove());
    }, 600);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-16">
      <aside className={`md:w-1/4 bg-white shadow-md p-4 overflow-y-auto ${isFullscreen ? "hidden" : ""}`}>
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

      <main className={`flex-1 px-4 py-6 overflow-y-auto ${isFullscreen ? "w-full" : ""}`}>
        {selectedTopic ? (
          <div style={{ fontSize: `${zoom}%` }} ref={contentRef}>
            <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded-lg">
              <div className="flex space-x-2">
                <button
                  className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => handleTopicClick(prevTopic)}
                  disabled={!prevTopic}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => handleTopicClick(nextTopic)}
                  disabled={!nextTopic}
                >
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
                <button onClick={downloadFullBookPDF} className="p-2 hover:bg-gray-200 rounded" title="Download PDF">
                  <FaFilePdf />
                </button>
              </div>
            </div>

            <div className="mb-6 text-center border-b pb-4">
              <h1 className="text-xl font-bold text-gray-900">{bookInfo?.responsedata?.title}</h1>
              <h2 className="text-sm italic text-gray-600">{bookInfo?.responsedata?.author}</h2>
            </div>

            <div className="flex justify-center">{renderA4Pages()}</div>

            {popupData && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
                <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-blue-200">
                  <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-blue-100 relative">
                    <h3 className="text-lg font-semibold text-blue-800">{popupData.header}</h3>
                    <button
                      className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
                      onClick={() => setPopupData(null)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="p-6 text-gray-700 leading-relaxed whitespace-pre-line">
                    {popupData.body}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-center p-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{bookInfo?.responsedata?.title}</h1>
            <h2 className="text-lg italic text-gray-600 mb-6">{bookInfo?.responsedata?.author}</h2>
            <img
              src={bookInfo?.responsedata?.cover_image || "/bookimage.jpg"}
              alt="Book Cover"
              className="max-h-[60vh] max-w-full rounded shadow-lg border border-gray-200"
            />
          </div>
        )}
      </main>
    </div>
  );
}
