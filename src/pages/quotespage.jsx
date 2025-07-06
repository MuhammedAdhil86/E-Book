// File: src/pages/QuotesPage.js
import React from 'react';
import useQuoteStore from '../store/useQuoteStore';

export default function QuotesPage() {
  const { selectedQuote } = useQuoteStore();

  if (!selectedQuote) {
    return <div className="p-6 text-center">No quote selected. Go back and try again.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">{selectedQuote.EbookContent?.title}</h2>
      <div
        className="prose max-w-none border p-4 rounded bg-white shadow"
        dangerouslySetInnerHTML={{
          __html: selectedQuote.EbookContent?.verified_content || "<p>No verified content available.</p>",
        }}
      />
    </div>
  );
}

