import React from "react";
import { FaArrowLeft, FaArrowRight, FaSearchPlus, FaSearchMinus, FaExpand, FaCompress } from "react-icons/fa";

export default function HeaderControls({
  selectedTopic,
  prevTopic,
  nextTopic,
  handleTopicClick,
  zoom,
  handleZoomIn,
  handleZoomOut,
  toggleFullScreen,
  isFullscreen,
  currentChapter,
}) {
  return (
    <div className="flex items-center justify-between bg-yellow-200 p-3 rounded-t-2xl border-b">
      <div className="flex items-center space-x-2">
        <button onClick={() => prevTopic && handleTopicClick(prevTopic)} disabled={!prevTopic}>
          <FaArrowLeft className={`text-xl ${!prevTopic ? "text-gray-400" : "text-black"}`} />
        </button>
        <button onClick={() => nextTopic && handleTopicClick(nextTopic)} disabled={!nextTopic}>
          <FaArrowRight className={`text-xl ${!nextTopic ? "text-gray-400" : "text-black"}`} />
        </button>
      </div>

      <div className="flex-grow text-center">
        <h3 className="text-lg font-bold truncate max-w-full">{selectedTopic?.header}</h3>
        <p className="text-sm text-gray-600">
          {currentChapter?.title || ""} | {selectedTopic?.title || ""}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={handleZoomOut}><FaSearchMinus className="text-xl" /></button>
        <span>{zoom}%</span>
        <button onClick={handleZoomIn}><FaSearchPlus className="text-xl" /></button>
        <button onClick={toggleFullScreen}>
          {isFullscreen ? <FaCompress className="text-xl" /> : <FaExpand className="text-xl" />}
        </button>
      </div>
    </div>
  );
}