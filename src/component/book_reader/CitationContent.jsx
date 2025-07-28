import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (node?.draft_content) {
      const processed = processCitationsForDisplay(node.draft_content, node.id);
      const { panels: parsedPanels, nonAccordionContent: parsedContent } = parseAccordion(processed);
      setPanels(parsedPanels);
      setNonAccordionContent(parsedContent);
      setProcessedContent(processed);
    }
  }, [node?.draft_content, node?.id]);

  const processCitationsForDisplay = (html, nodeId) => {
    const citationRegex = /~@\[([^\]]+)\]~@([^~]*)~@/g;
    let citationCounter = 0;
    const citations = {};

    const processedHtml = html.replace(citationRegex, (match, title, content) => {
      const citationId = `citation-${nodeId}-${citationCounter++}`;
      citations[citationId] = { title, content };

      return `<span 
        class="citation-link" 
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
        onmouseover="this.style.backgroundColor='#bbdefb'"
        onmouseout="this.style.backgroundColor='#e3f2fd'"
      >[${title}]</span>`;
    });

    if (!window.citationData) {
      window.citationData = {};
    }
    window.citationData[nodeId] = citations;

    return processedHtml;
  };

  const stripHtml = (htmlString) => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;
    return temp.textContent || temp.innerText || '';
  };

  const handleCitationClick = (event) => {
    if (event.target.classList.contains('citation-link')) {
      const citationId = event.target.getAttribute('data-citation-id');
      const nodeId = citationId.split('-')[1];
      const citation = window.citationData?.[nodeId]?.[citationId];

      if (citation) {
        setSelectedCitation(citation);
        setIsBottomSheetOpen(true);
      }
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
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(nonAccordionContent || '<p>No content available</p>')
        }}
        onClick={handleCitationClick}
      />

      {panels.length > 0 && (
        <div className="mt-4">
          {panels.map((panel) => (
            <div key={panel.id} className="border border-gray-200 rounded-lg mb-2">
              <button
                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none"
                onClick={() => togglePanel(panel.id)}
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
                <div className="p-4 bg-white">
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

      {isBottomSheetOpen && selectedCitation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end"
          onClick={closeBottomSheet}
        >
          <div
            className={`bg-white w-1/4 rounded-t-lg transform transition-transform duration-300 ease-out max-h-[80vh] flex flex-col border border-gray-100 ${
              isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-1 bg-gray-300 rounded-full mx-auto"></div>
              </div>
              <h3 className="text-base font-semibold text-gray-800 flex-1 text-center">
                Citation Details
              </h3>
              <button
                onClick={closeBottomSheet}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

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

            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={closeBottomSheet}
                className="w-full bg-black text-white py-2 rounded-sm font-medium hover:bg-yellow-700 transition-colors text-sm"
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
