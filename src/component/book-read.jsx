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

// ✅ Helper to get full image URL
const getImageUrl = (url) => {
  if (!url) return "/bookimage.jpg";
  return url.startsWith("http") ? url : `${IMAGE_BASE_URL}${url}`;
};

// ✅ Fix relative links inside verified_content
const fixRelativeLinks = (htmlString) => {
  if (typeof window === "undefined") return htmlString;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const links = tempDiv.querySelectorAll("a");
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";

    if (!href || href === "#") {
      // Remove href and make it non-clickable
      a.removeAttribute("href");
      a.style.pointerEvents = "none";
      a.style.color = "gray";
      a.style.textDecoration = "none";
      a.title = "This link is inactive";
      return;
    }

    // Fix relative links
    if (!href.startsWith("http")) {
      a.setAttribute("href", `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`);
    }

    // Open in new tab safely
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
  const [popupData, setPopupData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  const flattenTopics = (nodes = []) => nodes.flatMap((n) => [n, ...flattenTopics(n.children || [])]);
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

  const renderA4Pages = () => {
    if (!selectedTopic?.verified_content) return null;

    const content = fixRelativeLinks(selectedTopic.verified_content);
    const contentLength = content.length;
    const charsPerPage = 3000;
    const pageCount = Math.max(1, Math.ceil(contentLength / charsPerPage));

    return (
      <div className="space-y-4">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white shadow-lg p-8 mx-auto border border-gray-300"
            style={{
              width: "210mm",
              minHeight: "297mm",
              pageBreakAfter: pageIndex < pageCount - 1 ? "always" : "auto",
            }}
          >
            {pageIndex === 0 && (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedTopic.numbering}. {selectedTopic.header}
                </h2>
                {selectedTopic.title && (
                  <h3 className="text-lg italic text-gray-600 mb-6">{selectedTopic.title}</h3>
                )}
              </>
            )}

            <div
              className="text-gray-900 text-justify leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content, { ADD_ATTR: ["target", "rel"] }),
              }}
            />

            {pageIndex < pageCount - 1 && (
              <div className="mt-4 text-center text-sm text-gray-500">Continued on next page...</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const downloadFullBookPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const coverImageUrl = getImageUrl(bookInfo?.responsedata?.cover_image);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = coverImageUrl;

      await new Promise((resolve) => {
        img.onload = () => {
          doc.addImage(img, "JPEG", 15, 40, 180, 180);
          resolve();
        };
        img.onerror = () => resolve();
      });

      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(bookInfo?.responsedata?.title || "Untitled Book", 105, 30, { align: "center" });
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text(`by ${bookInfo?.responsedata?.author || "Unknown Author"}`, 105, 230, { align: "center" });

      doc.addPage();
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Table of Contents", 105, 20, { align: "center" });
      doc.setFontSize(12);

      let y = 40;
      const addIndexEntry = (node, indent = 0) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        const text = `${node.numbering ? node.numbering + " " : ""}${node.header || node.title || ""}`;
        doc.text(" ".repeat(indent * 4) + text, 20, y);
        y += 7;
        if (node.children) {
          node.children.forEach((child) => addIndexEntry(child, indent + 1));
        }
      };
      chapters.forEach((chapter) => addIndexEntry(chapter));

      const addContentPage = (node) => {
        let currentPage = doc;
        let pageStarted = false;
        let yPosition = 20;

        const addToPDF = (text, fontSize = 10, isBold = false, isItalic = false) => {
          if (!pageStarted) {
            currentPage.addPage();
            currentPage.setFontSize(16);
            currentPage.setFont("helvetica", "bold");
            const title = `${node.numbering ? node.numbering + " " : ""}${node.header || node.title || ""}`;
            const titleLines = currentPage.splitTextToSize(title, 180);
            titleLines.forEach((line, i) => {
              currentPage.text(line, 20, yPosition + i * 7);
            });
            yPosition += titleLines.length * 7 + 5;

            if (node.title && node.header) {
              currentPage.setFontSize(12);
              currentPage.setFont("helvetica", "italic");
              currentPage.text(node.title, 20, yPosition);
              yPosition += 7;
            }

            currentPage.setFontSize(fontSize);
            currentPage.setFont("helvetica", isBold ? "bold" : isItalic ? "italic" : "normal");
            pageStarted = true;
          }

          const lines = currentPage.splitTextToSize(text, 180);
          for (const line of lines) {
            if (yPosition > 270) {
              currentPage.addPage();
              yPosition = 20;
            }
            currentPage.text(line, 20, yPosition);
            yPosition += 7;
          }
        };

        if (node.verified_content) {
          const content = node.verified_content;
          const temp = document.createElement("div");
          temp.innerHTML = content;
          const plainText = temp.innerText.replace(/\s+/g, " ").trim();
          addToPDF(plainText);
        } else {
          addToPDF("No content available");
        }

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.rect(10, 10, 190, 277);
        }

        if (node.children) {
          node.children.forEach((child) => addContentPage(child));
        }
      };

      chapters.forEach((chapter) => addContentPage(chapter));

      doc.save(`${bookInfo?.responsedata?.title || "book"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
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
                <button
                  className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                  title="Download PDF"
                  onClick={downloadFullBookPDF}
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

            <div className="flex justify-center">{renderA4Pages()}</div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-center p-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{bookInfo?.responsedata?.title}</h1>
            <h2 className="text-lg italic text-gray-600 mb-6">{bookInfo?.responsedata?.author}</h2>
            <img
              src={getImageUrl(bookInfo?.responsedata?.cover_image)}
              alt="Book Cover"
              className="max-h-[60vh] max-w-full rounded shadow-lg border border-gray-200"
            />
          </div>
        )}
      </main>
    </div>
  );
}
