import { useState, useEffect } from "react";
import api from "../../api/Instance";
import { generateNumberedTree, flattenTopics } from "./utils";

export default function useBookData(bookId) {
  const [bookInfo, setBookInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const flatTopics = flattenTopics(chapters);
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopic?.id);
  const prevTopic = flatTopics[selectedIndex - 1];
  const nextTopic = flatTopics[selectedIndex + 1];

  return {
    bookInfo,
    chapters,
    expandedChapter,
    selectedTopic,
    popupData,
    isGeneratingPDF,
    zoom,
    isFullscreen,
    prevTopic,
    nextTopic,
    setExpandedChapter,
    setSelectedTopic,
    setPopupData,
    setIsGeneratingPDF,
    setZoom,
    setIsFullscreen,
  };
}
