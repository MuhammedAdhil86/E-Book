


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
import html2canvas from "html2canvas";

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
 const downloadFullBookPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      
      // Add cover page
      doc.addImage(bookInfo?.responsedata?.cover_image || "/bookimage.jpg", 'JPEG', 15, 40, 180, 180);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text(bookInfo?.responsedata?.title || "Untitled Book", 105, 30, { align: 'center' });
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text(`by ${bookInfo?.responsedata?.author || "Unknown Author"}`, 105, 230, { align: 'center' });
      
      // Add index page
      doc.addPage();
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Table of Contents", 105, 20, { align: 'center' });
      doc.setFontSize(12);
      
      let y = 40;
      const addIndexEntry = (node, indent = 0) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        const text = `${node.numbering ? node.numbering + ' ' : ''}${node.header || node.title || ''}`;
        doc.text(' '.repeat(indent * 4) + text, 20, y);
        y += 7;
        
        if (node.children) {
          node.children.forEach(child => addIndexEntry(child, indent + 1));
        }
      };
      
      chapters.forEach(chapter => {
        addIndexEntry(chapter);
        if (chapter.children) {
          chapter.children.forEach(child => addIndexEntry(child, 1));
        }
      });
      
      // Add content pages with proper formatting
      const addContentPage = (node) => {
        // Start a new page for each node
        let currentPage = doc;
        let pageStarted = false;
        let yPosition = 20;
        
        const addToPDF = (text, fontSize = 10, isBold = false, isItalic = false) => {
          if (!pageStarted) {
            currentPage.addPage();
            currentPage.setFontSize(16);
            currentPage.setFont("helvetica", "bold");
            
            // Chapter title
            const title = `${node.numbering ? node.numbering + ' ' : ''}${node.header || node.title || ''}`;
            const titleLines = currentPage.splitTextToSize(title, 180);
            titleLines.forEach((line, i) => {
              currentPage.text(line, 20, yPosition + (i * 7));
            });
            yPosition += titleLines.length * 7 + 5;
            
            // Subtitle if exists
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
        
        if (node.draft_content || node.verified_content) {
          const content = node.draft_content || node.verified_content;
          const temp = document.createElement("div");
          temp.innerHTML = content;
          const plainText = temp.innerText.replace(/\s+/g, " ").trim();
          addToPDF(plainText);
        } else {
          addToPDF("No content available");
        }
        
        // Add border to each page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.rect(10, 10, 190, 277);
        }
        
        // Recursively add child content
        if (node.children) {
          node.children.forEach(child => addContentPage(child));
        }
      };
      
      // Add all content pages
      chapters.forEach(chapter => {
        addContentPage(chapter);
        if (chapter.children) {
          chapter.children.forEach(child => addContentPage(child));
        }
      });
      
      doc.save(`${bookInfo?.responsedata?.title || "book"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
    if (!rawHTML) return "";
    const doc = new DOMParser().parseFromString(rawHTML, "text/html");
    const walk = (n) => {
      Array.from(n.childNodes).forEach((c) => {
        if (c.nodeType === 1) {
          for (const attr of Array.from(c.attributes)) {
            const name = attr.name.toLowerCase();
            if (
              name.startsWith("on") ||
              (["href", "src", "action"].includes(name) &&
                /^(javascript:|data:)/i.test(attr.value))
            ) {
              c.removeAttribute(attr.name);
            }
          }
          walk(c);
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

  const renderA4Pages = () => {
    if (!selectedTopic?.draft_content) return null;

    const contentLength = selectedTopic.draft_content.length;
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
              pageBreakAfter: pageIndex < pageCount - 1 ? "always" : "auto"
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

            <div className="text-gray-900 text-justify leading-relaxed">
              {pageIndex === 0 ? (
                parseDraftContent(selectedTopic.draft_content)
              ) : (
                <div dangerouslySetInnerHTML={{ __html: cleanHTML(selectedTopic.draft_content) }} />
              )}
            </div>

            {pageIndex < pageCount - 1 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Continued on next page...
              </div>
            )}
          </div>
        ))}
      </div>
    );
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

            <div className="flex justify-center">
              {renderA4Pages()}
            </div>

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





