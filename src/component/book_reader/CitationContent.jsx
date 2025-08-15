import React, { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const parseAccordion = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const accordion = doc.querySelector('#accordion');
  if (!accordion) return { panels: [], nonAccordionContent: html };

  const panels = Array.from(accordion.querySelectorAll('.panel')).map((panel, index) => {
    const heading = panel.querySelector('.panel-heading a')?.innerHTML || `Panel ${index + 1}`;
    const body = panel.querySelector('.panel-body')?.innerHTML || '';
    return { heading, body, id: `collapse${index + 1}` };
  });

  accordion.remove();
  const nonAccordionContent = doc.body.innerHTML;

  return { panels, nonAccordionContent };
};

const CitationContent = ({ node, selectedNodeId }) => {
  const [processedContent, setProcessedContent] = useState('');
  const [panels, setPanels] = useState([]);
  const [nonAccordionContent, setNonAccordionContent] = useState('');
  const [openPanel, setOpenPanel] = useState(null);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const baseUrl = "https://mvdebook.blr1.digitaloceanspaces.com";

  const contentRef = useRef(null);

  // Process draft content and extract citations + accordion
  useEffect(() => {
    if (node?.draft_content) {
      const processed = processCitationsForDisplay(node.draft_content, node.id);
      const { panels: parsedPanels, nonAccordionContent: parsedContent } = parseAccordion(processed);
      setPanels(parsedPanels);
      setNonAccordionContent(parsedContent);
      setProcessedContent(processed);
    }
  }, [node?.draft_content, node?.id]);

  // Handle /media links in the content
  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && href.startsWith('/media')) {
        e.preventDefault();
        window.open(baseUrl + href, '_blank', 'noopener,noreferrer');
      }
    };

    const currentContent = contentRef.current;
    currentContent?.addEventListener('click', handleLinkClick);

    return () => {
      currentContent?.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Add global CSS for links & citation hover
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .prose a {
        color: #1976d2 !important;
        text-decoration: none;
      }
      .prose a:hover {
        color: #0d47a1 !important;
      }
      .citation-link:hover {
        background-color: #bbdefb !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const processCitationsForDisplay = (html, nodeId) => {
    const citationRegex = /~@\[([^\]]+)\]~@([^~]*)~@/g;
    let citationCounter = 0;

    if (typeof window !== 'undefined' && !window.citationData) window.citationData = {};

    return html.replace(citationRegex, (match, title, content) => {
      const citationId = `citation-${nodeId}-${citationCounter++}`;
      if (typeof window !== 'undefined') {
        // Keep old format: nested by nodeId
        if (!window.citationData[nodeId]) window.citationData[nodeId] = {};
        window.citationData[nodeId][citationId] = { title, content };
      }

      return `<span 
        class="citation-link" 
        data-node-id="${nodeId}"
        data-citation-id="${citationId}"
        style="
          background-color: #e3f2fd; 
          color: #1976d2; 
          padding: 2px 6px; 
          border-radius: 4px; 
          cursor: pointer; 
          border: 1px solid #bbdefb;
          font-weight: 500;
          text-decoration: underline;
          transition: all 0.2s ease;
          line-height: 1.55;
        "
      >[${title}]</span>`;
    });
  };

  const stripHtml = (htmlString) => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;
    return temp.textContent || temp.innerText || '';
  };

  const handleCitationClick = (event) => {
    const citationSpan = event.target.closest('.citation-link');
    if (!citationSpan) return;

    const citationId = citationSpan.getAttribute('data-citation-id');
    const nodeId = citationSpan.getAttribute('data-node-id');
    const citation = typeof window !== 'undefined'
      ? window.citationData?.[nodeId]?.[citationId]
      : null;

    if (citation) {
      setSelectedCitation(citation);
      setIsBottomSheetOpen(true);
    }
  };

  const togglePanel = (panelId) => {
    setOpenPanel(openPanel === panelId ? null : panelId);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
    setTimeout(() => setSelectedCitation(null), 300);
  };

  return (
    <>
      {/* Non-accordion content */}
      <div
        ref={contentRef}
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(nonAccordionContent || '<p>No content available</p>')
        }}
        onClick={handleCitationClick}
      />

      {/* Accordion panels */}
      {panels.length > 0 && (
        <div className="mt-4">
          {panels.map((panel) => (
            <div key={panel.id} className="border border-gray-200 rounded-lg mb-2">
              <button
                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                onClick={() => togglePanel(panel.id)}
                aria-expanded={openPanel === panel.id}
                aria-controls={panel.id}
              >
                <span
                  className="text-sm font-medium text-gray-800"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(panel.heading) }}
                />
                {openPanel === panel.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {openPanel === panel.id && (
                <div className="p-4 bg-white" onClick={handleCitationClick}>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(panel.body) }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

 {/* Bottom sheet for citations */}
{isBottomSheetOpen && selectedCitation && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 position-fixed"
    onClick={closeBottomSheet}
  >
    <div
      className={`fixed bottom-0 right-0 bg-white w-full sm:w-96 rounded-t-lg transform transition-transform duration-300 ease-out max-h-[80vh] flex flex-col border border-gray-100 ${
        isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="citation-dialog-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <h3
          id="citation-dialog-title"
          className="text-base font-semibold text-gray-800 flex-1 text-center"
        >
          Citation Data
        </h3>
        <button
          onClick={closeBottomSheet}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close citation dialog"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-3">
          <h4 className="text-md font-bold text-gray-900 mb-1">
            {stripHtml(selectedCitation.title)}
          </h4>
          <div className="h-0.5 w-10 bg-yellow-500 rounded"></div>
        </div>
        <div className="prose max-w-none">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                selectedCitation.content || 'No additional information available.'
              )
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={closeBottomSheet}
          className="w-full bg-yellow-400 py-2 rounded-sm font-medium hover:bg-yellow-700 transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default CitationContent;
