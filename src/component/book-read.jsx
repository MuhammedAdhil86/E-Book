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
import api from "../api/Instance";

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
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHTML, "text/html");
    const allowedTags = ["B", "I", "EM", "STRONG", "P", "BR", "UL", "OL", "LI", "SPAN"];

    const walk = (node) => {
      const childNodes = Array.from(node.childNodes);
      childNodes.forEach((child) => {
        if (child.nodeType === 1) {
          if (!allowedTags.includes(child.tagName)) {
            const fragment = document.createDocumentFragment();
            while (child.firstChild) {
              fragment.appendChild(child.firstChild);
            }
            child.replaceWith(fragment);
          } else {
            if (child.tagName !== "A") {
              const attributes = Array.from(child.attributes);
              attributes.forEach(attr => {
                child.removeAttribute(attr.name);
              });
            }
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

  const renderA4Pages = () => {
    if (!selectedTopic?.draft_content) return null;
    
    // Calculate approximate number of A4 pages needed based on content length
    const contentLength = selectedTopic.draft_content.length;
    const charsPerPage = 3000; // Approximate characters per A4 page
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

  const downloadFullBookPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a container for the PDF content
      const element = document.createElement("div");
      element.id = "pdf-export-container";
      element.style.width = "210mm";
      element.style.margin = "0 auto";
      element.style.padding = "0";
      element.style.fontFamily = "'Georgia', serif";
      element.style.fontSize = "12pt";
      element.style.lineHeight = "1.6";
      element.style.color = "#333";

      // Add cover page with perfect spacing
      const coverPage = document.createElement("div");
      coverPage.style.pageBreakAfter = "always";
      coverPage.style.height = "297mm";
      coverPage.style.display = "flex";
      coverPage.style.flexDirection = "column";
      coverPage.style.justifyContent = "center";
      coverPage.style.alignItems = "center";
      coverPage.style.padding = "20mm";
      coverPage.style.textAlign = "center";
      coverPage.innerHTML = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <h1 style="font-size: 28pt; font-weight: bold; margin-bottom: 15pt; line-height: 1.3;">
            ${bookInfo?.responsedata?.title || "Book Title"}
          </h1>
          <h2 style="font-size: 18pt; margin-bottom: 30pt; color: #555;">
            ${bookInfo?.responsedata?.author || "Author"}
          </h2>
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
          <img src="${bookInfo?.responsedata?.cover_image || "/bookimage.jpg"}" 
               style="max-width: 60%; max-height: 60%; object-fit: contain;" 
               onerror="this.src='/bookimage.jpg'"
               alt="Book Cover" />
        </div>
      `;
      element.appendChild(coverPage);

      // Add table of contents with professional spacing
      const tocPage = document.createElement("div");
      tocPage.style.pageBreakAfter = "always";
      tocPage.style.padding = "25mm";
      tocPage.innerHTML = `
        <h2 style="font-size: 20pt; text-align: center; margin-bottom: 15mm; border-bottom: 1px solid #ddd; padding-bottom: 5mm;">
          Table of Contents
        </h2>
        <div style="column-count: 2; column-gap: 20mm; column-fill: auto;">
          ${generateTOC(chapters)}
        </div>
      `;
      element.appendChild(tocPage);

      // Add all chapters and sections with perfect typography
      chapters.forEach((chapter) => {
        const chapterDiv = document.createElement("div");
        chapterDiv.style.pageBreakBefore = "always";
        chapterDiv.style.padding = "20mm 25mm 15mm";
        
        chapterDiv.innerHTML = `
          <h2 style="font-size: 22pt; font-weight: bold; 
              margin-bottom: 10mm; border-bottom: 1px solid #eee; 
              padding-bottom: 5mm;">
            ${chapter.numbering}. ${chapter.title}
          </h2>
        `;
        element.appendChild(chapterDiv);

        if (chapter.children && chapter.children.length > 0) {
          chapter.children.forEach((topic) => {
            const topicDiv = document.createElement("div");
            topicDiv.className = "topic-content";
            topicDiv.style.marginBottom = "8mm";
            topicDiv.style.pageBreakInside = "avoid";
            
            topicDiv.innerHTML = `
              <h3 style="font-size: 16pt; font-weight: bold; 
                  margin-bottom: 4mm; color: #444;">
                ${topic.numbering}. ${topic.header}
              </h3>
              ${topic.title ? `
                <div style="font-style: italic; margin-bottom: 4mm; color: #666;">
                  ${topic.title}
                </div>
              ` : ''}
              <div style="text-align: justify; text-indent: 1.5em; line-height: 1.6;">
                ${cleanHTML(topic.draft_content || "")}
              </div>
            `;
            
            element.appendChild(topicDiv);
          });
        }
      });

      // Append to body temporarily
      document.body.appendChild(element);

      // Generate PDF with optimized settings
      const opt = {
        margin: [15, 15, 15, 15], // T, R, B, L margins
        filename: `${bookInfo?.responsedata?.title || 'ebook'}.pdf`.replace(/[^a-z0-9]/gi, '_'),
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          letterRendering: true,
          useCORS: true,
          allowTaint: false,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          ignoreElements: (element) => {
            return element.classList?.contains('avoid-render');
          }
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          hotfixes: ["px_scaling"]
        },
        pagebreak: { 
          mode: ['css', 'avoid-all'],
          avoid: ['.topic-content', 'img', 'h2', 'h3']
        }
      };

      // Small delay to ensure all elements are ready
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const worker = html2pdf().set(opt).from(element);
      await worker.save();
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Clean up
      const element = document.getElementById("pdf-export-container");
      if (element) {
        document.body.removeChild(element);
      }
      setIsGeneratingPDF(false);
    }
  };

  const generateTOC = (nodes) => {
    let tocHTML = "";
    nodes.forEach((node) => {
      tocHTML += `
        <div style="margin-bottom: 6pt; font-weight: bold; page-break-inside: avoid;">
          ${node.numbering}. ${node.title}
        </div>
      `;
      
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          tocHTML += `
            <div style="margin-left: 10pt; margin-bottom: 4pt; page-break-inside: avoid;">
              ${child.numbering}. ${child.header}
            </div>
          `;
        });
      }
    });
    return tocHTML;
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
                  onClick={downloadFullBookPDF} 
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