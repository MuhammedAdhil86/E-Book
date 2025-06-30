import React, { useState, useRef } from "react";
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
import chapters from "../data/Chapters";

export default function BookReader() {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef();

  const toggleChapter = (id) => setExpandedChapter(expandedChapter === id ? null : id);
  const handleTopicClick = (topic) => setSelectedTopic(topic);
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const toggleFullScreen = () => setIsFullscreen((prev) => !prev);

  const downloadFullBookPDF = () => {
    const printElement = document.createElement("div");
    printElement.style.width = "210mm";
    printElement.style.padding = "20mm";
    printElement.style.fontFamily = "Georgia, serif";
    printElement.style.lineHeight = "1.8";
    printElement.style.fontSize = "14px";
    printElement.style.color = "#000";

    // Cover Page
    const cover = document.createElement("div");
    cover.style.textAlign = "center";
    cover.style.pageBreakAfter = "always";
    cover.innerHTML = `
      <h1 style="font-size: 30px; font-weight: bold; margin-bottom: 10px;">
        Ikigai - The Japanese Secret to a Long and Happy Life
      </h1>
      <h2 style="font-size: 18px; font-weight: normal; margin-bottom: 20px;">
        by Hector Garcia and Francesc Miralles
      </h2>
      <img src="${window.location.origin}/bookimage.jpg" style="max-width: 70%; height: auto;" />
    `;
    printElement.appendChild(cover);

    // Index Page
    const indexPage = document.createElement("div");
    indexPage.style.pageBreakAfter = "always";
    indexPage.innerHTML = `<h2 style="font-size: 22px; font-weight: bold; margin-bottom: 10px;">Index</h2>`;
    const indexList = document.createElement("ul");
    indexList.style.fontSize = "14px";
    indexList.style.paddingLeft = "20px";
    indexList.style.listStyle = "none";

    chapters.forEach((ch) => {
      const chLi = document.createElement("li");
      chLi.style.marginTop = "10px";
      chLi.innerHTML = `<strong>${ch.title}</strong>`;
      const ul = document.createElement("ul");
      ch.topics.forEach((t) => {
        const li = document.createElement("li");
        li.style.marginLeft = "20px";
        li.innerText = t.title;
        ul.appendChild(li);
      });
      chLi.appendChild(ul);
      indexList.appendChild(chLi);
    });

    indexPage.appendChild(indexList);
    printElement.appendChild(indexPage);

    // Topics
    chapters.forEach((chapter) => {
      chapter.topics.forEach((topic) => {
        const topicSection = document.createElement("div");
        topicSection.style.marginBottom = "30px";

        topicSection.innerHTML = `
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${chapter.title}</h2>
          <h3 style="font-size: 16px; font-weight: bold; margin: 10px 0;">${topic.title}</h3>
          ${topic.content
            .split("\n\n")
            .map(
              (para) =>
                `<p style="margin-top: 10px; text-align: justify;">${para.replace("### ", "")}</p>`
            )
            .join("")}
        `;
        printElement.appendChild(topicSection);
      });
    });

    document.body.appendChild(printElement);

    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: "Ikigai_Book.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      })
      .from(printElement)
      .save()
      .then(() => printElement.remove());
  };

  const flatTopics = chapters.flatMap((ch) => ch.topics);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
      {/* Sidebar */}
      <aside
        className={`md:w-1/4 bg-white shadow-md p-4 overflow-y-auto ${isFullscreen ? "hidden" : ""}`}
      >
        <h1 className="text-lg font-bold text-black mb-4">
          Ikigai - The Japanese Secret to a Long and Happy Life
        </h1>

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
            {expandedChapter === chapter.id && (
              <ul className="pl-4 py-2 space-y-1">
                {chapter.topics.map((topic) => (
                  <li key={topic.id}>
                    <button
                      onClick={() => handleTopicClick(topic)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        selectedTopic?.id === topic.id
                          ? "bg-yellow-300 font-bold"
                          : "hover:bg-yellow-100"
                      }`}
                    >
                      {topic.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </aside>

      {/* Reader */}
      <main className={`flex-1 px-4 py-6 overflow-y-auto ${isFullscreen ? "w-full" : ""}`}>
        {selectedTopic ? (
          <div style={{ fontSize: `${zoom}%` }} ref={contentRef}>
            {/* Control Buttons */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex space-x-2 text-black">
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
              <div className="flex items-center space-x-3 text-black">
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

            {/* Book Name and Author */}
          <div className="mb-5 text-center">
  <div className="text-xl font-bold text-black">
    Ikigai - The Japanese Secret to a Long and Happy Life
  </div>
  <div className="text-gray-700 text-sm italic">
    by Hector Garcia and Francesc Miralles
  </div>
</div>


            {/* Topic Content */}
            <div className="bg-white p-6 rounded shadow border">
              <h2 className="text-2xl font-bold mb-4">{selectedTopic.title}</h2>
              {selectedTopic.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4 text-gray-800 text-justify">
                  {para.replace("### ", "")}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <img src="/bookimage.jpg" alt="Ikigai Book" className="max-h-[500px]" />
          </div>
        )}
      </main>
    </div>
  );
}
