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
  const contentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, contentRes] = await Promise.all([
          api.get(`/ebook/cover/${bookId}`),
          api.get(`/ebook-content/${bookId}`),
        ]);

        setBookInfo(bookRes.data);
        const numbered = generateNumberedTree(contentRes.data);
        setChapters(numbered);
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

  const handleTopicClick = (topic) => setSelectedTopic(topic);
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
    <ul className="pl-4 py-2 space-y-1  ">
      {topics.map((topic) => (
        <li key={topic.id}>
          <button
            onClick={() => handleTopicClick(topic)}
            className={`block w-full text-left px-2 py-1 rounded  ${
              selectedTopic?.id === topic.id ? "bg-yellow-300 font-bold" : "hover:bg-yellow-100"
            }`}
          >
            {topic.numbering}. {topic.header}
            {topic.header && (
              <div className="text-xs text-gray-500 italic ml-4 ">— {topic.title}</div>
            )}
          </button>
          {topic.children && renderTopics(topic.children)}
        </li>
      ))}
    </ul>
  );

  const downloadFullBookPDF = () => {
    const container = document.createElement("div");
    container.style.width = "210mm";
    container.style.minHeight = "297mm";
    container.style.padding = "20mm";
    container.style.fontFamily = "Georgia, serif";
    container.style.lineHeight = "1.6";
    container.style.fontSize = "14px";
    container.style.color = "#000";
    container.style.backgroundColor = "#fff";

    const cover = document.createElement("div");
    cover.style.pageBreakAfter = "always";
    cover.style.textAlign = "center";
    cover.innerHTML = `
      <h1 style="font-size: 32px; font-weight: bold;">${bookInfo?.responsedata?.title || "Book Title"}</h1>
      <h2 style="font-size: 18px; font-weight: normal; margin: 10px 0;">${bookInfo?.responsedata?.author || "Author"}</h2>
      <img src="${bookInfo?.responsedata?.cover_image || "/bookimage.jpg"}" crossorigin="anonymous" style="max-width: 60%; height: auto;" />
    `;
    container.appendChild(cover);

    const indexPage = document.createElement("div");
    indexPage.style.pageBreakAfter = "always";
    indexPage.innerHTML = `<h2 style="font-size: 22px; font-weight: bold;">Index</h2>`;
    const indexList = document.createElement("ul");
    indexList.style.listStyle = "none";
    indexList.style.paddingLeft = "0";

    const buildIndex = (topics, ul = indexList) => {
      topics.forEach((topic) => {
        const li = document.createElement("li");
        li.style.margin = "5px 0";
        li.innerText = `${topic.numbering}. ${topic.header}`;
        ul.appendChild(li);

        if (topic.children) {
          const subUl = document.createElement("ul");
          subUl.style.marginLeft = "20px";
          li.appendChild(subUl);
          buildIndex(topic.children, subUl);
        }
      });
    };

    chapters.forEach((chapter) => {
      const chLi = document.createElement("li");
      chLi.style.margin = "8px 0";
      chLi.innerHTML = `<strong>${chapter.numbering}. ${chapter.title}</strong>`;
      const subUl = document.createElement("ul");
      buildIndex(chapter.children || [], subUl);
      chLi.appendChild(subUl);
      indexList.appendChild(chLi);
    });

    indexPage.appendChild(indexList);
    container.appendChild(indexPage);

    const renderTopicContent = (topics) => {
      topics.forEach((topic) => {
        const section = document.createElement("div");
        section.style.pageBreakInside = "avoid";
        section.style.margin = "25px 0";

        section.innerHTML = `
          <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
            ${topic.numbering}. ${topic.header}
            ${topic.title ? `<br/><span style="font-size: 14px; font-weight: normal;">${topic.title}</span>` : ""}
          </h3>
          <div style="font-size: 14px;">${topic.verified_content || ""}</div>
        `;
        container.appendChild(section);

        if (topic.children) renderTopicContent(topic.children);
      });
    };

    chapters.forEach((ch) => {
      const chHeader = document.createElement("div");
      chHeader.style.pageBreakBefore = "always";
      chHeader.innerHTML = `<h2 style="font-size: 20px; font-weight: bold;">${ch.numbering}. ${ch.title}</h2>`;
      container.appendChild(chHeader);
      renderTopicContent(ch.children || []);
    });

    document.body.appendChild(container);

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename: `${bookInfo?.responsedata?.title || "ebook"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(container)
        .save()
        .then(() => setTimeout(() => container.remove(), 1500));
    }, 800);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-16">
      <aside className={`md:w-1/4 bg-white shadow-md p-4 overflow-y-auto ${isFullscreen ? "hidden" : ""}`}>
        {chapters.map((ch) => (
          <div key={ch.id}>
            <button
              onClick={() => toggleChapter(ch.id)}
              className="w-full text-left font-semibold py-2 border-b"
            >
              {ch.title}
              <span className="float-right">
                {expandedChapter === ch.id ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </button>
            {expandedChapter === ch.id && renderTopics(ch.children || [])}
          </div>
        ))}
      </aside>

      <main className={`flex-1 px-4 py-6 overflow-y-auto ${isFullscreen ? "w-full" : ""}`}>
        {selectedTopic ? (
          <div style={{ fontSize: `${zoom}%` }} ref={contentRef}>
            <div className="flex justify-between items-center mb-3 text-black">
              <div className="flex space-x-2">
                <button className="p-2 rounded disabled:opacity-50" onClick={() => handleTopicClick(prevTopic)} disabled={!prevTopic}>
                  <FaChevronLeft />
                </button>
                <button className="p-2 rounded disabled:opacity-50" onClick={() => handleTopicClick(nextTopic)} disabled={!nextTopic}>
                  <FaChevronRight />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={handleZoomOut} className="p-1"><FaSearchMinus /></button>
                <span className="w-12 text-center">{zoom}%</span>
                <button onClick={handleZoomIn} className="p-1"><FaSearchPlus /></button>
                <button onClick={toggleFullScreen} className="p-1" title="Fullscreen">
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
                <button onClick={downloadFullBookPDF} className="p-1" title="Download PDF">
                  <FaFilePdf />
                </button>
              </div>
            </div>

            <div className="mb-5 text-center">
              <div className="text-xl font-bold text-black">{bookInfo?.responsedata?.title}</div>
              <div className="text-gray-700 text-sm italic">{bookInfo?.responsedata?.author}</div>
            </div>

            <div className="bg-white p-6 rounded shadow border">
              <h2 className="text-2xl font-bold mb-4">
                {selectedTopic.numbering}. {selectedTopic.header}
              </h2>
              {selectedTopic.header && (
                <h3 className="text-lg italic text-gray-600 mb-4">{selectedTopic.title}</h3>
              )}
              <div
                className="text-gray-800 text-justify leading-7"
                dangerouslySetInnerHTML={{ __html: selectedTopic.verified_content }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <h1 className="text-xl font-bold mb-2 text-black">{bookInfo?.responsedata?.title}</h1>
            <h2 className="text-md italic text-gray-600 mb-4">{bookInfo?.responsedata?.author}</h2>
            <img
              src={bookInfo?.responsedata?.cover_image || "/bookimage.jpg"}
              alt="Book Cover"
              className="max-h-[500px]"
            />
          </div>
        )}
      </main>
    </div>
  );
}
