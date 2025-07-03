import React from 'react';
import { useBookStore } from '../../store/useBookStore';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function Sidebar() {
  const {
    chapters,
    expandedChapter,
    toggleChapter,
    setSelectedTopic,
    selectedTopic,
  } = useBookStore();

  const renderTopics = (topics) =>
    topics.map((t) => (
      <li key={t.id}>
        <button
          className={`w-full text-left px-2 py-1 rounded ${
            selectedTopic?.id === t.id ? 'bg-yellow-300 font-bold' : 'hover:bg-yellow-100'
          }`}
          onClick={() => setSelectedTopic(t)}
        >
          {t.numbering}. {t.header}
        </button>
        {t.children && <ul className="pl-4">{renderTopics(t.children)}</ul>}
      </li>
    ));

  return (
    <aside className="md:w-1/4 p-4 overflow-auto border-r">
      {chapters.map((c) => (
        <div key={c.id}>
          <button
            className="w-full flex justify-between items-center py-2 font-semibold border-b"
            onClick={() => toggleChapter(c.id)}
          >
            {c.title} {expandedChapter === c.id ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {expandedChapter === c.id && <ul>{renderTopics(c.children)}</ul>}
        </div>
      ))}
    </aside>
  );
}
