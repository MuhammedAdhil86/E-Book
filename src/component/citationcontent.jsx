import React from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export default function CitationContent() {
  // Dummy panels
  const panels = [
    {
      id: 'panel1',
      heading: 'Panel 1: Overview',
      body: 'This is the body content for Panel 1.',
    },
    {
      id: 'panel2',
      heading: 'Panel 2: Details',
      body: 'This is the body content for Panel 2.',
    },
  ];

  const citation = {
    title: 'Sample Citation Title',
    content: 'This is additional information about the citation.',
  };

  return (
    <div className="space-y-6">
      {/* Non-accordion content */}
      <div className="prose max-w-none">
        <p>
          Here is some dummy content with a <span
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded underline cursor-pointer"
          >[Citation]</span> inside.
        </p>
      </div>

      {/* Accordion Panels */}
      <div className="space-y-2">
        {panels.map((panel, index) => (
          <div key={index} className="border rounded">
            <div className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer">
              <div
                className="text-sm font-medium text-gray-800"
                dangerouslySetInnerHTML={{ __html: panel.heading }}
              />
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </div>
            <div className="p-4 bg-white">
              <div
                className="text-gray-700 text-sm"
                dangerouslySetInnerHTML={{ __html: panel.body }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sheet (Static, always open) */}
      <div className="fixed bottom-0 right-0 w-1/4 bg-white border-t border-l border-gray-200 shadow-xl z-50">
        <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
          <h3 className="text-sm font-semibold">Citation Details</h3>
          <X className="w-4 h-4 text-gray-500 cursor-pointer" />
        </div>
        <div className="p-4 overflow-y-auto">
          <h4 className="text-base font-bold text-gray-900 mb-2">
            {citation.title}
          </h4>
          <div className="text-gray-700 text-sm">
            {citation.content}
          </div>
        </div>
        <div className="p-3 border-t bg-gray-50">
          <button className="w-full bg-black text-white text-sm py-2 rounded hover:bg-yellow-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
