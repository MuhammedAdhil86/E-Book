import React from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
  FaFilePdf,
} from 'react-icons/fa';
import { useBookStore } from '../../store/useBookStore';


export default function Toolbar() {
  const {
    chapters,
    selectedTopic,
    setSelectedTopic,
    zoom,
    setZoom,
    isFullscreen,
    toggleFullscreen,
  } = useBookStore();

  const flat = chapters.flatMap((c) => [c, ...(c.children || [])]);
  const idx = flat.findIndex((t) => t.id === selectedTopic?.id);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];

  return (
    <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 rounded">
      <div className="flex space-x-2">
        <button onClick={() => prev && setSelectedTopic(prev)} disabled={!prev}>
          <FaChevronLeft />
        </button>
        <button onClick={() => next && setSelectedTopic(next)} disabled={!next}>
          <FaChevronRight />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => setZoom(Math.max(50, zoom - 10))}>
          <FaSearchMinus />
        </button>
        <span>{zoom}%</span>
        <button onClick={() => setZoom(Math.min(200, zoom + 10))}>
          <FaSearchPlus />
        </button>
        <button onClick={toggleFullscreen}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </button>
        <button onClick={downloadFullBookPDF} title="Download whole book as PDF">
          <FaFilePdf />
        </button>
      </div>
    </div>
  );
}
