import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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

export default function BookReader() {
  const { id } = useParams();
  const bookId = id;
  const [bookInfo, setBookInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef();

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const res = await axios.get(`https://mvdapi-mxjdw.ondigitalocean.app/api/ebook/cover/${bookId}`);
        setBookInfo(res.data);
      } catch (err) {
        console.error("Error fetching book info:", err);
      }
    };

    const fetchChapters = async () => {
      try {
        const res = await axios.get(`https://mvdapi-mxjdw.ondigitalocean.app/api/ebook-content/${bookId}`);
        const numbered = generateNumberedTree(res.data);
        setChapters(numbered);
      } catch (err) {
        console.error("Error fetching chapter data:", err);
      }
    };

    fetchBookInfo();
    fetchChapters();
  }, [bookId]);

  const generateNumberedTree = (nodes, prefix = []) => {
    return nodes.map((node, index) => {
      const numbering = [...prefix, index + 1].join(".");
      const numberedNode = { ...node, numbering };
      if (node.children) {
        numberedNode.children = generateNumberedTree(node.children, [...prefix, index + 1]);
      }
      return numberedNode;
    });
  };

  const toggleChapter = (id) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  const handleTopicClick = (topic) => setSelectedTopic(topic);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const toggleFullScreen = () => setIsFullscreen((prev) => !prev);

  const flattenTopics = (nodes = []) =>
    nodes.flatMap((node) => [node, ...flattenTopics(node.children || [])]);

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
            {topic.numbering}. {topic.title}
          </button>
          {topic.children && renderTopics(topic.children)}
        </li>
      ))}
    </ul>
  );

  const downloadFullBookPDF = () => {
    const printElement = document.createElement("div");
    printElement.style.width = "210mm";
    printElement.style.minHeight = "297mm";
    printElement.style.padding = "20mm";
    printElement.style.fontFamily = "Georgia, serif";
    printElement.style.lineHeight = "1.6";
    printElement.style.fontSize = "14px";
    printElement.style.color = "#000";
    printElement.style.backgroundColor = "#fff";

    // Cover Page
    const cover = document.createElement("div");
    cover.style.textAlign = "center";
    cover.style.pageBreakAfter = "always";
    cover.innerHTML = `
      <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 12px;">
        ${bookInfo?.title || "Book Title"}
      </h1>
      <h2 style="font-size: 20px; font-weight: normal; margin-bottom: 20px;">
        ${bookInfo?.author || "Author Name"}
      </h2>
      <img src="${bookInfo?.cover_image || "/bookimage.jpg"}" crossorigin="anonymous" style="max-width: 70%; height: auto;" />
    `;
    printElement.appendChild(cover);

    // Index Page
    const indexPage = document.createElement("div");
    indexPage.style.pageBreakAfter = "always";
    indexPage.innerHTML = `<h2 style="font-size: 22px; font-weight: bold; margin-bottom: 15px;">Index</h2>`;
    const indexList = document.createElement("ul");
    indexList.style.paddingLeft = "20px";
    indexList.style.listStyle = "none";

    const renderIndex = (topics, parentUl) => {
      topics.forEach((topic) => {
        const li = document.createElement("li");
        li.style.marginTop = "5px";
        li.innerText = `${topic.numbering}. ${topic.title}`;
        parentUl.appendChild(li);

        if (topic.children) {
          const childUl = document.createElement("ul");
          childUl.style.marginLeft = "20px";
          li.appendChild(childUl);
          renderIndex(topic.children, childUl);
        }
      });
    };

    chapters.forEach((ch) => {
      const chLi = document.createElement("li");
      chLi.style.marginTop = "10px";
      chLi.innerHTML = `<strong>${ch.numbering}. ${ch.title}</strong>`;
      const ul = document.createElement("ul");
      renderIndex(ch.children || [], ul);
      chLi.appendChild(ul);
      indexList.appendChild(chLi);
    });

    indexPage.appendChild(indexList);
    printElement.appendChild(indexPage);

    // Topics Content
    const renderTopicContent = (topics) => {
      topics.forEach((topic) => {
        const topicSection = document.createElement("div");
        topicSection.style.marginBottom = "20px";
        topicSection.style.border = "1px solid #ccc";
        topicSection.style.padding = "15px";
        topicSection.style.borderRadius = "6px";
        topicSection.style.pageBreakInside = "avoid";

        topicSection.innerHTML = `
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
            ${topic.numbering}. ${topic.title}
          </h3>
          <div>${topic.verified_content || ""}</div>
        `;
        printElement.appendChild(topicSection);

        if (topic.children) renderTopicContent(topic.children);
      });
    };

    chapters.forEach((chapter) => {
      const chapterHeader = document.createElement("h2");
      chapterHeader.style.fontSize = "18px";
      chapterHeader.style.fontWeight = "bold";
      chapterHeader.style.marginTop = "30px";
      chapterHeader.innerText = `${chapter.numbering}. ${chapter.title}`;
      printElement.appendChild(chapterHeader);
      renderTopicContent(chapter.children || []);
    });

    document.body.appendChild(printElement);

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename: `${bookInfo?.title || "ebook"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: true, scrollY: 0 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(printElement)
        .save()
        .then(() => {
          setTimeout(() => {
            printElement.remove();
          }, 2000);
        });
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
      <aside className={`md:w-1/4 bg-white shadow-md p-4 overflow-y-auto ${isFullscreen ? "hidden" : ""}`}>
        <h1 className="text-lg font-bold text-black mb-2">{bookInfo?.title}</h1>
        <p className="text-sm italic text-gray-600 mb-4">{bookInfo?.author}</p>

        {chapters.map((chapter) => (
          <div key={chapter.id}>
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full text-left font-semibold py-2 border-b"
            >
              {chapter.title}
              <span className="float-right">
                {expandedChapter === chapter.id ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </button>
            {expandedChapter === chapter.id && renderTopics(chapter.children || [])}
          </div>
        ))}
      </aside>

      <main className={`flex-1 px-4 py-6 overflow-y-auto ${isFullscreen ? "w-full" : ""}`}>
        {selectedTopic ? (
          <div style={{ fontSize: `${zoom}%` }} ref={contentRef}>
            <div className="flex justify-between items-center mb-3 text-black">
              <div className="flex space-x-2">
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
              <div className="flex items-center space-x-3">
                <button onClick={handleZoomOut} className="p-1">
                  <FaSearchMinus />
                </button>
                <span className="w-12 text-center">{zoom}%</span>
                <button onClick={handleZoomIn} className="p-1">
                  <FaSearchPlus />
                </button>
                <button onClick={toggleFullScreen} className="p-1" title="Fullscreen">
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
                <button onClick={downloadFullBookPDF} className="p-1" title="Download PDF">
                  <FaFilePdf />
                </button>
              </div>
            </div>

            <div className="mb-5 text-center">
              <div className="text-xl font-bold text-black">{bookInfo?.title}</div>
              <div className="text-gray-700 text-sm italic">{bookInfo?.author}</div>
            </div>

            <div className="bg-white p-6 rounded shadow border">
              <h2 className="text-2xl font-bold mb-4">{selectedTopic.numbering}. {selectedTopic.title}</h2>
              <div
                className="text-gray-800 text-justify leading-7"
                dangerouslySetInnerHTML={{ __html: selectedTopic.verified_content }}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <img
              src={bookInfo?.cover_image || "/bookimage.jpg"}
              alt="Book Cover"
              className="max-h-[500px]"
            />
          </div>
        )}
      </main>
    </div>
  );
}
