import React from 'react';
import { useBookStore } from '../../store/useBookStore';
import { cleanHTML, parseDraftContent, calculatePages } from '../../utils/parseDraft';

export default function TopicContent() {
  const { selectedTopic, zoom, popupData } = useBookStore();
  const pages = calculatePages(selectedTopic.draft_content, zoom);

  return (
    <div style={{ fontSize: `${zoom}%` }}>
      {pages.map((pg, i) => (
        <div key={i} className="mb-4 bg-white shadow border p-6 break-inside-avoid">
          {i === 0 && (
            <>
              <h2>{selectedTopic.numbering}. {selectedTopic.header}</h2>
              {selectedTopic.title && <h3 className="italic">{selectedTopic.title}</h3>}
            </>
          )}
          <div className="text-justify leading-relaxed">
            {parseDraftContent(pg)}
          </div>
        </div>
      ))}
    </div>
  );
}
